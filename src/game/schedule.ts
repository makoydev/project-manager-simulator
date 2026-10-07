import type { VelocityModifier, WorkstreamDef, WorkstreamState, WsRole } from './types'

export const WS_ROLES: WsRole[] = ['core', 'client', 'platform', 'data', 'review']

/** Team throughput multiplier from morale and quality. ≈1.0 at morale 60–65, quality 65–70. */
export function velocityFactor(morale: number, quality: number): number {
  return 0.55 + (0.4 * morale) / 100 + (0.3 * quality) / 100
}

/** Product of active modifiers for a workstream on a given day. */
export function modifierMult(mods: VelocityModifier[], ws: WsRole, day: number): number {
  let m = 1
  for (const mod of mods)
    if ((mod.ws === 'all' || mod.ws === ws) && mod.untilDay >= day && (mod.fromDay ?? 0) <= day) m *= mod.mult
  return m
}

/** Dependencies first, so a dependency finishing today lifts the cap for its dependants in the same tick. */
export function topoOrder(ws: Record<WsRole, Pick<WorkstreamState, 'deps'>>): WsRole[] {
  const out: WsRole[] = []
  const seen = new Set<WsRole>()
  const visit = (r: WsRole, depth = 0) => {
    if (seen.has(r) || depth > 10) return
    for (const d of ws[r].deps) visit(d.on, depth + 1)
    seen.add(r)
    out.push(r)
  }
  WS_ROLES.forEach((r) => visit(r))
  return out
}

export function isDone(w: Pick<WorkstreamState, 'done' | 'work'>): boolean {
  return w.done >= w.work - 1e-6
}

/** Fraction of `work` this workstream may reach right now given unfinished dependencies. */
export function capFor(w: WorkstreamState, all: Record<WsRole, WorkstreamState>): number {
  let cap = 1
  for (const d of w.deps) if (!isDone(all[d.on])) cap = Math.min(cap, d.capAt)
  return cap
}

/** The workstream it's waiting on, when progress is pinned at a dependency cap. */
export function waitingOn(w: WorkstreamState, all: Record<WsRole, WorkstreamState>): WsRole | null {
  for (const d of w.deps) if (!isDone(all[d.on]) && w.done >= w.work * d.capAt - 1e-6) return d.on
  return null
}

export interface TickInput {
  ws: Record<WsRole, WorkstreamState>
  velocity: Record<WsRole, number>
  factor: number
  modifiers: VelocityModifier[]
  day: number
  /** Per-workstream random multiplier; defaults to 1. */
  noise?: (r: WsRole) => number
}

/**
 * Advance every workstream by one day of work. Mutates `ws`.
 * Blocked workstreams make no progress and burn one blocked day.
 * Returns points gained per workstream.
 */
export function tick({ ws, velocity, factor, modifiers, day, noise }: TickInput): Record<WsRole, number> {
  const gained = { core: 0, client: 0, platform: 0, data: 0, review: 0 } as Record<WsRole, number>
  for (const r of topoOrder(ws)) {
    const w = ws[r]
    if (w.blockedDays > 0) {
      w.blockedDays -= 1
      if (w.blockedDays === 0) w.blockReason = undefined
      continue
    }
    if (isDone(w)) continue
    const limit = w.work * capFor(w, ws)
    if (w.done >= limit) continue
    const v = velocity[r] * factor * modifierMult(modifiers, r, day) * (noise ? noise(r) : 1)
    const before = w.done
    w.done = Math.min(limit, w.done + Math.max(0, v))
    gained[r] = w.done - before
  }
  return gained
}

export interface Projection {
  /** Day each workstream finishes (end of that day's tick); null if not within the horizon. */
  finish: Record<WsRole, number | null>
  /** Day the last workstream finishes. */
  launchDay: number | null
  /** Workstreams on the critical path (the chain that determines launchDay). */
  critical: WsRole[]
}

/**
 * Deterministic forward simulation from `fromDay` (whose end-of-day tick hasn't happened yet)
 * assuming today's morale/quality hold and no new events.
 */
export function project(
  ws: Record<WsRole, WorkstreamState>,
  velocity: Record<WsRole, number>,
  factor: number,
  modifiers: VelocityModifier[],
  fromDay: number,
  horizon = 60,
): Projection {
  const sim = structuredClone(ws)
  const finish = { core: null, client: null, platform: null, data: null, review: null } as Record<WsRole, number | null>
  // The dependency each workstream was last seen idling on — that dependency gated its finish.
  const waitedOn: Partial<Record<WsRole, WsRole>> = {}
  for (const r of WS_ROLES) if (isDone(sim[r])) finish[r] = fromDay - 1
  for (let d = fromDay; d < fromDay + horizon; d++) {
    for (const r of WS_ROLES) {
      const on = isDone(sim[r]) ? null : waitingOn(sim[r], sim)
      if (on) waitedOn[r] = on
    }
    tick({ ws: sim, velocity, factor, modifiers, day: d })
    for (const r of WS_ROLES) if (finish[r] === null && isDone(sim[r])) finish[r] = d
    if (WS_ROLES.every((r) => finish[r] !== null)) break
  }
  const done = WS_ROLES.every((r) => finish[r] !== null)
  const launchDay = done ? Math.max(...WS_ROLES.map((r) => finish[r] as number)) : null

  // Critical chain: start from the last finisher, follow the dependencies it actually waited on.
  const latest = (r: WsRole) => finish[r] ?? Infinity
  // Ties go to the later role in WS_ROLES (downstream work), which reads better as the end of the chain.
  let cur: WsRole | undefined = WS_ROLES.reduce((a, b) => (latest(b) >= latest(a) ? b : a))
  const critical: WsRole[] = []
  while (cur && !critical.includes(cur)) {
    critical.push(cur)
    cur = waitedOn[cur]
  }
  return { finish, launchDay, critical }
}

/** Build initial runtime workstreams from scenario definitions. */
export function initWorkstreams(defs: WorkstreamDef[]): Record<WsRole, WorkstreamState> {
  const out = {} as Record<WsRole, WorkstreamState>
  for (const d of defs) {
    out[d.role] = { role: d.role, work: d.work, done: d.done ?? 0, blockedDays: 0, deps: (d.deps ?? []).map((x) => ({ ...x })) }
  }
  return out
}

export function baseVelocities(defs: WorkstreamDef[]): Record<WsRole, number> {
  return Object.fromEntries(defs.map((d) => [d.role, d.velocity])) as Record<WsRole, number>
}

/** Weighted overall completion, 0–1. */
export function completion(ws: Record<WsRole, WorkstreamState>): number {
  let work = 0
  let done = 0
  for (const r of WS_ROLES) {
    work += ws[r].work
    done += Math.min(ws[r].done, ws[r].work)
  }
  return work === 0 ? 1 : done / work
}
