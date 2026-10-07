import { describe, expect, it } from 'vitest'
import { availability, performAction } from '../actions'
import { eventPool, getEvent, getScenario, SCENARIOS } from '../content'
import { choiceLocked, endDay, newGame, resolveChoice } from '../engine'
import { canNoGo, decideLaunch, decideNoGo, goNoGoVotes, resolveIncident } from '../launch'
import { statusReportDue, submitStatusReport, truthRag } from '../report'
import { finalScore } from '../scoring'
import { fill } from '../text'
import type { GameState, WsRole } from '../types'
import { validateEventList } from '../validate'

const WS: WsRole[] = ['core', 'client', 'platform', 'data', 'review']

function fresh(seed = 42): GameState {
  return newGame({ scenarioId: 'shiokpay', background: 'hybrid', playerName: 'Jas', seed })
}

/** End days without acting until the predicate holds. Trust is propped up so mechanics can be tested in isolation. */
function skipUntil(s: GameState, done: (s: GameState) => boolean): GameState {
  let guard = 0
  while (!done(s) && s.phase === 'day' && guard++ < 40) {
    s = { ...s, meters: { ...s.meters, trust: 80, morale: 70 } }
    if (statusReportDue(s)) {
      const t = truthRag(s)
      s = submitStatusReport(s, { overall: t.overall, ws: t.ws, topRisk: null, ask: 'none' }).state
    }
    s = endDay(s).state
  }
  return s
}

describe('content registry', () => {
  it('every scenario pool validates as one set (generic + scenario events, no id clashes)', () => {
    for (const sc of SCENARIOS) {
      const errors = validateEventList(eventPool(sc.id), { riskIds: new Set(sc.risks.map((r) => r.id)) })
      expect(errors, sc.id).toEqual([])
    }
  })

  it('fills every token in every event for every scenario', () => {
    for (const sc of SCENARIOS) {
      const s = newGame({ scenarioId: sc.id, background: 'builder', playerName: 'Jas', seed: 1 })
      for (const e of eventPool(sc.id)) {
        const texts = [e.title, e.body, e.ignored.text, ...e.choices.flatMap((c) => [c.label, c.insight, c.outcome?.text ?? '', c.chance?.success.text ?? '', c.chance?.failure.text ?? ''])]
        for (const t of texts) expect(fill(t, s), `${sc.id}/${e.id}`).not.toMatch(/\{[a-z.]+\}/)
      }
    }
  })
})

describe('new game', () => {
  it('starts every scenario and background on Day 1 with a story beat in the inbox', () => {
    for (const sc of SCENARIOS)
      for (const bg of ['builder', 'planner', 'hybrid'] as const) {
        const s = newGame({ scenarioId: sc.id, background: bg, playerName: 'Jas', seed: 7 })
        expect(s.day).toBe(1)
        expect(s.focus).toBe(6)
        expect(s.inbox.length).toBeGreaterThanOrEqual(1)
        expect(s.inbox.some((i) => getEvent(i.eventId).fixedDay === 1)).toBe(true)
        expect(s.meters.energy).toBe(100)
      }
  })

  it('planners start with hidden risks already revealed', () => {
    const planner = newGame({ scenarioId: 'kampong', background: 'planner', playerName: 'P', seed: 3 })
    const builder = newGame({ scenarioId: 'kampong', background: 'builder', playerName: 'B', seed: 3 })
    const open = (s: GameState) => Object.values(s.risks).filter((r) => r === 'open').length
    expect(open(planner)).toBe(open(builder) + 2)
  })

  it('is deterministic for a given seed', () => {
    const a = endDay(fresh(99)).state
    const b = endDay(fresh(99)).state
    expect(a).toEqual(b)
  })
})

