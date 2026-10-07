import { getScenario } from './content'
import { changeMeter, changeRel, type Delta } from './effects'
import { READINESS } from './meta'
import { makeRng } from './rng'
import { completion, WS_ROLES } from './schedule'
import { BASE_FOCUS, grantXp, logDecision, meetConcept } from './state'
import type { GameState, Grade, LaunchMode, LaunchResult, LaunchTier, Role } from './types'
import { deliverMorning } from './engine'

export interface Vote {
  role: Role
  vote: 'go' | 'concerns' | 'nogo'
  reason: string
}

/** What each stakeholder says at the Go/No-Go meeting, based on the state of their area. */
export function goNoGoVotes(s: GameState): Vote[] {
  const r = s.readiness
  const done = completion(s.ws)
  const client = s.ws.client.done / s.ws.client.work
  const votes: Vote[] = []

  votes.push(
    s.meters.quality < 45
      ? { role: 'lead', vote: 'nogo', reason: 'Quality is shaky. I would not put my name on this release yet.' }
      : !r.loadTest
        ? { role: 'lead', vote: 'concerns', reason: 'We never load-tested at peak. It probably holds… probably.' }
        : { role: 'lead', vote: 'go', reason: 'Load tested, code reviewed, tests green. We’re ready.' },
  )
  votes.push(
    !r.monitoring && !r.rollbackPlan
      ? { role: 'sre', vote: 'nogo', reason: 'No dashboards and no rollback plan. If it breaks, we’re flying blind with no parachute.' }
      : !r.monitoring || !r.rollbackPlan || !r.oncall
        ? { role: 'sre', vote: 'concerns', reason: `Missing: ${[!r.monitoring && 'monitoring', !r.rollbackPlan && 'rollback plan', !r.oncall && 'on-call rota'].filter(Boolean).join(', ')}.` }
        : { role: 'sre', vote: 'go', reason: 'Alerts tuned, rollback rehearsed, on-call staffed. Let’s go.' },
  )
  votes.push(
    r.securityReview
      ? { role: 'security', vote: 'go', reason: 'Pen test findings closed or risk-accepted in writing.' }
      : { role: 'security', vote: 'nogo', reason: 'No security review. I can’t sign off on an untested attack surface.' },
  )
  votes.push(
    r.signoff
      ? { role: 'compliance', vote: 'go', reason: 'Review complete and signed. You’re clear from our side.' }
      : { role: 'compliance', vote: 'nogo', reason: 'We have not signed off. Launching without it is a regulatory problem, not a technical one.' },
  )
  votes.push(
    done < 0.7
      ? { role: 'pm', vote: 'nogo', reason: `Only ${Math.round(done * 100)}% of scope is done. That’s not an MVP, that’s a demo.` }
      : done < 0.97 || !r.uat
        ? { role: 'pm', vote: 'concerns', reason: !r.uat ? 'Users haven’t done UAT. We’re guessing it solves their problem.' : `About ${Math.round(done * 100)}% of scope is in. We can launch as an MVP.` }
        : { role: 'pm', vote: 'go', reason: 'Scope complete and accepted by users. Ship it!' },
  )
  votes.push(
    client < 0.97
      ? { role: 'partner', vote: 'concerns', reason: 'Our side isn’t fully done. A few flows will be rough.' }
      : { role: 'partner', vote: 'go', reason: 'Our integration is done and tested.' },
  )
  votes.push(
    s.meters.trust < 35
      ? { role: 'sponsor', vote: 'concerns', reason: 'Honestly, I don’t know what to believe in the reports anymore. Convince me.' }
      : { role: 'sponsor', vote: 'go', reason: 'The market is waiting. If the team says go, I say go.' },
  )
  return votes
}

export function readyCount(s: GameState): number {
  return READINESS.filter((r) => s.readiness[r.key]).length
}

/** Probability that something goes wrong on launch day. Shown to the player as a gauge. */
export function problemChance(s: GameState): number {
  const sc = getScenario(s.scenarioId)
  const done = completion(s.ws)
  const highRisks = sc.risks.filter((r) => (s.risks[r.id] === 'open' || s.risks[r.id] === 'hidden') && r.likelihood * r.impact >= 12).length
  let p = 0.72 - 0.4 * (s.meters.quality / 100) - 0.045 * readyCount(s)
  if (done >= 0.999) p -= 0.08
  if (done < 0.9) p += 0.1
  p += 0.06 * highRisks
  if (!s.readiness.securityReview) p += 0.06
  if (!s.readiness.loadTest) p += 0.06
  return Math.max(0.03, Math.min(0.9, p))
}

