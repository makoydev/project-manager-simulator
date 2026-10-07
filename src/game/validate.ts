import type { Choice, Condition, Effects, EventDef, Outcome, RiskDef, Role, ScenarioDef, WsRole } from './types'

export const ROLES: Role[] = ['boss', 'sponsor', 'pm', 'lead', 'partner', 'sre', 'security', 'compliance']
export const WS_ROLES: WsRole[] = ['core', 'client', 'platform', 'data', 'review']

const TOKEN_RE = /\{([^}]+)\}/g
const VALID_TOKEN = new RegExp(
  '^(?:' +
    `(?:${ROLES.join('|')})(?:\\.(?:full|title))?` +
    `|ws\\.(?:${WS_ROLES.join('|')})` +
    '|company|program|product|player|target|day' +
    ')$',
)

const LIMITS = {
  title: 52,
  label: 90,
  body: 420,
  text: 340,
  insight: 340,
}

const METER_BOUNDS = { morale: 20, trust: 20, quality: 20, energy: 25 }

function checkTokens(where: string, text: string, errors: string[]) {
  for (const m of text.matchAll(TOKEN_RE)) {
    if (!VALID_TOKEN.test(m[1])) errors.push(`${where}: unknown token {${m[1]}}`)
  }
}

function checkLen(where: string, text: string | undefined, max: number, errors: string[]) {
  if (!text || !text.trim()) errors.push(`${where}: empty`)
  else if (text.length > max) errors.push(`${where}: ${text.length} chars (max ${max})`)
}

export interface RefContext {
  /** Event ids that followUps may reference. */
  eventIds: Set<string>
  /** Risk ids that revealRisks/addRisks/mitigate/riskOpen may reference. Empty for generic content. */
  riskIds: Set<string>
}

function checkEffects(where: string, fx: Effects | undefined, ctx: RefContext, errors: string[]) {
  if (!fx) return
  for (const k of Object.keys(METER_BOUNDS) as (keyof typeof METER_BOUNDS)[]) {
    const v = fx[k]
    if (v !== undefined && (!Number.isFinite(v) || Math.abs(v) > METER_BOUNDS[k]))
      errors.push(`${where}: ${k} ${v} out of bounds ±${METER_BOUNDS[k]}`)
  }
  if (fx.budget !== undefined && (fx.budget < -80 || fx.budget > 60)) errors.push(`${where}: budget ${fx.budget} out of bounds`)
  for (const [r, v] of Object.entries(fx.rel ?? {})) {
    if (!ROLES.includes(r as Role)) errors.push(`${where}: rel unknown role ${r}`)
    if (Math.abs(v ?? 0) > 20) errors.push(`${where}: rel ${r} ${v} out of bounds ±20`)
  }
  for (const [w, v] of Object.entries(fx.progress ?? {})) {
    if (!WS_ROLES.includes(w as WsRole)) errors.push(`${where}: progress unknown ws ${w}`)
    if (Math.abs(v ?? 0) > 15) errors.push(`${where}: progress ${w} ${v} out of bounds ±15`)
  }
  for (const [w, v] of Object.entries(fx.scope ?? {})) {
    if (!WS_ROLES.includes(w as WsRole)) errors.push(`${where}: scope unknown ws ${w}`)
    if ((v ?? 0) < -30 || (v ?? 0) > 30) errors.push(`${where}: scope ${w} ${v} out of bounds ±30`)
  }
  if (fx.block) {
    if (!WS_ROLES.includes(fx.block.ws)) errors.push(`${where}: block unknown ws ${fx.block.ws}`)
    if (fx.block.days < 1 || fx.block.days > 4) errors.push(`${where}: block days ${fx.block.days} not in 1–4`)
    checkLen(`${where}.block.reason`, fx.block.reason, 80, errors)
  }
  for (const w of fx.unblock ?? []) if (!WS_ROLES.includes(w)) errors.push(`${where}: unblock unknown ws ${w}`)
  if (fx.velocity) {
    const v = fx.velocity
    if (v.ws !== 'all' && !WS_ROLES.includes(v.ws)) errors.push(`${where}: velocity unknown ws ${v.ws}`)
    if (v.mult < 0.4 || v.mult > 1.6) errors.push(`${where}: velocity mult ${v.mult} not in 0.4–1.6`)
    if (v.days < 1 || v.days > 6) errors.push(`${where}: velocity days ${v.days} not in 1–6`)
    checkLen(`${where}.velocity.label`, v.label, 40, errors)
  }
  if (fx.relaxDependency) {
    if (!WS_ROLES.includes(fx.relaxDependency.ws)) errors.push(`${where}: relaxDependency unknown ws`)
    if (fx.relaxDependency.capAt <= 0 || fx.relaxDependency.capAt > 1) errors.push(`${where}: relaxDependency capAt not in (0,1]`)
  }
  const riskRefs: string[] = [
    ...(Array.isArray(fx.revealRisks) ? fx.revealRisks : []),
    ...(fx.addRisks ?? []),
    ...(fx.mitigate ?? []),
  ]
  for (const id of riskRefs) if (!ctx.riskIds.has(id)) errors.push(`${where}: unknown risk ${id}`)
  if (typeof fx.revealRisks === 'number' && (fx.revealRisks < 1 || fx.revealRisks > 3))
    errors.push(`${where}: revealRisks count not in 1–3`)
  for (const f of fx.followUps ?? []) {
    if (!ctx.eventIds.has(f.event)) errors.push(`${where}: followUp to unknown event ${f.event}`)
    if (f.inDays < 1 || f.inDays > 6) errors.push(`${where}: followUp inDays ${f.inDays} not in 1–6`)
  }
  if (fx.focus !== undefined && Math.abs(fx.focus) > 3) errors.push(`${where}: focus ${fx.focus} out of bounds ±3`)
  if (fx.targetDay !== undefined && (fx.targetDay < -2 || fx.targetDay > 5)) errors.push(`${where}: targetDay ${fx.targetDay} out of bounds`)
  for (const f of [...(fx.flags ?? []), ...(fx.clearFlags ?? [])])
    if (!/^[a-z0-9:-]+$/.test(f)) errors.push(`${where}: flag "${f}" must be kebab-case`)
}

