import { BACKGROUNDS } from './backgrounds'
import { getScenario } from './content'
import { addSkill } from './effects'
import { baseVelocities, completion, project, velocityFactor, type Projection } from './schedule'
import { fill } from './text'
import type { Choice, ConceptId, DaySnapshot, GameState, Grade, Role, SkillKey } from './types'

export const BASE_FOCUS = 6

export function projectionOf(s: GameState, fromDay = s.day): Projection {
  const sc = getScenario(s.scenarioId)
  return project(s.ws, baseVelocities(sc.workstreams), velocityFactor(s.meters.morale, s.meters.quality), s.modifiers, fromDay)
}

/** Projected launch day, or a large sentinel when the work can't finish within the horizon. */
export function projectedLaunch(s: GameState, fromDay = s.day): number {
  return projectionOf(s, fromDay).launchDay ?? fromDay + 60
}

export function isBehind(s: GameState): boolean {
  return projectedLaunch(s) > s.targetDay
}

export function snapshotOf(s: GameState, day: number, fromDay: number): DaySnapshot {
  return {
    day,
    progress: Math.round(completion(s.ws) * 1000) / 10,
    projectedDay: projectedLaunch(s, fromDay),
    targetDay: s.targetDay,
    meters: { ...s.meters },
  }
}

const XP: Record<Grade, number> = { best: 3, okay: 1, poor: 0 }

/** Award skill XP for a decision, scaled by background strengths. */
export function grantXp(s: GameState, skill: SkillKey, grade: Grade) {
  const mult = BACKGROUNDS[s.background].xp[skill] ?? 1
  addSkill(s, skill, XP[grade] * mult)
}

export function chanceOf(s: GameState, c: NonNullable<Choice['chance']>): number {
  const relBonus = c.rel ? (s.rel[c.rel as Role] - 50) / 100 : 0
  return Math.max(0.05, Math.min(0.95, c.base + relBonus))
}

/** Returns true when this is the first time the concept is met in this run. */
export function meetConcept(s: GameState, concept: ConceptId): boolean {
  if (s.conceptsSeen.includes(concept)) return false
  s.conceptsSeen.push(concept)
  return true
}

export function logDecision(
  s: GameState,
  entry: { eventId: string; title: string; choiceLabel: string; grade: Grade; insight: string; concept: ConceptId; ignored?: boolean },
) {
  s.log.push({
    day: s.day,
    eventId: entry.eventId,
    title: fill(entry.title, s),
    choiceLabel: fill(entry.choiceLabel, s),
    grade: entry.grade,
    insight: fill(entry.insight, s),
    concept: entry.concept,
    ignored: entry.ignored,
  })
}

export const week = (day: number) => Math.ceil(day / 5)
export const weekday = (day: number) => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][(day - 1) % 5]
