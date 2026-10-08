import type { Beat, Cond, LiveEffects, LiveEpisode, Meeting } from './types'

const LIMITS = { say: 280, option: 220, insight: 300 }

/** Every flag the episode can produce: read:<id> for key items, plus flags set by effects. */
export function producibleFlags(ep: LiveEpisode): Set<string> {
  const out = new Set<string>()
  for (const m of ep.messages) if (m.key) out.add(`read:${m.id}`)
  for (const d of ep.docs) for (const c of d.comments) if (c.key) out.add(`read:${c.id}`)
  for (const p of ep.dashboards) if (p.key) out.add(`read:${p.id}`)
  const addFx = (fx?: LiveEffects) => fx?.flags?.forEach((f) => out.add(f))
  for (const m of ep.messages) m.replies?.forEach((r) => addFx(r.effects))
  for (const mt of ep.meetings)
    for (const beats of Object.values(mt.script))
      for (const b of beats) {
        if (b.t === 'effects') addFx(b.effects)
        if (b.t === 'choice') b.options.forEach((o) => addFx(o.effects))
      }
  return out
}

function targets(b: Beat): string[] {
  if (b.t === 'goto') return [b.to]
  if (b.t === 'if') return [b.yes, b.no]
  if (b.t === 'choice') return [b.timeoutGoto, ...b.options.map((o) => o.goto)]
  return []
}

function checkCond(where: string, c: Cond | undefined, flags: Set<string>, errors: string[]) {
  for (const f of [...(c?.flags ?? []), ...(c?.notFlags ?? [])]) if (!flags.has(f)) errors.push(`${where}: flag "${f}" is never set`)
}

function checkMeeting(ep: LiveEpisode, m: Meeting, flags: Set<string>, errors: string[]) {
  const w = `meeting ${m.id}`
  const people = new Set(ep.people.map((p) => p.id))
  for (const a of m.attendees) if (!people.has(a)) errors.push(`${w}: unknown attendee ${a}`)
  if (!m.script.start) errors.push(`${w}: missing 'start' sequence`)
  if (!/^\d{2}:\d{2}$/.test(m.start)) errors.push(`${w}: start must be HH:MM`)
  const present = new Set([...m.attendees, ...Object.values(m.script).flat().flatMap((b) => (b.t === 'join' ? [b.who] : []))])
  const msgs = new Map(ep.messages.map((x) => [x.id, x]))
  const comments = new Map(ep.docs.flatMap((d) => d.comments).map((c) => [c.id, c]))
  for (const id of m.deskBefore ?? []) if (msgs.get(id)?.at !== 'desk') errors.push(`${w}: deskBefore ${id} must be a message with at: 'desk'`)

  for (const [label, beats] of Object.entries(m.script)) {
    const where = `${w}.${label}`
    if (!beats.length) errors.push(`${where}: empty sequence`)
    const last = beats[beats.length - 1]
    if (last && !['goto', 'if', 'choice', 'end'].includes(last.t)) errors.push(`${where}: must end with goto, if, choice or end`)
    beats.forEach((b, i) => {
      const at = `${where}[${i}]`
      for (const t of targets(b)) if (!m.script[t]) errors.push(`${at}: jumps to unknown sequence "${t}"`)
      if ((b.t === 'goto' || b.t === 'if' || b.t === 'choice' || b.t === 'end') && i !== beats.length - 1) errors.push(`${at}: ${b.t} must be the last beat`)
      switch (b.t) {
        case 'say':
          if (!present.has(b.who)) errors.push(`${at}: ${b.who} speaks but isn't in the meeting`)
          if (b.text.length > LIMITS.say) errors.push(`${at}: line is ${b.text.length} chars (max ${LIMITS.say})`)
          break
        case 'react':
        case 'leave':
        case 'join':
          if (!people.has(b.who)) errors.push(`${at}: unknown person ${b.who}`)
          break
        case 'share':
          if (b.id !== null && b.app === 'doc' && !ep.docs.some((d) => d.id === b.id)) errors.push(`${at}: unknown doc ${b.id}`)
          if (b.id !== null && b.app === 'dash' && !ep.dashboards.some((d) => d.id === b.id)) errors.push(`${at}: unknown dashboard ${b.id}`)
          break
        case 'slack':
          if (msgs.get(b.id)?.at !== 'beat') errors.push(`${at}: slack ${b.id} must be a message with at: 'beat'`)
          break
        case 'comment':
          if (comments.get(b.id)?.at !== 'beat') errors.push(`${at}: comment ${b.id} must be a doc comment with at: 'beat'`)
          break
        case 'if':
          checkCond(at, b.when, flags, errors)
          break
        case 'choice': {
          if (b.options.length < 2 || b.options.length > 4) errors.push(`${at}: needs 2–4 options`)
          if (!b.options.some((o) => o.grade === 'best')) errors.push(`${at}: no 'best' option`)
          if (!b.options.some((o) => o.grade !== 'best')) errors.push(`${at}: every option is 'best'`)
          if (b.options.every((o) => o.needs?.length)) errors.push(`${at}: every option is gated`)
          if (b.timeout < 8 || b.timeout > 40) errors.push(`${at}: timeout ${b.timeout}s not in 8–40`)
          if (b.timeoutInsight.length > LIMITS.insight) errors.push(`${at}: timeoutInsight too long`)
          for (const o of b.options) {
            if (o.text.length > LIMITS.option) errors.push(`${at}.${o.id}: text is ${o.text.length} chars (max ${LIMITS.option})`)
            if (o.insight.length > LIMITS.insight) errors.push(`${at}.${o.id}: insight is ${o.insight.length} chars (max ${LIMITS.insight})`)
            for (const f of o.needs ?? []) if (!flags.has(f)) errors.push(`${at}.${o.id}: needs "${f}", which is never set`)
            if (o.needs?.length && !o.lockedHint) errors.push(`${at}.${o.id}: gated option needs a lockedHint`)
          }
          break
        }
      }
    })
  }

  // Every sequence reachable from start, and every sequence can reach an end.
  const reach = new Set<string>()
  const walk = (l: string) => {
    if (reach.has(l) || !m.script[l]) return
    reach.add(l)
    for (const b of m.script[l]) targets(b).forEach(walk)
  }
  walk('start')
  for (const l of Object.keys(m.script)) if (!reach.has(l)) errors.push(`${w}: sequence "${l}" is unreachable`)
  const ends = new Set(Object.entries(m.script).filter(([, bs]) => bs.some((b) => b.t === 'end')).map(([l]) => l))
  let grew = true
  while (grew) {
    grew = false
    for (const [l, bs] of Object.entries(m.script))
      if (!ends.has(l) && bs.some((b) => targets(b).some((t) => ends.has(t)))) {
        ends.add(l)
        grew = true
      }
  }
  for (const l of Object.keys(m.script)) if (!ends.has(l)) errors.push(`${w}: sequence "${l}" can never reach an end`)
}

