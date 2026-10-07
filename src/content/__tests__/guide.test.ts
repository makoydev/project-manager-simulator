import { describe, expect, it } from 'vitest'
import type { ConceptId } from '../../game/types'
import { CAREER } from '../guide/career'
import { CONCEPTS } from '../guide/concepts'

const ALL: ConceptId[] = [
  'tpm-role', 'tpm-vs-roles', 'raid-log', 'rag-status', 'status-report', 'stakeholder-map', 'influence', 'raci',
  'escalation', 'critical-path', 'scope-creep', 'iron-triangle', 'estimation', 'brooks-law', 'risk-mgmt',
  'incident-mgmt', 'postmortem', 'launch-readiness', 'phased-rollout', 'tech-debt', 'agile-ceremonies', 'meetings',
  'team-health', 'tl-trap', 'vendor-mgmt', 'change-mgmt', 'mas-trm', 'pdpa', 'cross-timezone', 'uat', 'metrics',
  'decision-log', 'negotiation', 'self-care',
]

describe('field guide', () => {
  it('has exactly one entry per concept', () => {
    expect(CONCEPTS.map((c) => c.id).sort()).toEqual([...ALL].sort())
  })
  it('entries are complete and concise', () => {
    for (const c of CONCEPTS) {
      expect(c.tldr.length, c.id).toBeLessThanOrEqual(140)
      expect(c.body.length, c.id).toBeGreaterThanOrEqual(2)
      expect(c.body.length, c.id).toBeLessThanOrEqual(4)
      expect(c.inPractice.length, c.id).toBeGreaterThanOrEqual(3)
      expect(c.inPractice.length, c.id).toBeLessThanOrEqual(5)
      expect([...c.icon].length, c.id).toBeLessThanOrEqual(3)
    }
  })
  it('career kit has substance', () => {
    expect(CAREER.length).toBeGreaterThanOrEqual(5)
    const ids = CAREER.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const s of CAREER) expect(s.blocks.length, s.id).toBeGreaterThanOrEqual(2)
  })
})
