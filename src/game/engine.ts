import { BACKGROUNDS } from './backgrounds'
import { check } from './conditions'
import { eventPool, getEvent, getScenario } from './content'
import { applyEffects, changeMeter, revealHidden, type Delta } from './effects'
import { makeRng, randomSeed, type Rng } from './rng'
import { baseVelocities, initWorkstreams, isDone, tick, velocityFactor, WS_ROLES } from './schedule'
import { BASE_FOCUS, chanceOf, grantXp, isBehind, logDecision, meetConcept, projectedLaunch, snapshotOf } from './state'
import { fill } from './text'
import type {
  BackgroundId,
  ConceptId,
  EventDef,
  GameState,
  Grade,
  MeterKey,
  ReadinessKey,
  Role,
  ScenarioId,
  SkillKey,
  Urgency,
  WsRole,
} from './types'
import { ROLES } from './validate'

export const SAVE_VERSION = 1

const DEFAULT_EXPIRY: Record<Urgency, number> = { critical: 1, high: 1, normal: 2, low: 3 }
const MAX_INBOX = 6

export interface NewGameOptions {
  scenarioId: ScenarioId
  background: BackgroundId
  playerName: string
  seed?: number
}

export function newGame(opts: NewGameOptions): GameState {
  const sc = getScenario(opts.scenarioId)
  const bg = BACKGROUNDS[opts.background]
  const seed = opts.seed ?? randomSeed()
  const rng = makeRng(seed)
  const rel = Object.fromEntries(ROLES.map((r) => [r, Math.max(0, Math.min(100, 50 + (bg.rel[r] ?? 0)))])) as Record<Role, number>
  const meters: Record<MeterKey, number> = { ...sc.start, energy: 100 }
  for (const [k, v] of Object.entries(bg.meters)) meters[k as MeterKey] = Math.max(0, Math.min(100, meters[k as MeterKey] + (v as number)))

  const s: GameState = {
    version: SAVE_VERSION,
    seed,
    rng: rng.state(),
    scenarioId: opts.scenarioId,
    background: opts.background,
    playerName: opts.playerName.trim() || 'You',
    day: 1,
    targetDay: sc.targetDay,
    originalTargetDay: sc.targetDay,
    phase: 'day',
    focus: BASE_FOCUS,
    maxFocus: BASE_FOCUS,
    meters,
    rel,
    ws: initWorkstreams(sc.workstreams),
    risks: Object.fromEntries(sc.risks.map((r) => [r.id, r.initial])),
    inbox: [],
    scheduled: [],
    seenEvents: [],
    flags: {},
    readiness: Object.fromEntries(
      (['securityReview', 'loadTest', 'rollbackPlan', 'monitoring', 'oncall', 'commsPlan', 'signoff', 'uat', 'featureFlags'] as ReadinessKey[]).map((k) => [k, false]),
    ) as Record<ReadinessKey, boolean>,
    skills: { stakeholder: 0, risk: 0, comms: 0, technical: 0, execution: 0, leadership: 0 },
    modifiers: [],
    log: [],
    history: [],
    statusReports: [],
    counters: {
      codeIt: 0,
      escalations: 0,
      overtime: 0,
      ignored: 0,
      kopi: 0,
      riskReviews: 0,
      descopes: 0,
      noGos: 0,
      risksFired: 0,
      risksFiredUnmitigated: 0,
      watermelons: 0,
      accurateReports: 0,
      burnouts: 0,
    },
    cooldowns: {},
    conceptsSeen: ['tpm-role'],
    achievements: [],
    reportDueDay: null,
    retroDone: false,
    uidSeq: 0,
  }
  if (bg.revealRisks) revealHidden(s, bg.revealRisks, rng, [])
  s.history.push(snapshotOf(s, 0, 1))
  deliverMorning(s, rng)
  s.rng = rng.state()
  return s
}

function pushInbox(s: GameState, e: EventDef, fromRisk?: string) {
  const exp = e.expires ?? DEFAULT_EXPIRY[e.urgency]
  s.inbox.push({ uid: `m${++s.uidSeq}`, eventId: e.id, arrivedDay: s.day, expiresDay: s.day + exp - 1, fromRisk })
  if (!s.seenEvents.includes(e.id)) s.seenEvents.push(e.id)
}

