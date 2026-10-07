import type { EventDef } from '../../game/types'

/**
 * Events the engine schedules itself when a run is in trouble. They give the player
 * a fair warning, and a way back, before trust or morale collapse completely.
 */
export const SYSTEM_EVENTS: EventDef[] = [
  {
    id: 'sys-trust-warning',
    title: '“Got 15 minutes?”',
    channel: 'meeting',
    from: 'boss',
    body: "{player}, I'll be direct because I want you to succeed here. {sponsor} has stopped trusting the updates, and two leads told me they hear about changes late. This is fixable, but not by working harder. What's your plan?",
    urgency: 'high',
    expires: 2,
    weight: 0,
    concept: 'stakeholder-map',
    skill: 'stakeholder',
    choices: [
      {
        id: 'a',
        label: 'Explain that most of the slips came from other teams and the vendor',
        cost: 1,
        grade: 'poor',
        insight: 'Even when it is true, leading with blame tells your manager you will not own the outcome. Own the program, say what you will change, then mention constraints.',
        outcome: {
          text: '{boss} listens, nods slowly and asks, “Okay. And what will you do differently?” You don’t have an answer yet.',
          effects: { trust: -3, rel: { boss: -6 } },
        },
      },
      {
        id: 'b',
        label: 'Promise to work weekends until everything is back on track',
        cost: 0,
        grade: 'poor',
        insight: 'Hours are not the problem; signals are. Stakeholders need predictability and early warnings, not a tired TPM who will make worse calls by Thursday.',
        outcome: {
          text: '“I don’t need you exhausted. I need to stop being surprised.” {boss} looks more worried than before.',
          effects: { trust: 2, energy: -15 },
        },
      },
      {
        id: 'c',
        label: 'Ask what broke trust, then agree a reset: weekly {sponsor} 1:1s and a decision log',
        cost: 2,
        grade: 'best',
        insight: 'Trust is rebuilt with predictable behaviour, not one heroic week. A fixed cadence, a written decision log and early bad news show people they can rely on you again.',
        outcome: {
          text: '{boss} relaxes. “That’s exactly what I wanted to hear. I’ll back you with {sponsor} this week.”',
          effects: { trust: 12, rel: { boss: 8, sponsor: 5 }, flags: ['sys:trust-reset'] },
        },
      },
    ],
    ignored: {
      text: 'You skip the 1:1 with your own manager. {boss} escalates their concerns about you to {sponsor} instead.',
      effects: { trust: -6, rel: { boss: -10 } },
    },
  },
  {
    id: 'sys-morale-warning',
    title: 'The team is running on fumes',
    channel: 'hallway',
    from: 'lead',
    body: 'Can I be honest? Two of my engineers were online at 2am again, one is interviewing elsewhere, and nobody laughed at standup this week. If we keep this pace, we lose people before {target}.',
    urgency: 'high',
    expires: 2,
    weight: 0,
    concept: 'team-health',
    skill: 'leadership',
    choices: [
      {
        id: 'a',
        label: 'Remind them the date is fixed and everyone is in this together',
        cost: 0,
        grade: 'poor',
        insight: 'A team in the red zone doesn’t need the deadline explained again. Pressure without relief turns tired people into resignations, and resignations into slips.',
        outcome: {
          text: '{lead} nods without saying anything. The next morning, a senior engineer books a “personal appointment”.',
          effects: { morale: -6, rel: { lead: -8 }, velocity: { ws: 'all', mult: 0.9, days: 3, label: 'Quiet quitting' } },
        },
      },
      {
        id: 'b',
        label: 'Order bubble tea for the whole floor',
        cost: 0,
        grade: 'okay',
        insight: 'A treat is a nice gesture, but it treats the symptom. Burnout comes from workload and control, so pair the gesture with a real change to scope or pace.',
        outcome: {
          text: 'Brown sugar boba for everyone. Smiles all round, for about an hour.',
          effects: { morale: 4, budget: -0.4 },
        },
      },
      {
        id: 'c',
        label: 'Protect the team: no weekend work, cut one nice-to-have with {pm}, and thank them publicly',
        cost: 2,
        grade: 'best',
        insight: 'Sustainable pace is a delivery strategy. Trading a little scope for a team that stays is almost always the better deal, and saying so out loud is leadership.',
        outcome: {
          text: '{pm} grumbles but agrees to move one feature to a fast-follow. {lead} posts “weekends are back” in the team channel. Somebody replies with a GIF.',
          effects: { morale: 12, scope: { core: -8 }, rel: { lead: 8, pm: -3 }, trust: -1 },
        },
      },
    ],
    ignored: {
      text: 'You never get back to {lead}. On Monday, one of the engineers hands in their notice.',
      effects: { morale: -8, rel: { lead: -10 }, velocity: { ws: 'core', mult: 0.85, days: 4, label: 'Lost an engineer' } },
    },
  },
]
