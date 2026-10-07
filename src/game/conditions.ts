import type { Condition, GameState, MeterKey, Role, WsRole } from './types'

/** Workstream progress in percent. */
export function pct(s: GameState, ws: WsRole): number {
  const w = s.ws[ws]
  return w.work <= 0 ? 100 : Math.min(100, (w.done / w.work) * 100)
}

/**
 * Evaluate a content condition. `behind` is lazy because it needs a schedule projection.
 */
export function check(c: Condition | undefined, s: GameState, behind: () => boolean): boolean {
  if (!c) return true
  if (c.minDay !== undefined && s.day < c.minDay) return false
  if (c.maxDay !== undefined && s.day > c.maxDay) return false
  if (c.flags && !c.flags.every((f) => s.flags[f])) return false
  if (c.notFlags && c.notFlags.some((f) => s.flags[f])) return false
  for (const [k, v] of Object.entries(c.meterAtLeast ?? {})) if (s.meters[k as MeterKey] < (v as number)) return false
  for (const [k, v] of Object.entries(c.meterBelow ?? {})) if (s.meters[k as MeterKey] >= (v as number)) return false
  for (const [k, v] of Object.entries(c.relAtLeast ?? {})) if (s.rel[k as Role] < (v as number)) return false
  for (const [k, v] of Object.entries(c.relBelow ?? {})) if (s.rel[k as Role] >= (v as number)) return false
  for (const [k, v] of Object.entries(c.progressAtLeast ?? {})) if (pct(s, k as WsRole) < (v as number)) return false
  for (const [k, v] of Object.entries(c.progressBelow ?? {})) if (pct(s, k as WsRole) >= (v as number)) return false
  if (c.blocked && !c.blocked.every((w) => s.ws[w].blockedDays > 0)) return false
  if (c.readiness && !c.readiness.every((r) => s.readiness[r])) return false
  if (c.notReadiness && c.notReadiness.some((r) => s.readiness[r])) return false
  if (c.background && !c.background.includes(s.background)) return false
  if (c.riskOpen && !c.riskOpen.every((id) => s.risks[id] === 'open')) return false
  if (c.behindSchedule !== undefined && behind() !== c.behindSchedule) return false
  return true
}
