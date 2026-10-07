import { getScenario } from './content'
import { READINESS_BY_KEY, METER_META } from './meta'
import type { Rng } from './rng'
import { capFor } from './schedule'
import type { Effects, GameState, MeterKey, Role, SkillKey, WsRole } from './types'

/** A visible consequence, rendered as an animated chip in the UI. */
export interface Delta {
  icon: string
  label: string
  value?: number
  unit?: '%' | 'k' | 'd' | ''
  good: boolean
}

const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v))

export function addSkill(s: GameState, skill: SkillKey, xp: number) {
  s.skills[skill] = Math.max(0, s.skills[skill] + xp)
}

export function changeMeter(s: GameState, key: MeterKey, delta: number, out: Delta[]) {
  if (!delta) return
  const before = s.meters[key]
  s.meters[key] = key === 'budget' ? Math.round((before + delta) * 10) / 10 : clamp(before + delta)
  const applied = key === 'budget' ? delta : s.meters[key] - before
  if (applied === 0) return
  out.push({ icon: METER_META[key].icon, label: METER_META[key].label, value: applied, unit: key === 'budget' ? 'k' : '', good: applied > 0 })
}

export function changeRel(s: GameState, role: Role, delta: number, out: Delta[]) {
  if (!delta) return
  const before = s.rel[role]
  s.rel[role] = clamp(before + delta)
  const applied = s.rel[role] - before
  if (applied === 0) return
  const c = getScenario(s.scenarioId).cast[role]
  out.push({ icon: c.avatar, label: c.short, value: applied, good: applied > 0 })
}

export function addProgress(s: GameState, ws: WsRole, pctPoints: number, out: Delta[]) {
  const w = s.ws[ws]
  const before = w.done
  if (pctPoints >= 0) w.done = Math.min(w.work * capFor(w, s.ws), w.done + (w.work * pctPoints) / 100)
  else w.done = Math.max(0, w.done + (w.work * pctPoints) / 100)
  // Never go backwards past a cap that was already exceeded, and never forwards past it.
  w.done = Math.max(pctPoints >= 0 ? before : 0, w.done)
  const applied = w.work > 0 ? ((w.done - before) / w.work) * 100 : 0
  if (Math.abs(applied) < 0.05) return
  out.push({ icon: wsIcon(s, ws), label: wsName(s, ws), value: Math.round(applied), unit: '%', good: applied > 0 })
}

export function wsName(s: GameState, ws: WsRole): string {
  return getScenario(s.scenarioId).workstreams.find((w) => w.role === ws)?.name ?? ws
}

export function wsIcon(s: GameState, ws: WsRole): string {
  return getScenario(s.scenarioId).workstreams.find((w) => w.role === ws)?.icon ?? '📦'
}

export function block(s: GameState, ws: WsRole, days: number, reason: string, out: Delta[]) {
  const w = s.ws[ws]
  if (w.done >= w.work) return
  w.blockedDays = Math.max(w.blockedDays, days)
  w.blockReason = reason
  out.push({ icon: '⛔', label: `${wsName(s, ws)} blocked`, value: days, unit: 'd', good: false })
}

export function unblock(s: GameState, ws: WsRole, out: Delta[]) {
  const w = s.ws[ws]
  if (w.blockedDays <= 0) return
  w.blockedDays = 0
  w.blockReason = undefined
  out.push({ icon: '🔓', label: `${wsName(s, ws)} unblocked`, good: true })
}

/** Reveal the highest-exposure hidden risks (random tie-break). Returns revealed ids. */
export function revealHidden(s: GameState, count: number, rng: Rng, out: Delta[], owner?: Role): string[] {
  const sc = getScenario(s.scenarioId)
  const hidden = sc.risks
    .filter((r) => s.risks[r.id] === 'hidden' && (!owner || r.owner === owner))
    .map((r) => ({ r, k: r.likelihood * r.impact + rng.next() }))
    .sort((a, b) => b.k - a.k)
    .slice(0, count)
  for (const { r } of hidden) {
    s.risks[r.id] = 'open'
    out.push({ icon: '🔍', label: `Risk spotted: ${r.title}`, good: true })
  }
  return hidden.map((h) => h.r.id)
}

/**
 * Apply content effects to a mutable state draft. Returns visible deltas.
 * Skill XP and follow-ups are silent; flags are silent.
 */
