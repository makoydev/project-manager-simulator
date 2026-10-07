/**
 * Scripted players for balance simulations. Each policy plays a whole program
 * through the real engine, the same calls the UI makes.
 */
import { ACTIONS, availability, performAction, PANEL_ACTIONS, type ActionId } from '../actions'
import { getEvent, getScenario } from '../content'
import { choiceLocked, endDay, newGame, resolveChoice } from '../engine'
import { canNoGo, decideLaunch, decideNoGo, readyCount, resolveIncident } from '../launch'
import { READINESS } from '../meta'
import { reportableRisks, retroDue, RETRO_OPTIONS, statusReportDue, submitRetro, submitStatusReport, truthRag } from '../report'
import { makeRng, type Rng } from '../rng'
import { finalScore, type FinalScore } from '../scoring'
import type { BackgroundId, GameState, Grade, Rag, Role, ScenarioId, WsRole } from '../types'

export type Policy = 'seasoned' | 'novice' | 'random' | 'rookie'

const WS: WsRole[] = ['core', 'client', 'platform', 'data', 'review']
const ROLES: Role[] = ['sponsor', 'boss', 'pm', 'lead', 'partner', 'sre', 'security', 'compliance']
const URG = { critical: 0, high: 1, normal: 2, low: 3 }

function pickChoice(s: GameState, eventId: string, policy: Policy, rng: Rng): string | null {
  const e = getEvent(eventId)
  const open = e.choices.filter((c) => !choiceLocked(s, eventId, c.id))
  if (!open.length) return null
  if (policy === 'random') return rng.pick(open).id
  if (policy === 'novice') {
    const roll = rng.next()
    const target: Grade = roll < 0.45 ? 'best' : roll < 0.75 ? 'okay' : 'poor'
    const hit = open.filter((c) => c.grade === target)
    return (hit.length ? rng.pick(hit) : rng.pick(open)).id
  }
  const want: Grade[] = policy === 'seasoned' ? ['best', 'okay', 'poor'] : ['poor', 'okay', 'best']
  for (const g of want) {
    const c = open.filter((x) => x.grade === g).sort((a, b) => a.cost - b.cost)[0]
    if (c) return c.id
  }
  return open[0].id
}

function handleInbox(s: GameState, policy: Policy, rng: Rng): GameState {
  // Rookies ignore a third of their messages; everyone else triages by urgency.
  const items = [...s.inbox].sort((a, b) => URG[getEvent(a.eventId).urgency] - URG[getEvent(b.eventId).urgency] || a.expiresDay - b.expiresDay)
  for (const it of items) {
    if (policy === 'rookie' && rng.chance(0.33)) continue
    if (!s.inbox.some((x) => x.uid === it.uid)) continue
    const choice = pickChoice(s, it.eventId, policy, rng)
    if (choice) s = resolveChoice(s, it.uid, choice).state
  }
  return s
}

function tryAct(s: GameState, id: ActionId, target?: string): GameState {
  return availability(s, id, target).ok ? performAction(s, id, target).state : s
}

function proactive(s: GameState, policy: Policy, rng: Rng): GameState {
  const sc = getScenario(s.scenarioId)
  if (policy === 'seasoned') {
    // Unblock, mitigate the biggest risks, drive readiness, keep relationships warm.
    for (const r of WS) if (s.ws[r].blockedDays > 1) s = tryAct(s, 'facilitate', r)
    const open = sc.risks.filter((r) => s.risks[r.id] === 'open').sort((a, b) => b.likelihood * b.impact - a.likelihood * a.impact)
    for (const r of open) if (r.likelihood * r.impact >= 9) s = tryAct(s, 'mitigate', r.id)
    if (sc.risks.some((r) => s.risks[r.id] === 'hidden')) s = tryAct(s, 'riskReview')
    for (const r of READINESS) s = tryAct(s, 'readiness', r.key)
    if (s.meters.morale < 55) s = tryAct(s, 'teamLunch')
    const coldest = [...ROLES].sort((a, b) => s.rel[a] - s.rel[b])[0]
    s = tryAct(s, 'kopi', coldest)
    s = tryAct(s, 'update')
    return s
  }
  if (policy === 'novice') {
    // Does some of the right things, inconsistently.
    if (rng.chance(0.5)) s = tryAct(s, 'kopi', rng.pick(ROLES))
    if (rng.chance(0.4)) s = tryAct(s, 'riskReview')
    const open = sc.risks.filter((r) => s.risks[r.id] === 'open')
    if (open.length && rng.chance(0.4)) s = tryAct(s, 'mitigate', rng.pick(open).id)
    for (const r of READINESS) if (rng.chance(0.5)) s = tryAct(s, 'readiness', r.key)
    for (const r of WS) if (s.ws[r].blockedDays > 0) s = tryAct(s, rng.chance(0.5) ? 'facilitate' : 'escalate', r)
    return s
  }
  if (policy === 'random') {
    for (let i = 0; i < 3; i++) {
      const id = rng.pick([...PANEL_ACTIONS, 'mitigate', 'readiness'] as ActionId[])
      const target =
        ACTIONS[id].target === 'role'
          ? rng.pick(ROLES)
          : ACTIONS[id].target === 'ws'
            ? rng.pick(WS)
            : id === 'mitigate'
              ? rng.pick(sc.risks).id
              : id === 'readiness'
                ? rng.pick(READINESS).key
                : undefined
      if (id === 'overtime') continue
      s = tryAct(s, id, target)
    }
    return s
  }
  // Rookie: codes it themselves and stays late.
  s = tryAct(s, 'codeIt', 'core')
  if (s.focus <= 1 && rng.chance(0.4)) s = tryAct(s, 'overtime')
  for (const r of WS) if (s.ws[r].blockedDays > 0) s = tryAct(s, 'escalate', r)
  return s
}

