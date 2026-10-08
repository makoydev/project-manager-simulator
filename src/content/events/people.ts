import type { EventDef } from '../../game/types'

/**
 * People & communication events — stakeholders, influence, status, meetings, team health.
 * Generic: they play in every scenario, so they only use role/workstream tokens.
 *
 * Chains (weight-0 events reachable only via followUps):
 *   p-kopi-machine-feature → p-referral-bill              a hallway "yes" returns as unplanned scope
 *   p-partner-no-date      → p-partner-slip               an assumed date becomes a real slip
 *   p-board-in-ten / p-paint-it-green → p-watermelon-pops green-washed status bursts
 *   p-quiet-junior         → p-junior-catch               supporting a struggling junior pays off
 * Flag payoff: `p:keeps-decision-log` (good decision hygiene) unlocks a cheap answer in p-reopened-decision.
 */
export const PEOPLE_EVENTS: EventDef[] = [
  // ───────────────────────────── The role ─────────────────────────────
  {
    id: 'p-first-week',
    title: "First 1:1: \"So, what's your plan?\"",
    channel: 'meeting',
    from: 'boss',
    body: "Welcome to {company}! Kopi first, then business. {program} is already mid-flight and the team is heads-down, so nobody will hand you a to-do list. What are you spending your first few days on? {sponsor} will ask me if you've settled in.",
    urgency: 'high',
    when: { maxDay: 2 },
    concept: 'tpm-role',
    skill: 'leadership',
    choices: [
      {
        id: 'a',
        label: 'Dive into the codebase and open PRs so the engineers see you can still hang',
        cost: 2,
        grade: 'poor',
        insight: "Engineers' respect comes from a TPM who removes blockers, not one who reviews their diffs. In week one your job is the whole system: people, goals, dependencies and risks. Read the architecture doc, not the pull requests.",
        outcome: {
          text: "You learn a lot about the retry logic in {ws.core}. You learn nothing about why {partner}'s team hasn't replied to anyone in a week.",
          effects: { quality: 2, energy: -5, rel: { lead: 2, boss: -4 } },
        },
      },
      {
        id: 'b',
        label: 'Write the full project charter and management plan before meeting anyone',
        cost: 2,
        grade: 'poor',
        insight: "A plan written before you've listened describes the program you imagine. On a mid-flight program, start with conversations; the documents come after you know who decides what and where the real problems are.",
        outcome: {
          text: 'Your 14-page plan is beautifully formatted. {lead} points out that three of its assumptions changed last month.',
          effects: { energy: -6, trust: -2, rel: { boss: -3, lead: -3 } },
        },
      },
      {
        id: 'c',
        label: 'Listening tour: a 1:1 with every stakeholder, then map risks and the critical path',
        cost: 2,
        grade: 'best',
        insight: "A TPM owns the program's outcome, not its code or its paperwork. Start with a listening tour: who decides, who's worried, what's on the critical path, what nobody owns. Real risks surface in conversations long before they reach the ticket tracker.",
        outcome: {
          text: 'A dozen kopis later you have a stakeholder map, five problems nobody owns and a rough critical path. {boss} looks quietly relieved.',
          effects: { trust: 3, energy: -6, rel: { boss: 5, pm: 3, lead: 3, partner: 3 }, revealRisks: 1, skills: { stakeholder: 1 } },
        },
      },
    ],
    ignored: {
      text: "You spend the week reacting to whatever lands in your inbox. {boss} describes you to {sponsor} as 'busy, not yet in charge'.",
      effects: { trust: -2, rel: { boss: -4 } },
    },
  },

  // ───────────────────────────── Scope creep (chain A) ─────────────────────────────
  {
    id: 'p-kopi-machine-feature',
    title: 'A "tiny" ask at the kopi machine',
    channel: 'hallway',
    from: 'sponsor',
    body: 'Eh {player}, while the kopi brews — Marketing wants a referral reward in {product} for launch. Just one button, they said. Can squeeze in, right? I already told them it sounds easy.',
    urgency: 'normal',
    when: { minDay: 3, maxDay: 11 },
    concept: 'scope-creep',
    skill: 'stakeholder',
    choices: [
      {
        id: 'a',
        label: "Say you'll size it with {lead} and come back tomorrow with options",
        cost: 2,
        grade: 'best',
        insight: "Never say yes or no to scope without data. Size it, then offer real trade-offs (add it and drop something, or ship it as a fast-follow) and let the sponsor choose. That's change control without the bureaucracy, and your sponsor keeps face with Marketing.",
        outcome: {
          text: '{lead} sizes it at four days: fraud rules, T&Cs, attribution events. Offered a swap or a fast-follow two weeks after launch, {sponsor} picks the fast-follow. You log the decision and why.',
          effects: { trust: 4, rel: { sponsor: 3, lead: 5, pm: 3 }, flags: ['p:keeps-decision-log'], skills: { stakeholder: 1 } },
        },
      },
      {
        id: 'b',
        label: "Say yes on the spot — it's one button, and {sponsor} controls the budget",
        cost: 0,
        grade: 'poor',
        insight: "A hallway yes bypasses change control. 'One button' usually hides new APIs, fraud checks and legal copy, and the team hears about it second-hand. Acknowledge the ask warmly, then size it before anyone commits.",
        outcome: {
          text: "{sponsor} beams and is already texting Marketing. On the walk back to your desk, the words 'referral fraud' float into your head.",
          effects: {
            trust: 3,
            rel: { sponsor: 5 },
            scope: { core: 10, client: 6 },
            flags: ['p:hallway-yes'],
            followUps: [{ event: 'p-referral-bill', inDays: 2 }],
          },
        },
      },
      {
        id: 'c',
        label: 'Explain scope is frozen and ask them to raise a formal change request first',
        cost: 1,
        grade: 'okay',
        insight: "Protecting scope is right; leading with a form is not. Your sponsor hears 'no' and 'paperwork'. Say 'yes, and here's what it costs', let the decision-maker own the trade-off, then write it down.",
        outcome: {
          text: '{sponsor} blinks. "A form? For one button?" They fill it in anyway. You suspect this will come up at SteerCo.',
          effects: { trust: -3, rel: { sponsor: -6 } },
        },
      },
    ],
    ignored: {
      text: "{sponsor} takes your silence as a yes and tells Marketing it's in.",
      effects: {
        trust: -2,
        scope: { core: 10, client: 6 },
        flags: ['p:hallway-yes'],
        followUps: [{ event: 'p-referral-bill', inDays: 2 }],
      },
    },
  },
  {
    id: 'p-referral-bill',
    title: 'Who agreed to referral rewards??',
    channel: 'slack',
    from: 'lead',
    body: "{player}, Marketing's launch email draft says '{product}, now with referral rewards!' The 'one button' needs fraud rules, new T&Cs, attribution events in {ws.data} and an API change. The team found out from a mailing list. Not a great vibe here.",
    urgency: 'high',
    weight: 0,
    concept: 'change-mgmt',
    skill: 'leadership',
    choices: [
      {
        id: 'a',
        label: "Ask the team to absorb it — a couple of late nights and it's done",
        cost: 0,
        grade: 'poor',
        insight: "Absorbing unplanned scope with overtime hides the cost of the original mistake and taxes the people who didn't make it. Heroics feel free and are always paid back in quality and morale.",
        outcome: {
          text: 'The team ships the button at 1am. Standup is very quiet. {lead} has stopped making eye contact.',
          effects: { morale: -8, quality: -4, energy: -4, rel: { lead: -6 }, progress: { core: 2 } },
        },
      },
      {
        id: 'b',
        label: 'Own the mistake with the team, then take the real cost back to {sponsor}',
        cost: 2,
        grade: 'best',
        insight: "When you've made a bad call, the cheapest moment to correct it is now. Own it in front of the team, then run change control properly: true cost, options, a decision. Trust grows when people watch you fix your own mistakes.",
        outcome: {
          text: "You tell the team plainly you shouldn't have said yes in a hallway. {sponsor} grimaces but moves referrals to a fast-follow. {lead}: \"Thanks for not hiding it.\"",
          effects: {
            morale: 4,
            trust: -2,
            rel: { lead: 6, sponsor: -3 },
            scope: { core: -8, client: -5 },
            clearFlags: ['p:hallway-yes'],
            skills: { leadership: 1 },
          },
        },
      },
      {
        id: 'c',
        label: "Quietly ask {lead} for the thinnest version that still counts as 'referral'",
        cost: 2,
        grade: 'okay',
        insight: "A thinner slice is a good instinct, but doing it quietly leaves the sponsor's expectations wrong. Thin the scope AND reset the expectation, or an unannounced 'referral lite' surprises Marketing on launch day.",
        outcome: {
          text: "{lead} sketches referral codes with no rewards engine. It halves the work. Marketing's email still promises 'rewards'.",
          effects: { scope: { core: -5, client: -3 }, morale: -2, trust: -2, rel: { lead: 2 } },
        },
      },
    ],
    ignored: {
      text: 'The team quietly absorbs it. Two engineers cancel weekend plans; one starts updating their CV.',
      effects: { morale: -8, quality: -3, rel: { lead: -5 } },
    },
  },

  // ───────────────────────────── Ex–tech lead temptation ─────────────────────────────
  {
    id: 'p-design-deadlock',
    title: 'Queue vs REST: "let the TPM decide"',
    channel: 'meeting',
    from: 'lead',
    body: "Two of my seniors have argued event queue vs. plain REST for {ws.core} for three days. Both now say 'let {player} decide, they were a tech lead'. Honestly, I'm too close to it. You've built this before. Just pick one?",
    urgency: 'normal',
    when: { background: ['builder', 'hybrid'], minDay: 2, maxDay: 10 },
    concept: 'tl-trap',
    skill: 'leadership',
    choices: [
      {
        id: 'a',
        label: "Pick the event queue — you've shipped three of these and you're probably right",
        cost: 1,
        grade: 'poor',
        insight: 'You may well be right, and it is still the wrong move. Once you make the call you own the architecture, {lead} loses authority with their team, and every future deadlock lands on you. Make sure the right owner decides, quickly.',
        outcome: {
          text: "The debate ends. So does {lead}'s standing with the seniors: every design question now arrives in your DMs.",
          effects: { progress: { core: 3 }, morale: -3, rel: { lead: -6 }, flags: ['p:made-tech-call'] },
        },
      },
      {
        id: 'b',
        label: 'Time-box it: options on one page by Thursday; {lead} decides and you log it',
        cost: 2,
        grade: 'best',
        insight: 'Facilitate, don\'t decide. Agree criteria (latency, ops load, reversibility), put both options on one page, and give the call to the accountable tech lead with a deadline. Log it. People can disagree and commit to a decision they saw made fairly.',
        outcome: {
          text: 'Thursday: {lead} picks REST now, with an outbox to add events later. Both seniors feel heard. The decision log gets its first proper entry.',
          effects: { morale: 3, progress: { core: 2 }, rel: { lead: 6 }, flags: ['p:keeps-decision-log'], skills: { leadership: 1 } },
        },
      },
      {
        id: 'c',
        label: "Give them space — strong engineers converge if you don't force it",
        cost: 0,
        grade: 'poor',
        insight: "Open-ended debate isn't respect, it's a stalled critical path. Two smart people optimising for different things won't converge without an owner, criteria and a deadline. Supply the process, not the answer.",
        outcome: {
          text: 'Day four of the debate. A third engineer joins with a GraphQL proposal.',
          effects: { block: { ws: 'core', days: 1, reason: 'Architecture debate still unresolved' }, morale: -3 },
        },
      },
    ],
    ignored: {
      text: "The debate rolls on until {lead} picks one out of exhaustion. The senior who 'lost' goes quiet in design reviews.",
      effects: { block: { ws: 'core', days: 1, reason: 'Architecture debate still unresolved' }, morale: -4 },
    },
  },

  // ───────────────────────────── Decision log (flag payoff) ─────────────────────────────
  {
    id: 'p-reopened-decision',
    title: 'Re: Re: Re: admin dashboard in v1?',
    channel: 'email',
    from: 'pm',
    body: 'Hi {player}, sorry to raise this again, but should we put the admin dashboard back into v1 after all? Ops keep asking me about it. Can we get everyone in a room this week to revisit? Third time, I know.',
    urgency: 'normal',
    when: { minDay: 5 },
    concept: 'decision-log',
    skill: 'comms',
    choices: [
      {
        id: 'a',
        label: "Book the room — if a stakeholder is still uneasy, it isn't really decided",
        cost: 2,
        grade: 'poor',
        insight: 'Relitigating a settled decision without new information burns days and teaches everyone that decisions are optional. Reopen only on new facts: a changed constraint, new data, or a risk nobody saw.',
        outcome: {
          text: 'Ninety minutes, same arguments, same outcome. Afterwards {lead} asks, very politely, if you could stop scheduling these.',
          effects: { focus: -1, energy: -4, morale: -3, rel: { lead: -4, pm: 2 } },
        },
      },
      {
        id: 'b',
        label: 'Write it up: context, options, who decided, why, and what would reopen it',
        cost: 2,
        grade: 'best',
        insight: "A decision log turns 'I remember it differently' into a link. Record context, options, owner and rationale, plus what would justify reopening. Then a revisit is about new facts, not about who's most persistent.",
        outcome: {
          text: 'You write it up and share it. {pm} reads it twice: "Ah, right, Ops get CSV exports in v1." They forward it to Ops themselves.',
          effects: { trust: 2, rel: { pm: 4, lead: 3 }, flags: ['p:keeps-decision-log'], skills: { comms: 1 } },
        },
      },
      {
        id: 'c',
        label: 'Ask {sponsor} to settle it once and for all, so the team can stop re-arguing it',
        cost: 1,
        grade: 'poor',
        insight: "Pulling the sponsor into a decision that's already made signals you can't hold a line. Escalate when peers genuinely can't agree on something material, not to referee a rerun.",
        outcome: {
          text: "{sponsor} replies 'Didn't we decide this?' and cc's {boss} on a note about 'decision discipline'.",
          effects: { trust: -3, rel: { sponsor: -3, pm: -3 } },
        },
      },
      {
        id: 'd',
        label: 'Send {pm} the decision-log entry and ask what has changed since',
        cost: 0,
        grade: 'best',
        requires: { flags: ['p:keeps-decision-log'] },
        lockedHint: "Needs a decision log you've been keeping",
        insight: "This is the decision log paying off: the record already exists, so a reopen costs one link, not one meeting. Asking 'what's new?' respects the stakeholder and keeps the bar for reopening where it belongs.",
        outcome: {
          text: '{pm} reads the entry: owner, rationale, reopen triggers. "Okay, nothing\'s changed. I\'ll tell Ops it\'s v1.1." That took four minutes.',
          effects: { trust: 3, rel: { pm: 3 } },
        },
      },
    ],
    ignored: {
      text: '{pm} books the room anyway. The meeting happens without you, and the admin dashboard creeps back into v1.',
      effects: { scope: { client: 6 }, trust: -2 },
    },
  },

  // ───────────────────────────── Dependencies (chain B) ─────────────────────────────
  {
    id: 'p-partner-no-date',
    title: '"We\'ll get to it soon"',
    channel: 'slack',
    from: 'partner',
    body: "Hi {player}, about our part of {ws.client}: honestly my team is underwater with our own quarterly goals. We'll get to your changes soon. I just can't commit to a date right now, sorry.",
    urgency: 'normal',
    when: { minDay: 2, maxDay: 10 },
    concept: 'negotiation',
    skill: 'stakeholder',
    choices: [
      {
        id: 'a',
        label: 'Escalate to {boss} today — a critical dependency without a date is a red flag',
        cost: 2,
        grade: 'poor',
        insight: 'Escalating before trying peer-to-peer turns a partner into an opponent. First understand their constraints and look for a trade. Escalate later, with options, and tell them before you go over their head.',
        outcome: {
          text: '{boss} leans on their director and you get a date within the hour. You also get a partner who now replies in two days instead of two hours.',
          effects: {
            rel: { partner: -10, boss: -2 },
            velocity: { ws: 'client', mult: 1.1, days: 2, label: 'Partner pushed into it' },
            flags: ['p:went-over-partner'],
          },
        },
      },
      {
        id: 'b',
        label: "Ask what they're juggling, and offer something they need in return",
        cost: 2,
        grade: 'best',
        insight: 'Negotiation starts with their interests, not your deadline. Find what the other team needs (alert tuning, a reviewer, a shared library) and trade for it. A commitment someone chose to make survives far better than one squeezed out of them.',
        chance: {
          base: 0.6,
          rel: 'partner',
          success: {
            text: "Their on-call is drowning in alert noise. You offer two days of {sre}'s help tuning it; {partner} commits to a date and puts your work in their sprint.",
            effects: {
              rel: { partner: 8, sre: -3 },
              velocity: { ws: 'client', mult: 1.2, days: 3, label: 'Partner committed to a date' },
              flags: ['p:partner-deal'],
            },
          },
          failure: {
            text: '{partner} likes the offer, but their VP has frozen priorities. Still no date, but now you know why, and they owe you one.',
            effects: { rel: { partner: 5 }, flags: ['p:partner-owes'] },
          },
        },
      },
      {
        id: 'c',
        label: "Pencil in 'next week' on the plan and move on — no need to make it awkward",
        cost: 0,
        grade: 'poor',
        insight: "'Soon' isn't a date, and an assumption isn't a commitment. Undated dependencies on your critical path need an owner, a date and a check-in, or they will surprise you at the worst possible moment.",
        outcome: {
          text: "You pencil in next Wednesday. It feels reasonable. Nobody tells {partner} it's been pencilled in.",
          effects: { flags: ['p:assumed-date'], followUps: [{ event: 'p-partner-slip', inDays: 3 }] },
        },
      },
    ],
    ignored: {
      text: "No reply from you, no date from them. Your plan quietly assumes 'next week'.",
      effects: { rel: { partner: -2 }, flags: ['p:assumed-date'], followUps: [{ event: 'p-partner-slip', inDays: 3 }] },
    },
  },
  {
    id: 'p-partner-slip',
    title: '"Oh, we meant next sprint"',
    channel: 'slack',
    from: 'partner',
    body: "Hey {player}, quick update: our part of {ws.client} won't start until next sprint. I didn't realise you were planning around this week? Nobody agreed a date with me, so I'm a bit surprised by the panic.",
    urgency: 'high',
    weight: 0,
    concept: 'escalation',
    skill: 'stakeholder',
    choices: [
      {
        id: 'a',
        label: 'Propose escalating together: one note with impact, options and a recommendation',
        cost: 2,
        grade: 'best',
        insight: 'A clean escalation is a joint request for a decision, not a complaint: impact, options and a recommendation, sent together or at least after telling your peer. Leaders say yes faster to two teams asking together than to one pointing a finger.',
        chance: {
          base: 0.55,
          rel: 'partner',
          success: {
            text: "{partner} co-signs: impact on both teams' goals, three options, one recommendation. Their director approves a two-engineer swap within a day.",
            effects: {
              trust: 2,
              rel: { partner: 4, boss: 3 },
              block: { ws: 'client', days: 1, reason: 'Partner team re-planning their sprint' },
              clearFlags: ['p:assumed-date'],
            },
          },
          failure: {
            text: "{partner} won't co-sign, so you send it yourself after telling them. Their director picks your option B. {partner} is cool with you for a while.",
            effects: {
              rel: { partner: -3, boss: 2 },
              block: { ws: 'client', days: 2, reason: 'Partner team re-planning their sprint' },
              clearFlags: ['p:assumed-date'],
            },
          },
        },
      },
      {
        id: 'b',
        label: 'Email their director, cc {boss}, about the missed commitment',
        cost: 1,
        grade: 'poor',
        insight: "There was no commitment to miss: you assumed one. A grievance email makes this a fight about blame, and you'll lose it. Escalation should be a request for a decision, framed by impact and options.",
        outcome: {
          text: 'Their director replies with the thread where nobody agreed a date. Awkward. {partner} stops answering your messages.',
          effects: {
            trust: -3,
            rel: { partner: -8, boss: -3 },
            block: { ws: 'client', days: 2, reason: 'Partner team not starting until next sprint' },
          },
        },
      },
      {
        id: 'c',
        label: 'Re-plan around the slip on your side and keep it within the team',
        cost: 2,
        grade: 'okay',
        insight: "Re-planning is the right reflex; keeping it quiet isn't. If the slip touches the critical path, the decision-makers need to know now, with options, not at the next status report.",
        outcome: {
          text: 'You shuffle tasks so {ws.client} work starts later. The launch date quietly absorbs the hit, and nobody above you knows yet.',
          effects: { rel: { partner: 2 }, block: { ws: 'client', days: 3, reason: "Waiting for the partner team's next sprint" } },
        },
      },
    ],
    ignored: {
      text: 'The slip lands on your plan without anyone deciding anything about it.',
      effects: { trust: -3, block: { ws: 'client', days: 3, reason: 'Partner team not starting until next sprint' } },
    },
  },

  // ───────────────────────────── Exec status (chain C head) ─────────────────────────────
  {
    id: 'p-board-in-ten',
    title: 'Board in 10 min: "quick status pls"',
    channel: 'whatsapp',
    from: 'sponsor',
    body: "{player} going into the board in 10 min. Need a quick status on {program}. Short pls, I'm on my phone.",
    urgency: 'critical',
    expires: 1,
    when: { minDay: 4 },
    concept: 'status-report',
    skill: 'comms',
    choices: [
      {
        id: 'a',
        label: "Paste in this week's full status report so nothing important gets left out",
        cost: 0,
        grade: 'poor',
        insight: 'Execs read on phones, between meetings. A wall of text makes them do your synthesis. Bottom line up front: status, why, what you need. The detail can live behind a link.',
        outcome: {
          text: '{sponsor} scrolls your Gantt screenshot in the lift, gives up halfway through the RAID table and wings it.',
          effects: { trust: -3, rel: { sponsor: -4 } },
        },
      },
      {
        id: 'b',
        label: 'Reply "All on track!" and sort out the amber bits after the board',
        cost: 0,
        grade: 'poor',
        insight: 'Rounding amber up to green for an audience is how watermelons start: green outside, red inside. Boards remember what they were told. Give the honest one-liner plus the plan; execs can handle amber, not surprises.',
        outcome: {
          text: '"Perfect, thanks!" {sponsor} walks in with a thumbs-up. You feel fine about it for almost an hour.',
          effects: {
            trust: 2,
            rel: { sponsor: 2 },
            flags: ['p:told-board-green'],
            followUps: [{ event: 'p-watermelon-pops', inDays: 2 }],
          },
        },
      },
      {
        id: 'c',
        label: 'Send three lines: RAG and why, the top risk, the one decision you need',
        cost: 1,
        grade: 'best',
        insight: "Bottom line up front. An exec status fits on a phone screen: overall RAG with a one-line reason, the biggest risk and what you're doing about it, and any decision you need. Keep it ready before anyone asks and this takes ninety seconds.",
        outcome: {
          text: '{sponsor} reads it in the lift, quotes your risk line almost word for word, and asks the board for the decision you flagged.',
          effects: { trust: 6, rel: { sponsor: 5 }, skills: { comms: 1 } },
        },
      },
      {
        id: 'd',
        label: 'Ask for 15 minutes to pull the latest numbers together properly',
        cost: 2,
        grade: 'poor',
        insight: 'A late perfect answer is a wrong answer. Keep a current three-line summary ready at all times; when an exec asks, the value is in the timing, not the precision.',
        outcome: {
          text: "The board starts without your update. {sponsor} quotes last week's dates, which stopped being true on Tuesday.",
          effects: { trust: -4, rel: { sponsor: -3 } },
        },
      },
    ],
    ignored: {
      text: "No reply. {sponsor} tells the board 'the TPM is checking'. That lands about as well as you'd expect.",
      effects: { trust: -6, rel: { sponsor: -6 } },
    },
  },

  // ───────────────────────────── Meetings & ways of working ─────────────────────────────
  {
    id: 'p-thirty-one-invites',
    title: '31 recurring invites. Welcome aboard!',
    channel: 'calendar',
    from: 'boss',
    body: "Hi {player}! I've forwarded you every recurring {program} meeting so you have full context. 31 in total, I think? A few might overlap a little. Shout if anything looks odd!",
    urgency: 'normal',
    when: { maxDay: 4 },
    concept: 'meetings',
    skill: 'execution',
    choices: [
      {
        id: 'a',
        label: 'Accept all 31 for now — a new TPM should be seen everywhere',
        cost: 0,
        grade: 'poor',
        insight: "A calendar full of other people's meetings leaves no time for the work only you can do. Being everywhere isn't the same as being useful: attend to decide, unblock or learn, and read the notes for the rest.",
        outcome: {
          text: 'Wednesday: nine back-to-back meetings, two of them about the same thing. You eat lunch on mute.',
          effects: { energy: -10, focus: -2, flags: ['p:calendar-full'] },
        },
      },
      {
        id: 'b',
        label: 'Decline the lot and ask everyone for written async updates instead',
        cost: 0,
        grade: 'okay',
        insight: 'Async-first is healthy, but a blanket decline also skips the forums where decisions get made. Audit first: keep what you drive or decide in, delegate the rest, and kill meetings with no purpose.',
        outcome: {
          text: "Your calendar is spotless. On Thursday you learn the launch date was 'discussed' in a meeting you declined.",
          effects: { energy: 3, trust: -3, rel: { boss: -3, pm: -3 } },
        },
      },
      {
        id: 'c',
        label: 'Audit them: keep those where you decide or unblock; delegate or drop the rest',
        cost: 2,
        grade: 'best',
        insight: "Treat your calendar as the program's scarcest resource. For each meeting ask: what's it for, and what's my role? Keep decision forums, send a delegate where you'd only listen, merge duplicates, and propose ending the ones nobody owns.",
        outcome: {
          text: '31 becomes 9. You merge two status meetings and end one nobody could explain. Two engineers thank you; they were stuck in it too.',
          effects: { energy: 4, morale: 3, focus: 1, rel: { boss: 3, lead: 3 }, skills: { execution: 1 } },
        },
      },
    ],
    ignored: {
      text: "The invites sit there, tentatively accepted. Your week fills up before you've even looked at it.",
      effects: { energy: -8, focus: -1 },
    },
  },
  {
    id: 'p-seattle-9pm',
    title: 'Integration sync at 9pm. Twice a week.',
    channel: 'slack',
    from: 'lead',
    body: "Seattle's integration team booked our weekly sync for 9pm SG time, twice a week. It's 6am for them, so they say they're suffering too. My team has dinners, kids, night classes. Can you sort this out?",
    urgency: 'normal',
    when: { minDay: 2, maxDay: 12 },
    concept: 'cross-timezone',
    skill: 'leadership',
    choices: [
      {
        id: 'a',
        label: 'Keep 9pm SG — Seattle is the bigger team and they set it up first',
        cost: 0,
        grade: 'poor',
        insight: "Defaulting to the bigger or more senior site's comfort is how remote teams become second-class. Unfair time zones quietly drain morale and retention. Rotate the pain and cut the live time you need.",
        outcome: {
          text: 'Two engineers start joining from the MRT with cameras off. One misses an API change discussed at 9:40pm.',
          effects: { morale: -6, quality: -3, rel: { lead: -4 } },
        },
      },
      {
        id: 'b',
        label: 'Rotate slots (9pm SG, then 8am SG / 5pm Seattle) and move status updates async',
        cost: 2,
        grade: 'best',
        insight: 'Share time-zone pain fairly and shrink the overlap you need. Rotate slots, keep live time for decisions and debugging, and move status into a written async update. Record sessions for whoever is asleep.',
        outcome: {
          text: "Seattle agrees to rotate, and you swap one sync for a written update thread. {lead}'s team gets two evenings back a week.",
          effects: { morale: 4, energy: -3, rel: { lead: 5 }, skills: { leadership: 1 } },
        },
      },
      {
        id: 'c',
        label: 'Take the 9pm calls yourself and brief the team the next morning',
        cost: 2,
        grade: 'okay',
        insight: 'Shielding the team is kind, but it makes you a human relay: lossy, slow and exhausting. Engineers need to talk to engineers. Spend your energy redesigning the communication, not carrying it.',
        outcome: {
          text: "You take the calls and the notes. By week two you're paraphrasing API details you only half understand.",
          effects: { energy: -8, morale: 2, quality: -2 },
        },
      },
    ],
    ignored: {
      text: 'The 9pm sync stays. SG attendance drops to whoever loses rock-paper-scissors.',
      effects: { morale: -4, rel: { lead: -3 } },
    },
  },
  {
    id: 'p-done-means-done',
    title: 'Sprint review: "that\'s not done"',
    channel: 'meeting',
    from: 'pm',
    body: "Sprint review just got tense. {lead}: 'Onboarding flow is done: merged and tested on staging.' Me: 'It has no analytics, the error copy is placeholder and Ops hasn't seen it. That's not done.' {player}, can you settle this?",
    urgency: 'normal',
    when: { minDay: 4, maxDay: 13 },
    concept: 'agile-ceremonies',
    skill: 'execution',
    choices: [
      {
        id: 'a',
        label: 'Facilitate a written Definition of Done they both sign, starting this sprint',
        cost: 2,
        grade: 'best',
        insight: "Arguments about 'done' are a missing agreement, not a personality clash. Facilitate a short Definition of Done (code, tests, analytics, copy, ops sign-off) that both sign, add it to the sprint template, and apply it from now on.",
        outcome: {
          text: "Twenty minutes, one whiteboard, seven checkboxes. Two 'done' stories honestly move back to in-progress. The next review is boring, in a good way.",
          effects: { quality: 5, progress: { core: -2 }, rel: { pm: 4, lead: 4 }, skills: { execution: 1 } },
        },
      },
      {
        id: 'b',
        label: 'Back {lead}: merged and tested is done, the rest become new tickets',
        cost: 0,
        grade: 'poor',
        insight: "If 'done' means 'merged', unfinished work hides in new tickets and your burndown lies. Done should mean releasable to an agreed standard, or you discover a backlog of almost-done at launch.",
        outcome: {
          text: "The burndown looks fantastic. Twelve 'follow-up' tickets appear. UAT finds the placeholder copy in week three.",
          effects: { quality: -4, rel: { pm: -6, lead: 2 }, flags: ['p:hidden-undone'] },
        },
      },
      {
        id: 'c',
        label: "Back {pm}: the product owner decides what done means, so that's settled",
        cost: 0,
        grade: 'okay',
        insight: 'The PM owns acceptance criteria for each story, but the Definition of Done is a team-wide quality bar. Ruling for one side settles today\'s argument and guarantees the next one.',
        outcome: {
          text: '{pm} wins this round. {lead} mutters about moving goalposts, and the next review is frosty.',
          effects: { quality: 2, morale: -2, rel: { pm: 3, lead: -5 } },
        },
      },
    ],
    ignored: {
      text: 'The argument moves to a chat thread with 63 replies. Both sides screenshot it for their managers.',
      effects: { morale: -3, rel: { pm: -3, lead: -3 } },
    },
  },
  {
    id: 'p-scrum-master-too',
    title: '"Can you just be the scrum master too?"',
    channel: 'hallway',
    from: 'boss',
    body: "Bad news: our scrum master resigned, last day was Friday, and the backfill will take a couple of months. Can you just run standups, planning and retros as well? It's only a few meetings and you're there anyway, right?",
    urgency: 'normal',
    when: { minDay: 3, maxDay: 12 },
    concept: 'tpm-vs-roles',
    skill: 'leadership',
    choices: [
      {
        id: 'a',
        label: 'Agree, and run every ceremony yourself until the backfill arrives',
        cost: 2,
        grade: 'poor',
        insight: 'A TPM who becomes the full-time scrum master loses program altitude: dependencies, risks and stakeholders get the leftover hours. Ceremonies matter, but they belong to the team. Cover briefly, then hand them back.',
        outcome: {
          text: 'You now spend two hours a day facilitating. The cross-team dependency review quietly stops happening.',
          effects: { energy: -8, rel: { boss: 3 }, velocity: { ws: 'client', mult: 0.9, days: 3, label: 'Dependency reviews lapsed' } },
        },
      },
      {
        id: 'b',
        label: "Decline: that's not the TPM role, and the team should run its own ceremonies",
        cost: 0,
        grade: 'okay',
        insight: "Knowing your role is right; leaving a gap isn't. A team that just lost its scrum master needs a bridge. Offer a time-boxed interim and a plan to hand the ceremonies back.",
        outcome: {
          text: "{boss} says 'noted' in the tone that means 'noted'. Retro gets skipped for two sprints.",
          effects: { energy: 2, morale: -3, rel: { boss: -5 } },
        },
      },
      {
        id: 'c',
        label: 'Ask {boss} for budget to bring in a contract scrum master next week',
        cost: 1,
        grade: 'okay',
        insight: 'A contractor fills the gap but costs money and a week of ramp-up in your crunch. The cheaper answer is often coaching the team to rotate facilitation, which also builds skills that outlast the backfill.',
        outcome: {
          text: '{boss} approves it reluctantly. The contractor arrives on Thursday and spends a week learning who everyone is.',
          effects: { budget: -12, energy: -2, rel: { boss: -2 } },
        },
      },
      {
        id: 'd',
        label: 'Cover for two weeks while coaching engineers to rotate facilitation',
        cost: 2,
        grade: 'best',
        insight: "Scrum master and TPM are different jobs: one optimises a team's way of working, the other a multi-team outcome. Bridge the gap briefly, coach the team to rotate facilitation, and keep your hours for cross-team work. Tell {boss} what you're trading.",
        outcome: {
          text: 'Two engineers volunteer to rotate. Standups get shorter. You keep running the dependency review, and {boss} notes the plan in your 1:1 doc.',
          effects: { morale: 3, energy: -3, rel: { boss: 4, lead: 3 }, skills: { leadership: 1 } },
        },
      },
    ],
    ignored: {
      text: "Nobody runs retro. Standups drift to 40 minutes. {boss} assumes you're on it.",
      effects: { morale: -3, rel: { boss: -3 } },
    },
  },

  // ───────────────────────────── Team health (chain D: a best choice pays off) ─────────────────────────────
  {
    id: 'p-quiet-junior',
    title: '"No blockers", eight standups in a row',
    channel: 'slack',
    from: 'lead',
    body: "Small thing. Have you noticed our junior on {ws.data} has said 'no blockers' at standup eight days running? Same PR open for six days, on their first big feature. I'm drowning in reviews and can't check in properly.",
    urgency: 'normal',
    when: { minDay: 3, maxDay: 12, meterBelow: { morale: 80 } },
    concept: 'team-health',
    skill: 'leadership',
    choices: [
      {
        id: 'a',
        label: "Ask them at standup, kindly but in front of everyone, what's holding up the PR",
        cost: 0,
        grade: 'poor',
        insight: "Public questions about someone's stuck work feel like an audit, especially for a junior and anywhere losing face matters. Check in privately, ask open questions, and make it safe to say 'I'm stuck'.",
        outcome: {
          text: '"No blockers, just finishing up." The junior goes red. The PR stays open.',
          effects: { morale: -4, flags: ['p:junior-struggling'] },
        },
      },
      {
        id: 'b',
        label: 'Take them for kopi, then set up an hour a day of pairing with a senior',
        cost: 1,
        grade: 'best',
        insight: "Silence at standup is a team-health signal. A private, curious 1:1 ('what's the hardest part?') usually surfaces the real blocker. Pair them with a senior for a few days: the work moves, and you grow an engineer instead of losing one.",
        outcome: {
          text: 'Over kopi at the hawker centre it comes out: a flaky test harness, and a fear of looking slow. Two days of pairing later, the PR is merged.',
          effects: {
            morale: 4,
            energy: -3,
            progress: { data: 2 },
            rel: { lead: 4 },
            flags: ['p:junior-supported'],
            followUps: [{ event: 'p-junior-catch', inDays: 3 }],
          },
        },
      },
      {
        id: 'c',
        label: 'Hand the ticket to a senior so the date is protected',
        cost: 1,
        grade: 'okay',
        insight: 'Reassigning protects this sprint and costs you the next ten: the junior learns to hide problems and your seniors get busier. Pair before you reassign; take work away only if pairing fails.',
        outcome: {
          text: "A senior finishes it in a day. The junior gets 'documentation tasks' and goes quiet in team chat.",
          effects: { morale: -3, progress: { data: 3 } },
        },
      },
    ],
    ignored: {
      text: 'The PR stays open another week. Then the junior is on MC for two days.',
      effects: { morale: -4, block: { ws: 'data', days: 1, reason: 'Stuck PR on the data workstream' } },
    },
  },
  {
    id: 'p-junior-catch',
    title: 'Sev 3 raised by the junior: migration bug',
    channel: 'incident',
    from: 'lead',
    body: 'INC (Sev 3, staging): the migration script silently drops rows with a null postcode. Raised by our junior on {ws.data}, spotted while pairing. In production it would have hit about 2% of customers. Fix is in review.',
    urgency: 'normal',
    weight: 0,
    concept: 'team-health',
    skill: 'leadership',
    choices: [
      {
        id: 'a',
        label: 'Mention in the update that the team caught a data bug, no names needed',
        cost: 1,
        grade: 'okay',
        insight: 'Better than silence, but anonymous credit is easy to miss and does little for the person who earned it. Name people (with their consent) and the specific impact: that is what makes recognition land.',
        outcome: {
          text: 'Good news travels. Nobody in particular gets the credit.',
          effects: { morale: 2, quality: 3, trust: 1 },
        },
      },
      {
        id: 'b',
        label: 'Let the fix ship quietly — no need to make a fuss or alarm {sponsor}',
        cost: 0,
        grade: 'poor',
        insight: 'Quiet fixes waste the two things a near-miss gives you: a chance to recognise good behaviour and a lesson for everyone else. Share near-misses openly and thank whoever caught them.',
        outcome: {
          text: 'The fix ships. The junior wonders whether anyone noticed.',
          effects: { quality: 3, morale: -2 },
        },
      },
      {
        id: 'c',
        label: 'Thank them by name in the weekly update: the catch and why it mattered',
        cost: 1,
        grade: 'best',
        insight: 'Specific, public recognition (what they did and why it mattered) is the cheapest morale lever you have, and it tells the whole team that raising problems is valued. Recognise the behaviour you want more of.',
        outcome: {
          text: "The junior's catch leads your update. {sponsor} replies-all with a thumbs-up. At the next standup the junior asks two questions. Unprompted.",
          effects: { morale: 6, quality: 4, trust: 2, rel: { lead: 4 } },
        },
      },
    ],
    ignored: {
      text: "The fix ships unremarked. The junior goes back to saying 'no blockers'.",
      effects: { quality: 3, morale: -1 },
    },
  },

  // ───────────────────────────── RAG honesty (chain C) ─────────────────────────────
  {
    id: 'p-paint-it-green',
    title: '"Can we show green? The board is watching"',
    channel: 'slack',
    from: 'sponsor',
    body: "Saw your draft status: amber? {program} is on the board's watch list this quarter, and amber makes everyone nervous. Can we show green and fix things quietly? You said yourself it's recoverable.",
    urgency: 'high',
    when: { behindSchedule: true, minDay: 4 },
    concept: 'rag-status',
    skill: 'comms',
    choices: [
      {
        id: 'a',
        label: 'Change it to green — it IS recoverable, and the sponsor asked',
        cost: 0,
        grade: 'poor',
        insight: 'Status colours describe reality, not intent. Green outside, red inside (a watermelon) buys a week of calm and then a credibility crisis. Keep amber, and give the sponsor what they actually need: a credible path back to green.',
        outcome: {
          text: 'Green it is. {sponsor} sends a thank-you emoji. The schedule does not change colour.',
          effects: {
            trust: 2,
            rel: { sponsor: 4 },
            flags: ['p:painted-green'],
            followUps: [{ event: 'p-watermelon-pops', inDays: 2 }],
          },
        },
      },
      {
        id: 'b',
        label: "Keep amber and quietly cc the board secretary so it's on record",
        cost: 0,
        grade: 'poor',
        insight: 'Going around your sponsor to protect yourself turns a disagreement into a betrayal. Hold the line on the facts with them directly; cover-yourself emails cost more trust than they save.',
        outcome: {
          text: "It's on record. So is {sponsor}'s reply-all, which is short and very cold.",
          effects: { trust: -2, rel: { sponsor: -10, boss: -3 } },
        },
      },
      {
        id: 'c',
        label: 'Keep amber, plus a path to green: what it takes, by when, decisions needed',
        cost: 2,
        grade: 'best',
        insight: "Amber with a recovery plan is a good-news story: you spotted it early and you're on it. Give the RAG, the reason, the path back to green and the decision you need. Execs fear surprises far more than amber.",
        outcome: {
          text: "{sponsor} reads your path-to-green, calls it 'very board-friendly', and approves the scope trade-off you proposed.",
          effects: { trust: 5, rel: { sponsor: 3 }, skills: { comms: 1 } },
        },
      },
    ],
    ignored: {
      text: '{sponsor} edits your status to green before it goes out.',
      effects: { trust: -2, flags: ['p:painted-green'], followUps: [{ event: 'p-watermelon-pops', inDays: 2 }] },
    },
  },
  {
    id: 'p-watermelon-pops',
    title: '"Green last week. Now this?"',
    channel: 'email',
    from: 'boss',
    body: "{player}, the board was told {program} was on track. This morning's SteerCo pack says otherwise, and {sponsor} took the question in front of everyone. They're not happy and, frankly, neither am I. My office, 3pm. Bring the real picture.",
    urgency: 'high',
    weight: 0,
    concept: 'rag-status',
    skill: 'comms',
    choices: [
      {
        id: 'a',
        label: "Bring a 20-slide recovery deck to show you're fully on top of it",
        cost: 2,
        grade: 'okay',
        insight: 'A big deck shows effort, not honesty. After a status surprise, leaders first want to know whether they can believe you. Answer that in one sentence, then show a short, real plan.',
        outcome: {
          text: 'Slide 4 is where {boss} stops you: "Did you know it was amber when you said green?"',
          effects: { trust: -6, energy: -5, rel: { boss: -2 } },
        },
      },
      {
        id: 'b',
        label: "Come clean: what you knew and when, the real plan, how you'll report from now on",
        cost: 2,
        grade: 'best',
        insight: 'When a watermelon bursts, the way back is radical transparency: own it, show the real picture and recovery plan, and commit to surfacing bad news early. Trust is rebuilt by your next three reports, not by the apology.',
        outcome: {
          text: 'An uncomfortable hour. {boss} ends it with: "Okay. Next time I hear amber from you first." {sponsor} asks for twice-weekly updates for now.',
          effects: {
            trust: -4,
            rel: { boss: 3, sponsor: -2 },
            clearFlags: ['p:painted-green', 'p:told-board-green'],
            skills: { comms: 1 },
          },
        },
      },
      {
        id: 'c',
        label: 'Explain that it genuinely was green when you reported it, and things just moved fast',
        cost: 0,
        grade: 'poor',
        insight: 'Rewriting history rarely works: execs compare your report with the burndown and the chat threads. If you reported green knowing it was amber, say so and fix the habit, or you lose the benefit of the doubt for good.',
        outcome: {
          text: "{boss} pulls up that week's burndown. It was not green. The meeting gets shorter and much worse.",
          effects: { trust: -10, rel: { boss: -8, sponsor: -6 } },
        },
      },
    ],
    ignored: {
      text: 'You skip the 3pm. {boss} goes to see {sponsor} without you.',
      effects: { trust: -12, rel: { boss: -10, sponsor: -6 } },
    },
  },

  // ───────────────────────────── Stakeholders & influence ─────────────────────────────
  {
    id: 'p-not-consulted',
    title: 'Found out from a town hall slide',
    channel: 'email',
    from: 'compliance',
    body: 'Dear {player}, I learned from a town hall slide that {product} launches on {target}. Nobody consulted my team on the customer data flows. Until we have reviewed them, I cannot sign off. Earlier involvement would have been appreciated.',
    urgency: 'high',
    when: { minDay: 4, maxDay: 13 },
    concept: 'raci',
    skill: 'stakeholder',
    choices: [
      {
        id: 'a',
        label: 'Point out the launch date has been in the shared program doc since week 1',
        cost: 0,
        grade: 'poor',
        insight: "Technically informed isn't consulted. 'It was in the doc' wins the argument and loses the sign-off. Anyone with veto power must be Consulted early, in a conversation, not left to find it in a wiki.",
        outcome: {
          text: '{compliance} replies with one line: "Noted. Our review queue is currently three weeks."',
          effects: { rel: { compliance: -8 }, block: { ws: 'review', days: 3, reason: 'Compliance sign-off withheld' } },
        },
      },
      {
        id: 'b',
        label: 'Ask {sponsor} to waive the compliance sign-off for this launch',
        cost: 1,
        grade: 'poor',
        insight: "Escalating around a control owner to skip their review is how programs end up in audit findings. Compliance sign-off isn't a stakeholder preference; treat it as a launch gate and plan for it.",
        outcome: {
          text: '{sponsor} declines, politely, and forwards your email to {compliance}, who now reads everything you send with great care.',
          effects: { trust: -4, rel: { sponsor: -3, compliance: -10 } },
        },
      },
      {
        id: 'c',
        label: 'Apologise, ask what they need to review, and request an early slot',
        cost: 2,
        grade: 'best',
        insight: 'A RACI gap surfaces late as a surprise veto. Own the miss without blaming anyone, ask what they need to say yes, and fix the matrix: who is Responsible, Accountable, Consulted and Informed for each decision. Consulted means before, not after.',
        chance: {
          base: 0.55,
          rel: 'compliance',
          success: {
            text: '{compliance} appreciates the directness and finds a review slot on Tuesday. You add them as Consulted on the RACI and invite them to the weekly risk review.',
            effects: { trust: 2, rel: { compliance: 6 }, progress: { review: 4 }, flags: ['p:raci-fixed'] },
          },
          failure: {
            text: "{compliance} accepts the apology, but the queue is full: the earliest slot is next Friday. At least they're in the loop now.",
            effects: {
              rel: { compliance: 3 },
              block: { ws: 'review', days: 2, reason: 'Waiting for a compliance review slot' },
              flags: ['p:raci-fixed'],
            },
          },
        },
      },
    ],
    ignored: {
      text: 'No reply from you. {compliance} puts a formal hold on the launch checklist.',
      effects: { trust: -2, rel: { compliance: -6 }, block: { ws: 'review', days: 2, reason: 'Compliance hold on the launch' } },
    },
  },
  {
    id: 'p-silent-approver',
    title: 'The approver who never opens your emails',
    channel: 'slack',
    from: 'boss',
    body: 'Friendly tip: {security} hasn\'t opened one of your status emails in two weeks. On my last program they were silent until Day 13, then blocked go-live over a pen-test finding. High power, low interest. You know what that means.',
    urgency: 'low',
    when: { minDay: 2, maxDay: 9, relBelow: { security: 55 } },
    concept: 'stakeholder-map',
    skill: 'stakeholder',
    choices: [
      {
        id: 'a',
        label: 'Add {security} to every status thread and the daily standup notes',
        cost: 1,
        grade: 'poor',
        insight: "More email to someone who isn't reading isn't engagement, it's noise. High-power, low-interest stakeholders need to be kept satisfied: a short, targeted touchpoint about what they care about, not everything you send everyone.",
        outcome: {
          text: '{security} now gets fourteen emails a week from you. They set up a filter.',
          effects: { rel: { security: -3 } },
        },
      },
      {
        id: 'b',
        label: "Leave them for now — they won't be on the critical path until the final review",
        cost: 0,
        grade: 'poor',
        insight: 'Approvers who stay absent until the end are on the critical path; you just cannot see it yet. Engage high-power stakeholders before you need them. Late surprises from approvers cost days, not hours.',
        outcome: {
          text: 'You focus on louder stakeholders. Somewhere, a pen-test finding waits patiently.',
          effects: { rel: { boss: -2 }, flags: ['p:security-ignored'] },
        },
      },
      {
        id: 'c',
        label: "Book 20 minutes: ask what they'd need to see to approve, agree checkpoints",
        cost: 1,
        grade: 'best',
        insight: "Map stakeholders by power and interest. High power, low interest: keep them satisfied by learning their acceptance criteria early and agreeing a few checkpoints. 'What would you need to see to say yes?' is the most useful question in stakeholder management.",
        chance: {
          base: 0.6,
          rel: 'security',
          success: {
            text: '{security} gives you exactly 20 minutes and a list: threat model, pen-test window, secrets handling. You agree two checkpoints. No Day 13 surprise for you.',
            effects: { rel: { security: 6 }, progress: { review: 3 }, revealRisks: 1, flags: ['p:security-mapped'] },
          },
          failure: {
            text: '{security} reschedules twice, then sends the list by email. Useful, but the first checkpoint slips a week.',
            effects: { rel: { security: 3 }, revealRisks: 1 },
          },
        },
      },
    ],
    ignored: {
      text: 'You never get round to it. {security} remains a mystery, for now.',
      effects: { rel: { security: -2 } },
    },
  },
  {
    id: 'p-platform-queue',
    title: '"You\'re #14 in our queue"',
    channel: 'slack',
    from: 'sre',
    body: "Hey {player}, saw your request for a dedicated perf-test environment. The platform backlog is full until end of month and you're #14. If it's urgent, my director sets the priorities.",
    urgency: 'normal',
    when: { minDay: 2, maxDay: 11 },
    concept: 'influence',
    skill: 'stakeholder',
    choices: [
      {
        id: 'a',
        label: 'Buy {sre} a kopi: learn their goals and reshape the ask to help them too',
        cost: 1,
        grade: 'best',
        insight: "Influence without authority starts with their goals, not yours. Learn what the other team is measured on and shape your ask to help: their standard template, a reusable fix, a metric they care about. Relationships built before you need them make asks cheap.",
        chance: {
          base: 0.55,
          rel: 'sre',
          success: {
            text: 'Over kopi you learn their goal is fewer one-off environments. You offer to use their standard template, which helps their numbers. {sre} spins it up in two days.',
            effects: { rel: { sre: 6 }, velocity: { ws: 'platform', mult: 1.2, days: 3, label: 'Platform team pitching in' } },
          },
          failure: {
            text: "{sre} is friendly but genuinely stretched. You get a shared environment two days a week. Not ideal, but it's a start.",
            effects: { rel: { sre: 4 }, velocity: { ws: 'platform', mult: 1.1, days: 2, label: 'Shared perf environment' } },
          },
        },
      },
      {
        id: 'b',
        label: 'Escalate to their director to get bumped up the queue',
        cost: 1,
        grade: 'poor',
        insight: "Going to someone's boss on your first ask burns the relationship you'll need for the next ten, and teaches the platform team you're a requester, not a partner. Understand their goals first; escalate only when that fails.",
        outcome: {
          text: "You're bumped to #3. {sre} gets told off for 'not supporting programs'. Your next three tickets mysteriously need more information.",
          effects: { rel: { sre: -10 }, velocity: { ws: 'platform', mult: 1.1, days: 2, label: 'Escalated up the queue' } },
        },
      },
      {
        id: 'c',
        label: "Have {lead}'s engineers quietly spin up their own environment off to the side",
        cost: 0,
        grade: 'poor',
        insight: "Shadow infrastructure solves today's queue and creates tomorrow's security finding and on-call mystery. Work with the platform team's standards, not around them.",
        outcome: {
          text: "It's up by Thursday. It also has a public storage bucket and no monitoring, which {security} finds the following week.",
          effects: { progress: { platform: 3 }, quality: -5, rel: { sre: -5, security: -3 } },
        },
      },
    ],
    ignored: {
      text: "Your ticket stays at #14. By Friday it's #13.",
      effects: { velocity: { ws: 'platform', mult: 0.9, days: 2, label: 'No perf environment yet' } },
    },
  },

  // ───────────────────────────── Iron triangle ─────────────────────────────
  {
    id: 'p-budget-squeeze',
    title: 'Same scope, same date, 20% less money',
    channel: 'email',
    from: 'sponsor',
    body: "Hi {player}, Finance has asked every program to cut contractor spend by 20% this quarter. I'm sure you'll find efficiencies. Same scope and date, of course: the launch has already been announced.",
    urgency: 'high',
    when: { minDay: 5, maxDay: 12 },
    concept: 'iron-triangle',
    skill: 'stakeholder',
    choices: [
      {
        id: 'a',
        label: "Push back: the program can't absorb a cut this close to launch",
        cost: 1,
        grade: 'okay',
        insight: "You might be right, but 'can't' leaves your sponsor nothing to take back to Finance. Show the cost of the cut in scope or days; often the numbers do the refusing for you.",
        outcome: {
          text: '{sponsor} sighs. "Then help me explain that to Finance." You have nothing written down to give them.',
          effects: { trust: -3, rel: { sponsor: -4 } },
        },
      },
      {
        id: 'b',
        label: 'Cost the options: what drops, or how many days slip, per contractor cut',
        cost: 2,
        grade: 'best',
        insight: "Turn a constraint into trade-offs the decision-maker can choose between: 'cut 20% and we drop X, slip N days, or accept more risk on Y'. Scope, time, cost and quality are linked; leaders rarely want all four fixed, they want to choose consciously.",
        chance: {
          base: 0.6,
          rel: 'sponsor',
          success: {
            text: 'Faced with three costed options, {sponsor} drops two nice-to-have reports and persuades Finance to exempt the core team.',
            effects: {
              trust: 4,
              rel: { sponsor: 3 },
              scope: { data: -10 },
              velocity: { ws: 'data', mult: 0.9, days: 3, label: 'One contractor released' },
            },
          },
          failure: {
            text: "{sponsor} can't win an exemption, but chooses with eyes open: one reporting feature goes, and so does one contractor.",
            effects: { trust: 2, scope: { data: -10 }, velocity: { ws: 'all', mult: 0.9, days: 3, label: 'One contractor released' } },
          },
        },
      },
      {
        id: 'c',
        label: 'Accept it and trust the team to find efficiencies — you always do somehow',
        cost: 0,
        grade: 'poor',
        insight: 'Scope, time and resources form the iron triangle: squeeze one and another moves, whether you say so or not. Accepting a cut silently means quality pays: fewer tests, tired people, a bumpy launch.',
        outcome: {
          text: 'You release two contractors and change nothing else. Test coverage is the first thing to quietly shrink.',
          effects: { quality: -5, velocity: { ws: 'all', mult: 0.85, days: 4, label: 'Two contractors released' } },
        },
      },
    ],
    ignored: {
      text: "Finance applies the cut across the board. Two contractors' access ends on Friday.",
      effects: { trust: -2, velocity: { ws: 'all', mult: 0.85, days: 3, label: 'Contractors released' } },
    },
  },

  // ───────────────────────────── Relationship capital ─────────────────────────────
  {
    id: 'p-promo-packet',
    title: '"Could you read my promo packet?"',
    channel: 'whatsapp',
    from: 'lead',
    body: "Hey {player}, small favour. My promotion packet to Staff is due Friday. Could you read the 'cross-team impact' section and tell me honestly if it's convincing? You've seen my work across teams more than most people.",
    urgency: 'low',
    when: { minDay: 3, relAtLeast: { lead: 45 } },
    concept: 'influence',
    skill: 'leadership',
    choices: [
      {
        id: 'a',
        label: 'Skim it and reply "Looks great, all the best!" — launch comes first',
        cost: 0,
        grade: 'poor',
        insight: 'Vague praise on a promotion case is a missed chance to help, and a small breach of trust: they asked for honesty. Specific feedback tied to evidence is the real gift.',
        outcome: {
          text: "\"Thanks!\" The packet goes in as is. The committee asks for 'clearer evidence of cross-team impact'.",
          effects: { morale: -1, rel: { lead: 1 } },
        },
      },
      {
        id: 'b',
        label: "Gently point them to their manager — promo feedback really is their manager's job",
        cost: 0,
        grade: 'okay',
        insight: 'Their manager does own the case, but your view of cross-team impact is exactly the evidence it lacks. Redirecting is defensible; adding your perspective is far more valuable.',
        outcome: {
          text: "{lead} says 'sure, no worries'. They don't ask you for anything for a while.",
          effects: { rel: { lead: -4 } },
        },
      },
      {
        id: 'c',
        label: 'Spend an hour: concrete feedback, plus a peer note on the impact you saw',
        cost: 2,
        grade: 'best',
        insight: "Investing in your partners' growth is influence, not charity. Concrete feedback and a peer statement grounded in evidence ('their API contract unblocked two teams') help them, and they will remember who did.",
        outcome: {
          text: 'You suggest leading with the API contract that unblocked two teams. {lead} rewrites the section that night. "Okay, this one I\'d promote," they joke.',
          effects: { morale: 3, energy: -4, rel: { lead: 10 } },
        },
      },
    ],
    ignored: {
      text: 'You meant to reply. Friday comes and goes.',
      effects: { rel: { lead: -5 } },
    },
  },

  // ───────────────────────────── Capacity reality ─────────────────────────────
  {
    id: 'p-festive-leave',
    title: 'Deepavali leave meets the launch plan',
    channel: 'slack',
    from: 'lead',
    body: 'Paiseh, should have flagged this earlier. Four engineers have had leave approved for months around the Deepavali long weekend, which lands in our final stretch, and another has reservist ICT that week. Two are flying home to family. The plan assumed full capacity.',
    urgency: 'high',
    when: { minDay: 3, maxDay: 10 },
    concept: 'iron-triangle',
    skill: 'execution',
    choices: [
      {
        id: 'a',
        label: 'Ask them to postpone — a launch only happens once, holidays come every year',
        cost: 1,
        grade: 'poor',
        insight: "Cancelling long-approved family leave is a morale grenade, and resentful people aren't productive anyway. Leave is a known constraint: plan around it, and treat 'the plan assumed full capacity' as a planning bug to fix.",
        outcome: {
          text: 'Two agree, grudgingly. One goes to HR. After two cancelled flights, standups are very quiet.',
          effects: { morale: -10, progress: { core: 2 }, rel: { lead: -6 } },
        },
      },
      {
        id: 'b',
        label: 'Quietly plan Saturday sessions for the rest of the team to cover the gap',
        cost: 0,
        grade: 'poor',
        insight: "Making the people who didn't take leave cover for those who did breeds resentment on both sides. Overtime is an emergency tool, not a planning assumption.",
        outcome: {
          text: "The team spots the 'optional' Saturday sessions in the plan. The group chat goes silent.",
          effects: {
            morale: -6,
            energy: -3,
            velocity: { ws: 'core', mult: 1.1, days: 2, label: 'Weekend sessions' },
            flags: ['p:weekend-plan'],
          },
        },
      },
      {
        id: 'c',
        label: 'Ask {sponsor} straight away to move the launch back a week',
        cost: 1,
        grade: 'okay',
        insight: "Telling the sponsor early is right, but jumping straight to 'move the date' skips the work. Re-plan first: what can move earlier, what can be cut? Then bring real options, of which a date move is only one.",
        outcome: {
          text: "{sponsor} asks what else you considered. You don't have much. The date stays, with a frown.",
          effects: { trust: -2, rel: { sponsor: -3 } },
        },
      },
      {
        id: 'd',
        label: 'Re-plan for real capacity: pull critical work forward and flag the impact',
        cost: 2,
        grade: 'best',
        insight: 'Capacity is a fact, not a negotiation. Rebuild the plan with leave and holidays in it, pull critical-path work forward, and show the sponsor the trade-off early. Public holidays are on the calendar years ahead; your plan should be too.',
        outcome: {
          text: 'You move the riskiest {ws.core} tasks before the long weekend and flag a one-day risk to {sponsor}, who appreciates hearing it two weeks early.',
          effects: {
            trust: 3,
            morale: 4,
            rel: { lead: 4 },
            velocity: { ws: 'core', mult: 1.1, days: 3, label: 'Critical work pulled forward' },
          },
        },
      },
    ],
    ignored: {
      text: 'The long weekend arrives, and so does the gap. Nobody re-planned.',
      effects: { trust: -2, velocity: { ws: 'all', mult: 0.8, days: 2, label: 'Holiday capacity gap' } },
    },
  },

  // ───────────────────────────── Escalations landing on you ─────────────────────────────
  {
    id: 'p-sunday-whatsapp',
    title: 'Sunday, 10:52pm: "Call me."',
    channel: 'whatsapp',
    from: 'sponsor',
    body: "{player}, {partner}'s VP just messaged me that your team is 'blocking them' and 'not responding'. I'm at my niece's birthday makan. What is going on? Call me.",
    urgency: 'high',
    weight: 3,
    when: { minDay: 6, maxDay: 6 },
    concept: 'escalation',
    skill: 'comms',
    choices: [
      {
        id: 'a',
        label: "Call right away and defend your team — they've done everything asked of them",
        cost: 1,
        grade: 'poor',
        insight: 'Defending before you have the facts turns an escalation into an argument. Acknowledge, get the facts, then come back with a short written account and next steps. Calm and precise beats fast and loud.',
        outcome: {
          text: '{sponsor} gets forty minutes of you defending from memory. Two of your facts turn out to be from last week. They end the call less reassured than when it started.',
          effects: { energy: -8, trust: -3, rel: { sponsor: -2 } },
        },
      },
      {
        id: 'b',
        label: "Mute it till morning — it's Sunday night and boundaries matter",
        cost: 0,
        grade: 'okay',
        insight: "Boundaries matter, and most weekend messages can wait. But an exec escalation that says 'call me' needs a thirty-second acknowledgement: silence lets the other side's story set overnight. Acknowledge, set a time, then go back to your weekend.",
        outcome: {
          text: "By the time you reply at 9am, {sponsor} has already 'aligned' with the other VP. Without you.",
          effects: { energy: 3, trust: -4, rel: { sponsor: -4 } },
        },
      },
      {
        id: 'c',
        label: "Reply now: 'Got it, facts by 10am.' Then check with {lead} and {partner}",
        cost: 1,
        grade: 'best',
        insight: "When an escalation lands on you: acknowledge fast, don't argue, commit to a time. Then get both sides' facts, talk to the other team directly, and send a short note: what happened, what you're doing, what you need. Facts beat adrenaline.",
        outcome: {
          text: 'By 9:30 you know it was a misrouted ticket. You and {partner} fix it together, and {sponsor} gets a five-line summary before their 10am.',
          effects: { trust: 4, energy: -3, rel: { sponsor: 3, partner: 4 }, skills: { comms: 1 } },
        },
      },
    ],
    ignored: {
      text: "No reply. {sponsor} assumes the worst and forwards the VP's message to {boss}.",
      effects: { trust: -6, rel: { sponsor: -5, boss: -3 } },
    },
  },

  // ───────────────────────────── PMP temptation ─────────────────────────────
  {
    id: 'p-first-exec-update',
    title: 'Your first exec update goes out Friday',
    channel: 'email',
    from: 'boss',
    body: 'Your first weekly update to {sponsor} goes out Friday. Heads-up: {sponsor} reads updates on the MRT to one-north, on a phone, squeezed between two other programs. What format are you thinking?',
    urgency: 'normal',
    when: { background: ['planner', 'hybrid'], maxDay: 5 },
    concept: 'status-report',
    skill: 'comms',
    choices: [
      {
        id: 'a',
        label: 'One screen: RAG and why, milestones, top 3 risks with owners, decisions needed',
        cost: 2,
        grade: 'best',
        insight: 'A good exec update fits on one screen: overall RAG with a one-line reason, progress against milestones, top risks with owners and dates, and the decisions you need. Same format every week so trends jump out. Detail lives in a linked appendix.',
        outcome: {
          text: '{sponsor} replies from the MRT: "Clear. Approved item 2." {boss} forwards your format to two other TPMs.',
          effects: { trust: 5, rel: { sponsor: 4, boss: 4 }, skills: { comms: 1 } },
        },
      },
      {
        id: 'b',
        label: 'A full PMBOK-style report: EVM table (CPI, SPI), Gantt, RAID log, change register',
        cost: 2,
        grade: 'poor',
        insight: "Earned value and full registers have their place, but not on an exec's MRT commute. Executives want the conclusion, the risk and the decision needed. Keep the detail one click away for whoever wants it.",
        outcome: {
          text: 'It runs to 11 pages. {sponsor} replies "thanks, very thorough" to page one. The SPI of 0.87 on page 6 goes unread.',
          effects: { energy: -6, trust: -2, rel: { sponsor: -3 } },
        },
      },
      {
        id: 'c',
        label: 'A rundown of everything each workstream did this week, so nobody feels left out',
        cost: 1,
        grade: 'poor',
        insight: "An activity list answers 'were people busy?', which no exec asked. Status is about outcomes: are we on track, what's at risk, what do you need from me? Report progress against milestones, not effort.",
        outcome: {
          text: '{sponsor} learns that 47 tickets were closed. They do not learn whether the launch is on track.',
          effects: { trust: -2, rel: { sponsor: -2 } },
        },
      },
    ],
    ignored: {
      text: 'Friday arrives and you send a rushed brain-dump at 7pm.',
      effects: { trust: -3 },
    },
  },
]