function checkCondition(where: string, c: Condition | undefined, ctx: RefContext, errors: string[]) {
  if (!c) return
  for (const id of c.riskOpen ?? []) if (!ctx.riskIds.has(id)) errors.push(`${where}: riskOpen unknown risk ${id}`)
  for (const r of [...Object.keys(c.relAtLeast ?? {}), ...Object.keys(c.relBelow ?? {})])
    if (!ROLES.includes(r as Role)) errors.push(`${where}: unknown role ${r}`)
  for (const w of [...Object.keys(c.progressAtLeast ?? {}), ...Object.keys(c.progressBelow ?? {}), ...(c.blocked ?? [])])
    if (!WS_ROLES.includes(w as WsRole)) errors.push(`${where}: unknown ws ${w}`)
}

function checkOutcome(where: string, o: Outcome, ctx: RefContext, errors: string[]) {
  checkLen(`${where}.text`, o.text, LIMITS.text, errors)
  checkTokens(`${where}.text`, o.text, errors)
  checkEffects(`${where}.effects`, o.effects, ctx, errors)
}

function checkChoice(where: string, c: Choice, ctx: RefContext, errors: string[]) {
  checkLen(`${where}.label`, c.label, LIMITS.label, errors)
  checkTokens(`${where}.label`, c.label, errors)
  checkLen(`${where}.insight`, c.insight, LIMITS.insight, errors)
  checkTokens(`${where}.insight`, c.insight, errors)
  if (!Number.isInteger(c.cost) || c.cost < 0 || c.cost > 3) errors.push(`${where}: cost ${c.cost} not an integer 0–3`)
  if (!!c.outcome === !!c.chance) errors.push(`${where}: provide exactly one of outcome | chance`)
  if (c.outcome) checkOutcome(`${where}.outcome`, c.outcome, ctx, errors)
  if (c.chance) {
    if (c.chance.base < 0.05 || c.chance.base > 0.95) errors.push(`${where}: chance.base not in 0.05–0.95`)
    if (c.chance.rel && !ROLES.includes(c.chance.rel)) errors.push(`${where}: chance.rel unknown role`)
    checkOutcome(`${where}.success`, c.chance.success, ctx, errors)
    checkOutcome(`${where}.failure`, c.chance.failure, ctx, errors)
  }
  checkCondition(`${where}.requires`, c.requires, ctx, errors)
  if (c.requires && !c.lockedHint) errors.push(`${where}: requires without lockedHint`)
  if (c.lockedHint) checkTokens(`${where}.lockedHint`, c.lockedHint, errors)
}

