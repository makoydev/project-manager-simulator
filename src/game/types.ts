/**
 * Ship It, Lah! — core data contract.
 *
 * Content (scenarios, events, risks) is plain data typed against these interfaces.
 * The engine (engine.ts) interprets it. Keep this file free of runtime logic.
 */

// ───────────────────────────── Primitive unions ─────────────────────────────

export type ScenarioId = 'shiokpay' | 'kampong' | 'lioncity'

/** Player origin story. Changes starting relationships, perks and temptations. */
export type BackgroundId = 'builder' | 'planner' | 'hybrid'

/**
 * Meters.
 * - morale, trust, quality, energy: 0–100 (clamped).
 * - budget: remaining contingency in S$ thousands (may go negative = overspend).
 */
export type MeterKey = 'morale' | 'trust' | 'quality' | 'budget' | 'energy'

/**
 * Cast roles. Every scenario maps all eight roles to a named character, so generic
 * events can be written once against roles and play in every scenario.
 * - boss:       your line manager (Director of Program Management / Head of Delivery)
 * - sponsor:    executive sponsor who owns the outcome and the budget
 * - pm:         product manager / business owner (owns the "what" and "why")
 * - lead:       tech lead of the core team (owns the "how")
 * - partner:    engineering manager of a team you depend on (does not report to you)
 * - sre:        SRE / platform / infrastructure lead
 * - security:   security engineering / technology risk
 * - compliance: legal, compliance, privacy (DPO)
 */
export type Role = 'boss' | 'sponsor' | 'pm' | 'lead' | 'partner' | 'sre' | 'security' | 'compliance'

/**
 * Workstream roles. Every scenario has exactly these five workstreams.
 * - core:     the main build (critical path), owned by `lead`
 * - client:   apps/channels/consumers that integrate with core, owned by `partner`
 * - platform: infra, environments, observability, owned by `sre`
 * - data:     data / ML / migration work
 * - review:   security, compliance & legal review track
 */
export type WsRole = 'core' | 'client' | 'platform' | 'data' | 'review'

/** TPM competencies tracked on the end-of-game skills radar. */
export type SkillKey = 'stakeholder' | 'risk' | 'comms' | 'technical' | 'execution' | 'leadership'

/** Launch readiness checklist reviewed at the Go/No-Go meeting. */
export type ReadinessKey =
  | 'securityReview'
  | 'loadTest'
  | 'rollbackPlan'
  | 'monitoring'
  | 'oncall'
  | 'commsPlan'
  | 'signoff'
  | 'uat'
  | 'featureFlags'

export type Channel = 'slack' | 'email' | 'meeting' | 'incident' | 'hallway' | 'whatsapp' | 'calendar'
export type Urgency = 'low' | 'normal' | 'high' | 'critical'

/** How a seasoned TPM would rate a choice. Hidden from the player until after they choose. */
export type Grade = 'best' | 'okay' | 'poor'

export type Rag = 'green' | 'amber' | 'red'

/** Field Guide entries. Every event links to one so playing unlocks the guide. */
export type ConceptId =
  | 'tpm-role'
  | 'tpm-vs-roles'
  | 'raid-log'
  | 'rag-status'
  | 'status-report'
  | 'stakeholder-map'
  | 'influence'
  | 'raci'
  | 'escalation'
  | 'critical-path'
  | 'scope-creep'
  | 'iron-triangle'
  | 'estimation'
  | 'brooks-law'
  | 'risk-mgmt'
  | 'incident-mgmt'
  | 'postmortem'
  | 'launch-readiness'
  | 'phased-rollout'
  | 'tech-debt'
  | 'agile-ceremonies'
  | 'meetings'
  | 'team-health'
  | 'tl-trap'
  | 'vendor-mgmt'
  | 'change-mgmt'
  | 'mas-trm'
  | 'pdpa'
  | 'cross-timezone'
  | 'uat'
  | 'metrics'
  | 'decision-log'
  | 'negotiation'
  | 'self-care'

// ───────────────────────────── Effects & conditions ─────────────────────────────

/**
 * Everything an outcome can do to the game. All fields optional; combine freely.
 * Magnitude guide: small ±2–4, medium ±5–8, large ±10–15 (rare).
 */
