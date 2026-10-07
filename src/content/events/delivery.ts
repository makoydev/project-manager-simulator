import type { EventDef } from '../../game/types'

/**
 * Delivery events — the technical, risk and execution side of the TPM job.
 *
 * Generic: they play in every scenario, so they use role/workstream tokens only.
 * Ids are prefixed `d-`, flags are namespaced `d:`.
 *
 * Chains (weight-0 follow-ups):
 *  - d-prod-incident → d-postmortem-name → (skip it) → d-repeat-incident
 *  - d-cab-rejected → (relabel as a standard change) → d-migration-night
 *  - d-tl-fix-bug → (hero fix) → d-hero-regression
 * Engine flag: d-boss-who-runs follows the "write code yourself" action (sys:coded).
 */
export const DELIVERY_EVENTS: EventDef[] = [
  // ─────────────── Planning, estimation & risk ───────────────
  {
    id: 'd-ninety-percent',
    title: 'The integration that is always 90% done',
    channel: 'meeting',
    from: 'partner',
    body: 'Standup starts ten minutes late (MRT delay, again). {partner}: "{ws.client} integration is 90% done, should wrap up tomorrow." You glance at your notes from last week. Same words. Same confident nod.',
    urgency: 'normal',
    when: { minDay: 6, maxDay: 13, progressBelow: { client: 90 } },
    concept: 'estimation',
    skill: 'execution',
    choices: [
      {
        id: 'a',
        label: 'Mark it green: {partner} knows their own team, and nagging grown-ups never helps',
        cost: 0,
        grade: 'poor',
        insight:
          "\"90% done\" measures effort spent, not work left, and the last 10% hides integration, edge cases and testing. Accept it unchallenged and your report turns watermelon: green outside, red inside. Ask what's left, not how far along it is.",
        outcome: {
          text: 'Green it is. Two days later {ws.client} is still "almost there", and your status report has aged like milk.',
          effects: { trust: -4, scope: { client: 10 } },
        },
      },
      {
        id: 'b',
        label: 'Sit with {partner} after standup and list every remaining task, each ≤ 1 day',
        cost: 2,
        grade: 'best',
        insight:
          'Swap percent-complete for a list of remaining tasks small enough to be done-or-not-done (a day or less, each with a demo or test as proof). It turns a feeling into a forecast and surfaces the hidden last 10% while you can still act.',
        outcome: {
          text: "The list has 14 items, including \"wait for {ws.core}'s final API\". You agree a contract and mocks so {partner}'s team can finish against them. Real ETA: four days. Bad news, but early bad news.",
          effects: {
            scope: { client: 6 },
            relaxDependency: { ws: 'client', capAt: 0.9 },
            trust: 3,
            rel: { partner: 4 },
            revealRisks: 1,
            skills: { execution: 1 },
          },
        },
      },
      {
        id: 'c',
        label: "Call it out in front of everyone: \"That's what you said last week.\"",
        cost: 0,
        grade: 'poor',
        insight:
          "Public call-outs make people defend the number instead of examining it, and teach the whole team to pad and hide. Probe in private, with curiosity: what's left, what's blocking, what's still unknown?",
        outcome: {
          text: "The room goes quiet. {partner} says you don't understand integration work. Standups get shorter, vaguer and much less useful.",
          effects: { morale: -4, rel: { partner: -8 }, scope: { client: 8 } },
        },
      },
    ],
    ignored: {
      text: 'Nobody asks. "90% done" rolls into a third week, and the remaining work surfaces all at once.',
      effects: { scope: { client: 10 }, trust: -3 },
    },
  },
  {
    id: 'd-brooks-four-more',
    title: 'Four more engineers, starting Monday',
    channel: 'email',
    from: 'sponsor',
    body: "Saw the projected date slip, so here's good news: I've freed up four engineers from another squad. They can join {ws.core} on Monday. More hands, faster finish, right? Let me know by end of day so I can tell their manager. — {sponsor}",
    urgency: 'high',
    when: { minDay: 4, maxDay: 11, behindSchedule: true },
    concept: 'brooks-law',
    skill: 'stakeholder',
    choices: [
      {
        id: 'a',
        label: 'Accept all four on the spot: more hands is exactly what a late program needs',
        cost: 0,
        grade: 'poor',
        insight:
          "Brooks's law: adding people to a late project makes it later. Newcomers need onboarding from your busiest engineers, and communication paths grow as n(n−1)/2. Extra people help only on well-partitioned work, ideally added early.",
        outcome: {
          text: 'Monday: four keen engineers, zero repo access, and {lead} spending the week onboarding instead of building.',
          effects: {
            velocity: { ws: 'core', mult: 0.7, days: 3, label: 'Onboarding four newcomers' },
            budget: -10,
            morale: -3,
            rel: { sponsor: 4, lead: -6 },
          },
        },
      },
      {
        id: 'b',
        label: "Decline politely: cite Brooks's law and say the team will manage",
        cost: 0,
        grade: 'okay',
        insight:
          "Right instinct, wrong delivery. Quoting a 1975 book at your sponsor sounds like \"no\", and they offered because they're worried. Give them a useful way to help instead: split-off work, clearing a blocker, or a scope decision.",
        outcome: {
          text: "{sponsor} replies \"OK, your call.\" The four go elsewhere. The date problem stays yours, and so does the sponsor's worry.",
          effects: { trust: -2, rel: { sponsor: -4 } },
        },
      },
      {
        id: 'c',
        label: 'Ask {lead} which work splits off cleanly, then take only who can help',
        cost: 2,
        grade: 'best',
        insight:
          'Extra people help on work that splits off cleanly with little ramp-up: test automation, tooling, a self-contained component. Take the people you can absorb, keep them off the critical path, and let them free up your experienced engineers.',
        outcome: {
          text: "{lead} carves out test automation and an admin screen. Two engineers join; two stay put. {sponsor} likes that you said \"yes, here's how\" instead of just yes or no.",
          effects: {
            velocity: { ws: 'core', mult: 1.15, days: 4, label: 'Two helpers on split-off work' },
            budget: -5,
            rel: { sponsor: 3, lead: 4 },
            skills: { leadership: 1 },
          },
        },
      },
    ],
    ignored: {
      text: '{sponsor} takes silence as a yes. Four engineers arrive on Monday, and nobody has planned their week.',
      effects: { velocity: { ws: 'core', mult: 0.75, days: 3, label: 'Unplanned onboarding' }, budget: -10, rel: { lead: -4 } },
    },
  },
  {
    id: 'd-gantt-312',
    title: 'A 312-line Gantt chart for a 3-week program',
    channel: 'slack',
    from: 'lead',
    body: "Saw the project plan you shared. It's 312 lines? With task dependencies down to half a day? Are we meant to update our % complete in it every day? Because the team is asking, and the answer they're hoping for is no. — {lead}",
    urgency: 'normal',
    when: { background: ['planner', 'hybrid'], maxDay: 6 },
    concept: 'critical-path',
    skill: 'execution',
    choices: [
      {
        id: 'a',
        label: 'Cut it to one page: milestones, cross-team dependencies, critical path',
        cost: 2,
        grade: 'best',
        insight:
          'Keep the PMP rigour, drop the weight: a one-page milestone plan with cross-team dependencies and the critical path, while each team runs its own board. You manage the seams between teams; the teams manage their own work.',
        outcome: {
          text: 'One page, nine milestones, four dependencies. It shows {ws.core} is the critical path, which is exactly where your attention goes next.',
          effects: { morale: 4, rel: { lead: 5 }, revealRisks: 1, skills: { execution: 1 } },
        },
      },
      {
        id: 'b',
        label: "Yes: daily updates keep the plan accurate, and you'll run a training session on it",
        cost: 1,
        grade: 'poor',
        insight:
          'A three-week agile program changes daily, so a task-level Gantt is stale by Tuesday and turns engineers into data-entry clerks. Plan at the level where decisions are made: milestones, cross-team dependencies, the critical path.',
        outcome: {
          text: 'The team updates it for three days. Then the file stops changing, and so does your view of reality.',
          effects: { morale: -6, rel: { lead: -6 }, velocity: { ws: 'all', mult: 0.9, days: 2, label: 'Updating the Gantt' } },
        },
      },
      {
        id: 'c',
        label: "Keep the Gantt, but update it yourself from the team's board every evening",
        cost: 1,
        grade: 'okay',
        insight:
          "Sparing the team the data entry is kind, but you'll spend an hour a day maintaining detail nobody uses. Track the critical path and the dependencies; let the team's board hold the tasks.",
        outcome: {
          text: 'The team is relieved. You spend your evenings copying tickets into a chart only you read.',
          effects: { energy: -8, rel: { lead: 2 } },
        },
      },
    ],
    ignored: {
      text: 'Nobody answers {lead}. The team stops opening the plan, and eventually so do you.',
      effects: { morale: -2, rel: { lead: -3 } },
    },
  },
  {
    id: 'd-raid-staging',
    title: 'Staging is down. Again. Three teams stuck.',
    channel: 'slack',
    from: 'sre',
    body: 'Shared staging is down again, third time this sprint. {ws.core}, {ws.client} and {ws.data} are all blocked. We are on it, ETA "today, probably". Also: your plan assumes a stable staging environment. Might want to look at that. — {sre}',
    urgency: 'high',
    when: { minDay: 2, maxDay: 11 },
    concept: 'raid-log',
    skill: 'risk',
    choices: [
      {
        id: 'a',
        label: "Ping all three leads every hour, so everyone can see you're right on top of it",
        cost: 1,
        grade: 'poor',
        insight:
          'Hourly pings create noise, not progress. In a blocker, get one owner, one ETA and one channel for updates, then work the bigger question: why does this keep happening, and what else does the plan assume?',
        outcome: {
          text: 'Three leads, hourly pings, zero new information. {sre} mutes you. Staging comes back at 6pm.',
          effects: { energy: -4, rel: { sre: -5, lead: -3 }, block: { ws: 'core', days: 1, reason: 'Shared staging down' } },
        },
      },
      {
        id: 'b',
        label: 'Ask {sre} to stand up a temporary environment for {ws.core} first',
        cost: 1,
        grade: 'okay',
        insight:
          "Unblocking the critical path first is the right instinct: protect the work that sets the launch date. But if nobody records why staging keeps failing, you'll be back here next week.",
        chance: {
          base: 0.45,
          rel: 'sre',
          success: {
            text: '{sre} spins up a temporary environment by noon. {ws.core} keeps moving; the other two teams wait it out.',
            effects: { rel: { sre: 2 } },
          },
          failure: {
            text: "{sre}'s team is heads-down on the fix and can't spare anyone. You wait like everyone else.",
            effects: { rel: { sre: -2 }, block: { ws: 'core', days: 1, reason: 'Shared staging down' } },
          },
        },
      },
      {
        id: 'c',
        label: 'Log the broken assumption as an issue and a risk, owned by {sre}',
        cost: 2,
        grade: 'best',
        insight:
          "RAID = Risks, Assumptions, Issues, Dependencies. When an assumption breaks, it's an issue today and a risk going forward: log both with an owner and a mitigation (here, per-team environments). A RAID log is a decision tool, not a diary.",
        outcome: {
          text: "{sre} owns \"staging instability\", with a mitigation: on-demand environments for {ws.core}. Staging is back by 4pm, and your plan no longer assumes it'll stay up.",
          effects: {
            block: { ws: 'core', days: 1, reason: 'Shared staging down' },
            revealRisks: 1,
            quality: 3,
            rel: { sre: 4 },
            velocity: { ws: 'all', mult: 1.1, days: 3, label: 'Fewer environment stalls' },
            skills: { risk: 1 },
          },
        },
      },
    ],
    ignored: {
      text: 'Staging limps back late tomorrow. Nobody writes down why it keeps happening.',
      effects: { block: { ws: 'core', days: 2, reason: 'Shared staging down' }, trust: -2 },
    },
  },
  {
    id: 'd-bus-factor',
    title: 'Only one person understands the recon job',
    channel: 'hallway',
    from: 'lead',
    body: 'At the pantry, {lead} mentions it like the weather: "Oh, only one engineer understands the nightly reconciliation job. No docs. He starts two weeks of ICT reservist training next Monday." Then takes a long, slow sip of kopi.',
    urgency: 'low',
    when: { minDay: 2, maxDay: 10 },
    concept: 'risk-mgmt',
    skill: 'risk',
    choices: [
      {
        id: 'a',
        label: 'Log it as a risk; book pairing and a recorded walkthrough this week',
        cost: 2,
        grade: 'best',
        insight:
          'A bus factor of one is a classic hidden risk. Log it with an owner and a mitigation, then spread the knowledge while you can: pairing on real runs, a recorded walkthrough, a runbook, and a named backup who runs the job before the expert leaves.',
        outcome: {
          text: 'Two pairing sessions and a 40-minute recording later, a second engineer runs the job solo on Friday. It fails once, while the expert is still around to explain why.',
          effects: {
            velocity: { ws: 'data', mult: 0.9, days: 2, label: 'Knowledge-transfer sessions' },
            quality: 4,
            revealRisks: 1,
            rel: { lead: 4 },
            flags: ['d:bus-factor-fixed'],
            skills: { risk: 1 },
          },
        },
      },
      {
        id: 'b',
        label: 'Ask him to see if his ICT can be deferred until after launch, as it is only two weeks',
        cost: 0,
        grade: 'poor',
        insight:
          "Reservist in-camp training is a national service obligation: you plan around it, you don't bargain it away for a launch. Treat a key-person dependency as a risk and spread the knowledge before it walks out the door.",
        outcome: {
          text: "He looks at you like you've suggested he skip his own wedding. {lead} changes the subject.",
          effects: { morale: -4, rel: { lead: -6 } },
        },
      },
      {
        id: 'c',
        label: 'Ask him to write up the documentation before he goes',
        cost: 0,
        grade: 'okay',
        insight:
          'Docs help, but knowledge transfer only sticks when a second person actually runs the job while the expert is still reachable. A doc written alone in a rush captures the happy path and none of the 3am surprises.',
        outcome: {
          text: 'You get eight pages. Accurate, mostly. Nobody else has ever actually run the job.',
          effects: { quality: 2, rel: { lead: 2 } },
        },
      },
    ],
    ignored: {
      text: 'He leaves for camp. On Tuesday night the reconciliation job fails, and nobody knows what "step 4b" means.',
      effects: { block: { ws: 'data', days: 1, reason: 'Recon job down, expert away on reservist' }, quality: -4, trust: -2 },
    },
  },
  {
    id: 'd-vendor-can',
    title: 'The vendor says "can". Again.',
    channel: 'whatsapp',
    from: 'pm',
    body: "Forwarding from the vendor's account manager: \"Can! SDK by Wednesday, can support the new fields, can do the load test also.\" That's the third \"can\" this month, and we still don't have sandbox credentials. {ws.client} is waiting on them. What do we do? — {pm}",
    urgency: 'normal',
    when: { minDay: 3, maxDay: 11 },
    concept: 'vendor-mgmt',
    skill: 'stakeholder',
    choices: [
      {
        id: 'a',
        label: "Take them at their word: it's in writing now, so any slip is on them",
        cost: 0,
        grade: 'poor',
        insight:
          'A written "can" shifts blame, not risk: if the vendor slips, your launch slips. Track vendor deliverables like internal ones, with early proof points, and keep a fallback for the critical ones.',
        outcome: {
          text: 'Wednesday comes and goes. The account manager is "checking with the team".',
          effects: { trust: -3, block: { ws: 'client', days: 2, reason: 'Waiting on vendor SDK' }, flags: ['d:vendor-slip'] },
        },
      },
      {
        id: 'b',
        label: 'Ask {partner}, who has used this vendor before, to get you to their engineers',
        cost: 1,
        grade: 'okay',
        insight:
          "Back channels help: an engineer-to-engineer call often gets the truth an account manager won't. But it supplements holding the vendor to dated deliverables; it doesn't replace it.",
        chance: {
          base: 0.5,
          rel: 'partner',
          success: {
            text: '{partner} makes the intro. Their engineer admits the SDK is "about 60%". Unwelcome, but real, and early.',
            effects: { revealRisks: 1, scope: { client: 4 }, rel: { partner: 2 } },
          },
          failure: {
            text: "{partner}'s contact left the vendor last year. You've spent a favour and learned nothing new.",
            effects: { rel: { partner: -2 }, block: { ws: 'client', days: 1, reason: 'Waiting on vendor SDK' } },
          },
        },
      },
      {
        id: 'c',
        label: 'Ask for proof, not promises: a working sandbox by Friday and a weekly demo',
        cost: 2,
        grade: 'best',
        insight:
          "Vendors sit on your critical path but outside your reporting line, so manage by evidence: dated deliverables you can verify (sandbox, demo, test results), a named technical contact, and the contract's escalation path. \"Can\" is not a status.",
        outcome: {
          text: "The sandbox arrives Thursday. It's missing two fields, but you know now instead of in week three, and the vendor knows you'll check.",
          effects: { scope: { client: 4 }, revealRisks: 1, trust: 2, rel: { pm: 3 }, skills: { stakeholder: 1 } },
        },
      },
    ],
    ignored: {
      text: "Nobody chases. Wednesday's SDK becomes next Wednesday's SDK.",
      effects: { trust: -2, block: { ws: 'client', days: 2, reason: 'Waiting on vendor SDK' } },
    },
  },

  // ─────────────── Incidents, post-mortems & change control ───────────────
  {
    id: 'd-prod-incident',
    title: 'SEV-2 in production, and it was your change',
    channel: 'incident',
    from: 'sre',
    body: '#inc-bridge: error rate on the live app hit 18% at 14:02. At 14:00, {ws.core} shipped a shared config change for {program}. Six engineers are on the bridge, four are reading logs, and nobody is talking to customers or execs. Everyone just turned to look at you. — {sre}',
    urgency: 'critical',
    expires: 1,
    when: { minDay: 3, maxDay: 13 },
    concept: 'incident-mgmt',
    skill: 'comms',
    choices: [
      {
        id: 'a',
        label: 'Jump into the logs: you know this codebase better than anyone on the call',
        cost: 2,
        grade: 'poor',
        insight:
          "A TPM debugging is one more pair of eyes and zero coordination. Ask instead: who's incident commander, who's on comms, what's the fastest mitigation? Roll back first, find the root cause later.",
        outcome: {
          text: 'You find a promising stack trace at 14:40. Meanwhile nobody updated support, {sponsor} heard about it from a customer, and the bad config stayed live for 50 minutes.',
          effects: {
            trust: -6,
            quality: -4,
            energy: -8,
            focus: -1,
            rel: { sponsor: -6, sre: -3 },
            followUps: [{ event: 'd-postmortem-name', inDays: 2 }],
          },
        },
      },
      {
        id: 'b',
        label: 'Hold the rollback until the root cause is confirmed',
        cost: 1,
        grade: 'poor',
        insight:
          'Mitigate first, diagnose second. When a change lines up with the start of an incident, rolling it back is cheap and reversible; waiting for certainty while customers fail is not. Root cause is for the post-mortem.',
        outcome: {
          text: 'Root cause is confirmed at 15:10: it was the config. The rollback takes four minutes. The outage took 68.',
          effects: {
            trust: -8,
            quality: -5,
            rel: { sre: -5, sponsor: -3 },
            followUps: [{ event: 'd-postmortem-name', inDays: 2 }],
          },
        },
      },
      {
        id: 'c',
        label: 'Ask {sre} to take incident command, roll back now, and own the comms yourself',
        cost: 2,
        grade: 'best',
        insight:
          'Split the roles: an incident commander coordinates, engineers mitigate, and one person owns comms on a fixed cadence. Rolling back the suspect change is usually the fastest fix. A TPM adds most by running comms and decisions, not reading logs.',
        outcome: {
          text: 'Rolled back at 14:11; errors normal by 14:15. Your updates went out at 14:10, 14:30 and 15:00. {sponsor} replies: "Thanks for the clear updates." A change freeze holds {ws.core} for a day.',
          effects: {
            trust: 5,
            rel: { sre: 5, sponsor: 3 },
            block: { ws: 'core', days: 1, reason: 'Change freeze after the SEV-2' },
            followUps: [{ event: 'd-postmortem-name', inDays: 2 }],
            skills: { comms: 1 },
          },
        },
      },
    ],
    ignored: {
      text: 'The bridge runs leaderless for an hour. {sponsor} hears about the outage from a customer first, and from you second.',
      effects: {
        trust: -12,
        quality: -5,
        rel: { sponsor: -8, sre: -4 },
        followUps: [{ event: 'd-postmortem-name', inDays: 2 }],
      },
    },
  },
  {
    id: 'd-postmortem-name',
    title: 'The post-mortem, and a request for a name',
    channel: 'meeting',
    from: 'sponsor',
    body: 'Post-mortem for the SEV-2. Before you can share your screen, {sponsor} leans in: "Before the timeline: who pushed the change? I need a name for my boss." The engineers suddenly find the table fascinating. {lead} is watching you very closely.',
    urgency: 'high',
    weight: 0,
    concept: 'postmortem',
    skill: 'leadership',
    choices: [
      {
        id: 'a',
        label: 'Give the name: the sponsor asked directly, and dodging it looks evasive',
        cost: 0,
        grade: 'poor',
        insight:
          'Naming individuals teaches everyone to hide mistakes, so the next incident gets reported later. Blameless means the fix targets the system: why could one config change reach production with no canary and no review gate?',
        outcome: {
          text: "The engineer goes red. Afterwards three people ask {lead} if they're \"in trouble\". The action items are thin: nobody volunteers detail any more.",
          effects: { morale: -8, quality: -3, rel: { lead: -8, sponsor: 3 }, flags: ['d:blame-culture'] },
        },
      },
      {
        id: 'b',
        label: 'Offer {sponsor} a 1:1 readout; keep this room blameless, with owned actions',
        cost: 2,
        grade: 'best',
        insight:
          "The sponsor needs confidence it won't happen again, not a scapegoat. Keep the review on systems, not people; leave with 3–5 actions that have owners and dates; and brief execs separately. That's accountability without fear.",
        outcome: {
          text: "The team opens up: no canary, no config review, an alert nobody tuned. Four actions, four owners. In the 1:1, {sponsor} mostly wanted proof it's fixed, and now has it.",
          effects: {
            morale: 5,
            quality: 6,
            trust: 4,
            rel: { lead: 6, sponsor: 2 },
            readiness: ['monitoring'],
            flags: ['d:postmortem-done'],
            skills: { leadership: 1 },
          },
        },
      },
      {
        id: 'c',
        label: 'Cancel the post-mortem: the team is behind, and everyone already knows what happened',
        cost: 0,
        grade: 'poor',
        insight:
          "Skipping the post-mortem saves an hour and leaves the hole open. Incidents recur when contributing causes (no canary, review gaps, weak alerts) aren't tracked to closure. Keep it short, 45 minutes, but never skip it.",
        outcome: {
          text: 'Everyone gets an hour back. The canary, the config review and the alert stay exactly as they were.',
          effects: { morale: 2, flags: ['d:skipped-postmortem'], followUps: [{ event: 'd-repeat-incident', inDays: 3 }] },
        },
      },
    ],
    ignored: {
      text: 'Without you, the review drifts into who-did-what. The fix list is two vague bullets with no owners.',
      effects: { morale: -4, quality: -2, flags: ['d:skipped-postmortem'], followUps: [{ event: 'd-repeat-incident', inDays: 3 }] },
    },
  },
  {
    id: 'd-repeat-incident',
    title: 'Same incident, second time in a week',
    channel: 'incident',
    from: 'sre',
    body: "#inc-bridge: error spike, same pattern as last time. A config change went straight to production with no canary. Different engineer, same hole. {sponsor} has already asked in the public channel: \"Didn't we have this exact incident last week?\" — {sre}",
    urgency: 'critical',
    expires: 1,
    weight: 0,
    concept: 'postmortem',
    skill: 'risk',
    choices: [
      {
        id: 'a',
        label: 'Roll back, then run the post-mortem today and track every action to done',
        cost: 2,
        grade: 'best',
        insight:
          'A repeat incident is the bill for a skipped post-mortem. Mitigate first, then review and track actions to closure: an action without an owner and a date is a wish. Tell the sponsor plainly why it happened twice.',
        outcome: {
          text: 'Rolled back in six minutes. This time the actions land: a config canary and a two-person review. Telling {sponsor} why it happened twice stings, and earns some respect back.',
          effects: {
            trust: -3,
            quality: 6,
            rel: { sponsor: 2, sre: 4 },
            block: { ws: 'core', days: 1, reason: 'Config freeze while a canary is added' },
            flags: ['d:postmortem-done'],
            clearFlags: ['d:skipped-postmortem'],
          },
        },
      },
      {
        id: 'b',
        label: 'Roll back, post "resolved", and send everyone straight back to the {program} backlog',
        cost: 0,
        grade: 'poor',
        insight:
          'Fixing the symptom twice and calling it done guarantees a third time. Repeat incidents erode trust far faster than first ones; the only credible answer is a systemic fix with an owner and a date.',
        outcome: {
          text: "Resolved in six minutes. {sponsor} doesn't reply to your \"all good\" message, which is worse than an angry reply. Nobody can say why the alert stayed silent.",
          effects: { trust: -8, quality: -4, rel: { sponsor: -6 }, unready: ['monitoring'] },
        },
      },
      {
        id: 'c',
        label: 'Find out which engineer pushed it and make sure their lead knows',
        cost: 1,
        grade: 'poor',
        insight:
          "Two different engineers made the same mistake: that's the system talking. Hunting individuals hides the real fix (a canary and a review gate) and makes people slower to raise the alarm next time.",
        outcome: {
          text: 'The engineer apologises in the channel. Everyone else goes quiet. The config path still has no guardrails.',
          effects: { morale: -6, trust: -4, quality: -2, rel: { lead: -6 }, unready: ['monitoring'] },
        },
      },
    ],
    ignored: {
      text: 'The bridge fixes it in 40 minutes without you. {sponsor} notes, in writing, that this is the second time.',
      effects: { trust: -10, quality: -4, rel: { sponsor: -6 }, unready: ['monitoring'] },
    },
  },
  {
    id: 'd-cab-rejected',
    title: 'Change board: REJECTED (no rollback plan)',
    channel: 'email',
    from: 'sre',
    body: 'FYI: the Change Advisory Board rejected Thursday\'s {ws.data} production migration. Reason: "No tested rollback plan." Next CAB is Monday. {lead} says the migration is simple and asks if we can file it as a standard change instead. Your call. — {sre}',
    urgency: 'high',
    when: { minDay: 6, maxDay: 13 },
    concept: 'change-mgmt',
    skill: 'risk',
    choices: [
      {
        id: 'a',
        label: "Rehearse a rollback on staging with {lead}, then take it to Monday's CAB",
        cost: 2,
        grade: 'best',
        insight:
          "A rollback plan you haven't rehearsed is a hope. Write the down-migration, time it on production-sized data, agree the abort criteria, then resubmit. Losing a couple of days now is cheaper than a night with no way back.",
        outcome: {
          text: "The rehearsal finds a step that would have locked a table for 20 minutes. Fixed. Monday's CAB approves it in five minutes, and {sre} quietly forwards your plan as a template.",
          effects: {
            readiness: ['rollbackPlan'],
            block: { ws: 'data', days: 1, reason: 'Waiting for Monday CAB' },
            quality: 5,
            trust: 3,
            rel: { sre: 4 },
            skills: { risk: 1 },
          },
        },
      },
      {
        id: 'b',
        label: "Take {lead}'s idea: refile it as a standard change and ship on Thursday",
        cost: 0,
        grade: 'poor',
        insight:
          "Standard changes are for pre-approved, low-risk, repeatable work, not for dodging a rejection. A schema migration without a tested way back is exactly what change control exists to catch. Fix the gap; don't relabel it.",
        outcome: {
          text: 'Refiled. Auto-approved. Thursday night it is. {lead} thanks you for "cutting the red tape".',
          effects: { rel: { lead: 3 }, flags: ['d:no-rollback'], followUps: [{ event: 'd-migration-night', inDays: 2 }] },
        },
      },
      {
        id: 'c',
        label: 'Escalate to {boss}: the CAB is blocking the program over paperwork',
        cost: 1,
        grade: 'poor',
        insight:
          "Escalating against a valid control burns credibility with your boss and the CAB at once. The board isn't the blocker; the missing rollback plan is. Escalate when you've done your part and still need a decision.",
        outcome: {
          text: "{boss} reads the rejection reason and replies: \"They're right, though?\" The CAB chair hears about your email by lunch.",
          effects: { trust: -4, rel: { boss: -5, sre: -4 } },
        },
      },
    ],
    ignored: {
      text: "Nothing is resubmitted. The migration misses Monday's CAB too, and {ws.data} waits.",
      effects: { block: { ws: 'data', days: 2, reason: 'Migration not approved by CAB' }, trust: -2 },
    },
  },
  {
    id: 'd-migration-night',
    title: '1:47am: the migration is half done',
    channel: 'incident',
    from: 'sre',
    body: "Migration failed at step 6 of 11. Half the tables are on the new schema, half aren't, and there's no down-script. The app is up but writes to two tables are failing. {lead} wants to fix forward; I'd rather restore from the 23:00 snapshot. You're the one awake and in the channel. — {sre}",
    urgency: 'critical',
    expires: 1,
    weight: 0,
    concept: 'incident-mgmt',
    skill: 'risk',
    choices: [
      {
        id: 'a',
        label: 'Back {lead}: keep fixing forward until it works, since restoring loses hours',
        cost: 1,
        grade: 'poor',
        insight:
          'Improvised forward-fixes in production at 2am, with no plan and tired people, are how a partial failure becomes data loss. Set a time box, then take the most reversible option.',
        outcome: {
          text: 'Fix three introduces a new error. At 5am you restore from the snapshot anyway, minus a night of sleep and an hour of customer writes.',
          effects: {
            energy: -15,
            quality: -6,
            trust: -5,
            rel: { sre: -4 },
            block: { ws: 'data', days: 2, reason: 'Recovering from a failed migration' },
          },
        },
      },
      {
        id: 'b',
        label: 'Declare an incident, give the fix 30 minutes, then restore from the snapshot',
        cost: 2,
        grade: 'best',
        insight:
          'Without a plan, structure is your plan: declare the incident, freeze other changes, time-box the fix and pick the most reversible path. Then close the gap for good: no production change without a tested rollback, which is what the CAB asked for.',
        chance: {
          base: 0.6,
          rel: 'sre',
          success: {
            text: "At 2:20 the fix isn't working, so you call it. {sre}'s restore runs clean by 3:10. You send {sponsor} a short, factual note before bed.",
            effects: {
              energy: -10,
              trust: -2,
              quality: 3,
              rel: { sre: 5 },
              block: { ws: 'data', days: 1, reason: 'Re-running the migration properly' },
              clearFlags: ['d:no-rollback'],
            },
          },
          failure: {
            text: "The restore works but loses 40 minutes of writes, and {pm}'s ops team spends the morning reconciling. Painful, but contained and reported honestly.",
            effects: {
              energy: -12,
              trust: -4,
              rel: { pm: -4, sre: 3 },
              block: { ws: 'data', days: 2, reason: 'Recovering from a failed migration' },
              clearFlags: ['d:no-rollback'],
            },
          },
        },
      },
      {
        id: 'c',
        label: "Go back to sleep: {sre} and {lead} are the experts here, so it's really their call",
        cost: 0,
        grade: 'poor',
        insight:
          'Delegating the fix is right; leaving with no decision-maker while two experts disagree is not. Your job at 2am is to make sure someone decides, stakeholders hear it from you, and the team has a time box.',
        outcome: {
          text: 'They debate until 3:30. By morning nothing is restored, and {sponsor} wants to know why nobody told them.',
          effects: {
            energy: 3,
            trust: -8,
            rel: { sponsor: -5, sre: -3 },
            block: { ws: 'data', days: 3, reason: 'Failed migration, no overnight decision' },
          },
        },
      },
    ],
    ignored: {
      text: 'Nobody makes the call. At 6am the team restores from the snapshot and loses a night of writes.',
      effects: {
        trust: -10,
        quality: -5,
        energy: -5,
        block: { ws: 'data', days: 3, reason: 'Recovering from a failed migration' },
      },
    },
  },
  {
    id: 'd-cr-copy-fix',
    title: 'A change request form for two words of copy',
    channel: 'email',
    from: 'pm',
    body: 'Tiny one: the confirmation screen says "Submision received" (typo), and legal prefers "Request received" anyway. Two words. The engineer says your process needs a change request form, an impact assessment and a slot at Thursday\'s change board. Is that right?? — {pm}',
    urgency: 'low',
    when: { background: ['planner', 'hybrid'], minDay: 3, maxDay: 13 },
    concept: 'change-mgmt',
    skill: 'execution',
    choices: [
      {
        id: 'a',
        label: "Yes: process is process. CR form, impact assessment, Thursday's change board",
        cost: 1,
        grade: 'poor',
        insight:
          'Change control should scale with risk. Run a copy fix through a full board and people learn to route around your process, including for the risky changes. Give low-risk changes a light, pre-approved lane instead.',
        outcome: {
          text: 'The CR goes to Thursday\'s board. Meanwhile the typo reaches UAT, gets screenshotted, and becomes a team meme.',
          effects: { morale: -2, trust: -1, rel: { pm: -5, lead: -3 } },
        },
      },
      {
        id: 'b',
        label: 'Approve it as a normal PR, then define a fast lane for low-risk changes',
        cost: 1,
        grade: 'best',
        insight:
          'Tier change control by risk: copy and config tweaks go through a normal PR with owner sign-off; scope, schedule or architecture changes get the full impact analysis. PMBOK says tailor the process; most PMPs forget that part.',
        outcome: {
          text: 'Fixed within the hour. You add a "standard change" lane to the plan: copy, styling, flags. {pm} sends a thumbs-up and, unusually, a thank-you.',
          effects: { morale: 2, trust: 2, rel: { pm: 4, lead: 3 }, skills: { execution: 1 } },
        },
      },
      {
        id: 'c',
        label: 'Waive the process just this once, as a favour to {pm}',
        cost: 0,
        grade: 'okay',
        insight:
          'Waiving a rule "just this once" makes you the bottleneck for every future exception. Fix the rule instead: a pre-approved path for low-risk changes.',
        outcome: {
          text: 'Fixed. Next week three more "just this once" requests land in your DMs.',
          effects: { energy: -3, rel: { pm: 3 } },
        },
      },
    ],
    ignored: {
      text: 'The question sits in your inbox. The typo reaches UAT and becomes a team meme.',
      effects: { morale: -1, rel: { pm: -3 } },
    },
  },

  // ─────────────── Launch readiness, rollout & data ───────────────
  {
    id: 'd-launch-oncall',
    title: 'Who is on call on launch night?',
    channel: 'slack',
    from: 'sre',
    body: "Quick launch check: who's on call that night and that weekend? I see no rota, no runbook and no escalation path in the doc. Half of {lead}'s team will be at a wedding in Johor on Saturday. \"We'll all just be online\" is not an on-call plan. — {sre}",
    urgency: 'high',
    when: { minDay: 11, maxDay: 15, notReadiness: ['oncall'] },
    concept: 'launch-readiness',
    skill: 'execution',
    choices: [
      {
        id: 'a',
        label: 'Reassure {sre}: the whole team will be online anyway, they really care about this',
        cost: 0,
        grade: 'poor',
        insight:
          '"Everyone will be online" means nobody is accountable and everyone is tired. Launch support needs a named primary and backup, runbooks for the likeliest failures, an escalation path, and someone empowered to call a rollback.',
        outcome: {
          text: '{sre} replies with a single 👀 and nothing else. The on-call line in the launch checklist stays red.',
          effects: { trust: -2, rel: { sre: -5 } },
        },
      },
      {
        id: 'b',
        label: 'Put yourself on call for the whole weekend so nobody else has to',
        cost: 1,
        grade: 'poor',
        insight:
          "A TPM can't restart a service or read a heap dump for the team at 3am. On call alone, you're a slow pager relay. Make sure the right engineers are rostered, rested and supported instead.",
        outcome: {
          text: "You feel noble for about an hour. Then {sre} points out you don't have production access. The item stays unticked.",
          effects: { energy: -6, rel: { sre: -2 } },
        },
      },
      {
        id: 'c',
        label: "Ask {sre}'s platform team to cover launch on-call for {lead}'s team",
        cost: 1,
        grade: 'okay',
        insight:
          "Borrowing on-call is better than nothing, but the people who built the service must be reachable: platform engineers can't debug your business logic. Use them as backup, not primary.",
        chance: {
          base: 0.45,
          rel: 'sre',
          success: {
            text: "{sre} agrees to be backup if {lead}'s team is primary, and helps write the runbook. Fair deal.",
            effects: { readiness: ['oncall'], rel: { sre: 2 } },
          },
          failure: {
            text: "{sre}: \"We'll be backup. But you build it, you run it.\" You're back to square one, minus a favour.",
            effects: { rel: { sre: -3 } },
          },
        },
      },
      {
        id: 'd',
        label: 'Draft a rota with {lead}: primary, backup, runbook, and who calls rollback',
        cost: 2,
        grade: 'best',
        insight:
          'Operational readiness is a launch gate, not a nice-to-have. Name a primary and a backup, write runbooks for the top failure modes, agree who can call a rollback, give time off in lieu, then test-page someone.',
        outcome: {
          text: 'Rota done, the runbook covers the top five failure modes, and the wedding guests are rostered off. {sre} fires a test page. It works.',
          effects: { readiness: ['oncall'], morale: 3, rel: { sre: 5, lead: 3 }, skills: { execution: 1 } },
        },
      },
    ],
    ignored: {
      text: 'No rota gets written. {sre} marks on-call readiness red in the launch checklist and copies {boss}.',
      effects: { trust: -4, rel: { sre: -4 } },
    },
  },
  {
    id: 'd-big-bang',
    title: 'Everyone, 9am, with a press release',
    channel: 'meeting',
    from: 'sponsor',
    body: 'Launch planning. Marketing has booked a press release, and the plan is to switch {product} on for every customer at 9am on launch day. "Big moment, big bang!" says {sponsor}, beaming. {lead} slides a sticky note across the table: "we have no kill switch".',
    urgency: 'normal',
    when: { minDay: 8, maxDay: 14, notReadiness: ['featureFlags'] },
    concept: 'phased-rollout',
    skill: 'technical',
    choices: [
      {
        id: 'a',
        label: 'Back the big bang: the sponsor owns the launch, and marketing is already booked',
        cost: 0,
        grade: 'poor',
        insight:
          'A big-bang launch turns every unknown into a full-blast incident. Exposure should be a dial, not a switch: flags let you go 1% → 10% → 50% → 100% and turn things off in seconds, without a deploy.',
        outcome: {
          text: "Everything is set for 9am sharp. {lead} starts writing a rollback script \"just in case\". You both know it won't be quick.",
          effects: { quality: -3, rel: { sponsor: 4, lead: -5 }, flags: ['d:big-bang'] },
        },
      },
      {
        id: 'b',
        label: 'Propose a phased ramp behind a flag, with the press release at 100%',
        cost: 2,
        grade: 'best',
        insight:
          "Separate the marketing moment from the technical switch-on. Ramp exposure behind feature flags with go/no-go metrics at each step, keep a kill switch, and announce once you're at 100%. Execs usually accept it framed as a \"controlled launch\".",
        chance: {
          base: 0.55,
          rel: 'sponsor',
          success: {
            text: '{sponsor} likes the phrase "controlled launch", and the press release moves to the end of the ramp. {lead} adds flags and a kill switch.',
            effects: { readiness: ['featureFlags'], scope: { core: 5 }, trust: 4, rel: { sponsor: 3, lead: 5 } },
          },
          failure: {
            text: "{sponsor} won't move the press date. Compromise: everyone on day one, but behind a flag with a kill switch. Not a ramp, but a way back.",
            effects: { readiness: ['featureFlags'], scope: { core: 5 }, rel: { sponsor: -2, lead: 4 } },
          },
        },
      },
      {
        id: 'c',
        label: 'Stay out of it: rollout strategy is between {lead} and marketing',
        cost: 0,
        grade: 'poor',
        insight:
          "How a change reaches customers is a cross-team risk decision, which makes it squarely a TPM's job. Bring engineering and marketing to one plan they can both live with.",
        outcome: {
          text: 'Engineering and marketing each assume the other has a plan. Neither does.',
          effects: { quality: -3, trust: -2, flags: ['d:big-bang'] },
        },
      },
    ],
    ignored: {
      text: 'No decision gets made, so the plan stands: everyone, 9am, no kill switch.',
      effects: { quality: -2, flags: ['d:big-bang'] },
    },
  },
  {
    id: 'd-uat-skip',
    title: '"We trust you lah, just skip UAT"',
    channel: 'email',
    from: 'pm',
    body: "The ops managers say they're too busy for UAT this week and asked if the engineers can test it themselves. Honestly, I'd rather skip it too. We're tight on time and our QA is solid. Can we tick UAT and move on? — {pm}",
    urgency: 'normal',
    when: { minDay: 9, maxDay: 14, notReadiness: ['uat'] },
    concept: 'uat',
    skill: 'execution',
    choices: [
      {
        id: 'a',
        label: 'Let the engineers do UAT: they know the system, and it saves a week',
        cost: 0,
        grade: 'poor',
        insight:
          "UAT isn't more QA: it checks that real users can do their real jobs with the product. Engineers test what they built; users find what was never built. Skip it and ops finds the gaps on launch day.",
        outcome: {
          text: 'The engineers pass every script they wrote. Nobody notices that ops has no way to put a case on hold from the new screen.',
          effects: { quality: -5, trust: -2, rel: { pm: 2 }, flags: ['d:fake-uat'] },
        },
      },
      {
        id: 'b',
        label: 'Escalate to {sponsor} and have the ops managers told to attend',
        cost: 1,
        grade: 'okay',
        insight:
          'Executive pressure gets bodies into a room, not engaged testers. Make it easy first: fewer hours, their real workflows, their schedule. Escalate only if they still will not come.',
        outcome: {
          text: "Ops attend, arms folded. They test exactly what's on the script and not one click more.",
          effects: { readiness: ['uat'], trust: -1, rel: { pm: -4, sponsor: -2 } },
        },
      },
      {
        id: 'c',
        label: 'Ask {pm} for three ops users, two half-days, testing their real workflows',
        cost: 2,
        grade: 'best',
        insight:
          "Keep UAT small but real: a few actual end users, their real workflows, clear entry and exit criteria, and a triage for what they find. Half a day of an ops lead's time beats a week of support tickets after launch.",
        chance: {
          base: 0.55,
          rel: 'pm',
          success: {
            text: '{pm} gets you three ops leads. They find two real gaps: no way to put a case on hold, and a baffling error message. Both fixed in a day.',
            effects: { readiness: ['uat'], scope: { core: 4 }, quality: 4, rel: { pm: 3 } },
          },
          failure: {
            text: '{pm} can only free up one ops lead for an afternoon. Even so, they find the missing "on hold" status. Partial UAT, honestly labelled; you book a second round.',
            effects: { scope: { core: 3 }, quality: 2, rel: { pm: -2 } },
          },
        },
      },
    ],
    ignored: {
      text: 'UAT quietly does not happen. The launch checklist says "TBC" in yellow.',
      effects: { quality: -2, rel: { pm: -2 } },
    },
  },
  {
    id: 'd-pdpa-test-data',
    title: 'Real customer NRICs in the test database',
    channel: 'slack',
    from: 'security',
    body: 'Found something. The {ws.data} test environment has a full copy of production: names, NRIC numbers, phone numbers, about 80,000 customers. Someone copied it in to "make testing realistic". Twelve people and a vendor have access. Before anyone panics or deletes anything: how do you want to handle this? — {security}',
    urgency: 'high',
    when: { minDay: 3, maxDay: 13 },
    concept: 'pdpa',
    skill: 'risk',
    choices: [
      {
        id: 'a',
        label: 'Quietly delete it, swap in fake data, and tell nobody: no harm done',
        cost: 1,
        grade: 'poor',
        insight:
          "Deleting evidence before assessment turns a privacy incident into a cover-up. Under the PDPA the organisation must assess a suspected breach and, if it's notifiable (significant harm, or 500+ people), tell PDPC within 3 calendar days of that assessment.",
        outcome: {
          text: "Gone by midnight, along with the access logs. When {compliance} hears about it a week later, the question is no longer about the data. It's about you.",
          effects: { quality: 2, trust: -8, rel: { compliance: -10, security: -6 }, flags: ['d:pdpa-hushed'] },
        },
      },
      {
        id: 'b',
        label: 'Lock down access, bring in {compliance} to assess, and move to masked data',
        cost: 2,
        grade: 'best',
        insight:
          "Contain first (restrict access, preserve logs), then let the DPO assess whether it's notifiable; once it's assessed so, PDPC must hear within 3 calendar days. Then fix the cause: masked or synthetic test data, and no production copies without approval.",
        outcome: {
          text: 'Access locked within the hour, logs preserved. {compliance} starts the assessment with a clean timeline, exactly what a DPO needs. {ws.data} loses two days rebuilding a masked dataset.',
          effects: {
            block: { ws: 'data', days: 2, reason: 'Rebuilding test data with masking' },
            trust: 5,
            quality: 3,
            rel: { compliance: 6, security: 5 },
            skills: { risk: 1 },
          },
        },
      },
      {
        id: 'c',
        label: "Leave it for now: it's internal staging, and launch is close",
        cost: 0,
        grade: 'poor',
        insight:
          "Non-production isn't a PDPA-free zone: the duty to protect personal data covers every copy, including test environments a vendor can reach. \"It's only staging\" is how many real breaches start. Contain it and call the DPO.",
        outcome: {
          text: 'Launch prep continues. So does access by twelve people, a vendor, and one over-permissioned service account.',
          effects: { trust: -4, quality: -2, rel: { security: -8 }, flags: ['d:pdpa-ignored'] },
        },
      },
    ],
    ignored: {
      text: '{security} takes it to {compliance} and {boss} without you. It gets handled, and your absence is noted.',
      effects: {
        trust: -5,
        rel: { security: -5, compliance: -4 },
        block: { ws: 'data', days: 2, reason: 'Test data locked pending privacy review' },
      },
    },
  },

  // ─────────────── Engineering health & metrics ───────────────
  {
    id: 'd-refactor-sprint',
    title: 'The team wants a refactor sprint. Now.',
    channel: 'meeting',
    from: 'lead',
    body: 'The retro got spicy. CI is so flaky that people re-run it three times to get green, and the {ws.core} module is held together with if-statements. {lead}: "We want next week as a refactor sprint, or we are building on sand." The whole team is nodding. The launch date is not.',
    urgency: 'normal',
    when: { minDay: 4, maxDay: 11 },
    concept: 'tech-debt',
    skill: 'technical',
    choices: [
      {
        id: 'a',
        label: 'Approve the full refactor sprint: the team knows this codebase far better than you',
        cost: 0,
        grade: 'poor',
        insight:
          "A stop-the-world refactor mid-program trades a known date for an unknown benefit. Pay down the debt that's taxing today's work now, and give the rest a real, dated slot rather than a vague \"later\".",
        outcome: {
          text: 'Morale jumps. The projected launch slides, and {sponsor} asks why in a channel with 40 people in it.',
          effects: {
            morale: 6,
            quality: 8,
            trust: -6,
            block: { ws: 'core', days: 3, reason: 'Refactor sprint' },
            rel: { lead: 5, sponsor: -5 },
          },
        },
      },
      {
        id: 'b',
        label: 'Say no: features first, refactoring after launch',
        cost: 0,
        grade: 'poor',
        insight:
          "A flat no tells engineers their pain doesn't count, and flaky CI is already slowing you every day. \"After launch\" is where tech debt goes to die unless it has a date and a budget.",
        outcome: {
          text: 'Heads down. Nobody argues. CI stays flaky and the nodding stops.',
          effects: { morale: -6, quality: -3, rel: { lead: -6 }, velocity: { ws: 'core', mult: 0.9, days: 3, label: 'Flaky CI re-runs' } },
        },
      },
      {
        id: 'c',
        label: 'Spend ~20% on the debt slowing you now (flaky tests first) and date the rest',
        cost: 2,
        grade: 'best',
        insight:
          "Treat tech debt like a loan: pay down what's charging interest on today's work (flaky tests, the module you touch daily), log the rest with its cost, and agree a dated post-launch slot with the PM. Engineers need to see the plan is real.",
        outcome: {
          text: 'Quarantining and fixing 11 flaky tests takes two days. CI goes green on the first run. {pm} agrees a post-launch week for the rest, in writing.',
          effects: {
            quality: 6,
            morale: 4,
            progress: { core: -2 },
            velocity: { ws: 'core', mult: 1.15, days: 4, label: 'CI green on the first run' },
            rel: { lead: 4, pm: 2 },
            flags: ['d:debt-plan'],
          },
        },
      },
    ],
    ignored: {
      text: 'The team takes your silence as a no. Grumbling in the pantry, and CI stays flaky.',
      effects: { morale: -4, quality: -2, rel: { lead: -3 } },
    },
  },
  {
    id: 'd-velocity-league',
    title: 'Can we rank the teams by velocity?',
    channel: 'email',
    from: 'boss',
    body: "Loved the dashboard. One idea: {ws.core} did 42 story points last sprint and {ws.client} only 19. Can we put every team's velocity side by side in the SteerCo deck? A bit of healthy competition never hurt anyone. — {boss}",
    urgency: 'normal',
    when: { minDay: 5, maxDay: 12 },
    concept: 'metrics',
    skill: 'comms',
    choices: [
      {
        id: 'a',
        label: 'Suggest each team vs its own trend, plus milestones and change failure rate',
        cost: 1,
        grade: 'best',
        insight:
          'Measure flow and outcomes, not activity: milestones against plan, lead time, deploy frequency, change failure rate and time to restore (the DORA four). Compare each team with its own trend, never with other teams.',
        outcome: {
          text: '{boss} likes "change failure rate" so much it ends up in their own deck. No league table, no gaming, and {partner} never finds out how close it was.',
          effects: { trust: 4, rel: { boss: 3, partner: 3 }, skills: { comms: 1 } },
        },
      },
      {
        id: 'b',
        label: 'Build the league table for SteerCo: your boss asked for it, and it costs you nothing',
        cost: 0,
        grade: 'poor',
        insight:
          "Story points are each team's private estimating currency; comparing them across teams is comparing prices in different currencies. Once points become a target, they inflate (Goodhart's law) and the metric dies.",
        outcome: {
          text: 'Next sprint, {ws.client} delivers 47 points. Somehow nothing else changed. {partner} stops trusting your dashboards.',
          effects: { morale: -4, rel: { boss: 3, partner: -6 }, flags: ['d:points-league'] },
        },
      },
      {
        id: 'c',
        label: 'Normalise story points across teams first, so the comparison is fair',
        cost: 2,
        grade: 'okay',
        insight:
          'Normalising makes the comparison look fair while keeping the real flaw: points measure effort guesses, not value delivered. Put that effort into metrics that track outcomes instead.',
        outcome: {
          text: 'Two weeks of calibration meetings later, every team\'s points are "normalised". And quietly inflated.',
          effects: { morale: -3, energy: -4, focus: -1, rel: { lead: -3 } },
        },
      },
    ],
    ignored: {
      text: "{boss} asks an analyst to build the velocity league table anyway. {partner}'s team sees it first.",
      effects: { morale: -3, rel: { partner: -4 } },
    },
  },

  // ─────────────── Sustainable pace ───────────────
  {
    id: 'd-1am-status',
    title: 'It is 1:12am and you are still online',
    channel: 'slack',
    from: 'lead',
    body: "1:12am. You're rewriting tomorrow's status update for the fourth time, your third kopi-O has gone cold, and you've just replied to a thread from Tuesday. {lead} DMs you: \"Eh, why are you still online? Go and sleep lah. The program will still be late in the morning.\"",
    urgency: 'normal',
    when: { minDay: 3, meterBelow: { energy: 40 } },
    concept: 'self-care',
    skill: 'leadership',
    choices: [
      {
        id: 'a',
        label: "Push through: one more hour tonight and you'll be ahead tomorrow",
        cost: 1,
        grade: 'poor',
        insight:
          "Late-night \"getting ahead\" borrows from tomorrow at a terrible rate: you wake up behind and slower. If you're regularly working past midnight, fix the system (meetings, delegation, priorities), not your stamina.",
        outcome: {
          text: 'You finish at 2:30. In the morning you misread a dependency date and have to send {sponsor} a correction.',
          effects: { energy: -10, trust: -2, focus: -1 },
        },
      },
      {
        id: 'b',
        label: "Promise yourself an 11pm hard stop from tomorrow, but finish tonight's update first",
        cost: 1,
        grade: 'okay',
        insight:
          'Right idea, wrong start date. The boundary you will set "from tomorrow" is the one you broke today. Start it tonight, and make it visible: the team copies what you do, not what you say.',
        outcome: {
          text: 'You finish at 2am. The 11pm rule survives exactly one day.',
          effects: { energy: -6 },
        },
      },
      {
        id: 'c',
        label: 'Log off now and block your first hour tomorrow for the update',
        cost: 0,
        grade: 'best',
        insight:
          'Your energy is a program resource. A tired TPM makes worse calls, misses risks and models burnout for the team. Stop, sleep, and save your best hours for the work only you can do.',
        outcome: {
          text: 'Seven hours of sleep. The update takes 20 minutes in the morning and is better than all four midnight drafts.',
          effects: { energy: 12, rel: { lead: 2 } },
        },
      },
    ],
    ignored: {
      text: 'You fall asleep at the laptop around 2am. The status update has a typo in the headline.',
      effects: { energy: -6 },
    },
  },
  {
    id: 'd-team-running-hot',
    title: 'Two MCs, one LinkedIn tab, zero jokes',
    channel: 'meeting',
    from: 'lead',
    body: "Your 1:1 with {lead}: \"The team's been doing 11pm nights for two weeks. Two people are on MC, and I saw a recruiter message open on someone's screen. Standup used to be fun; now nobody even jokes. Something has to give, and I'm out of ideas.\"",
    urgency: 'high',
    when: { minDay: 6, meterBelow: { morale: 50 } },
    concept: 'team-health',
    skill: 'leadership',
    choices: [
      {
        id: 'a',
        label: "Order pizza and give a rousing \"one last push\" speech at Friday's town hall",
        cost: 1,
        grade: 'poor',
        insight:
          'Pizza treats the symptom. Sustained overtime is a planning failure, not a motivation problem: the fix is less work in progress, protected evenings, and an honest conversation about scope or date. Not a pep talk.',
        outcome: {
          text: 'The pizza is good. The speech gets polite silence. Someone\'s out-of-office says "back Monday".',
          effects: { morale: -2, budget: -1, rel: { lead: -3 } },
        },
      },
      {
        id: 'b',
        label: 'Ask {lead} who the low performers are, so you can address them directly',
        cost: 0,
        grade: 'poor',
        insight:
          'Hunting for low performers when the whole team is exhausted turns a system problem into blame. Look at load, priorities and how work arrives before you look at individuals.',
        outcome: {
          text: "{lead} stares at you for a long second. \"That's not the problem.\" Your next 1:1 is noticeably shorter.",
          effects: { morale: -5, rel: { lead: -8 } },
        },
      },
      {
        id: 'c',
        label: 'Give everyone Friday off as a thank-you, and keep the plan as it is',
        cost: 1,
        grade: 'okay',
        insight:
          'A day off is kind and helps in the short term, but if the plan still needs 11pm nights, Monday brings the same exhaustion. Fix the load, not just the recovery.',
        outcome: {
          text: 'Friday off lands well. By Wednesday the late nights are back.',
          effects: { morale: 5, velocity: { ws: 'all', mult: 0.8, days: 1, label: 'Team day off' } },
        },
      },
      {
        id: 'd',
        label: 'Cut work in progress and take a scope trade-off to {sponsor}',
        cost: 2,
        grade: 'best',
        insight:
          'Team health is a delivery metric: tired teams ship bugs. Reset the system: cap work in progress, no meetings or deploys after 6pm, and take an honest trade-off (scope, date or people) to the sponsor before the team pays for it.',
        outcome: {
          text: '{sponsor} agrees to move two nice-to-haves to a fast-follow. Evenings go quiet. By Thursday, standup has jokes again, mostly about you.',
          effects: {
            morale: 10,
            trust: -2,
            scope: { core: -8, client: -5 },
            rel: { lead: 6, sponsor: -2 },
            skills: { leadership: 1 },
          },
        },
      },
    ],
    ignored: {
      text: 'Nothing changes. On Monday a third engineer calls in sick, and {lead} stops raising it.',
      effects: { morale: -6, rel: { lead: -5 }, velocity: { ws: 'core', mult: 0.85, days: 3, label: 'Team running on fumes' } },
    },
  },

  // ─────────────── Ex–tech lead traps (builder / hybrid) ───────────────
  {
    id: 'd-tl-fix-bug',
    title: 'The bug you could fix in 20 minutes',
    channel: 'hallway',
    from: 'lead',
    body: "6pm. The team heads out for hawker dinner, except one junior engineer, on day two of a race condition in {ws.core}. You glance at the stack trace and know exactly what it is: you've fixed this bug before. {lead}, pausing at the door: \"They're close, I think. Probably.\" Your fingers twitch toward the repo.",
    urgency: 'high',
    when: { background: ['builder', 'hybrid'], minDay: 3, maxDay: 12 },
    concept: 'tl-trap',
    skill: 'leadership',
    choices: [
      {
        id: 'a',
        label: "Fix it yourself tonight: it's 20 minutes for you and two more days for them",
        cost: 2,
        grade: 'poor',
        insight:
          'Doing it yourself is fast once and costly every time after: the engineer does not learn, the team learns to wait for you, and you now own code you cannot support. Your leverage is unblocking people, not closing tickets.',
        outcome: {
          text: 'Fixed by 7:30pm, merged by 8. You feel fantastic. The engineer finds out from the commit log.',
          effects: {
            progress: { core: 3 },
            energy: -6,
            morale: -3,
            flags: ['d:hero-fix'],
            followUps: [{ event: 'd-hero-regression', inDays: 2 }],
          },
        },
      },
      {
        id: 'b',
        label: 'Pull up a chair for 30 minutes and ask questions until they spot it',
        cost: 2,
        grade: 'best',
        insight:
          "Coach, don't take over: a few good questions (\"what changes between the two threads?\") get the bug fixed and leave the engineer stronger. Your technical depth is worth most when it multiplies other people's work.",
        outcome: {
          text: "Twenty minutes in, they spot it and grin. The fix lands next morning, with a regression test you wouldn't have bothered writing. You reach the hawker centre before the satay sells out.",
          effects: { progress: { core: 2 }, morale: 5, quality: 3, rel: { lead: 4 }, skills: { leadership: 1 } },
        },
      },
      {
        id: 'c',
        label: "Leave it: you're a TPM now, and engineering problems are {lead}'s job",
        cost: 0,
        grade: 'okay',
        insight:
          "Not writing the code is right, but a two-day blocker on the critical path is your business. Ask {lead} for a time box and a plan to swarm it. You don't have to fix it to make sure it gets fixed.",
        outcome: {
          text: "Day three, still stuck. {lead} eventually pairs a senior engineer on it, and it's done by Thursday.",
          effects: { velocity: { ws: 'core', mult: 0.9, days: 2, label: 'Stuck on a race condition' } },
        },
      },
    ],
    ignored: {
      text: 'Nobody steps in. The junior engineer spends a third day on it, quietly.',
      effects: { morale: -2, velocity: { ws: 'core', mult: 0.85, days: 2, label: 'Stuck on a race condition' } },
    },
  },
  {
    id: 'd-hero-regression',
    title: 'About that fix you pushed the other night',
    channel: 'slack',
    from: 'lead',
    body: "Two things about your fix. One: it causes duplicate writes under load, which the test you didn't have time to write would have caught. Two: the engineer who'd spent two days on that bug asked me if you think they can't do the job. Also, on-call wants to know who owns \"the TPM's code\". — {lead}",
    urgency: 'high',
    weight: 0,
    concept: 'tl-trap',
    skill: 'leadership',
    choices: [
      {
        id: 'a',
        label: "Fix the regression yourself tonight: it's your code, so it's your mess",
        cost: 2,
        grade: 'poor',
        insight:
          "Doubling down makes you the owner of code you can't support, on a program you're meant to be running. Hand it back properly: the team owns the fix and the code, and you repair the trust you dented.",
        outcome: {
          text: 'Fixed by midnight. Tomorrow: nine meetings, zero energy. The engineer stays silent in standup.',
          effects: { energy: -10, morale: -3, quality: 2 },
        },
      },
      {
        id: 'b',
        label: 'Point out your fix unblocked the critical path, and the duplicates are a rare edge case',
        cost: 0,
        grade: 'poor',
        insight:
          'Defending a shortcut by its speed ignores what it cost: a bug, a bruised engineer, and code nobody owns. Speed borrowed from quality gets repaid with interest.',
        outcome: {
          text: '{lead} types, deletes, types again, and finally replies "ok". Lowercase. No full stop.',
          effects: { morale: -4, quality: -4, rel: { lead: -8 } },
        },
      },
      {
        id: 'c',
        label: 'Hand the fix back to the team, and apologise to the engineer in person',
        cost: 1,
        grade: 'best',
        insight:
          'Own the mistake, then hand back ownership: the team fixes and owns the code, and you apologise in person to the engineer you bypassed. The TPM lesson: unblocking people beats doing their work, every time.',
        outcome: {
          text: "The engineer fixes it properly, test included. Your apology lands better than expected: \"Honestly, I'd have done the same as a tech lead,\" they admit.",
          effects: { morale: 4, quality: 4, rel: { lead: 5 }, clearFlags: ['d:hero-fix'] },
        },
      },
    ],
    ignored: {
      text: 'Nobody picks it up. The duplicates keep coming, and the code stays "the TPM\'s code".',
      effects: { quality: -5, morale: -3, rel: { lead: -4 } },
    },
  },
  {
    id: 'd-tl-db-deadlock',
    title: 'Invite: "Datastore decision, round 3 (final)"',
    channel: 'calendar',
    from: 'lead',
    body: "Day three of the datastore debate for {ws.data}: relational vs document store. Two camps, forty Slack messages, no decision. {lead}'s invite note: \"You've built this before. Can you just pick one and write the design doc? Everyone will follow you.\" You do have an opinion. A strong one.",
    urgency: 'normal',
    when: { background: ['builder', 'hybrid'], minDay: 2, maxDay: 9 },
    concept: 'tl-trap',
    skill: 'technical',
    choices: [
      {
        id: 'a',
        label: 'Pick the one you used at your last job, and write the design doc this weekend',
        cost: 2,
        grade: 'poor',
        insight:
          "You'd be making a decision you won't live with, and the team would own your doc but not the reasoning. Your job is to make sure a good decision gets made on time, by the people who'll run it in production.",
        outcome: {
          text: 'Your doc is excellent. The losing camp reads it as "the TPM overruled us" and picks holes in every review.',
          effects: { progress: { data: 3 }, energy: -8, morale: -4, rel: { lead: 2 }, flags: ['d:tpm-decided'] },
        },
      },
      {
        id: 'b',
        label: 'Decline the invite: engineers should own their own architecture debates',
        cost: 0,
        grade: 'okay',
        insight:
          "Ownership is right, but an unbounded debate is a schedule risk. A TPM doesn't make the technical call; they make sure the call gets made, with a deadline and a named decider.",
        outcome: {
          text: 'Day five. Still two camps. {ws.data} is quietly slipping.',
          effects: { velocity: { ws: 'data', mult: 0.8, days: 2, label: 'Architecture debate' } },
        },
      },
      {
        id: 'c',
        label: 'Time-box it: agree criteria, {lead} decides by Thursday, log the why',
        cost: 2,
        grade: 'best',
        insight:
          'Unstick decisions by fixing the process, not taking the decision: agree criteria (access patterns, scale, team skills, ops cost), a time box and one decider, usually the tech lead, and record it in a decision log. Offer your experience as input, not a verdict.',
        outcome: {
          text: "With the criteria on one page, the debate takes 40 minutes. {lead} makes the call, the doc credits both camps' points, and nobody sulks.",
          effects: {
            progress: { data: 2 },
            morale: 4,
            rel: { lead: 5 },
            velocity: { ws: 'data', mult: 1.1, days: 2, label: 'Decision made, team aligned' },
            skills: { leadership: 1 },
          },
        },
      },
    ],
    ignored: {
      text: 'The debate rolls into a second week. Both camps start building prototypes.',
      effects: { morale: -2, velocity: { ws: 'data', mult: 0.8, days: 3, label: 'Architecture debate' } },
    },
  },
  {
    id: 'd-boss-who-runs',
    title: 'Who is running the program this week?',
    channel: 'meeting',
    from: 'boss',
    body: "Weekly 1:1. {boss} scrolls through the repo history, then closes the laptop. \"Your commits are good. That's the problem. While you were coding, two dependencies slipped and nobody told {sponsor}. So: who's running {program} this week?\"",
    urgency: 'normal',
    when: { flags: ['sys:coded'], background: ['builder', 'hybrid'] },
    concept: 'tl-trap',
    skill: 'leadership',
    choices: [
      {
        id: 'a',
        label: 'Own it: hand the code back, and put those hours into dependencies and the sponsor',
        cost: 1,
        grade: 'best',
        insight:
          'Use your engineering depth to ask sharp questions, spot integration risk and earn credibility, not to close tickets. Make the shift visible: hand work back explicitly and spend your hours where only a TPM adds value.',
        outcome: {
          text: 'You hand two tickets back at standup. That afternoon you catch a slipped dependency before it bites, and {boss} notices.',
          effects: { trust: 4, rel: { boss: 6 }, revealRisks: 1, skills: { leadership: 1 } },
        },
      },
      {
        id: 'b',
        label: 'Explain that the team needed help, and coding is how you lead by example',
        cost: 0,
        grade: 'poor',
        insight:
          '"Leading by example" in code sets the example that the TPM is a spare engineer. Your scarcest resource is attention: every hour in the IDE is an hour nobody is managing dependencies, risks and stakeholders.',
        outcome: {
          text: "{boss} nods slowly. \"Then who's doing your job?\" You don't have a great answer.",
          effects: { trust: -4, rel: { boss: -6 } },
        },
      },
      {
        id: 'c',
        label: 'Promise to only code at night, so it never eats into your TPM hours',
        cost: 0,
        grade: 'poor',
        insight:
          "Moving the coding to midnight doesn't fix the role confusion; it adds burnout. The team still routes around you, and you arrive tired at the meetings where you matter most.",
        outcome: {
          text: '{boss} raises an eyebrow. Over the next week, your Slack replies get later and shorter.',
          effects: { energy: -10, rel: { boss: -3 } },
        },
      },
    ],
    ignored: {
      text: 'You skip the 1:1. {boss} writes "role clarity" in your performance notes, underlined.',
      effects: { trust: -3, rel: { boss: -5 } },
    },
  },
]