export function applyEffects(s: GameState, fx: Effects | undefined, rng: Rng): Delta[] {
  const out: Delta[] = []
  if (!fx) return out
  const sc = getScenario(s.scenarioId)

  for (const key of ['morale', 'trust', 'quality', 'energy', 'budget'] as const) if (fx[key]) changeMeter(s, key, fx[key]!, out)
  for (const [role, d] of Object.entries(fx.rel ?? {})) changeRel(s, role as Role, d as number, out)

  for (const [ws, d] of Object.entries(fx.scope ?? {})) {
    const w = s.ws[ws as WsRole]
    const before = w.work
    w.work = Math.max(w.done, w.work * (1 + (d as number) / 100))
    if (Math.abs(w.work - before) > 0.01)
      out.push({ icon: '📦', label: `${wsName(s, ws as WsRole)} scope`, value: Math.round(d as number), unit: '%', good: (d as number) < 0 })
  }
  for (const [ws, d] of Object.entries(fx.progress ?? {})) addProgress(s, ws as WsRole, d as number, out)

  if (fx.relaxDependency) {
    const w = s.ws[fx.relaxDependency.ws]
    let relaxed = false
    for (const d of w.deps)
      if (d.capAt < fx.relaxDependency.capAt) {
        d.capAt = fx.relaxDependency.capAt
        relaxed = true
      }
    if (relaxed) out.push({ icon: '🔗', label: `${wsName(s, fx.relaxDependency.ws)} can progress further`, good: true })
  }
  if (fx.block) block(s, fx.block.ws, fx.block.days, fx.block.reason, out)
  for (const ws of fx.unblock ?? []) unblock(s, ws, out)
  if (fx.velocity) {
    const v = fx.velocity
    s.modifiers.push({ ws: v.ws, mult: v.mult, untilDay: s.day + v.days - 1, label: v.label })
    const who = v.ws === 'all' ? 'All teams' : wsName(s, v.ws)
    out.push({ icon: v.mult >= 1 ? '🚀' : '🐢', label: `${v.label} · ${who} ×${v.mult} for ${v.days}d`, good: v.mult >= 1 })
  }

  for (const f of fx.flags ?? []) s.flags[f] = true
  for (const f of fx.clearFlags ?? []) delete s.flags[f]

  if (typeof fx.revealRisks === 'number') revealHidden(s, fx.revealRisks, rng, out)
  else
    for (const id of fx.revealRisks ?? []) {
      if (s.risks[id] === 'hidden' || s.risks[id] === 'dormant') {
        s.risks[id] = 'open'
        out.push({ icon: '🔍', label: `Risk spotted: ${sc.risks.find((r) => r.id === id)?.title ?? id}`, good: true })
      }
    }
  for (const id of fx.addRisks ?? []) {
    if (s.risks[id] === 'dormant' || s.risks[id] === 'hidden') {
      s.risks[id] = 'open'
      out.push({ icon: '⚠️', label: `New risk: ${sc.risks.find((r) => r.id === id)?.title ?? id}`, good: false })
    }
  }
  for (const id of fx.mitigate ?? []) {
    if (s.risks[id] && s.risks[id] !== 'occurred' && s.risks[id] !== 'mitigated') {
      s.risks[id] = 'mitigated'
      out.push({ icon: '🛡️', label: `Mitigated: ${sc.risks.find((r) => r.id === id)?.title ?? id}`, good: true })
    }
  }

  for (const k of fx.readiness ?? [])
    if (!s.readiness[k]) {
      s.readiness[k] = true
      out.push({ icon: '✅', label: READINESS_BY_KEY[k].name, good: true })
    }
  for (const k of fx.unready ?? [])
    if (s.readiness[k]) {
      s.readiness[k] = false
      out.push({ icon: '❌', label: `${READINESS_BY_KEY[k].name} no longer ready`, good: false })
    }

  for (const f of fx.followUps ?? []) s.scheduled.push({ eventId: f.event, day: s.day + f.inDays })

  if (fx.focus) {
    const before = s.focus
    s.focus = Math.max(0, s.focus + fx.focus)
    if (s.focus !== before) out.push({ icon: '⚡', label: 'Focus today', value: s.focus - before, good: s.focus > before })
  }
  if (fx.targetDay) {
    s.targetDay = Math.max(s.day, Math.min(sc.maxDay, s.targetDay + fx.targetDay))
    out.push({ icon: '📅', label: `Target moved to Day ${s.targetDay}`, good: fx.targetDay < 0 })
  }
  for (const [k, v] of Object.entries(fx.skills ?? {})) addSkill(s, k as SkillKey, v as number)
  return out
}