export interface Effects {
  morale?: number
  trust?: number
  quality?: number
  energy?: number
  /** S$ thousands. Negative = spend. */
  budget?: number
  /** Relationship deltas per role (0–100 scale). */
  rel?: Partial<Record<Role, number>>
  /** Percentage points of the workstream's total work done (negative = rework). Respects dependency caps. */
  progress?: Partial<Record<WsRole, number>>
  /** Percent change of the workstream's total work. -15 = cut 15% of scope, +10 = 10% more work. */
  scope?: Partial<Record<WsRole, number>>
  /** Stop a workstream from progressing for N days (1–4). */
  block?: { ws: WsRole; days: number; reason: string }
  /** Remove any block on these workstreams. */
  unblock?: WsRole[]
  /** Temporary velocity multiplier for N days (counts tonight's progress tick). */
  velocity?: { ws: WsRole | 'all'; mult: number; days: number; label: string }
  /** Raise a workstream's dependency cap (0–1), e.g. after agreeing an API contract and mocks. Never lowers a cap. */
  relaxDependency?: { ws: WsRole; capAt: number }
  flags?: string[]
  clearFlags?: string[]
  /** Reveal N hidden risks (highest exposure first), or specific risk ids (scenario content only). */
  revealRisks?: number | string[]
  /** Bring dormant/hidden risks into the open RAID log (scenario content only). */
  addRisks?: string[]
  /** Mark risks as mitigated (scenario content only). */
  mitigate?: string[]
  /** Tick launch-readiness items. */
  readiness?: ReadinessKey[]
  /** Un-tick launch-readiness items (e.g. a failed rehearsal). */
  unready?: ReadinessKey[]
  /** Deliver another event later. Same-file event ids only. inDays 1–6. The target's `when` is re-checked on delivery. */
  followUps?: { event: string; inDays: number }[]
  /** Immediate change to focus remaining today (e.g. -1: the meeting overran). */
  focus?: number
  /** Move the target launch day by N days (re-baselining). */
  targetDay?: number
  /** Extra skill XP on top of the automatic XP from the choice grade. */
  skills?: Partial<Record<SkillKey, number>>
}

/** Gate for events and choices. All provided clauses must hold. */
export interface Condition {
  minDay?: number
  maxDay?: number
  /** All of these flags are set. */
  flags?: string[]
  /** None of these flags are set. */
  notFlags?: string[]
  meterAtLeast?: Partial<Record<MeterKey, number>>
  meterBelow?: Partial<Record<MeterKey, number>>
  relAtLeast?: Partial<Record<Role, number>>
  relBelow?: Partial<Record<Role, number>>
  /** Workstream progress in percent (0–100). */
  progressAtLeast?: Partial<Record<WsRole, number>>
  progressBelow?: Partial<Record<WsRole, number>>
  /** All of these workstreams are currently blocked. */
  blocked?: WsRole[]
  readiness?: ReadinessKey[]
  notReadiness?: ReadinessKey[]
  background?: BackgroundId[]
  /** true: projected launch is after the target day. false: on/before. */
  behindSchedule?: boolean
  /** These risks are currently open (known, not mitigated, not yet occurred). */
  riskOpen?: string[]
}

// ───────────────────────────── Events ─────────────────────────────

export interface Outcome {
  /** What happened, written in second person. Supports text tokens. */
  text: string
  effects?: Effects
}

export interface Choice {
  /** Unique within the event: 'a', 'b', 'c', 'd'. */
  id: string
  /** What you do, imperative. ≤ 90 chars. */
  label: string
  /** Focus points this costs today (0–3). */
  cost: number
  grade: Grade
  /** The lesson: why a seasoned TPM rates this choice the way they do. 1–3 sentences. */
  insight: string
  /** Choice is shown but disabled unless this holds. */
  requires?: Condition
  /** Explains a locked choice, e.g. "Needs a good relationship with {sre}". */
  lockedHint?: string
  /** Deterministic outcome. Provide exactly one of `outcome` or `chance`. */
  outcome?: Outcome
  /**
   * Probabilistic outcome. Success chance = base + (rel[rel] - 50) / 100, clamped 5–95%.
   * Use for asks that depend on goodwill ("build relationships before you need them").
   */
  chance?: { base: number; rel?: Role; success: Outcome; failure: Outcome }
}