export function validateEvent(e: EventDef, ctx: RefContext): string[] {
  const errors: string[] = []
  const w = `event ${e.id}`
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(e.id)) errors.push(`${w}: id must be kebab-case`)
  checkLen(`${w}.title`, e.title, LIMITS.title, errors)
  checkTokens(`${w}.title`, e.title, errors)
  checkLen(`${w}.body`, e.body, LIMITS.body, errors)
  checkTokens(`${w}.body`, e.body, errors)
  if (!ROLES.includes(e.from)) errors.push(`${w}: unknown sender ${e.from}`)
  if (e.choices.length < 2 || e.choices.length > 4) errors.push(`${w}: needs 2–4 choices`)
  const ids = new Set(e.choices.map((c) => c.id))
  if (ids.size !== e.choices.length) errors.push(`${w}: duplicate choice ids`)
  if (!e.choices.some((c) => c.grade === 'best')) errors.push(`${w}: no 'best' choice`)
  if (!e.choices.some((c) => c.grade !== 'best')) errors.push(`${w}: every choice is 'best'`)
  if (e.choices.every((c) => c.requires)) errors.push(`${w}: every choice is gated — player could be stuck`)
  e.choices.forEach((c) => checkChoice(`${w}.choice ${c.id}`, c, ctx, errors))
  checkOutcome(`${w}.ignored`, e.ignored, ctx, errors)
  checkCondition(`${w}.when`, e.when, ctx, errors)
  if (e.fixedDay !== undefined && (e.fixedDay < 1 || e.fixedDay > 20)) errors.push(`${w}: fixedDay not in 1–20`)
  if (e.weight !== undefined && e.weight < 0) errors.push(`${w}: negative weight`)
  if (e.expires !== undefined && (e.expires < 1 || e.expires > 4)) errors.push(`${w}: expires not in 1–4`)
  return errors
}

export function validateEventList(events: EventDef[], extra?: Partial<RefContext>): string[] {
  const errors: string[] = []
  const seen = new Set<string>()
  for (const e of events) {
    if (seen.has(e.id)) errors.push(`duplicate event id ${e.id}`)
    seen.add(e.id)
  }
  const ctx: RefContext = {
    eventIds: new Set([...seen, ...(extra?.eventIds ?? [])]),
    riskIds: extra?.riskIds ?? new Set(),
  }
  for (const e of events) errors.push(...validateEvent(e, ctx))
  return errors
}

function checkRisk(r: RiskDef, s: ScenarioDef, eventIds: Set<string>, errors: string[]) {
  const w = `risk ${r.id}`
  if (!r.id.startsWith(prefixOf(s))) errors.push(`${w}: id must start with ${prefixOf(s)}`)
  checkLen(`${w}.title`, r.title, 40, errors)
  checkLen(`${w}.description`, r.description, 240, errors)
  checkTokens(`${w}.description`, r.description, errors)
  if (!ROLES.includes(r.owner)) errors.push(`${w}: unknown owner`)
  if (r.ws && !WS_ROLES.includes(r.ws)) errors.push(`${w}: unknown ws`)
  if (!eventIds.has(r.trigger)) errors.push(`${w}: trigger event ${r.trigger} not in scenario events`)
  const trig = s.events.find((e) => e.id === r.trigger)
  if (trig && (trig.weight ?? 1) !== 0) errors.push(`${w}: trigger event ${r.trigger} must have weight 0`)
  checkLen(`${w}.mitigation.label`, r.mitigation.label, 60, errors)
  checkLen(`${w}.mitigation.text`, r.mitigation.text, LIMITS.text, errors)
  if (r.mitigation.cost < 1 || r.mitigation.cost > 3) errors.push(`${w}: mitigation cost not in 1–3`)
}