function report(s: GameState, policy: Policy, rng: Rng): GameState {
  const truth = truthRag(s)
  const rags: Rag[] = ['green', 'amber', 'red']
  if (policy === 'seasoned') {
    const top = reportableRisks(s).filter((r) => s.risks[r.id] === 'open')[0]
    const blocked = WS.some((r) => s.ws[r].blockedDays > 0)
    const late = truth.projected === null || truth.projected > s.targetDay
    return submitStatusReport(s, {
      overall: truth.overall,
      ws: truth.ws,
      topRisk: top?.id ?? null,
      ask: blocked ? 'unblock' : late ? 'decision' : truth.overall === 'green' ? 'recognition' : 'none',
    }).state
  }
  if (policy === 'novice') {
    // Mostly honest; sometimes rounds one notch up out of optimism.
    const lift = (r: Rag): Rag => (rng.chance(0.3) ? (r === 'red' ? 'amber' : 'green') : r)
    const top = reportableRisks(s).filter((r) => s.risks[r.id] === 'open')[0]
    return submitStatusReport(s, {
      overall: lift(truth.overall),
      ws: Object.fromEntries(WS.map((r) => [r, lift(truth.ws[r])])) as Record<WsRole, Rag>,
      topRisk: rng.chance(0.6) ? (top?.id ?? null) : null,
      ask: rng.pick(['none', 'unblock', 'decision', 'recognition'] as const),
    }).state
  }
  if (policy === 'rookie') {
    return submitStatusReport(s, { overall: 'green', ws: { core: 'green', client: 'green', platform: 'green', data: 'green', review: 'green' }, topRisk: null, ask: 'none' }).state
  }
  return submitStatusReport(s, {
    overall: rng.pick(rags),
    ws: Object.fromEntries(WS.map((r) => [r, rng.pick(rags)])) as Record<WsRole, Rag>,
    topRisk: null,
    ask: rng.pick(['none', 'unblock', 'decision', 'headcount', 'recognition'] as const),
  }).state
}

export interface RunResult {
  score: FinalScore
  state: GameState
}

export function playRun(scenarioId: ScenarioId, background: BackgroundId, policy: Policy, seed: number): RunResult {
  const rng = makeRng(seed ^ 0x9e3779b9)
  let s = newGame({ scenarioId, background, playerName: 'Bot', seed })
  let guard = 0
  while (s.phase !== 'ended' && guard++ < 60) {
    if (s.phase === 'day') {
      s = handleInbox(s, policy, rng)
      s = proactive(s, policy, rng)
      if (statusReportDue(s)) s = report(s, policy, rng)
      if (retroDue(s)) {
        const pick = policy === 'seasoned' ? 'ci' : policy === 'rookie' ? 'deadline' : rng.pick(RETRO_OPTIONS).id // novice & random pick at random
        s = submitRetro(s, pick).state
      }
      s = endDay(s).state
    } else if (s.phase === 'goNoGo') {
      const ready = readyCount(s)
      if (policy === 'seasoned' && (ready < 7 || s.ws.core.done < s.ws.core.work) && canNoGo(s) && s.counters.noGos < 1) s = decideNoGo(s).state
      else s = decideLaunch(s, policy === 'seasoned' && s.readiness.featureFlags ? 'phased' : 'full').state
    } else if (s.phase === 'launch') {
      s = resolveIncident(s, policy === 'seasoned' ? 'commander' : policy === 'rookie' ? 'debug' : rng.pick(['commander', 'debug', 'quiet'])).state // novice & random
    }
  }
  if (s.phase !== 'ended') throw new Error(`Run did not finish (phase ${s.phase}, day ${s.day})`)
  return { score: finalScore(s), state: s }
}