/** Morning: follow-ups and risk triggers due today, story beats, then random events to keep the inbox lively. */
export function deliverMorning(s: GameState, rng: Rng) {
  const sc = getScenario(s.scenarioId)
  const pool = eventPool(s.scenarioId)
  let behindCache: boolean | undefined
  const behind = () => (behindCache ??= isBehind(s))

  const due = s.scheduled.filter((x) => x.day <= s.day)
  s.scheduled = s.scheduled.filter((x) => x.day > s.day)
  for (const d of due) {
    const e = getEvent(d.eventId)
    if (d.fromRisk) pushInbox(s, e, d.fromRisk)
    // Two chains can schedule the same follow-up; deliver it once unless it's repeatable.
    else if ((e.repeatable || !s.seenEvents.includes(e.id)) && check(e.when, s, behind)) pushInbox(s, e)
  }

  for (const e of pool)
    if (e.fixedDay === s.day && !s.seenEvents.includes(e.id) && check(e.when, s, behind)) pushInbox(s, e)

  const target = sc.difficulty === 3 ? 4 : 3
  let n = s.day === 1 ? 1 : Math.min(3, Math.max(1, target - s.inbox.length))
  if (s.inbox.length >= MAX_INBOX) n = 0
  const eligible = pool.filter(
    (e) =>
      (e.weight ?? 1) > 0 &&
      e.fixedDay === undefined &&
      (e.repeatable || !s.seenEvents.includes(e.id)) &&
      !s.inbox.some((i) => i.eventId === e.id) &&
      check(e.when, s, behind),
  )
  for (let i = 0; i < n && eligible.length; i++) {
    // Scenario-specific events are a little more likely: they carry the story.
    const idx = rng.weightedIndex(eligible.map((e) => (e.weight ?? 1) * (e.scenarios ? 1.6 : 1)))
    if (idx < 0) break
    pushInbox(s, eligible.splice(idx, 1)[0])
  }
}

export interface ChoiceResult {
  eventId: string
  title: string
  choiceId: string
  label: string
  grade: Grade
  text: string
  insight: string
  deltas: Delta[]
  /** For chance outcomes: whether the roll succeeded, and the odds. */
  success?: boolean
  odds?: number
  concept: ConceptId
  newConcept: boolean
  skill: SkillKey
}

export function choiceLocked(s: GameState, eventId: string, choiceId: string): string | null {
  const e = getEvent(eventId)
  const c = e.choices.find((x) => x.id === choiceId)
  if (!c) return 'Unknown choice'
  if (c.requires && !check(c.requires, s, () => isBehind(s))) return fill(c.lockedHint ?? 'Not available', s)
  if (c.cost > s.focus) return `Needs ${c.cost} focus`
  return null
}

export function resolveChoice(state: GameState, uid: string, choiceId: string): { state: GameState; result: ChoiceResult } {
  const item = state.inbox.find((i) => i.uid === uid)
  if (!item) throw new Error(`No inbox item ${uid}`)
  const locked = choiceLocked(state, item.eventId, choiceId)
  if (locked) throw new Error(locked)
  const s = structuredClone(state)
  const rng = makeRng(s.rng)
  const e = getEvent(item.eventId)
  const c = e.choices.find((x) => x.id === choiceId)!

  s.focus -= c.cost
  changeMeter(s, 'energy', -c.cost * 2, [])
  let outcome = c.outcome
  let success: boolean | undefined
  let odds: number | undefined
  if (c.chance) {
    odds = chanceOf(s, c.chance)
    success = rng.chance(odds)
    outcome = success ? c.chance.success : c.chance.failure
  }
  const deltas = applyEffects(s, outcome!.effects, rng)
  grantXp(s, e.skill, c.grade)
  const newConcept = meetConcept(s, e.concept)
  logDecision(s, { eventId: e.id, title: e.title, choiceLabel: c.label, grade: c.grade, insight: c.insight, concept: e.concept })
  s.inbox = s.inbox.filter((i) => i.uid !== uid)
  s.rng = rng.state()
  return {
    state: s,
    result: {
      eventId: e.id,
      title: fill(e.title, s),
      choiceId,
      label: fill(c.label, s),
      grade: c.grade,
      text: fill(outcome!.text, s),
      insight: fill(c.insight, s),
      deltas,
      success,
      odds,
      concept: e.concept,
      newConcept,
      skill: e.skill,
    },
  }
}

export interface DayReport {
  day: number
  weekend: boolean
  /** Percentage points gained per workstream overnight. */
  gained: Record<WsRole, number>
  completed: WsRole[]
  unblocked: WsRole[]
  expired: { title: string; text: string; deltas: Delta[] }[]
  risk?: { id: string; title: string; wasKnown: boolean; mitigated: boolean }
  energyBefore: number
  energyAfter: number
  burnout: boolean
  fired: boolean
  projectedBefore: number
  projectedAfter: number
  goNoGo: boolean
  pressure: Delta[]
}

const RISK_RATE = 0.03

