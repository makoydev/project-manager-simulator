import { describe, expect, it } from 'vitest'
import { capFor, completion, initWorkstreams, modifierMult, project, tick, topoOrder, velocityFactor, waitingOn } from '../schedule'
import type { WorkstreamDef, WsRole } from '../types'

const defs: WorkstreamDef[] = [
  { role: 'core', name: 'Core', icon: '⚙️', owner: 'lead', work: 50, velocity: 10, description: '' },
  { role: 'client', name: 'Client', icon: '📱', owner: 'partner', work: 40, velocity: 10, deps: [{ on: 'core', capAt: 0.5 }], description: '' },
  { role: 'platform', name: 'Platform', icon: '☁️', owner: 'sre', work: 20, velocity: 10, description: '' },
  { role: 'data', name: 'Data', icon: '🧮', owner: 'lead', work: 20, velocity: 10, deps: [{ on: 'platform', capAt: 0.5 }], description: '' },
  { role: 'review', name: 'Review', icon: '⚖️', owner: 'compliance', work: 10, velocity: 5, deps: [{ on: 'client', capAt: 0.8 }], description: '' },
]
const vel = Object.fromEntries(defs.map((d) => [d.role, d.velocity])) as Record<WsRole, number>

describe('schedule', () => {
  it('velocity factor is ~1 at typical starting morale/quality', () => {
    expect(velocityFactor(62, 68)).toBeCloseTo(1, 1)
    expect(velocityFactor(100, 100)).toBeGreaterThan(velocityFactor(30, 30))
  })

  it('orders dependencies before dependants', () => {
    const order = topoOrder(initWorkstreams(defs))
    expect(order.indexOf('core')).toBeLessThan(order.indexOf('client'))
    expect(order.indexOf('client')).toBeLessThan(order.indexOf('review'))
    expect(order.indexOf('platform')).toBeLessThan(order.indexOf('data'))
  })

  it('caps a workstream at its dependency threshold until the dependency completes', () => {
    const ws = initWorkstreams(defs)
    for (let d = 1; d <= 3; d++) tick({ ws, velocity: vel, factor: 1, modifiers: [], day: d })
    expect(ws.client.done).toBe(20) // capped at 50% of 40
    expect(waitingOn(ws.client, ws)).toBe('core')
    expect(capFor(ws.client, ws)).toBe(0.5)
    for (let d = 4; d <= 5; d++) tick({ ws, velocity: vel, factor: 1, modifiers: [], day: d })
    expect(ws.core.done).toBe(50)
    expect(ws.client.done).toBe(30) // cap lifts in the same tick core finishes
  })

  it('blocked workstreams make no progress and burn blocked days', () => {
    const ws = initWorkstreams(defs)
    ws.core.blockedDays = 2
    ws.core.blockReason = 'waiting on vendor'
    tick({ ws, velocity: vel, factor: 1, modifiers: [], day: 1 })
    expect(ws.core.done).toBe(0)
    expect(ws.core.blockedDays).toBe(1)
    tick({ ws, velocity: vel, factor: 1, modifiers: [], day: 2 })
    expect(ws.core.blockedDays).toBe(0)
    expect(ws.core.blockReason).toBeUndefined()
    tick({ ws, velocity: vel, factor: 1, modifiers: [], day: 3 })
    expect(ws.core.done).toBe(10)
  })

  it('applies modifiers only inside their day window', () => {
    const mods = [{ ws: 'core' as const, mult: 2, fromDay: 3, untilDay: 4, label: 'x' }]
    expect(modifierMult(mods, 'core', 2)).toBe(1)
    expect(modifierMult(mods, 'core', 3)).toBe(2)
    expect(modifierMult(mods, 'core', 5)).toBe(1)
    expect(modifierMult(mods, 'client', 3)).toBe(1)
  })

  it('projects launch day and walks the critical chain through gating dependencies', () => {
    const p = project(initWorkstreams(defs), vel, 1, [], 1)
    // core done day 5 → client resumes the same day, done day 6 → review (pinned at 80%) finishes day 6 too.
    expect(p.finish.core).toBe(5)
    expect(p.finish.client).toBe(6)
    expect(p.finish.review).toBe(6)
    expect(p.finish.data).toBe(2)
    expect(p.launchDay).toBe(6)
    expect(p.critical).toEqual(['review', 'client', 'core'])
  })

  it('does not mutate the input when projecting', () => {
    const ws = initWorkstreams(defs)
    project(ws, vel, 1, [], 1)
    expect(completion(ws)).toBe(0)
  })
})
