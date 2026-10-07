import { describe, expect, it } from 'vitest'
import { SCENARIOS } from '../content'
import type { BackgroundId } from '../types'
import { playRun, type Policy } from './bots'

/**
 * Balance simulation: scripted players run whole programs through the real engine.
 * The game must reward what a seasoned TPM does and punish rookie habits.
 * `npm run simulate` prints the table.
 */
const SEEDS = 40
const POLICIES: Policy[] = ['seasoned', 'novice', 'random', 'rookie']
const BACKGROUNDS: BackgroundId[] = ['builder', 'planner', 'hybrid']

interface Row {
  scenario: string
  policy: Policy
  avg: number
  grades: string
  launchedOnTime: string
  fired: string
  avgLaunchDay: number
}

describe('balance simulation', () => {
  const rows: Row[] = []
  const avg: Record<string, Record<Policy, number>> = {}

  for (const sc of SCENARIOS) {
    avg[sc.id] = { seasoned: 0, novice: 0, random: 0, rookie: 0 }
    for (const policy of POLICIES) {
      it(`${sc.id} · ${policy} plays ${SEEDS} full programs without errors`, () => {
        const scores: number[] = []
        const grades: Record<string, number> = {}
        let onTime = 0
        let fired = 0
        let launchDays = 0
        for (let i = 0; i < SEEDS; i++) {
          const { score, state } = playRun(sc.id, BACKGROUNDS[i % 3], policy, 1000 + i * 7919)
          scores.push(score.total)
          grades[score.grade] = (grades[score.grade] ?? 0) + 1
          if (state.ending === 'fired') fired++
          if (state.launch && state.launch.day <= state.originalTargetDay) onTime++
          launchDays += state.launch?.day ?? state.day
        }
        const mean = scores.reduce((a, b) => a + b, 0) / SEEDS
        avg[sc.id][policy] = mean
        rows.push({
          scenario: sc.id,
          policy,
          avg: Math.round(mean * 10) / 10,
          grades: ['S', 'A', 'B', 'C', 'D'].map((g) => `${g}:${grades[g] ?? 0}`).join(' '),
          launchedOnTime: `${Math.round((onTime / SEEDS) * 100)}%`,
          fired: `${Math.round((fired / SEEDS) * 100)}%`,
          avgLaunchDay: Math.round((launchDays / SEEDS) * 10) / 10,
        })
        if (policy === 'seasoned') expect(fired).toBe(0)
        // A learner who is right about half the time should rarely be replaced.
        if (policy === 'novice') expect(fired / SEEDS).toBeLessThanOrEqual(0.1)
      })
    }
    it(`${sc.id} rewards seasoned > novice > random > rookie`, () => {
      expect(avg[sc.id].seasoned).toBeGreaterThan(avg[sc.id].novice + 8)
      expect(avg[sc.id].novice).toBeGreaterThan(avg[sc.id].random + 5)
      expect(avg[sc.id].random).toBeGreaterThan(avg[sc.id].rookie)
    })
  }

  it('prints the balance table', () => {
    console.table(rows)
    expect(rows.length).toBe(SCENARIOS.length * POLICIES.length)
  })
})