export function endDay(state: GameState): { state: GameState; report: DayReport } {
  if (state.phase !== 'day') throw new Error('Day already over')
  const s = structuredClone(state)
  const rng = makeRng(s.rng)
  const sc = getScenario(s.scenarioId)
  const day = s.day
  const projectedBefore = projectedLaunch(s)

  // 1. Unanswered messages expire — silence has consequences.
  const expired: DayReport['expired'] = []
  for (const item of s.inbox.filter((i) => i.expiresDay <= day)) {
    const e = getEvent(item.eventId)
    const deltas = applyEffects(s, e.ignored.effects, rng)
    expired.push({ title: fill(e.title, s), text: fill(e.ignored.text, s), deltas })
    meetConcept(s, e.concept)
    logDecision(s, {
      eventId: e.id,
      title: e.title,
      choiceLabel: 'No response — it expired',
      grade: 'poor',
      insight: e.ignored.text,
      concept: e.concept,
      ignored: true,
    })
    s.counters.ignored++
  }
  s.inbox = s.inbox.filter((i) => i.expiresDay > day)

  // 2. The team works.
  const pctOf = (r: WsRole) => (s.ws[r].done / s.ws[r].work) * 100
  const before = Object.fromEntries(WS_ROLES.map((r) => [r, pctOf(r)])) as Record<WsRole, number>
  const doneBefore = WS_ROLES.filter((r) => isDone(s.ws[r]))
  const blockedBefore = WS_ROLES.filter((r) => s.ws[r].blockedDays > 0)
  tick({
    ws: s.ws,
    velocity: baseVelocities(sc.workstreams),
    factor: velocityFactor(s.meters.morale, s.meters.quality),
    modifiers: s.modifiers,
    day,
    noise: () => rng.range(0.85, 1.15),
  })
  const gained = Object.fromEntries(WS_ROLES.map((r) => [r, pctOf(r) - before[r]])) as Record<WsRole, number>
  const completed = WS_ROLES.filter((r) => isDone(s.ws[r]) && !doneBefore.includes(r))
  const unblocked = blockedBefore.filter((r) => s.ws[r].blockedDays === 0)
  s.modifiers = s.modifiers.filter((m) => m.untilDay > day)

  // 3. Risks roll. At most one materialises per night.
  let risk: DayReport['risk']
  const fired = sc.risks.filter((r) => {
    const st = s.risks[r.id]
    if (st !== 'hidden' && st !== 'open' && st !== 'mitigated') return false
    if (day < (r.earliestDay ?? 3)) return false
    return rng.chance(r.likelihood * RISK_RATE * (st === 'mitigated' ? 0.25 : 1))
  })
  if (fired.length) {
    const r = fired.sort((a, b) => b.likelihood * b.impact - a.likelihood * a.impact)[0]
    const st = s.risks[r.id]
    s.risks[r.id] = 'occurred'
    s.scheduled.push({ eventId: r.trigger, day: day + 1, fromRisk: r.id })
    s.counters.risksFired++
    if (st !== 'mitigated') s.counters.risksFiredUnmitigated++
    risk = { id: r.id, title: r.title, wasKnown: st !== 'hidden', mitigated: st === 'mitigated' }
  }

  // 4. Schedule pressure wears the team down.
  const pressure: Delta[] = []
  const projectedNow = projectedLaunch(s, day + 1)
  if (projectedNow > s.targetDay + 2) changeMeter(s, 'morale', -2, pressure)

  // 5. You recover — more if you left focus unspent, less if you stayed late. Weekends help.
  const weekend = day % 5 === 0
  const energyBefore = s.meters.energy
  const burnout = energyBefore <= 0
  let recovery = 12 + 4 * s.focus + (weekend ? 25 : 0) - (s.flags['sys:overtime-today'] ? 10 : 0)
  delete s.flags['sys:overtime-today']
  if (burnout) {
    s.counters.burnouts++
    s.flags['sys:burnout'] = true
    changeMeter(s, 'trust', -3, pressure)
    recovery = 40
  }
  s.meters.energy = Math.max(0, Math.min(100, s.meters.energy + recovery))

  s.history.push(snapshotOf(s, day, day + 1))

  // 6. Warnings before disaster: your manager (trust) or tech lead (morale) pulls you aside.
  if (s.meters.trust < 20 && s.cooldowns['warned:trust'] === undefined) {
    s.cooldowns['warned:trust'] = day
    s.scheduled.push({ eventId: 'sys-trust-warning', day: day + 1 })
  }
  if (s.meters.morale < 25 && s.cooldowns['warned:morale'] === undefined) {
    s.cooldowns['warned:morale'] = day
    s.scheduled.push({ eventId: 'sys-morale-warning', day: day + 1 })
  }

  // 7. Fired (only after a warning you had a day to act on)? Launch day? Or tomorrow.
  const warnedAt = s.cooldowns['warned:trust']
  const firedNow = s.meters.trust <= 5 && warnedAt !== undefined && warnedAt < day
  let goNoGo = false
  if (firedNow) {
    s.phase = 'ended'
    s.ending = 'fired'
  } else if (day >= s.targetDay) {
    s.phase = 'goNoGo'
    goNoGo = true
  } else {
    s.day += 1
    s.maxFocus = burnout ? 2 : BASE_FOCUS - (s.meters.energy < 25 ? 1 : 0) - (s.meters.energy < 10 ? 1 : 0)
    s.focus = s.maxFocus
    if (!burnout) delete s.flags['sys:burnout']
    deliverMorning(s, rng)
  }
  s.rng = rng.state()
  return {
    state: s,
    report: {
      day,
      weekend,
      gained,
      completed,
      unblocked,
      expired,
      risk,
      energyBefore,
      energyAfter: s.meters.energy,
      burnout,
      fired: firedNow,
      projectedBefore,
      projectedAfter: projectedNow,
      goNoGo,
      pressure,
    },
  }
}
