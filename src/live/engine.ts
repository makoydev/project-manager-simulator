/**
 * Live-mode engine. Pure functions over LiveState; the React hook (useLive) owns time.
 * `step` processes one beat and returns how long to wait before the next one.
 */
import type { Grade } from '../game/types'
import type { Beat, Cond, LiveEffects, LiveEpisode, Meeting, Mood, PersonId } from './types'

export type LivePhase = 'lock' | 'desk' | 'meeting' | 'meetingEnd' | 'wrapup' | 'debrief'

export interface Caption {
  id: number
  who: PersonId | 'you' | 'system'
  text: string
  mood?: Mood
  meetingId: string
  clock: number
  /** Spoke over the previous line. */
  overlap?: boolean
}

export interface ChoiceRecord {
  where: string
  choiceId: string
  prompt: string
  /** null when the player stayed silent. */
  optionId: string | null
  text: string
  grade: Grade
  insight: string
}

export type ChoiceBeat = Extract<Beat, { t: 'choice' }>

export interface LiveState {
  phase: LivePhase
  meetingIndex: number
  cursor: { label: string; index: number } | null
  present: PersonId[]
  speaking: PersonId[]
  sharing: { who: PersonId; app: 'doc' | 'dash'; id: string } | null
  transcript: Caption[]
  flags: Record<string, true>
  messages: string[]
  comments: string[]
  readMessages: string[]
  replied: Record<string, string>
  rel: Record<PersonId, number>
  trust: number
  morale: number
  clarity: number
  choices: ChoiceRecord[]
  pending: ChoiceBeat | null
  outcomes: Record<string, string>
  /** Minutes since midnight. */
  clock: number
  pinned: number[]
  wrap: { fields: Record<string, string>; post: string | null; submitted: boolean }
  seq: number
}

