import type { Channel, Condition, ConceptId, Effects, MeterKey, ReadinessKey, Role, SkillKey } from './types'

export const METER_META: Record<MeterKey, { label: string; icon: string; help: string }> = {
  morale: { label: 'Morale', icon: '😊', help: 'Team morale. Drives velocity. Low morale → mistakes and resignations.' },
  trust: { label: 'Trust', icon: '🤝', help: 'Stakeholder & exec trust in you. At zero, you are replaced.' },
  quality: { label: 'Quality', icon: '🧱', help: 'Code & test health. Drives velocity and launch-day risk.' },
  budget: { label: 'Budget', icon: '💰', help: 'Remaining contingency reserve (S$). Overspend hurts your review.' },
  energy: { label: 'Energy', icon: '🔋', help: 'Your own stamina. Low energy means less focus. Zero means an MC day.' },
}

export const SKILL_META: Record<SkillKey, { label: string; icon: string }> = {
  stakeholder: { label: 'Stakeholders', icon: '🤝' },
  risk: { label: 'Risk', icon: '🛡️' },
  comms: { label: 'Communication', icon: '📣' },
  technical: { label: 'Technical judgment', icon: '🧠' },
  execution: { label: 'Execution', icon: '🚚' },
  leadership: { label: 'Leadership', icon: '🌱' },
}

export const CHANNEL_META: Record<Channel, { label: string; icon: string }> = {
  slack: { label: 'Slack', icon: '💬' },
  email: { label: 'Email', icon: '✉️' },
  meeting: { label: 'Meeting', icon: '📅' },
  incident: { label: 'Incident', icon: '🚨' },
  hallway: { label: 'Hallway', icon: '🚶' },
  whatsapp: { label: 'WhatsApp', icon: '📱' },
  calendar: { label: 'Calendar', icon: '🗓️' },
}

export const ROLE_LABEL: Record<Role, string> = {
  boss: 'Your manager',
  sponsor: 'Exec sponsor',
  pm: 'Product / business owner',
  lead: 'Tech lead',
  partner: 'Partner team',
  sre: 'SRE / platform',
  security: 'Security / tech risk',
  compliance: 'Compliance & legal',
}

export interface ReadinessDef {
  key: ReadinessKey
  name: string
  icon: string
  /** What doing it involves, in one sentence. */
  description: string
  cost: number
  owner: Role
  requires: Condition
  requirementText: string
  concept: ConceptId
  /** Doing the work properly sometimes uncovers problems — better now than on launch day. */
  discovery?: { chance: number; text: string; effects: Effects }
}

export const READINESS: ReadinessDef[] = [
  {
    key: 'featureFlags',
    name: 'Feature flags & kill switch',
    icon: '🎚️',
    description: 'Wrap the launch behind flags so you can ramp 1% → 100% and switch it off instantly.',
    cost: 1,
    owner: 'lead',
    requires: { progressAtLeast: { core: 40 } },
    requirementText: '{ws.core} ≥ 40%',
    concept: 'phased-rollout',
  },
  {
    key: 'monitoring',
    name: 'Dashboards & alerts',
    icon: '📈',
    description: 'Golden signals (latency, errors, traffic, saturation) plus business metrics, with alerts that page a human.',
    cost: 1,
    owner: 'sre',
    requires: { progressAtLeast: { platform: 50 } },
    requirementText: '{ws.platform} ≥ 50%',
    concept: 'launch-readiness',
  },
  {
    key: 'oncall',
    name: 'On-call rota & runbooks',
    icon: '📟',
    description: 'Who gets paged at 3am, and what do they do? Rota agreed, runbooks written, escalation paths known.',
    cost: 1,
    owner: 'sre',
    requires: { minDay: 6 },
    requirementText: 'Week 2 or later',
    concept: 'incident-mgmt',
  },
  {
    key: 'rollbackPlan',
    name: 'Rollback plan, rehearsed',
    icon: '⏪',
    description: 'A written, rehearsed way back — including the point of no return and data reconciliation.',
    cost: 2,
    owner: 'sre',
    requires: { progressAtLeast: { platform: 60, core: 50 } },
    requirementText: '{ws.platform} ≥ 60%, {ws.core} ≥ 50%',
    concept: 'launch-readiness',
    discovery: {
      chance: 0.3,
      text: 'The rehearsal fails halfway: the database migration is not reversible. Painful — but far better to find out now.',
      effects: { scope: { platform: 8 }, quality: 4 },
    },
  },
  {
    key: 'securityReview',
    name: 'Security review / VAPT',
    icon: '🛡️',
    description: 'Threat model reviewed, pen test run, high findings fixed or formally risk-accepted.',
    cost: 2,
    owner: 'security',
    requires: { progressAtLeast: { core: 60 } },
    requirementText: '{ws.core} ≥ 60%',
    concept: 'launch-readiness',
    discovery: {
      chance: 0.35,
      text: 'The pen test finds a high-severity IDOR in an internal API. The team patches it, but it costs time.',
      effects: { scope: { core: 6 }, quality: 5 },
    },
  },
  {
    key: 'loadTest',
    name: 'Load & performance test',
    icon: '🏋️',
    description: 'Test at 2–3× expected peak, find the bottleneck before your customers do.',
    cost: 2,
    owner: 'sre',
    requires: { progressAtLeast: { core: 70, platform: 60 } },
    requirementText: '{ws.core} ≥ 70%, {ws.platform} ≥ 60%',
    concept: 'launch-readiness',
    discovery: {
      chance: 0.4,
      text: 'At 2× peak the connection pool saturates and p99 latency hits 8 seconds. Fixable — now that you know.',
      effects: { scope: { core: 6, platform: 4 }, quality: 6 },
    },
  },
  {
    key: 'uat',
    name: 'UAT sign-off',
    icon: '🧪',
    description: 'Real business users run real scenarios end-to-end and formally accept the release.',
    cost: 2,
    owner: 'pm',
    requires: { progressAtLeast: { core: 90, client: 85 } },
    requirementText: '{ws.core} ≥ 90%, {ws.client} ≥ 85%',
    concept: 'uat',
    discovery: {
      chance: 0.35,
      text: 'UAT finds that refunds show the wrong amount on receipts. Small fix, big embarrassment avoided.',
      effects: { scope: { client: 6 }, quality: 4 },
    },
  },
  {
    key: 'signoff',
    name: 'Compliance & legal sign-off',
    icon: '⚖️',
    description: 'Formal sign-off once the review track is complete: privacy, regulatory, T&Cs.',
    cost: 1,
    owner: 'compliance',
    requires: { progressAtLeast: { review: 100 } },
    requirementText: '{ws.review} complete',
    concept: 'launch-readiness',
  },
  {
    key: 'commsPlan',
    name: 'Launch comms plan',
    icon: '📣',
    description: 'Customer support briefed, status page ready, stakeholders know the timeline and who to call.',
    cost: 1,
    owner: 'pm',
    requires: { minDay: 8 },
    requirementText: 'Day 8 or later',
    concept: 'launch-readiness',
  },
]

export const READINESS_BY_KEY = Object.fromEntries(READINESS.map((r) => [r.key, r])) as Record<ReadinessKey, ReadinessDef>