export function validateEpisode(ep: LiveEpisode): string[] {
  const errors: string[] = []
  const ids = ep.people.map((p) => p.id)
  if (new Set(ids).size !== ids.length) errors.push('duplicate person ids')
  if (ids.includes('you')) errors.push("'you' is reserved for the player")
  const flags = producibleFlags(ep)
  const channelIds = new Set(ep.channels.map((c) => c.id))
  for (const c of ep.channels) if (c.kind === 'dm' && !ids.includes(c.with ?? '')) errors.push(`channel ${c.id}: DM with unknown person`)
  const msgIds = ep.messages.map((m) => m.id)
  if (new Set(msgIds).size !== msgIds.length) errors.push('duplicate message ids')
  for (const m of ep.messages) {
    if (!channelIds.has(m.channel)) errors.push(`message ${m.id}: unknown channel ${m.channel}`)
    if (!ids.includes(m.from)) errors.push(`message ${m.id}: unknown sender ${m.from}`)
    for (const r of m.replies ?? []) if (r.insight.length > LIMITS.insight) errors.push(`message ${m.id}.${r.id}: insight too long`)
  }
  // Every 'beat'/'desk' message is actually delivered somewhere.
  const delivered = new Set<string>()
  for (const mt of ep.meetings) {
    mt.deskBefore?.forEach((id) => delivered.add(id))
    for (const beats of Object.values(mt.script)) for (const b of beats) if (b.t === 'slack') delivered.add(b.id)
  }
  for (const m of ep.messages) if (m.at !== 'morning' && !delivered.has(m.id)) errors.push(`message ${m.id}: at '${m.at}' but never delivered`)
  for (const d of ep.docs) if (!ids.includes(d.author)) errors.push(`doc ${d.id}: unknown author`)
  for (const c of ep.calendar) if (c.meetingId && !ep.meetings.some((m) => m.id === c.meetingId)) errors.push(`calendar: unknown meeting ${c.meetingId}`)
  for (const m of ep.meetings) checkMeeting(ep, m, flags, errors)
  for (const f of ep.wrapUp.fields) {
    if (f.options.length < 2) errors.push(`wrap-up ${f.id}: needs 2+ options`)
    if (!f.options.some((o) => o.correctWhen)) errors.push(`wrap-up ${f.id}: no option is ever correct`)
    for (const o of f.options) checkCond(`wrap-up ${f.id}.${o.id}`, o.correctWhen, flags, errors)
  }
  if (!channelIds.has(ep.wrapUp.post.channel)) errors.push('wrap-up post: unknown channel')
  for (const o of ep.wrapUp.post.options) for (const f of o.needs ?? []) if (!flags.has(f)) errors.push(`wrap-up post ${o.id}: needs "${f}", never set`)
  return errors
}