/** Something the UI should animate or announce. */
export type LiveEvent =
  | { type: 'react'; who: PersonId; emoji: string }
  | { type: 'notify'; app: 'slack'; id: string }
  | { type: 'notify'; app: 'docs'; id: string }
  | { type: 'join' | 'leave'; who: PersonId }
  | { type: 'choice' }
  | { type: 'end'; meetingId: string }

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
export const toClock = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
export const fmtClock = (min: number) => {
  const h = Math.floor(min / 60)
  const m = Math.floor(min % 60)
  const h12 = ((h + 11) % 12) + 1
  return `${h12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}

/** How long a spoken line stays on screen, in ms at 1× speed. */
export function lineDuration(text: string, overlap = false): number {
  const base = clamp(900 + text.length * 38, 1700, 6500)
  return overlap ? Math.round(base * 0.55) : base
}

export function meetingAt(ep: LiveEpisode, s: LiveState): Meeting | undefined {
  return ep.meetings[s.meetingIndex]
}

function holds(c: Cond, flags: Record<string, true>): boolean {
  return (c.flags ?? []).every((f) => flags[f]) && !(c.notFlags ?? []).some((f) => flags[f])
}

function applyEffects(s: LiveState, fx: LiveEffects | undefined) {
  if (!fx) return
  for (const [who, d] of Object.entries(fx.rel ?? {})) s.rel[who] = clamp((s.rel[who] ?? 50) + d, 0, 100)
  if (fx.trust) s.trust = clamp(s.trust + fx.trust, 0, 100)
  if (fx.morale) s.morale = clamp(s.morale + fx.morale, 0, 100)
  if (fx.clarity) s.clarity = clamp(s.clarity + fx.clarity, 0, 100)
  for (const f of fx.flags ?? []) s.flags[f] = true
}

function caption(s: LiveState, c: Omit<Caption, 'id' | 'clock'>) {
  s.transcript.push({ ...c, id: ++s.seq, clock: s.clock })
}

export function initLive(ep: LiveEpisode): LiveState {
  return {
    phase: 'lock',
    meetingIndex: 0,
    cursor: null,
    present: [],
    speaking: [],
    sharing: null,
    transcript: [],
    flags: {},
    messages: ep.messages.filter((m) => m.at === 'morning').map((m) => m.id),
    comments: ep.docs.flatMap((d) => d.comments).filter((c) => c.at === 'morning').map((c) => c.id),
    readMessages: [],
    replied: {},
    rel: Object.fromEntries(ep.people.map((p) => [p.id, 50])),
    trust: 50,
    morale: 50,
    clarity: 50,
    choices: [],
    pending: null,
    outcomes: {},
    clock: toClock('09:15'),
    pinned: [],
    wrap: { fields: {}, post: null, submitted: false },
    seq: 0,
  }
}

/** Lock screen → desk time before the first meeting. */
export function startDay(prev: LiveState, ep: LiveEpisode): LiveState {
  if (prev.phase !== 'lock') return prev
  const s = structuredClone(prev)
  s.phase = 'desk'
  s.messages.push(...(ep.meetings[0]?.deskBefore ?? []).filter((id) => !s.messages.includes(id)))
  return s
}

export function joinMeeting(prev: LiveState, ep: LiveEpisode): LiveState {
  const m = meetingAt(ep, prev)
  if (!m || prev.phase !== 'desk') return prev
  const s = structuredClone(prev)
  s.phase = 'meeting'
  s.cursor = { label: 'start', index: 0 }
  s.present = [...m.attendees]
  s.speaking = []
  s.sharing = null
  s.clock = Math.max(s.clock, toClock(m.start))
  caption(s, { who: 'system', text: `You joined “${m.title}”`, meetingId: m.id })
  return s
}

/** Process the next beat. Returns the new state, how long to wait (Infinity = stop), and UI events. */
export function step(prev: LiveState, ep: LiveEpisode): { state: LiveState; wait: number; events: LiveEvent[] } {
  const m = meetingAt(ep, prev)
  if (prev.phase !== 'meeting' || !prev.cursor || !m || prev.pending) return { state: prev, wait: Infinity, events: [] }
  const s = structuredClone(prev)
  const events: LiveEvent[] = []
  const beats = m.script[s.cursor!.label]
  const b = beats?.[s.cursor!.index]
  if (!b) return { state: s, wait: Infinity, events }
  let wait = 0
  let advance = true
  switch (b.t) {
    case 'say': {
      const last = [...s.transcript].reverse().find((c) => c.meetingId === m.id && c.who !== 'system' && c.who !== 'you')
      s.speaking = b.overlap && last && last.who !== b.who ? [last.who as PersonId, b.who] : [b.who]
      caption(s, { who: b.who, text: b.text, mood: b.mood, meetingId: m.id, overlap: b.overlap })
      s.clock += 0.35
      wait = lineDuration(b.text, b.overlap)
      break
    }
    case 'narrate':
      s.speaking = []
      caption(s, { who: 'system', text: b.text, meetingId: m.id })
      wait = 1400
      break
    case 'react':
      events.push({ type: 'react', who: b.who, emoji: b.emoji })
      wait = 350
      break
    case 'join':
      if (!s.present.includes(b.who)) s.present.push(b.who)
      events.push({ type: 'join', who: b.who })
      caption(s, { who: 'system', text: `${nameOf(ep, b.who)} joined`, meetingId: m.id })
      wait = 900
      break
    case 'leave':
      s.present = s.present.filter((p) => p !== b.who)
      s.speaking = s.speaking.filter((p) => p !== b.who)
      events.push({ type: 'leave', who: b.who })
      caption(s, { who: 'system', text: b.text ?? `${nameOf(ep, b.who)} left the meeting`, meetingId: m.id })
      wait = 1100
      break
    case 'share':
      s.sharing = b.id === null ? null : { who: b.who, app: b.app, id: b.id }
      caption(s, { who: 'system', text: b.id === null ? `${nameOf(ep, b.who)} stopped sharing` : `${nameOf(ep, b.who)} is sharing their screen`, meetingId: m.id })
      wait = 1200
      break
    case 'slack':
      if (!s.messages.includes(b.id)) s.messages.push(b.id)
      events.push({ type: 'notify', app: 'slack', id: b.id })
      wait = 450
      break
    case 'comment':
      if (!s.comments.includes(b.id)) s.comments.push(b.id)
      events.push({ type: 'notify', app: 'docs', id: b.id })
      wait = 450
      break
    case 'pause':
      s.speaking = []
      wait = b.ms
      break
    case 'effects':
      applyEffects(s, b.effects)
      break
    case 'choice':
      s.speaking = []
      s.pending = b
      events.push({ type: 'choice' })
      wait = Infinity
      advance = false
      break
    case 'goto':
      s.cursor = { label: b.to, index: 0 }
      advance = false
      break
    case 'if':
      s.cursor = { label: holds(b.when, s.flags) ? b.yes : b.no, index: 0 }
      advance = false
      break
    case 'end':
      s.outcomes[m.id] = b.outcome
      s.phase = 'meetingEnd'
      s.speaking = []
      s.sharing = null
      s.cursor = null
      s.clock = Math.max(s.clock, toClock(m.start) + m.minutes)
      caption(s, { who: 'system', text: 'Meeting ended', meetingId: m.id })
      events.push({ type: 'end', meetingId: m.id })
      wait = Infinity
      advance = false
      break
  }
  if (advance && s.cursor) s.cursor.index += 1
  return { state: s, wait, events }
}

export function optionLocked(s: LiveState, needs?: string[]): boolean {
  return !!needs?.some((f) => !s.flags[f])
}

/** Answer the pending choice (`optionId`), or stay silent (`null`). */
export function choose(prev: LiveState, ep: LiveEpisode, optionId: string | null): LiveState {
  const m = meetingAt(ep, prev)
  const c = prev.pending
  if (!c || !m) return prev
  const s = structuredClone(prev)
  const opt = optionId ? c.options.find((o) => o.id === optionId) : undefined
  if (opt && optionLocked(s, opt.needs)) return prev
  s.pending = null
  if (opt) {
    caption(s, { who: 'you', text: opt.text, meetingId: m.id })
    applyEffects(s, opt.effects)
    s.choices.push({ where: m.title, choiceId: c.id, prompt: c.prompt, optionId: opt.id, text: opt.text, grade: opt.grade, insight: opt.insight })
    s.cursor = { label: opt.goto, index: 0 }
  } else {
    caption(s, { who: 'system', text: 'You stayed quiet.', meetingId: m.id })
    s.choices.push({ where: m.title, choiceId: c.id, prompt: c.prompt, optionId: null, text: '(silence)', grade: 'poor', insight: c.timeoutInsight })
    s.cursor = { label: c.timeoutGoto, index: 0 }
  }
  s.clock += 0.5
  return s
}

/** Meeting summary → next desk block, or the end-of-day wrap-up. */
export function leaveMeeting(prev: LiveState, ep: LiveEpisode): LiveState {
  if (prev.phase !== 'meetingEnd') return prev
  const s = structuredClone(prev)
  s.present = []
  s.meetingIndex += 1
  const next = ep.meetings[s.meetingIndex]
  if (next) {
    s.phase = 'desk'
    s.clock = Math.max(s.clock, toClock(next.start) - 8)
    for (const id of next.deskBefore ?? []) if (!s.messages.includes(id)) s.messages.push(id)
  } else {
    s.phase = 'wrapup'
    s.clock = Math.max(s.clock, toClock('17:30'))
  }
  return s
}

/** The player looked at something: Slack messages in a channel, the docs app, or the dashboards. */
export function markSeen(prev: LiveState, ep: LiveEpisode, what: { messages?: string[]; docs?: boolean; dashboards?: boolean }): LiveState {
  const newMsgs = (what.messages ?? []).filter((id) => prev.messages.includes(id) && !prev.readMessages.includes(id))
  const docKeys = what.docs ? ep.docs.flatMap((d) => d.comments).filter((c) => c.key && prev.comments.includes(c.id) && !prev.flags[`read:${c.id}`]) : []
  const dashKeys = what.dashboards ? ep.dashboards.filter((p) => p.key && !prev.flags[`read:${p.id}`]) : []
  if (!newMsgs.length && !docKeys.length && !dashKeys.length) return prev
  const s = structuredClone(prev)
  for (const id of newMsgs) {
    s.readMessages.push(id)
    if (ep.messages.find((m) => m.id === id)?.key) s.flags[`read:${id}`] = true
  }
  for (const c of docKeys) s.flags[`read:${c.id}`] = true
  for (const p of dashKeys) s.flags[`read:${p.id}`] = true
  return s
}

export function reply(prev: LiveState, ep: LiveEpisode, messageId: string, replyId: string): LiveState {
  const msg = ep.messages.find((m) => m.id === messageId)
  const r = msg?.replies?.find((x) => x.id === replyId)
  if (!msg || !r || prev.replied[messageId]) return prev
  const s = structuredClone(prev)
  s.replied[messageId] = replyId
  applyEffects(s, r.effects)
  s.choices.push({ where: 'Slack', choiceId: messageId, prompt: msg.text, optionId: r.id, text: r.text, grade: r.grade, insight: r.insight })
  return s
}

export function togglePin(prev: LiveState, captionId: number): LiveState {
  const s = structuredClone(prev)
  s.pinned = s.pinned.includes(captionId) ? s.pinned.filter((x) => x !== captionId) : [...s.pinned, captionId]
  return s
}

export function setWrap(prev: LiveState, field: string, optionId: string): LiveState {
  const s = structuredClone(prev)
  if (field === '__post') s.wrap.post = optionId
  else s.wrap.fields[field] = optionId
  return s
}

export function submitWrap(prev: LiveState): LiveState {
  const s = structuredClone(prev)
  s.wrap.submitted = true
  s.phase = 'debrief'
  return s
}

export function nameOf(ep: LiveEpisode, id: PersonId | 'you' | 'system'): string {
  if (id === 'you') return 'You'
  if (id === 'system') return ''
  return ep.people.find((p) => p.id === id)?.short ?? id
}

// ───────────────────────────── Debrief ─────────────────────────────

export interface Debrief {
  score: number
  rating: string
  headline: string
  choices: ChoiceRecord[]
  missed: { id: string; label: string; where: string }[]
  record: { field: string; label: string; chosen: string | null; correct: boolean; why: string; right: string[] }[]
  post: { text: string; grade: Grade; insight: string } | null
  meters: { trust: number; morale: number; clarity: number }
  rel: { id: PersonId; delta: number }[]
}

const POINTS: Record<Grade, number> = { best: 1, okay: 0.45, poor: 0 }

export function debrief(s: LiveState, ep: LiveEpisode): Debrief {
  const keyItems = [
    ...ep.messages.filter((m) => m.key && s.messages.includes(m.id)).map((m) => ({ id: m.id, label: `${nameOf(ep, m.from)} on Slack: “${m.text.slice(0, 70)}${m.text.length > 70 ? '…' : ''}”`, where: 'Slack' })),
    ...ep.docs.flatMap((d) => d.comments.filter((c) => c.key && s.comments.includes(c.id)).map((c) => ({ id: c.id, label: `${nameOf(ep, c.who)}’s comment on ${d.title}`, where: 'Docs' }))),
    ...ep.dashboards.filter((p) => p.key).map((p) => ({ id: p.id, label: p.title, where: 'Dashboards' })),
  ]
  const missed = keyItems.filter((k) => !s.flags[`read:${k.id}`])
  const record = ep.wrapUp.fields.map((f) => {
    const chosen = f.options.find((o) => o.id === s.wrap.fields[f.id]) ?? null
    const right = f.options.filter((o) => o.correctWhen && holds(o.correctWhen, s.flags))
    return {
      field: f.id,
      label: f.label,
      chosen: chosen?.text ?? null,
      correct: !!chosen && right.includes(chosen),
      why: chosen?.why ?? 'You left this blank.',
      right: right.map((o) => o.text),
    }
  })
  const postOpt = ep.wrapUp.post.options.find((o) => o.id === s.wrap.post)
  const post = postOpt ? { text: postOpt.text, grade: postOpt.grade, insight: postOpt.insight } : null

  const choicePts = s.choices.length ? s.choices.reduce((a, c) => a + POINTS[c.grade], 0) / s.choices.length : 0
  const signalPts = keyItems.length ? 1 - missed.length / keyItems.length : 1
  const recordPts = record.length ? record.filter((r) => r.correct).length / record.length : 0
  const postPts = post ? POINTS[post.grade] : 0
  const score = Math.round(choicePts * 50 + signalPts * 20 + recordPts * 20 + postPts * 10)
  const [rating, headline] =
    score >= 85
      ? ['Outstanding', 'You ran the day instead of the day running you. Facts in the room, decisions with owners, no surprises upstairs.']
      : score >= 70
        ? ['Strong', 'Solid TPM instincts. A couple of moments where more preparation or a crisper close would have paid off.']
        : score >= 50
          ? ['Mixed', 'You kept things moving, but some decisions drifted and some facts never made it into the room.']
          : ['Rough day', 'The meetings happened to you. The good news: every moment below is replayable, and so is tomorrow.']
  const rel = Object.entries(s.rel)
    .map(([id, v]) => ({ id, delta: v - 50 }))
    .filter((r) => r.delta !== 0)
    .sort((a, b) => b.delta - a.delta)
  return { score, rating, headline, choices: s.choices, missed, record, post, meters: { trust: s.trust, morale: s.morale, clarity: s.clarity }, rel }
}
