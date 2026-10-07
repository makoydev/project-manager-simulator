import { describe, expect, it } from 'vitest'
import { baseVelocities, initWorkstreams, project, velocityFactor } from '../../game/schedule'
import { validateScenario } from '../../game/validate'
import { LIONCITY } from '../scenarios/lioncity'
import { expectFairChoices } from './helpers'

describe('lioncity scenario', () => {
  it('passes structural validation', () => {
    expect(validateScenario(LIONCITY)).toEqual([])
  })
  it('is tuned to its difficulty at neutral performance', () => {
    const s = LIONCITY
    const p = project(initWorkstreams(s.workstreams), baseVelocities(s.workstreams), velocityFactor(s.start.morale, s.start.quality), [], 1)
    const [lo, hi] = ({ 1: [13, 15], 2: [14, 17], 3: [15, 18] } as const)[s.difficulty]
    expect(p.launchDay, JSON.stringify(p.finish)).not.toBeNull()
    expect(p.launchDay!).toBeGreaterThanOrEqual(lo)
    expect(p.launchDay!).toBeLessThanOrEqual(hi)
  })
  it('does not telegraph answers', () => expectFairChoices(LIONCITY.events))
})