describe('choices', () => {
  it('spend focus, apply effects, log the decision and clear the inbox item', () => {
    const s = fresh()
    const item = s.inbox[0]
    const e = getEvent(item.eventId)
    const c = e.choices.find((x) => !choiceLocked(s, e.id, x.id))!
    const { state, result } = resolveChoice(s, item.uid, c.id)
    expect(state.focus).toBe(s.focus - c.cost)
    expect(state.inbox.find((i) => i.uid === item.uid)).toBeUndefined()
    expect(state.log).toHaveLength(1)
    expect(result.grade).toBe(c.grade)
    expect(state.conceptsSeen).toContain(e.concept)
  })

  it('refuses a choice you cannot afford', () => {
    const s = { ...fresh(), focus: 0 }
    const item = s.inbox[0]
    const pricey = getEvent(item.eventId).choices.find((c) => c.cost > 0)
    if (pricey) expect(() => resolveChoice(s, item.uid, pricey.id)).toThrow()
  })
})

describe('end of day', () => {
  it('advances the day, makes progress, snapshots history and expires ignored messages', () => {
    let s = fresh()
    const before = WS.reduce((a, r) => a + s.ws[r].done, 0)
    const expiring = s.inbox.filter((i) => i.expiresDay <= s.day).length
    const { state, report } = endDay(s)
    s = state
    expect(s.day).toBe(2)
    expect(WS.reduce((a, r) => a + s.ws[r].done, 0)).toBeGreaterThan(before)
    expect(s.history).toHaveLength(2)
    expect(report.expired).toHaveLength(expiring)
    expect(s.counters.ignored).toBe(expiring)
  })

  it('unspent focus restores more energy than a fully spent day', () => {
    const s = { ...fresh(), meters: { ...fresh().meters, energy: 40 } }
    const rested = endDay(s).state.meters.energy
    const tired = endDay({ ...s, focus: 0 }).state.meters.energy
    expect(rested).toBeGreaterThan(tired)
  })

  it('a burnt-out TPM gets an MC day with only 2 focus', () => {
    const s = { ...fresh(), meters: { ...fresh().meters, energy: 0 }, focus: 0 }
    const next = endDay(s).state
    expect(next.maxFocus).toBe(2)
    expect(next.counters.burnouts).toBe(1)
  })

  it('warns before firing, then fires if trust stays collapsed', () => {
    const s = { ...fresh(), meters: { ...fresh().meters, trust: 3 } }
    const warned = endDay(s).state
    expect(warned.phase).toBe('day')
    expect(warned.inbox.some((i) => i.eventId === 'sys-trust-warning')).toBe(true)
    const next = endDay({ ...warned, meters: { ...warned.meters, trust: 3 } }).state
    expect(next.phase).toBe('ended')
    expect(next.ending).toBe('fired')
  })

  it('a struggling team triggers a morale check-in from the tech lead', () => {
    const s = { ...fresh(), meters: { ...fresh().meters, morale: 20 } }
    expect(endDay(s).state.inbox.some((i) => i.eventId === 'sys-morale-warning')).toBe(true)
  })
})