export interface EventDef {
  /** Globally unique kebab-case id. Scenario events are prefixed 'sp-', 'kl-' or 'lc-'. */
  id: string
  /** Restrict to scenarios. Omit for generic events that play everywhere. */
  scenarios?: ScenarioId[]
  /** Inbox headline. ≤ 52 chars. */
  title: string
  channel: Channel
  from: Role
  /** The message itself, in the sender's voice. Supports text tokens. ≤ 420 chars. */
  body: string
  urgency: Urgency
  /** Days it waits in the inbox before expiring (default: critical/high 1, normal 2, low 3). */
  expires?: number
  /** Random draw weight (default 1). 0 = only delivered via followUps, fixedDay or risk triggers. */
  weight?: number
  /** Story beat: always delivered on the morning of this day if `when` holds. */
  fixedDay?: number
  when?: Condition
  /** Can be drawn again after being seen (default false). */
  repeatable?: boolean
  concept: ConceptId
  /** Primary skill this event exercises (gets XP automatically: best +3, okay +1). */
  skill: SkillKey
  /** 2–4 choices. At least one 'best', at least one not 'best'. */
  choices: Choice[]
  /** What happens if the player lets it expire. Required — silence has consequences. */
  ignored: Outcome
}

// ───────────────────────────── Scenario content ─────────────────────────────

export interface Character {
  role: Role
  /** Full name, e.g. "Nurul Huda Binte Ismail". */
  name: string
  /** What people call them in conversation, e.g. "Nurul", "Mdm Wong". Used by the {role} token. */
  short: string
  title: string
  /** Single emoji used as avatar. */
  avatar: string
  /** Avatar background hue 0–360. */
  hue: number
  /** Stakeholder map position, 1–5. */
  power: number
  interest: number
  location: string
  /** Personality & what they care about. 1–2 sentences. Shown on the stakeholder map. */
  bio: string
}

export interface WorkstreamDef {
  role: WsRole
  name: string
  icon: string
  owner: Role
  /** Total effort points remaining at Day 1. */
  work: number
  /** Points per day at neutral morale/quality. */
  velocity: number
  /** Points already completed at Day 1 (a program you join mid-flight). */
  done?: number
  /** This workstream cannot exceed `capAt` (0–1) until `on` reaches 100%. */
  deps?: { on: WsRole; capAt: number }[]
  description: string
}

export type RiskStatus = 'dormant' | 'hidden' | 'open' | 'mitigated' | 'occurred'

export interface RiskDef {
  /** Scenario-prefixed id, e.g. 'sp-risk-bank-sandbox'. */
  id: string
  /** ≤ 40 chars. */
  title: string
  /** What could happen and why. 1–2 sentences. */
  description: string
  ws?: WsRole
  /** Who would know about it — kopi chats with this person can reveal it. */
  owner: Role
  likelihood: 1 | 2 | 3 | 4 | 5
  impact: 1 | 2 | 3 | 4 | 5
  /** hidden = in play but unknown; open = on the RAID log from Day 1; dormant = only enters via addRisks. */
  initial: 'hidden' | 'open' | 'dormant'
  /** Cannot materialise before this day (default 3). */
  earliestDay?: number
  mitigation: { label: string; cost: number; text: string; effects?: Effects }
  /** Event id (weight 0, in the same scenario) delivered when the risk materialises. */
  trigger: string
}

export interface ScenarioDef {
  id: ScenarioId
  /** e.g. "ShiokPay Later" */
  name: string
  company: string
  companyBlurb: string
  /** Program code name, e.g. "Project Kaya". */
  program: string
  /** The thing being launched, e.g. "ShiokPay Later". */
  product: string
  tagline: string
  difficulty: 1 | 2 | 3
  setting: string
  /** Mission brief shown before Day 1. 2–3 short paragraphs. */
  brief: string[]
  /** Usually 15 (three working weeks). */
  targetDay: number
  /** Last possible day after slips, usually targetDay + 5. */
  maxDay: number
  /** Starting meters. Budget is contingency in S$ thousands. */
  start: Record<Exclude<MeterKey, 'energy'>, number>
  cast: Record<Role, Character>
  workstreams: WorkstreamDef[]
  risks: RiskDef[]
  /** Planning assumptions shown in the RAID log. */
  assumptions: string[]
  /** Scenario-specific events (story beats, risk triggers, flavour). */
  events: EventDef[]
  /** Accent hue for the scenario card. */
  hue: number
  icon: string
}

