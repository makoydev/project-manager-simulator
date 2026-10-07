import { DELIVERY_EVENTS } from '../content/events/delivery'
import { PEOPLE_EVENTS } from '../content/events/people'
import { SYSTEM_EVENTS } from '../content/events/system'
import { KAMPONG } from '../content/scenarios/kampong'
import { LIONCITY } from '../content/scenarios/lioncity'
import { SHIOKPAY } from '../content/scenarios/shiokpay'
import type { EventDef, RiskDef, ScenarioDef, ScenarioId } from './types'

/** Ordered by difficulty — the setup screen lists them in this order. */
export const SCENARIOS: ScenarioDef[] = [SHIOKPAY, KAMPONG, LIONCITY]
export const GENERIC_EVENTS: EventDef[] = [...PEOPLE_EVENTS, ...DELIVERY_EVENTS, ...SYSTEM_EVENTS]

const scenarios = new Map<ScenarioId, ScenarioDef>()
const events = new Map<string, EventDef>()
const pools = new Map<ScenarioId, EventDef[]>()

/** Register a scenario (and index its events). Tests use this to inject fixtures. */
export function registerScenario(s: ScenarioDef) {
  scenarios.set(s.id, s)
  for (const e of s.events) events.set(e.id, e)
  pools.set(s.id, [...GENERIC_EVENTS, ...s.events])
}

for (const e of GENERIC_EVENTS) events.set(e.id, e)
for (const s of SCENARIOS) registerScenario(s)

export function getScenario(id: ScenarioId): ScenarioDef {
  const s = scenarios.get(id)
  if (!s) throw new Error(`Unknown scenario ${id}`)
  return s
}

export function getEvent(id: string): EventDef {
  const e = events.get(id)
  if (!e) throw new Error(`Unknown event ${id}`)
  return e
}

export function hasEvent(id: string): boolean {
  return events.has(id)
}

/** Every event that can appear in a scenario: generic + scenario-specific. */
export function eventPool(id: ScenarioId): EventDef[] {
  return pools.get(id) ?? []
}

export function getRisk(s: ScenarioDef, id: string): RiskDef | undefined {
  return s.risks.find((r) => r.id === id)
}