export function prefixOf(s: ScenarioDef): string {
  return { shiokpay: 'sp-', kampong: 'kl-', lioncity: 'lc-' }[s.id]
}

function hasCycle(s: ScenarioDef): boolean {
  const deps = new Map(s.workstreams.map((w) => [w.role, (w.deps ?? []).map((d) => d.on)]))
  const visiting = new Set<WsRole>()
  const done = new Set<WsRole>()
  const visit = (n: WsRole): boolean => {
    if (done.has(n)) return false
    if (visiting.has(n)) return true
    visiting.add(n)
    for (const m of deps.get(n) ?? []) if (visit(m)) return true
    visiting.delete(n)
    done.add(n)
    return false
  }
  return WS_ROLES.some(visit)
}

export function validateScenario(s: ScenarioDef): string[] {
  const errors: string[] = []
  const prefix = prefixOf(s)
  for (const r of ROLES) {
    const c = s.cast[r]
    if (!c) {
      errors.push(`cast missing role ${r}`)
      continue
    }
    if (c.role !== r) errors.push(`cast.${r}.role mismatch`)
    if (c.power < 1 || c.power > 5 || c.interest < 1 || c.interest > 5) errors.push(`cast.${r}: power/interest not 1–5`)
    checkLen(`cast.${r}.bio`, c.bio, 200, errors)
  }
  const wsRoles = s.workstreams.map((w) => w.role)
  for (const r of WS_ROLES) if (wsRoles.filter((x) => x === r).length !== 1) errors.push(`workstreams must contain ${r} exactly once`)
  for (const w of s.workstreams) {
    if (!ROLES.includes(w.owner)) errors.push(`ws ${w.role}: unknown owner`)
    if (w.work <= 0 || w.velocity <= 0) errors.push(`ws ${w.role}: work/velocity must be > 0`)
    for (const d of w.deps ?? []) {
      if (!WS_ROLES.includes(d.on) || d.on === w.role) errors.push(`ws ${w.role}: bad dep ${d.on}`)
      if (d.capAt < 0.3 || d.capAt > 0.95) errors.push(`ws ${w.role}: capAt ${d.capAt} not in 0.3–0.95`)
    }
  }
  if (hasCycle(s)) errors.push('workstream dependencies contain a cycle')
  if (s.risks.length < 5 || s.risks.length > 9) errors.push(`expected 5–9 risks, got ${s.risks.length}`)

  const eventIds = new Set(s.events.map((e) => e.id))
  const riskIds = new Set(s.risks.map((r) => r.id))
  for (const r of s.risks) checkRisk(r, s, eventIds, errors)
  if (new Set(s.risks.map((r) => r.id)).size !== s.risks.length) errors.push('duplicate risk ids')
  for (const e of s.events) {
    if (!e.id.startsWith(prefix)) errors.push(`event ${e.id}: must start with ${prefix}`)
    if (!e.scenarios || e.scenarios.length !== 1 || e.scenarios[0] !== s.id)
      errors.push(`event ${e.id}: scenarios must be ['${s.id}']`)
  }
  errors.push(...validateEventList(s.events, { riskIds }))
  for (const r of s.risks) {
    checkEffects(`risk ${r.id}.mitigation`, r.mitigation.effects, { eventIds, riskIds }, errors)
  }
  if (!s.events.some((e) => e.fixedDay === 1)) errors.push('needs a Day 1 story beat (fixedDay: 1)')
  if (s.brief.length < 1 || s.brief.length > 4) errors.push('brief should be 1–4 paragraphs')
  for (const p of s.brief) checkTokens('brief', p, errors)
  return errors
}