// ───────────────────────────── Runtime state ─────────────────────────────

export interface WorkstreamState {
  role: WsRole
  work: number
  done: number
  /** Remaining blocked days (0 = unblocked). */
  blockedDays: number
  blockReason?: string
  /** Current dependency caps (copied from defs, may be relaxed by events). */
  deps: { on: WsRole; capAt: number }[]
}

export interface VelocityModifier {
  ws: WsRole | 'all'
  mult: number
  /** First day (inclusive) whose progress tick this applies to. Defaults to immediately. */
  fromDay?: number
  /** Last day (inclusive) whose progress tick this applies to. */
  untilDay: number
  label: string
}

export interface InboxItem {
  uid: string
  eventId: string
  arrivedDay: number
  /** Expires at the end of this day if unanswered. */
  expiresDay: number
  /** Delivered because a risk materialised. */
  fromRisk?: string
}

export interface DecisionLogEntry {
  day: number
  eventId: string
  title: string
  choiceLabel: string
  grade: Grade
  insight: string
  concept: ConceptId
  /** true when the event expired unanswered. */
  ignored?: boolean
}

export interface DaySnapshot {
  day: number
  /** Overall completion 0–100. */
  progress: number
  projectedDay: number
  targetDay: number
  meters: Record<MeterKey, number>
}

export interface StatusReportInput {
  overall: Rag
  ws: Record<WsRole, Rag>
  /** Risk id highlighted as the top risk, or null for none. */
  topRisk: string | null
  ask: AskId
}

export type AskId = 'none' | 'unblock' | 'decision' | 'headcount' | 'recognition'

export interface StatusReportResult {
  day: number
  week: number
  input: StatusReportInput
  truth: { overall: Rag; ws: Record<WsRole, Rag> }
  score: number
  trustDelta: number
  feedback: { tone: 'good' | 'bad' | 'neutral'; text: string }[]
  watermelon: boolean
}

export type LaunchMode = 'full' | 'phased'
export type LaunchTier = 'smooth' | 'bumpy' | 'sev1'

export interface LaunchResult {
  day: number
  mode: LaunchMode
  tier: LaunchTier
  completion: number
  readyCount: number
  problemChance: number
  /** A phased rollout contained a problem to the canary cohort. */
  caughtInCanary?: boolean
  /** Consequence lines for the launch screen. */
  notes: { tone: 'good' | 'bad' | 'neutral'; text: string }[]
  /** Incident response choice id, if an incident happened. */
  incidentChoice?: string
}

export type Phase = 'day' | 'goNoGo' | 'launch' | 'ended'

export type EndingKind = 'launched' | 'fired' | 'cancelled'

export interface Counters {
  codeIt: number
  escalations: number
  overtime: number
  ignored: number
  kopi: number
  riskReviews: number
  descopes: number
  noGos: number
  risksFired: number
  risksFiredUnmitigated: number
  watermelons: number
  accurateReports: number
  burnouts: number
}

export interface GameState {
  version: number
  seed: number
  rng: number
  scenarioId: ScenarioId
  background: BackgroundId
  playerName: string
  day: number
  targetDay: number
  originalTargetDay: number
  phase: Phase
  focus: number
  maxFocus: number
  meters: Record<MeterKey, number>
  rel: Record<Role, number>
  ws: Record<WsRole, WorkstreamState>
  risks: Record<string, RiskStatus>
  inbox: InboxItem[]
  scheduled: { eventId: string; day: number; fromRisk?: string }[]
  seenEvents: string[]
  flags: Record<string, boolean>
  readiness: Record<ReadinessKey, boolean>
  skills: Record<SkillKey, number>
  modifiers: VelocityModifier[]
  log: DecisionLogEntry[]
  history: DaySnapshot[]
  statusReports: StatusReportResult[]
  counters: Counters
  /** Per-day usage limits for actions, e.g. kopi:pm → day last used. */
  cooldowns: Record<string, number>
  conceptsSeen: ConceptId[]
  achievements: string[]
  /** Whether this Friday's status report has been submitted. */
  reportDueDay: number | null
  retroDone: boolean
  launch?: LaunchResult
  ending?: EndingKind
  /** Monotonic counter for inbox uids. */
  uidSeq: number
}