describe('actions', () => {
  it('kopi builds a relationship and goes on cooldown', () => {
    const s = fresh()
    const { state } = performAction(s, 'kopi', 'lead')
    expect(state.rel.lead).toBeGreaterThan(s.rel.lead)
    expect(availability(state, 'kopi', 'lead').ok).toBe(false)
    expect(state.focus).toBe(s.focus - 1)
  })

  it('a pre-mortem reveals hidden risks', () => {
    const s = fresh()
    const hidden = (x: GameState) => Object.values(x.risks).filter((r) => r === 'hidden').length
    const { state } = performAction(s, 'riskReview')
    expect(hidden(state)).toBe(Math.max(0, hidden(s) - 2))
  })

  it('mitigating marks a risk mitigated', () => {
    const s = fresh()
    const open = getScenario('shiokpay').risks.find((r) => s.risks[r.id] === 'open')!
    const { state } = performAction(s, 'mitigate', open.id)
    expect(state.risks[open.id]).toBe('mitigated')
  })

  it('escalation unblocks but costs more trust each time', () => {
    let s = fresh()
    const trustBefore = s.meters.trust
    s = { ...s, ws: { ...s.ws, core: { ...s.ws.core, blockedDays: 2, blockReason: 'test' } } }
    s = performAction(s, 'escalate', 'core').state
    expect(s.ws.core.blockedDays).toBe(0)
    expect(s.meters.trust).toBeLessThan(trustBefore)
    expect(s.flags['sys:escalated']).toBe(true)
  })

  it('only coders can code, and coding sets the engine flag', () => {
    const planner = newGame({ scenarioId: 'shiokpay', background: 'planner', playerName: 'P', seed: 1 })
    expect(availability(planner, 'codeIt', 'core').ok).toBe(false)
    const { state } = performAction(fresh(), 'codeIt', 'core')
    expect(state.flags['sys:coded']).toBe(true)
    expect(state.counters.codeIt).toBe(1)
  })

  it('readiness items respect their prerequisites', () => {
    const s = fresh()
    expect(availability(s, 'readiness', 'loadTest').ok).toBe(false)
    expect(availability(s, 'readiness', 'uat').ok).toBe(false)
    const ready = { ...s, ws: { ...s.ws, core: { ...s.ws.core, done: s.ws.core.work * 0.8 }, platform: { ...s.ws.platform, done: s.ws.platform.work * 0.7 } } }
    expect(availability(ready, 'readiness', 'loadTest').ok).toBe(true)
    expect(performAction(ready, 'readiness', 'loadTest').state.readiness.loadTest).toBe(true)
  })
})

describe('status reports', () => {
  it('honest reports beat watermelon reports, and watermelons are remembered', () => {
    let s = skipUntil(fresh(5), (x) => statusReportDue(x))
    // Force a clearly red program so a green report is a watermelon.
    s = { ...s, ws: { ...s.ws, core: { ...s.ws.core, blockedDays: 4, blockReason: 'vendor' } } }
    const truth = truthRag(s)
    expect(truth.overall).toBe('red')
    const honest = submitStatusReport(s, { overall: truth.overall, ws: truth.ws, topRisk: null, ask: 'unblock' })
    const melon = submitStatusReport(s, {
      overall: 'green',
      ws: { core: 'green', client: 'green', platform: 'green', data: 'green', review: 'green' },
      topRisk: null,
      ask: 'none',
    })
    expect(honest.result.trustDelta).toBeGreaterThan(melon.result.trustDelta)
    expect(melon.result.watermelon).toBe(true)
    expect(melon.state.flags['sys:watermelon']).toBe(true)
    expect(honest.state.ws.core.blockedDays).toBe(0) // the specific ask got the blocker cleared
  })
})

describe('launch', () => {
  it('reaches Go/No-Go on the target day, can slip, and always ends', () => {
    let s = skipUntil(fresh(11), (x) => x.phase !== 'day')
    expect(s.phase).toBe('goNoGo')
    expect(goNoGoVotes(s)).toHaveLength(7)
    expect(canNoGo(s)).toBe(true)
    const slipped = decideNoGo(s).state
    expect(slipped.phase).toBe('day')
    expect(slipped.targetDay).toBeGreaterThan(s.targetDay)
    const launched = decideLaunch(s, 'full').state
    const ended = launched.phase === 'launch' ? resolveIncident(launched, 'commander').state : launched
    expect(ended.phase).toBe('ended')
    expect(ended.ending).toBe('launched')
    const score = finalScore(ended)
    expect(score.total).toBeGreaterThanOrEqual(0)
    expect(score.total).toBeLessThanOrEqual(100)
  })

  it('a phased rollout requires feature flags', () => {
    const s = skipUntil(fresh(12), (x) => x.phase !== 'day')
    expect(() => decideLaunch({ ...s, readiness: { ...s.readiness, featureFlags: false } }, 'phased')).toThrow()
  })
})