export function noGoSlip(s: GameState): number {
  return Math.min(3, getScenario(s.scenarioId).maxDay - s.day)
}

export function canNoGo(s: GameState): boolean {
  return noGoSlip(s) >= 2
}

/** Call a No-Go: slip the date and keep working. */
export function decideNoGo(state: GameState): { state: GameState; deltas: Delta[] } {
  if (!canNoGo(state)) throw new Error('No room left to slip')
  const s = structuredClone(state)
  const rng = makeRng(s.rng)
  const deltas: Delta[] = []
  const slip = noGoSlip(s)
  const warned = s.statusReports.length > 0 && s.statusReports[s.statusReports.length - 1].input.overall !== 'green'
  changeMeter(s, 'trust', warned ? -3 : -7, deltas)
  if (s.flags['sys:watermelon']) changeMeter(s, 'trust', -4, deltas)
  changeMeter(s, 'morale', 3, deltas)
  s.targetDay = s.day + slip
  deltas.push({ icon: '📅', label: `New launch day: Day ${s.targetDay}`, good: false })
  s.flags['sys:no-go'] = true
  s.counters.noGos++
  meetConcept(s, 'launch-readiness')
  logDecision(s, {
    eventId: `go-no-go-d${s.day}`,
    title: 'Go/No-Go meeting',
    choiceLabel: `Called No-Go — slip ${slip} days`,
    grade: 'okay',
    insight: 'A No-Go is a success of the process, not a failure of the team — if it is based on explicit criteria. The cost is trust and time; the alternative may be an outage.',
    concept: 'launch-readiness',
  })
  s.phase = 'day'
  s.day += 1
  s.focus = s.maxFocus = BASE_FOCUS
  deliverMorning(s, rng)
  s.rng = rng.state()
  return { state: s, deltas }
}

/** Launch! Rolls the outcome from quality, readiness, completeness and unhandled risks. */
export function decideLaunch(state: GameState, mode: LaunchMode): { state: GameState; result: LaunchResult; deltas: Delta[] } {
  if (mode === 'phased' && !state.readiness.featureFlags) throw new Error('Phased rollout needs feature flags')
  const s = structuredClone(state)
  const rng = makeRng(s.rng)
  const sc = getScenario(s.scenarioId)
  const deltas: Delta[] = []
  const notes: LaunchResult['notes'] = []
  const p = problemChance(s)
  const problem = rng.chance(p)
  let tier: LaunchTier = 'smooth'
  let caughtInCanary = false
  if (problem) tier = s.readiness.monitoring && s.readiness.rollbackPlan ? 'bumpy' : 'sev1'
  if (problem && mode === 'phased') {
    if (tier === 'bumpy') {
      tier = 'smooth'
      caughtInCanary = true
    } else tier = 'bumpy'
  }

  if (tier === 'smooth') {
    changeMeter(s, 'trust', caughtInCanary ? 6 : 8, deltas)
    changeMeter(s, 'morale', 8, deltas)
    notes.push(
      caughtInCanary
        ? { tone: 'good', text: 'A bug surfaced at 5% — the canary caught it, you paused the rollout, fixed it, and resumed. Most customers never noticed.' }
        : { tone: 'good', text: `${sc.product} is live. Dashboards are green, support queues are quiet, and the sponsor posts a 🚀 in the exec channel.` },
    )
  } else if (tier === 'bumpy') {
    changeMeter(s, 'trust', -2, deltas)
    changeMeter(s, 'morale', -2, deltas)
    notes.push({ tone: 'neutral', text: 'Error rates spike 40 minutes in. Alerts fire, the on-call engineer catches it, and the blast radius stays small.' })
  } else {
    changeMeter(s, 'trust', -10, deltas)
    changeMeter(s, 'morale', -8, deltas)
    changeMeter(s, 'quality', -5, deltas)
    notes.push({ tone: 'bad', text: 'Sev-1. Customers notice before your dashboards do — because there aren’t any. Rolling back takes hours without a rehearsed plan.' })
  }
  if (!s.readiness.signoff) {
    changeMeter(s, 'trust', -12, deltas)
    changeRel(s, 'compliance', -15, deltas)
    notes.push({ tone: 'bad', text: `You launched without compliance sign-off. ${sc.cast.compliance.short} escalates to the sponsor and the incident goes on your record.` })
  }
  const late = s.day - s.originalTargetDay
  if (late > 0) {
    changeMeter(s, 'trust', -Math.min(6, late), deltas)
    notes.push({ tone: 'neutral', text: `Launched ${late} day${late > 1 ? 's' : ''} after the original target.` })
  } else notes.push({ tone: 'good', text: late < 0 ? `Launched ${-late} days early!` : 'Launched on the original target date.' })
  if (s.flags['sys:watermelon'] && late > 0) {
    changeMeter(s, 'trust', -6, deltas)
    notes.push({ tone: 'bad', text: 'Your last status report said things were fine. The delay is a surprise, and surprises are what execs remember.' })
  }

  const result: LaunchResult = { day: s.day, mode, tier, completion: completion(s.ws), readyCount: readyCount(s), problemChance: p, caughtInCanary, notes }
  s.launch = result
  meetConcept(s, mode === 'phased' ? 'phased-rollout' : 'launch-readiness')
  const grade: Grade = mode === 'phased' ? 'best' : readyCount(s) >= 7 ? 'okay' : 'poor'
  logDecision(s, {
    eventId: 'launch',
    title: 'Go/No-Go meeting',
    choiceLabel: mode === 'phased' ? 'GO — phased rollout behind feature flags' : 'GO — full launch to 100%',
    grade,
    insight:
      mode === 'phased'
        ? 'Ramping 1% → 10% → 50% → 100% behind a kill switch turns launch-day surprises into small, reversible events.'
        : 'Big-bang launches put 100% of customers in the blast radius. When you can, ramp gradually behind flags.',
    concept: mode === 'phased' ? 'phased-rollout' : 'launch-readiness',
  })
  grantXp(s, 'execution', grade)
  if (tier === 'smooth') {
    s.phase = 'ended'
    s.ending = 'launched'
  } else s.phase = 'launch'
  s.rng = rng.state()
  return { state: s, result, deltas }
}

