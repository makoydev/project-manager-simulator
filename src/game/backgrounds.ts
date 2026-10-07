import type { BackgroundId, MeterKey, Role, SkillKey } from './types'

export interface BackgroundDef {
  id: BackgroundId
  name: string
  subtitle: string
  icon: string
  description: string
  perks: string[]
  traps: string[]
  rel: Partial<Record<Role, number>>
  meters: Partial<Record<MeterKey, number>>
  /** Hidden risks revealed on Day 1 — planners see risks early. */
  revealRisks: number
  /** Unlocks the tempting "write the code yourself" action. */
  canCode: boolean
  /** XP multipliers for skills this background is naturally good at. */
  xp: Partial<Record<SkillKey, number>>
}

export const BACKGROUNDS: Record<BackgroundId, BackgroundDef> = {
  builder: {
    id: 'builder',
    name: 'The Builder',
    subtitle: 'Ex–Tech Lead',
    icon: '🛠️',
    description: 'Six years shipping code. Engineers trust you instantly — and you can smell a bad estimate from across the office.',
    perks: ['Engineers start out liking you', 'Technical judgment XP ×1.5'],
    traps: ['Itchy fingers: you can jump in and code. Should you?', 'Execs don’t know you yet'],
    rel: { lead: 10, partner: 8, sre: 8 },
    meters: { trust: -5 },
    revealRisks: 0,
    canCode: true,
    xp: { technical: 1.5 },
  },
  planner: {
    id: 'planner',
    name: 'The Planner',
    subtitle: 'PMP Project Manager',
    icon: '📐',
    description: 'You’ve run RAID logs in your sleep. Execs love your structure; engineers suspect you’ll bring a Gantt chart to standup.',
    perks: ['Spot 2 hidden risks on Day 1', 'Sponsor & manager start out liking you', 'Risk XP ×1.5'],
    traps: ['Gantt reflex: tempted to over-process an agile team', 'Engineers start out wary'],
    rel: { sponsor: 8, boss: 6, lead: -5, partner: -3 },
    meters: {},
    revealRisks: 2,
    canCode: false,
    xp: { risk: 1.5 },
  },
  hybrid: {
    id: 'hybrid',
    name: 'The Hybrid',
    subtitle: 'Tech Lead + PMP',
    icon: '🧭',
    description: 'You can read a sequence diagram and a risk register. The rarest TPM profile — if you resist both your old habits.',
    perks: ['Balanced relationships on both sides', 'Spot 1 hidden risk on Day 1', 'Technical & Risk XP ×1.25'],
    traps: ['Both temptations: coding it yourself and over-planning'],
    rel: { lead: 6, partner: 4, sre: 4, sponsor: 4 },
    meters: {},
    revealRisks: 1,
    canCode: true,
    xp: { technical: 1.25, risk: 1.25 },
  },
}