export interface IncidentOption {
  id: string
  icon: string
  label: string
  grade: Grade
  insight: string
}

export const INCIDENT_OPTIONS: IncidentOption[] = [
  {
    id: 'debug',
    icon: '⌨️',
    label: 'Open the logs and start debugging — you know this code better than anyone',
    grade: 'poor',
    insight: 'In an incident the TPM’s job is coordination and communication. If you are debugging, nobody is running the incident, and execs hear about it on social media.',
  },
  {
    id: 'commander',
    icon: '🎧',
    label: 'Run it as Incident Commander: assign roles, open a war room, update execs every 30 min',
    grade: 'best',
    insight: 'Incident Commander, tech lead, comms lead, scribe — clear roles, a regular update cadence, and a bias to roll back first and investigate later. Then a blameless post-mortem.',
  },
  {
    id: 'quiet',
    icon: '🤫',
    label: 'Let the engineers fix it quietly; brief the execs once it’s resolved',
    grade: 'poor',
    insight: 'Silence during an incident is read as either ignorance or concealment. Communicate early and on a cadence, even when the update is “still investigating”.',
  },
]

export function resolveIncident(state: GameState, choiceId: string): { state: GameState; deltas: Delta[]; option: IncidentOption } {
  const s = structuredClone(state)
  const option = INCIDENT_OPTIONS.find((o) => o.id === choiceId)
  if (!option || !s.launch) throw new Error('No incident to resolve')
  const deltas: Delta[] = []
  const sev = s.launch.tier === 'sev1' ? 1.5 : 1
  if (option.id === 'commander') {
    changeMeter(s, 'trust', Math.round(5 * sev), deltas)
    changeMeter(s, 'morale', 3, deltas)
  } else if (option.id === 'debug') {
    changeMeter(s, 'trust', -Math.round(5 * sev), deltas)
    changeMeter(s, 'morale', -4, deltas)
  } else {
    changeMeter(s, 'trust', -Math.round(7 * sev), deltas)
  }
  s.launch.incidentChoice = option.id
  meetConcept(s, 'incident-mgmt')
  grantXp(s, 'leadership', option.grade)
  logDecision(s, { eventId: 'launch-incident', title: 'Launch-day incident', choiceLabel: option.label, grade: option.grade, insight: option.insight, concept: 'incident-mgmt' })
  s.phase = 'ended'
  s.ending = 'launched'
  return { state: s, deltas, option }
}

/** Every workstream complete — the player may call Go/No-Go before the target day. */
export function canLaunchEarly(s: GameState): boolean {
  return s.phase === 'day' && s.day < s.targetDay && WS_ROLES.every((r) => s.ws[r].done >= s.ws[r].work - 1e-6)
}

export function callGoNoGoEarly(state: GameState): GameState {
  if (!canLaunchEarly(state)) return state
  return { ...structuredClone(state), phase: 'goNoGo' }
}
