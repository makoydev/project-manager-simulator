import type { ScenarioDef } from '../../game/types'

/**
 * Alpenrose Private Bank: "The Alpenrose Account" (difficulty 3).
 *
 * The mirror image of Lion City: here the player IS the vendor. They are the new delivery lead at the
 * Singapore delivery centre of Kestrel & Quay, a fictional global consultancy, building v2 of a
 * fictional Zurich private bank's relationship-manager (RM) tablet app. Themes: delivering against a
 * SOW someone else signed (assumptions, change requests, margin), a client-owned dependency on the
 * critical path, client-identifying data (CID) rules for offshore teams, release windows and freezes,
 * a 6–7 hour time gap, and a date that cannot move: the bank's annual RM conference.
 *
 * Tuning at neutral play (start morale 55 / quality 60 → velocity factor 0.95):
 *   platform Day 11 · core Day 13 · data Day 15 · review Day 16 · client Day 17 → projected Day 17.
 *   Critical chain: client ← core ← platform (the bank's own API team gates the vendor's backend).
 *   Recovery levers: surface the broken SOW assumptions on Day 1 (the bank reprioritises its APIs),
 *   contract-first mocks with the platform team (relaxes core's dependency), phasing the messaging
 *   pilot at SteerCo (≈ Day 15 on its own), and keeping morale/quality up. Ignoring the API slip
 *   pushes the projection to Day 19.
 */
export const ALPENROSE: ScenarioDef = {
  id: 'alpenrose',
  name: 'The Alpenrose Account',
  company: 'Kestrel & Quay',
  companyBlurb:
    'A 60,000-person global consultancy with a slide for everything. Its Singapore delivery centre in Tanjong Pagar builds banking software for clients from Zurich to Sydney, mostly between 3pm and midnight.',
  program: 'Project Gipfeli',
  product: 'RM Cockpit 2.0',
  tagline: "Zurich wants it free. Your director wants margin. The conference won't wait.",
  difficulty: 3,
  setting: 'Tanjong Pagar delivery centre, Singapore · client in Zurich, 7 hours behind',
  brief: [
    "Welcome to {company}, {player}. As of this morning you're delivery lead on the Alpenrose account: a discreet Zurich private bank, small by revenue, huge by logo, and watched by everyone up to the Asia CEO. You inherit a team of seven, a fixed-price statement of work (SOW), and Rupert, the account director in Zurich who sold it with great confidence.",
    "{program} (the client named it after the Swiss croissant, at a breakfast meeting) is v2 of {product}, the tablet app 600 relationship managers carry into client meetings. The redesign must halve RM training time, and a secure client-messaging pilot rides along. {sponsor} will demo it live at the bank's annual RM Conference on {target}, and every RM gets it straight after. The conference does not move.",
    "Being the vendor changes the job. The bank is client, sponsor and gatekeeper: its platform team owns the APIs you need, its release manager owns the windows, and Swiss banking secrecy plus the bank's client-data rules mean nobody in Singapore may ever see a real client's name. Every extra ask is either a change request or someone's margin. Keep the client happy, keep the firm profitable, and write everything down.",
  ],
  targetDay: 15,
  maxDay: 20,
  start: { morale: 55, trust: 45, quality: 60, budget: 60 },
  hue: 205,
  icon: '🏔️',

  // ───────────────────────────── Cast ─────────────────────────────
  cast: {
    boss: {
      role: 'boss',
      name: 'Desmond Yeo Kah Wee',
      short: 'Desmond',
      title: 'Delivery Director, Banking & Wealth, Kestrel & Quay',
      avatar: '💼',
      hue: 225,
      power: 4,
      interest: 4,
      location: 'Tanjong Pagar, Singapore',
      bio: "Runs the delivery centre's banking accounts and watches two numbers: margin and client happiness. Bring him bad news early, with numbers, and he'll fight upstairs for you.",
    },
    sponsor: {
      role: 'sponsor',
      name: 'Dr Regula Steiner',
      short: 'Dr Steiner',
      title: 'Head of Wealth Management Technology, Alpenrose Private Bank',
      avatar: '🗝️',
      hue: 345,
      power: 5,
      interest: 4,
      location: 'Head office, Zurich',
      bio: 'Precise, polite and impossible to bluff. She chose Kestrel & Quay, and her name is on the conference demo. Wants facts in writing, options with prices, and no surprises.',
    },
    pm: {
      role: 'pm',
      name: 'Luca Bernasconi',
      short: 'Luca',
      title: 'Product Owner, RM Cockpit, Alpenrose Private Bank',
      avatar: '☕',
      hue: 28,
      power: 4,
      interest: 5,
      location: 'Zurich, usually between client meetings',
      bio: 'Fifteen years as a relationship manager before he moved to product. Knows exactly how RMs use the app in front of clients, and asks your engineers for things directly. Warmly.',
    },
    lead: {
      role: 'lead',
      name: 'Nur Hidayah binte Salleh',
      short: 'Hidayah',
      title: 'Tech Lead, Alpenrose team, Kestrel & Quay',
      avatar: '⚙️',
      hue: 160,
      power: 3,
      interest: 5,
      location: 'Tanjong Pagar, Singapore',
      bio: 'Built the v1 backend and knows where every shortcut is buried. Leads seven engineers across backend, mobile and QA. Calm, direct, and allergic to promises made without her.',
    },
    partner: {
      role: 'partner',
      name: 'Magdalena Zielińska',
      short: 'Magda',
      title: 'Engineering Manager, Integration Platform, Alpenrose Private Bank',
      avatar: '🧩',
      hue: 275,
      power: 3,
      interest: 2,
      location: 'Zurich-Oerlikon',
      bio: "Her team owns every API between core banking and the outside world, and three programs think they're her top priority. Blunt and fair: bring her a dated, written ask.",
    },
    sre: {
      role: 'sre',
      name: 'Urs Gämperli',
      short: 'Urs',
      title: 'Release & Environments Manager, Alpenrose Private Bank',
      avatar: '🚦',
      hue: 48,
      power: 4,
      interest: 2,
      location: 'Zurich-Oerlikon',
      bio: "Owns the release calendar, the test environments and the masked data. Punctual to the minute. Book his windows early and in writing: 'can we just' is not a release process.",
    },
    security: {
      role: 'security',
      name: 'Nathalie Rochat',
      short: 'Nathalie',
      title: 'IT Security Officer, Alpenrose Private Bank',
      avatar: '🔒',
      hue: 195,
      power: 4,
      interest: 3,
      location: 'Zurich',
      bio: 'Guards client-identifying data (CID) like the vault it is, and runs the pen tests. Pragmatic about controls, unbending about CID leaving Switzerland. Show her designs before you build.',
    },
    compliance: {
      role: 'compliance',
      name: 'Lukas Tanner',
      short: 'Lukas',
      title: 'Compliance & Data Protection Lead, Alpenrose Private Bank',
      avatar: '📜',
      hue: 305,
      power: 4,
      interest: 2,
      location: 'Zurich',
      bio: 'Thinks in obligations: banking secrecy, outsourcing, records retention. Calm and exact. Ask him at design time and he helps you get it right; ask in launch week and he must say no.',
    },
  },

  // ───────────────────────────── Workstreams ─────────────────────────────
  // Neutral projection: platform 11 → core 13 (pinned at 80% on Days 9–10 waiting for the bank's
  // APIs) → client 17 (pinned at 75% waiting for core). Review (16) and data (15) trail close behind,
  // so a single lever rarely fixes everything: the player has to work the bank-side dependency too.
  workstreams: [
    {
      role: 'core',
      name: 'Portfolio Cockpit Backend',
      icon: '📊',
      owner: 'lead',
      work: 125,
      done: 30,
      velocity: 9,
      deps: [{ on: 'platform', capAt: 0.8 }],
      description:
        "Your team's services behind the app: portfolio views, performance, each RM's client book and the secure-messaging service. Built against mocks; finishing it needs the bank's real APIs.",
    },
    {
      role: 'client',
      name: 'RM Tablet App Redesign',
      icon: '📲',
      owner: 'pm',
      work: 130,
      done: 12,
      velocity: 8,
      deps: [{ on: 'core', capAt: 0.75 }],
      description:
        'The new tablet app: fewer taps, a calmer client view and in-app messaging. Your mobile engineers build it; Luca owns the design and the acceptance. The last quarter needs a finished backend.',
    },
    {
      role: 'platform',
      name: 'Bank Platform APIs & Environments',
      icon: '🔌',
      owner: 'partner',
      work: 60,
      done: 12,
      velocity: 5,
      description:
        "The bank's Integration Platform team exposes core-banking data as APIs and runs the integration environment. A client-side dependency: you can ask, chase and help, but not command.",
    },
    {
      role: 'data',
      name: 'Masked Test Data & Migration',
      icon: '🎭',
      owner: 'sre',
      work: 55,
      done: 8,
      velocity: 5,
      deps: [{ on: 'platform', capAt: 0.6 }],
      description:
        "Masked and synthetic portfolios your Singapore team is allowed to see, plus migrating RMs' saved views from v1. Only onshore bank staff may touch production data.",
    },
    {
      role: 'review',
      name: 'Security, CID & Compliance Sign-off',
      icon: '🔏',
      owner: 'security',
      work: 36,
      done: 4,
      velocity: 4,
      deps: [{ on: 'core', capAt: 0.6 }],
      description:
        "The bank's pen test, CID and data-classification review, outsourcing checks and the compliance sign-off for messaging. The gate between you and the release window.",
    },
  ],

  // ───────────────────────────── Risks (RAID) ─────────────────────────────
  risks: [
    {
      id: 'ar-risk-api-slip',
      title: "The bank's platform team slips the APIs",
      description:
        "Magda's Integration Platform team owns the APIs your backend needs, and the bank's core-banking upgrade wants the same engineers. SOW assumption A4 says week 1; two of the six exist.",
      ws: 'platform',
      owner: 'partner',
      likelihood: 4,
      impact: 4,
      initial: 'open',
      earliestDay: 3,
      mitigation: {
        label: 'Agree API contracts with Magda and build to mocks',
        cost: 2,
        text: "You and Magda sign off specs for all six endpoints, with sample payloads and error codes, and Hidayah's team builds against mocks. If the platform slips now, you lose days, not weeks.",
        effects: { relaxDependency: { ws: 'core', capAt: 0.9 }, rel: { partner: 3 } },
      },
      trigger: 'ar-api-slip',
    },
    {
      id: 'ar-risk-fake-data',
      title: 'Masked data too tidy to find real bugs',
      description:
        'Synthetic portfolios have ten positions, one currency and polite names. Real books have hundreds of positions, 20+ currencies and exotic products, so bugs may hide until UAT in Zurich.',
      ws: 'data',
      owner: 'lead',
      likelihood: 3,
      impact: 4,
      initial: 'open',
      earliestDay: 6,
      mitigation: {
        label: 'Profile production onshore; build edge-case personas',
        cost: 2,
        text: "Urs's onshore team profiles production (shapes and counts, never names), and Hidayah turns the profile into 30 synthetic edge-case portfolios: 2,000 positions, 23 currencies, negative cash.",
        effects: { quality: 4, scope: { data: 6 }, rel: { sre: 2 } },
      },
      trigger: 'ar-uat-real-books',
    },
    {
      id: 'ar-risk-freeze',
      title: 'A bank-wide freeze eats the window',
      description:
        "Releases go out only in Urs's scheduled windows. A bank-wide change freeze, after an incident or an audit finding, could cancel the last window before the conference.",
      ws: 'platform',
      owner: 'sre',
      likelihood: 2,
      impact: 5,
      initial: 'open',
      earliestDay: 8,
      mitigation: {
        label: 'Pre-book a fallback window and a freeze-ready pack',
        cost: 1,
        text: 'Urs pencils in an earlier fallback window, and you build the release pack to freeze-exception standard from day one: test evidence, rollback steps, sign-offs and the business case.',
        effects: { rel: { sre: 4 } },
      },
      trigger: 'ar-freeze',
    },
    {
      id: 'ar-risk-cid-leak',
      title: 'Client data leaks to the offshore team',
      description:
        'A production screenshot, log extract or ticket attachment with real client names could reach Singapore, breaching Swiss banking secrecy and the outsourcing obligations the bank owes its regulator, FINMA.',
      ws: 'data',
      owner: 'security',
      likelihood: 2,
      impact: 5,
      initial: 'hidden',
      earliestDay: 4,
      mitigation: {
        label: 'Add CID scanning to tickets and logs; brief the team',
        cost: 2,
        text: "Nathalie's team adds a CID pattern scan to the ticket tool and log exports, and your engineers get a 20-minute 'what CID looks like, and who you tell' briefing. Two old log exports are found and purged.",
        effects: { quality: 2, rel: { security: 5 } },
      },
      trigger: 'ar-cid-screenshot',
    },
    {
      id: 'ar-risk-adoption',
      title: 'RM training lags the redesign',
      description:
        "The redesign only halves training time if RMs are trained on it. The bank's RM Academy is writing courses from screens that still change daily, and 600 RMs first see the app at the conference.",
      ws: 'client',
      owner: 'pm',
      likelihood: 3,
      impact: 3,
      initial: 'hidden',
      earliestDay: 7,
      mitigation: {
        label: 'Freeze screens in waves; train RM champions first',
        cost: 1,
        text: 'Luca recruits eight RM champions, and screens now freeze in waves: once a screen is frozen, the Academy films a two-minute walkthrough. Training stops chasing the build.',
        effects: { rel: { pm: 4 } },
      },
      trigger: 'ar-training-lag',
    },
    {
      id: 'ar-risk-retention',
      title: 'Messaging pilot meets records retention',
      description:
        'Client messages are business records. If the bank must archive, retain and supervise them like email, the messaging pilot needs an archiving integration that nobody scoped.',
      ws: 'review',
      owner: 'compliance',
      likelihood: 3,
      impact: 4,
      initial: 'hidden',
      earliestDay: 5,
      mitigation: {
        label: 'Walk the messaging design through Lukas now',
        cost: 2,
        text: "Lukas reviews the message flow before it's built: messages export nightly to the bank's existing archive and are supervised like email. Scoped and priced as a small CR now, not discovered in launch week.",
        effects: { scope: { core: 4 }, rel: { compliance: 5 } },
      },
      trigger: 'ar-retention',
    },
    {
      id: 'ar-risk-rolloff',
      title: 'Best mobile engineer rolled off',
      description:
        "Wei Ting built half the new screens, and {company}'s biggest account keeps asking for her. If resourcing moves her before the conference, the redesign loses its fastest pair of hands.",
      ws: 'client',
      owner: 'boss',
      likelihood: 3,
      impact: 4,
      initial: 'hidden',
      earliestDay: 4,
      mitigation: {
        label: 'Get Wei Ting locked to the account until Day 15',
        cost: 1,
        text: "You show Desmond the critical path with Wei Ting's name on it. He marks her 'locked to Alpenrose until the conference' in the resourcing tool, and you start pairing a second engineer on her screens.",
        effects: { rel: { boss: 2, lead: 2 } },
      },
      trigger: 'ar-rolloff',
    },
    {
      id: 'ar-risk-margin',
      title: 'Unbilled asks are eating the margin',
      description:
        "Small asks are being built without change requests. Each one is 'only a day', and together they are quietly turning a fixed-price SOW into a loss that Desmond will have to explain.",
      ws: 'core',
      owner: 'boss',
      likelihood: 3,
      impact: 3,
      initial: 'dormant',
      earliestDay: 6,
      mitigation: {
        label: 'Start a shared change log and size every ask',
        cost: 1,
        text: "Every ask now goes into a change log shared with the bank: who asked, the size, and 'absorbed as goodwill' or 'CR'. Desmond loves it. So, surprisingly, does Luca: now he can see what he's getting.",
        effects: { rel: { boss: 3, pm: 2 }, flags: ['ar:change-log'] },
      },
      trigger: 'ar-margin-review',
    },
  ],

  assumptions: [
    'Fixed-price SOW: anything outside Annex A is a change request (CR), sized, priced and approved before work starts.',
    "SOW assumption A4: the bank's platform team provides all six APIs in its integration environment from week 1.",
    'SOW assumption A7: the bank provides masked test data from Day 3. Offshore staff never see client-identifying data (CID).',
    "Production is onshore only: the bank's release team deploys, in scheduled release windows, after the bank's own pen test.",
    'The RM Conference demo is on Day 15 and cannot move. Rollout to all 600 RMs starts straight after it.',
    'Zurich is 7 hours behind Singapore in winter (6 in summer): the shared working day is roughly 3pm to 6pm SGT.',
  ],

  events: [
    // ───────────── Story beat: Day 1 — the SOW somebody else signed ─────────────
    {
      id: 'ar-sow-inheritance',
      scenarios: ['alpenrose'],
      title: 'Read page 14 of the SOW before Zurich wakes up',
      channel: 'slack',
      from: 'lead',
      body: "Welcome to the account lah. Before your first Zurich call at 3pm, please read SOW page 14. Assumption A4: 'bank platform APIs available from week 1'. Two of the six exist. A7: 'masked test data from Day 3'. {sre} has never heard of A7. Sales signed this. We deliver it.",
      urgency: 'high',
      expires: 2,
      weight: 0,
      fixedDay: 1,
      concept: 'client-delivery',
      skill: 'stakeholder',
      choices: [
        {
          id: 'a',
          label: "Absorb it quietly: build around the gaps and don't spook a new client",
          cost: 0,
          grade: 'poor',
          insight:
            "Silent absorption feels like good service, but an assumption nobody tracks becomes your fault by default. The client can't fix a gap it doesn't know about, and you lose the paper trail any later change request will need.",
          outcome: {
            text: "{lead}'s team builds mock after mock. Nobody in Zurich knows the APIs are late, so nobody in Zurich hurries.",
            effects: {
              morale: -3,
              budget: -8,
              rel: { lead: -4 },
              flags: ['ar:absorbed-assumptions'],
              addRisks: ['ar-risk-margin'],
            },
          },
        },
        {
          id: 'b',
          label: 'Raise a change request today: broken assumptions are billable under the SOW',
          cost: 2,
          grade: 'okay',
          insight:
            "Contractually right, relationally clumsy. A change request on day one, before you've tried to fix the gap together, tells a new client the relationship is adversarial. Log the assumptions jointly first; price the impact once it's real.",
          outcome: {
            text: "Zurich procurement logs CR-001 on your first morning. {sponsor} signs nothing, and asks Rupert whether this is how it's going to be.",
            effects: { trust: -4, rel: { sponsor: -5, boss: 3 }, flags: ['ar:assumptions-logged'] },
          },
        },
        {
          id: 'c',
          label: 'Brief {boss}, then walk the bank through each broken assumption: owner, date, impact',
          cost: 2,
          grade: 'best',
          insight:
            "Assumptions are a vendor's risk register in disguise. Surface broken ones early, jointly and in writing, each with a client-side owner, a date and an agreed impact. That turns a future argument into a shared plan, and it's the paper trail any change request will need.",
          outcome: {
            text: "{sponsor} is not delighted, but she is grateful. {partner} gets a dated request with the sponsor's name on it. On A7, {security} asks how you'd know if real client data ever reached Singapore. Good question. {boss}: 'Good. No surprises.'",
            effects: {
              trust: 4,
              rel: { sponsor: 5, boss: 3, partner: -2 },
              velocity: { ws: 'platform', mult: 1.15, days: 4, label: 'Bank reprioritises your APIs' },
              flags: ['ar:assumptions-logged'],
              revealRisks: ['ar-risk-cid-leak'],
            },
          },
        },
        {
          id: 'd',
          label: 'Send it back to sales: they signed it, so they can renegotiate it',
          cost: 0,
          grade: 'poor',
          insight:
            'Sales-to-delivery handovers always leak. Loop your leadership in, by all means, but the moment you took the account the SOW became yours to deliver. Waiting for sales to renegotiate burns the week you most need.',
          outcome: {
            text: "{boss} forwards it to Rupert, who is at a client offsite in Geneva until Thursday. The assumptions stay broken, and now they're also four days older.",
            effects: { trust: -2, rel: { boss: -4, lead: -3 }, flags: ['ar:absorbed-assumptions'] },
          },
        },
      ],
      ignored: {
        text: 'Nobody raises the assumptions. Week one ends with two APIs and no test data, and Zurich assumes all is well.',
        effects: { trust: -2, rel: { lead: -3 }, flags: ['ar:absorbed-assumptions'], addRisks: ['ar-risk-margin'] },
      },
    },

    // ───────────── Story beat: Day 8 SteerCo (behind) ─────────────
    {
      id: 'ar-steerco-behind',
      scenarios: ['alpenrose'],
      title: "SteerCo: the date is fixed. The plan isn't.",
      channel: 'meeting',
      from: 'sponsor',
      body: "Your projection misses the conference, {player}. The conference does not move: 600 RMs, our CEO, one stage. Rupert tells me {company} will 'find a way'. {boss} tells me your team is already stretched. I would like one recommendation, with its price, before we leave this room.",
      urgency: 'high',
      weight: 0,
      fixedDay: 8,
      when: { behindSchedule: true },
      concept: 'iron-triangle',
      skill: 'stakeholder',
      choices: [
        {
          id: 'a',
          label: "Absorb it: add two {company} engineers at the firm's own cost",
          cost: 2,
          grade: 'okay',
          insight:
            "Goodwill, bought with margin. Extra vendor engineers can't speed up the bank's platform team, which is where your critical path runs, and they need the bank's screening and CID training first. If you buy capacity, buy it for separable work, and name it as goodwill so it counts.",
          outcome: {
            text: "{sponsor} thanks you warmly. {boss} does not. The two engineers wait three days for bank laptops and CID training, then build a fuller mock backend so the app team stops waiting on yours.",
            effects: {
              budget: -25,
              trust: 3,
              rel: { sponsor: 4, boss: -6 },
              relaxDependency: { ws: 'client', capAt: 0.85 },
              velocity: { ws: 'client', mult: 1.15, days: 4, label: 'Two extra engineers' },
            },
          },
        },
        {
          id: 'b',
          label: 'Phase it: messaging follows in a dated release; the demo shows the redesign',
          cost: 2,
          grade: 'best',
          insight:
            'Recommend, don\'t present a menu. When the date is fixed, scope is the honest lever: move the least-ready feature to a dated follow-up release, write the change into the SOW, and protect what the date is for. It costs neither margin nor quality.',
          outcome: {
            text: '{sponsor} asks two sharp questions, then agrees: messaging pilots in the first release after the conference, with its own date. {pm} sulks for an hour. The change is minuted, signed and attached to the SOW.',
            effects: {
              scope: { core: -15, client: -15, review: -20 },
              trust: 5,
              morale: 4,
              rel: { sponsor: 4, pm: -3, lead: 5, boss: 3 },
              mitigate: ['ar-risk-retention'],
              flags: ['ar:messaging-phased'],
            },
          },
        },
        {
          id: 'c',
          label: 'Invoke assumption A4: a priced change request for the API delay',
          cost: 1,
          grade: 'okay',
          requires: { flags: ['ar:assumptions-logged'] },
          lockedHint: 'Needs the broken SOW assumptions logged with the bank on Day 1',
          insight:
            "A logged assumption turns 'you're late' into 'we agreed this would cost money if it broke'. Legitimate, but people bought this late rarely buy much time, and billing the sponsor in her own SteerCo spends goodwill. Use the paper trail to protect margin, not to win the room.",
          outcome: {
            text: "{sponsor} reads A4, glances at {partner}'s empty chair, and signs: two engineers, billed to the bank, building a fuller mock backend. Fair, and a little cold. {boss} sends a thumbs-up emoji, his highest honour.",
            effects: {
              trust: -2,
              rel: { sponsor: -4, partner: -3, boss: 6 },
              relaxDependency: { ws: 'client', capAt: 0.85 },
              velocity: { ws: 'client', mult: 1.15, days: 4, label: 'Two extra engineers (CR)' },
            },
          },
        },
        {
          id: 'd',
          label: 'Build a scripted demo path for the stage and finish the real app after the conference',
          cost: 1,
          grade: 'poor',
          insight:
            "Demo-ware wins the room and loses the account. The client remembers what they saw on stage, not your caveats, and 600 RMs will try those exact flows on Monday. If it isn't ready, phase it openly; never let a demo promise what the release can't do.",
          outcome: {
            text: "The demo path is ready by Friday and looks wonderful. {lead} calls it 'the stage set'. The real app is now behind by exactly the effort it took to build the stage set.",
            effects: {
              trust: 3,
              quality: -6,
              morale: -4,
              rel: { lead: -6 },
              scope: { client: 6 },
              flags: ['ar:demo-ware'],
              addRisks: ['ar-risk-adoption'],
            },
          },
        },
      ],
      ignored: {
        text: "You're stuck on a call with Rupert and miss the slot. SteerCo decides without you: {company} will 'absorb it'. {boss} finds out from the minutes.",
        effects: { budget: -20, trust: -4, morale: -3, rel: { sponsor: -3, boss: -6 } },
      },
    },

    // ───────────── Story beat: Day 8 SteerCo (on track) ─────────────
    {
      id: 'ar-steerco-ontrack',
      scenarios: ['alpenrose'],
      title: 'SteerCo: on track, so can we borrow two of yours?',
      channel: 'meeting',
      from: 'sponsor',
      body: "A SteerCo with good news, for once: {program} is on track. Our core-banking upgrade is not. I would like two of your engineers on it from Monday. Rupert assures me {company} can 'make it work' under a new SOW. Any objection, {player}?",
      urgency: 'high',
      weight: 0,
      fixedDay: 8,
      when: { behindSchedule: false },
      concept: 'negotiation',
      skill: 'stakeholder',
      choices: [
        {
          id: 'a',
          label: "Agree: it's new revenue for {company}, and {sponsor} will owe you a favour",
          cost: 0,
          grade: 'poor',
          insight:
            "On track is a buffer, not slack. Lending critical-path engineers turns a green plan amber overnight, and the client will remember the slip, not the favour. Revenue that endangers the delivery it depends on isn't a win.",
          outcome: {
            text: "Rupert is thrilled. {sponsor} is thrilled. Within a week your projection has slipped two days, and the people who could fix it are in someone else's stand-up.",
            effects: {
              trust: 2,
              morale: -4,
              rel: { sponsor: 5, lead: -6 },
              velocity: { ws: 'core', mult: 0.75, days: 5, label: 'Two engineers lent out' },
            },
          },
        },
        {
          id: 'b',
          label: 'Decline politely: the SOW ring-fences your team until the conference',
          cost: 0,
          grade: 'okay',
          insight:
            "Protecting the plan is right, but 'the contract says no' to a sponsor with a real problem wastes an opening. Find the interest behind the ask (her upgrade needs capacity) and offer a way to meet it that doesn't cost your date.",
          outcome: {
            text: "{sponsor} nods, slowly. 'Of course.' Rupert calls you afterwards to ask whether you enjoy turning down revenue.",
            effects: { trust: -2, rel: { sponsor: -4, boss: -3 } },
          },
        },
        {
          id: 'c',
          label: 'Lend them, and have the team cover the gap with evenings until the conference',
          cost: 2,
          grade: 'poor',
          insight:
            "Overtime to fund a favour makes the team pay for a decision they weren't part of. Tired engineers inject defects, and an offshore team already works into Zurich's afternoon. Trade scope, time or money, never your team's evenings.",
          outcome: {
            text: "The favour is granted and the gap is 'covered'. {lead}'s team works until 11pm three nights running. On Thursday, QA reopens nine tickets.",
            effects: { trust: 3, morale: -8, quality: -4, energy: -5, rel: { sponsor: 4, lead: -6 } },
          },
        },
        {
          id: 'd',
          label: 'Offer two bench consultants now, and one of yours after the pen test',
          cost: 2,
          grade: 'best',
          insight:
            'Find the interest behind the position: she needs capacity on her upgrade, not your people specifically. Offer capacity that keeps your critical path whole, with dates, and the firm wins revenue without the program losing its buffer. Good negotiation creates options.',
          outcome: {
            text: "{sponsor} takes it: two bench consultants start the bank's onboarding today, and one of yours joins after the pen test. With help on the upgrade, {partner}'s team suddenly has time for your APIs. Checking the bench, {boss} mentions another account keeps asking for Wei Ting.",
            effects: {
              trust: 4,
              rel: { sponsor: 3, boss: 5, partner: 5 },
              velocity: { ws: 'platform', mult: 1.2, days: 3, label: 'Upgrade help frees the platform team' },
              revealRisks: ['ar-risk-rolloff'],
            },
          },
        },
      ],
      ignored: {
        text: "You're on another call. Rupert answers for you: 'Of course!' Two engineers leave your team on Monday.",
        effects: {
          morale: -3,
          rel: { lead: -5 },
          velocity: { ws: 'core', mult: 0.75, days: 4, label: 'Two engineers lent out' },
        },
      },
    },

    // ───────────── Story beat: Day 12 — the dress rehearsal ─────────────
    {
      id: 'ar-dress-rehearsal',
      scenarios: ['alpenrose'],
      title: 'Dress rehearsal: three findings, one window',
      channel: 'meeting',
      from: 'sre',
      body: "Grüezi. Dress rehearsal notes. One: the release dry-run took 2h50m, and Wednesday night's window is two hours. Two: on the conference hotel's Wi-Fi, the app froze twice. Three: {sponsor} asked me to load a real client's portfolio for the demo, because 'Muster AG looks fake'. I said I would ask you first.",
      urgency: 'high',
      expires: 2,
      weight: 0,
      fixedDay: 12,
      concept: 'launch-readiness',
      skill: 'execution',
      choices: [
        {
          id: 'a',
          label: 'Record a polished fallback video; demo live only if the Wi-Fi behaves',
          cost: 1,
          grade: 'okay',
          insight:
            "A recorded fallback is smart insurance for any live demo. But it doesn't fix the release that overran its window, which is what 600 RMs will feel on Monday. Insure the demo, then fix the release.",
          outcome: {
            text: "The fallback video is gorgeous. The release dry-run still takes 2h50m, and the real-client question is still in {sre}'s inbox.",
            effects: { trust: 2, rel: { sponsor: 2 } },
          },
        },
        {
          id: 'b',
          label: "Load the real portfolio: it's the bank's own data on the bank's own stage, after all",
          cost: 0,
          grade: 'poor',
          insight:
            "CID rules aren't only about offshore teams: need-to-know applies on a stage too, and 600 RMs don't need to know one client's wealth. A believable synthetic persona demos just as well. Never let a deadline talk you into the breach that ends accounts.",
          outcome: {
            text: '{security} hears about it within the hour and vetoes it in writing, copying {sponsor}. The demo uses synthetic data after all, and you spent goodwill getting there.',
            effects: { trust: -4, rel: { security: -8, sponsor: -2 } },
          },
        },
        {
          id: 'c',
          label: "Skip the window: sideload the demo build onto the presenters' tablets",
          cost: 1,
          grade: 'poor',
          insight:
            'Sideloading a build around release management onto bank-managed devices is how you fail an audit live on stage. The window is a control, not an obstacle: fit the release into it, or agree a documented exception with its owner.',
          outcome: {
            text: "{sre} reads your message twice, replies 'No.', and copies {security}. The demo tablets stay on the managed build.",
            effects: { trust: -3, rel: { sre: -8, security: -4 } },
          },
        },
        {
          id: 'd',
          label: "Fix and re-run: offline cache, a rich 'Familie Muster', timed release + rollback",
          cost: 3,
          grade: 'best',
          insight:
            "A rehearsal's job is to fail somewhere safe. Give every finding an owner and a go/no-go check: re-time the release to fit its window with rollback proven, make the app degrade gracefully offline, and give the sponsor a demo persona as rich as a real client, minus the secrecy problem.",
          outcome: {
            text: "Wednesday afternoon's re-run: release in 1h35m, rollback proven in 25 minutes, and Familie Muster now has a chalet, three currencies and a worrying amount of gold. {sponsor} adores them.",
            effects: { readiness: ['rollbackPlan'], quality: 5, energy: -8, rel: { sre: 6, sponsor: 3 } },
          },
        },
      ],
      ignored: {
        text: "Nobody owns the findings. The release goes into Wednesday's window untimed, and the real-client request is still sitting in {sre}'s inbox.",
        effects: { quality: -4, trust: -3, rel: { sre: -4 } },
      },
    },

    // ───────────── Risk trigger: CID reaches Singapore ─────────────
    {
      id: 'ar-cid-screenshot',
      scenarios: ['alpenrose'],
      title: "CID alert: a real client's name reached Singapore",
      channel: 'incident',
      from: 'security',
      body: "Our DLP scan flagged ticket RMC-2291: a Zurich support analyst attached a production screenshot with a real client's name, portfolio and account number. Three of your engineers in Singapore opened it yesterday. Nobody reported it. I need facts within the hour: who saw it, where every copy is, and what you are doing about it.",
      urgency: 'critical',
      weight: 0,
      concept: 'incident-mgmt',
      skill: 'risk',
      choices: [
        {
          id: 'a',
          label: 'Facts within the hour: who opened it, copies quarantined, {boss} in copy',
          cost: 2,
          grade: 'best',
          insight:
            'As the vendor, the data was never yours: the client owns the incident, so they hear first and fast, with facts. Contain and preserve, report, and brief your own leadership in parallel. Then fix the leak path together and drill the team on reporting, without blaming the sender.',
          outcome: {
            text: "Within the hour {security} has names, timestamps and a quarantined attachment. The fix is joint: the ticket tool now blocks screenshot attachments, and your team gets a one-click 'report CID' button. She ends the call: 'Thank you. That is how it should work.'",
            effects: {
              trust: 3,
              rel: { security: 8, boss: 3 },
              block: { ws: 'data', days: 1, reason: 'Test environments locked down for a CID review' },
              flags: ['ar:cid-handled'],
            },
          },
        },
        {
          id: 'b',
          label: 'Point out that a Zurich analyst sent it; your team never asked for it',
          cost: 0,
          grade: 'poor',
          insight:
            "True, and beside the point. Leading with blame makes the client's security officer defend her colleague instead of solving the problem with you. State the facts, own your side (nobody reported it), and fix the path together.",
          outcome: {
            text: "{security} agrees the sender erred, then asks why three of your engineers sat on it for a day. You don't have a good answer.",
            effects: { trust: -4, rel: { security: -8 } },
          },
        },
        {
          id: 'c',
          label: 'Have the team delete every copy right now, then reply with a clean slate',
          cost: 1,
          grade: 'poor',
          insight:
            "Deleting before the client assesses destroys the evidence of how far it spread, and looks like a cover-up. Quarantine, don't delete: it's the bank's data, and the bank decides what happens to it and whether its regulator needs to hear.",
          outcome: {
            text: "The copies are gone, and so is any proof of who forwarded what. {security}'s reply is two lines long and copies {compliance}.",
            effects: { trust: -8, rel: { security: -10, compliance: -6 }, flags: ['ar:cid-evidence-gone'] },
          },
        },
        {
          id: 'd',
          label: "Route every reply through {company}'s legal team before you say anything",
          cost: 2,
          grade: 'okay',
          insight:
            "Your legal team should know, since contracts usually set notification duties. But making the client's security officer wait for lawyers while CID sits in your systems reads as stalling. Give her the facts now, with legal in copy.",
          outcome: {
            text: 'Legal sends a careful holding statement five hours later. {security} needed facts in one. She gets them the next morning, and remembers the wait.',
            effects: { trust: -3, rel: { security: -5, boss: 2 } },
          },
        },
      ],
      ignored: {
        text: "The hour passes. {security} suspends all offshore access to the bank's test environments pending review, and calls {sponsor}.",
        effects: {
          trust: -8,
          rel: { security: -10, sponsor: -4 },
          block: { ws: 'data', days: 2, reason: 'Offshore access suspended pending a CID review' },
        },
      },
    },

    // ───────────── Risk trigger: masked data was too tidy ─────────────
    {
      id: 'ar-uat-real-books',
      scenarios: ['alpenrose'],
      title: 'UAT in Zurich: the app chokes on real books',
      channel: 'whatsapp',
      from: 'pm',
      body: 'Ciao {player}! UAT news: our RMs opened their real books in the onshore UAT environment. One family office has 1,900 positions in 23 currencies, and the app freezes for 40 seconds. Your synthetic clients have ten positions each. I could screen-share the real portfolio with your team tonight. Just this once?',
      urgency: 'high',
      expires: 2,
      weight: 0,
      concept: 'uat',
      skill: 'technical',
      choices: [
        {
          id: 'a',
          label: "Accept the screen-share: the bank's own product owner is offering, just once",
          cost: 1,
          grade: 'poor',
          insight:
            "CID rules don't have a 'just once' setting, and a client employee can't waive the bank's obligations on your behalf. If it surfaces, it's your firm in the incident report. Decline warmly, and offer a compliant route to the same answer.",
          outcome: {
            text: "Forty minutes of very useful debugging. Then {security}'s access review finds the session recording. {pm} is mortified, and you're on a call with {boss} and the firm's risk team.",
            effects: { quality: 3, progress: { client: 3 }, trust: -8, rel: { security: -10, boss: -6 } },
          },
        },
        {
          id: 'b',
          label: 'Pair onshore: a bank engineer reproduces it and sends you masked traces',
          cost: 2,
          grade: 'best',
          insight:
            "The client's data is the real spec, so get its shape without its secrets: an onshore engineer runs the repro, profiles the data and shares masked traces. Then feed those shapes into your synthetic set, so the next bug is found in Singapore, not in UAT.",
          outcome: {
            text: '{sre} lends an onshore engineer for two days. Masked traces show one database query per position. Fixed, and 30 edge-case portfolios join your synthetic set. The family office now opens in two seconds.',
            effects: { quality: 6, scope: { core: 4 }, rel: { pm: 4, sre: 3, security: 3 } },
          },
        },
        {
          id: 'c',
          label: 'Fix what you can from the error logs and let UAT carry on',
          cost: 1,
          grade: 'okay',
          insight:
            "Logs show symptoms, not the shape of the data behind them, so you'll fix the first freeze and miss the next. When UAT fails on real data, your test data is wrong as well as your code: fix both.",
          outcome: {
            text: "You fix the timeout. The family office now loads in 22 seconds, and {pm}'s RMs find two new freezes the next day.",
            effects: { quality: -2, progress: { client: 2 }, rel: { pm: -2 } },
          },
        },
        {
          id: 'd',
          label: "Remind {pm} that SOW assumption A7 made test data the bank's job",
          cost: 0,
          grade: 'poor',
          insight:
            "Winning the contract argument while the client's UAT burns is how vendors lose accounts. Assumptions protect your margin when you plan with them together, not when you wield them mid-crisis. Fix first; discuss the commercial impact calmly, later.",
          outcome: {
            text: '{pm} goes quiet. Then he forwards your message to {sponsor} with a single question mark.',
            effects: { trust: -5, rel: { pm: -8, sponsor: -3 } },
          },
        },
      ],
      ignored: {
        text: "UAT carries on without you. Within two days {pm}'s RMs have logged 14 freezes and started calling the app 'the hourglass'.",
        effects: { quality: -4, trust: -3, rel: { pm: -5 } },
      },
    },

    // ───────────── Risk trigger: the bank's platform team slips ─────────────
    {
      id: 'ar-api-slip',
      scenarios: ['alpenrose'],
      title: 'Platform team: your APIs slip at least a week',
      channel: 'email',
      from: 'partner',
      body: "Hi {player}, honest update. The core-banking upgrade has taken three of my engineers until further notice, so the portfolio and messaging APIs slip by at least a week. I know your SOW says week 1. I didn't sign your SOW. Tell me what would help most and I'll see what I can do. {partner}",
      urgency: 'high',
      expires: 2,
      weight: 0,
      concept: 'critical-path',
      skill: 'execution',
      choices: [
        {
          id: 'a',
          label: 'Escalate to {sponsor}: her own platform team is breaking the SOW',
          cost: 0,
          grade: 'poor',
          insight:
            "Escalating a client's team to the client's executive before trying peer-to-peer makes a vendor look like a prosecutor. She offered help: take it first. If you must escalate later, do it together, with options, and tell her before you go.",
          outcome: {
            text: "{sponsor} forwards your email to {partner}'s boss: 'please align'. One engineer comes back. {partner}'s replies are now prompt, polite, and contain exactly what you asked for, never anything more.",
            effects: {
              trust: -3,
              rel: { partner: -10, sponsor: -2 },
              velocity: { ws: 'platform', mult: 0.85, days: 3, label: 'Platform team short-staffed' },
            },
          },
        },
        {
          id: 'b',
          label: 'Bypass her layer: have your backend call the core-banking services directly',
          cost: 2,
          grade: 'poor',
          insight:
            "Going around the platform layer swaps a schedule problem for an architecture and security one: no gateway, no entitlement checks, and a design the bank's security review will reject. Shrink the dependency with contracts and mocks instead.",
          outcome: {
            text: "{lead} prototypes it in a day. {security}'s design review takes ten minutes and ends with 'absolutely not'. A day gone, and the APIs are still late.",
            effects: {
              quality: -3,
              rel: { security: -5, partner: -4 },
              block: { ws: 'core', days: 1, reason: 'Direct core-banking calls rejected at design review' },
              velocity: { ws: 'platform', mult: 0.7, days: 3, label: 'Platform team short-staffed' },
            },
          },
        },
        {
          id: 'c',
          label: 'Agree the API contract now: her team ships a stub, yours builds to mocks',
          cost: 2,
          grade: 'best',
          insight:
            'When a dependency slips, shrink what you need from it. A signed contract (specs, sample payloads, error codes) plus a stub lets both teams work in parallel, so the real API becomes a late swap, not a blocker. Ask what helps her too: a stub costs her less than a deadline.',
          outcome: {
            text: 'Two hours with {partner} at 3pm (her 8am). Specs signed, stub live within a day. Your backend stops waiting, and the real API becomes a late swap instead of a cliff.',
            effects: {
              trust: 2,
              rel: { partner: 6, lead: 3 },
              relaxDependency: { ws: 'core', capAt: 0.95 },
              velocity: { ws: 'platform', mult: 0.8, days: 3, label: 'Platform team short-staffed' },
            },
          },
        },
        {
          id: 'd',
          label: 'Invoke the logged assumption A4: build to mocks, and the bank owns the delay',
          cost: 1,
          grade: 'best',
          requires: { flags: ['ar:assumptions-logged'] },
          lockedHint: 'Needs the broken SOW assumptions logged with the bank on Day 1',
          insight:
            "This is what the Day 1 paper trail was for: the slip is an agreed, known impact, not a surprise. Build to mocks to protect the date, and record the delay against the bank's assumption, calmly. Margin protected, and nobody had to win an argument.",
          outcome: {
            text: '{partner} signs the specs, and {sponsor} minutes the delay against assumption A4 without a murmur: it was logged on Day 1. The bank funds the extra integration days. {boss} is quietly delighted.',
            effects: {
              trust: 2,
              budget: 10,
              rel: { partner: 4, boss: 4 },
              relaxDependency: { ws: 'core', capAt: 0.95 },
              velocity: { ws: 'platform', mult: 0.8, days: 3, label: 'Platform team short-staffed' },
            },
          },
        },
      ],
      ignored: {
        text: "Nobody replies to {partner}. Her team reprioritises around the programs that did, and your APIs drift to 'after the upgrade'.",
        effects: {
          trust: -2,
          rel: { partner: -5 },
          block: { ws: 'platform', days: 2, reason: 'Platform engineers pulled onto the core-banking upgrade' },
        },
      },
    },

    // ───────────── Risk trigger: training lags the redesign ─────────────
    {
      id: 'ar-training-lag',
      scenarios: ['alpenrose'],
      title: "The RM Academy can't train on moving screens",
      channel: 'email',
      from: 'sponsor',
      body: "{player}, the RM Academy tells me it cannot train 600 RMs on screens that change every day, and 'halve the training time' is in my conference speech. They want the whole UI frozen today, and your team to write the training guides. I said I would ask. What do you propose?",
      urgency: 'high',
      expires: 2,
      weight: 0,
      concept: 'change-mgmt',
      skill: 'leadership',
      choices: [
        {
          id: 'a',
          label: 'Freeze screens in waves, train 40 RM champions first, add in-app tips',
          cost: 2,
          grade: 'best',
          insight:
            "Adoption is delivery, especially when the business case is 'cut training time'. Freeze in waves so training starts on stable screens, train champions who teach their peers, and build help into the product. Writing the manuals yourself is scope; enabling the Academy is delivery.",
          outcome: {
            text: "The Academy films a walkthrough as each screen freezes, and 40 RM champions get early access. A 30-year veteran calls the new client view 'almost intuitive'. From him, that is a standing ovation.",
            effects: { trust: 3, morale: 2, rel: { sponsor: 4, pm: 5 }, readiness: ['commsPlan'] },
          },
        },
        {
          id: 'b',
          label: 'Agree to both: freeze the whole UI today and have your team write the guides',
          cost: 0,
          grade: 'poor',
          insight:
            "Two mistakes in one yes: freezing everything today locks in known bugs, and writing the bank's training for free is unbilled scope your team has no time for. Freeze in waves, and help the Academy rather than replacing it.",
          outcome: {
            text: 'The UI freezes with three known bugs inside. Your QA engineer spends four days writing guides instead of testing. The guides are excellent. So, unfortunately, are the bugs.',
            effects: { trust: 2, quality: -6, rel: { sponsor: 3, lead: -6 }, addRisks: ['ar-risk-margin'] },
          },
        },
        {
          id: 'c',
          label: "Point out that training is the bank's responsibility under the SOW",
          cost: 0,
          grade: 'poor',
          insight:
            "Contractually correct, strategically wrong: the client buys outcomes, and if RMs don't adopt the app, nobody will remember whose job training was. Hold the scope line, but help the client succeed on its side of it.",
          outcome: {
            text: "{sponsor} replies: 'Understood.' Nothing else. From her, that is a very long sentence.",
            effects: { trust: -4, rel: { sponsor: -6 } },
          },
        },
        {
          id: 'd',
          label: 'Lend the Academy your designer two days a week, priced as a small CR',
          cost: 2,
          grade: 'okay',
          insight:
            "A priced, visible offer is good vendor practice: helpful and honest about cost. But it doesn't fix the root problem, training that chases moving screens. Pair the help with a wave-by-wave freeze plan.",
          outcome: {
            text: 'The CR is signed within a day. Your designer helps, but the Academy still re-films three videos when the screens change again.',
            effects: {
              budget: 6,
              rel: { sponsor: 2 },
              velocity: { ws: 'client', mult: 0.9, days: 2, label: 'Designer helping the Academy' },
            },
          },
        },
      ],
      ignored: {
        text: "The Academy freezes its course on last week's screens. At the conference, 600 RMs learn a navigation that no longer exists.",
        effects: { trust: -4, quality: -2, rel: { sponsor: -3, pm: -3 } },
      },
    },

    // ───────────── Risk trigger: records retention ─────────────
    {
      id: 'ar-retention',
      scenarios: ['alpenrose'],
      title: 'Compliance: client messages are business records',
      channel: 'email',
      from: 'compliance',
      body: 'Dear {player}, I have reviewed the messaging pilot. Client messages are business records: the bank must archive them, retain them for years and be able to produce them for supervision and audit. Your design deletes messages after 90 days. As designed, I cannot sign it. I am happy to work through options this week. Kind regards, {compliance}',
      urgency: 'high',
      expires: 2,
      weight: 0,
      concept: 'risk-mgmt',
      skill: 'risk',
      choices: [
        {
          id: 'a',
          label: "Argue that a 40-RM pilot shouldn't need full retention yet",
          cost: 1,
          grade: 'poor',
          insight:
            "There's no pilot exemption from record-keeping: the first client message is already a record. Arguing scale with compliance spends credibility you'll need at sign-off. Ask for the minimum compliant design instead.",
          outcome: {
            text: "{compliance} listens politely, then sends you the bank's records policy with two paragraphs highlighted. Sign-off just moved further away.",
            effects: {
              trust: -3,
              rel: { compliance: -8 },
              block: { ws: 'review', days: 1, reason: 'Messaging design rejected by compliance' },
            },
          },
        },
        {
          id: 'b',
          label: 'Switch messaging off for the conference and ship it once the archiving exists',
          cost: 1,
          grade: 'okay',
          insight:
            'Pulling a non-compliant feature beats shipping it. But doing it unilaterally surprises the sponsor who announced it. Agree the de-scope with her, with a date, and record it as a change.',
          outcome: {
            text: 'Messaging is switched off. {compliance} is relieved. {sponsor} hears about it from {pm}, and asks why she was the last to know.',
            effects: { scope: { core: -8, client: -6 }, trust: -3, rel: { compliance: 4, sponsor: -5 } },
          },
        },
        {
          id: 'c',
          label: 'Build the archive export quietly at your cost, to protect the date',
          cost: 2,
          grade: 'poor',
          insight:
            'Absorbing a requirement nobody priced hides a real change from the client and drains margin in silence. Regulatory requirements found late are legitimate change requests: price them openly and let the sponsor decide.',
          outcome: {
            text: "Your team builds the export in the evenings. It works. Nobody at the bank knows it cost anything, which is exactly how {boss}'s margin review will find it.",
            effects: { scope: { core: 8 }, morale: -4, rel: { compliance: 4, lead: -4 }, addRisks: ['ar-risk-margin'] },
          },
        },
        {
          id: 'd',
          label: 'Co-design it with {compliance}: nightly archive export, priced as a CR',
          cost: 2,
          grade: 'best',
          insight:
            'A compliance finding is a requirement, not a verdict. Design the minimum compliant solution with the person who signs it off, reuse what the bank already has, and price it openly as a change. The client sees what regulation costs, and your date stays honest.',
          outcome: {
            text: "{compliance} and {lead} design it in an hour: messages export nightly to the bank's existing archive and are supervised like email. {sponsor} signs the CR the same day, and {compliance} pencils in his sign-off.",
            effects: {
              scope: { core: 5 },
              budget: 8,
              trust: 3,
              progress: { review: 4 },
              rel: { compliance: 7, sponsor: 2 },
            },
          },
        },
      ],
      ignored: {
        text: "{compliance} logs the pilot as 'not compliant: no retention' in the review tracker {sponsor} reads every Monday.",
        effects: {
          trust: -4,
          rel: { compliance: -6 },
          block: { ws: 'review', days: 2, reason: 'Messaging pilot failed the records-retention review' },
        },
      },
    },

    // ───────────── Risk trigger: key engineer rolled off ─────────────
    {
      id: 'ar-rolloff',
      scenarios: ['alpenrose'],
      title: 'Resourcing moves Wei Ting off your team',
      channel: 'hallway',
      from: 'boss',
      body: "Paiseh, {player}. Leadership decision: in three days Wei Ting moves to our biggest account; their CEO demo is in two weeks. I can give you a graduate who built mobile apps at uni. I know the timing is bad. If you see something I don't, show me today.",
      urgency: 'high',
      expires: 2,
      weight: 0,
      concept: 'escalation',
      skill: 'stakeholder',
      choices: [
        {
          id: 'a',
          label: 'Accept it, and pair the graduate with Wei Ting for her last three days here',
          cost: 1,
          grade: 'okay',
          insight:
            "A handover overlap is the right reflex, but three days won't transfer two months of context, and you haven't tested whether the decision is final. Put the impact, in numbers, in front of whoever made the call.",
          outcome: {
            text: 'The graduate is bright and keen. Two days in, he can build the app. By the end of the week, he can almost explain it.',
            effects: { rel: { boss: 2 }, velocity: { ws: 'client', mult: 0.8, days: 4, label: 'Graduate ramping up' } },
          },
        },
        {
          id: 'b',
          label: 'Show {boss} the critical-path cost, the key-personnel clause and a plan',
          cost: 2,
          grade: 'best',
          insight:
            "Escalate through your own leadership with data, not drama: what the move costs in days, what the client's contract says (named key personnel usually need client consent to swap), and a proposal that meets the firm's need too, such as an overlap or a part-time split.",
          outcome: {
            text: "{boss} reads the clause, does the maths and calls the other account's director. Wei Ting stays until the conference, advising the other team two afternoons a week, with the graduate shadowing her.",
            effects: {
              trust: 2,
              rel: { boss: 4, lead: 4 },
              velocity: { ws: 'client', mult: 0.95, days: 2, label: 'Wei Ting advising part-time' },
            },
          },
        },
        {
          id: 'c',
          label: "Tip off {sponsor} so the client complains to {company}'s leadership",
          cost: 0,
          grade: 'poor',
          insight:
            "Using the client to win an internal fight works once and costs twice: your leadership stops trusting you, and the client learns your firm's staffing bends to complaints. Make the case inside first.",
          outcome: {
            text: "{sponsor} calls the firm's Asia CEO. Wei Ting stays. {boss} hears how it happened, and the temperature in your next 1:1 is distinctly Alpine.",
            effects: { trust: 2, rel: { sponsor: 2, boss: -10 }, flags: ['ar:client-weaponised'] },
          },
        },
        {
          id: 'd',
          label: "Accept it quietly: the firm's biggest account comes first",
          cost: 0,
          grade: 'poor',
          insight:
            'Accepting silently means the client finds out from a missing engineer, and your critical path loses its fastest hands. Firm priorities are real, but leadership can only weigh them if you show them the cost.',
          outcome: {
            text: "Wei Ting leaves three days later, with a cake. Her screens stay half-built, and the graduate inherits a branch called 'wip-do-not-touch'.",
            effects: { quality: -3, velocity: { ws: 'client', mult: 0.7, days: 4, label: 'Best mobile engineer rolled off' } },
          },
        },
      ],
      ignored: {
        text: "By the time you reply, it's final. Wei Ting's farewell cake is already in the office pantry.",
        effects: {
          quality: -3,
          rel: { lead: -3 },
          velocity: { ws: 'client', mult: 0.7, days: 4, label: 'Best mobile engineer rolled off' },
        },
      },
    },

    // ───────────── Risk trigger: change freeze ─────────────
    {
      id: 'ar-freeze',
      scenarios: ['alpenrose'],
      title: 'Bank-wide change freeze: your window is gone',
      channel: 'email',
      from: 'sre',
      body: "Dear {player}. After last night's payments incident, the CIO has frozen all non-emergency production changes until further notice. Your release window before the conference is cancelled. Exceptions go to the CAB with full evidence. I can add you to the next agenda if the pack is complete. Most packs are not.",
      urgency: 'critical',
      weight: 0,
      concept: 'change-mgmt',
      skill: 'execution',
      choices: [
        {
          id: 'a',
          label: 'Ask {sponsor} to get the CIO to grant her conference an exception',
          cost: 0,
          grade: 'poor',
          insight:
            "Seniority aimed at a control rarely works, and when it does it's remembered for the wrong reasons. A freeze after an incident is the bank protecting itself: earn the exception with evidence, and let the sponsor endorse it, not force it.",
          outcome: {
            text: "{sponsor} tries. The CIO replies that the CAB process exists for exactly this, and asks why the vendor didn't use it.",
            effects: { trust: -5, rel: { sponsor: -4, sre: -6 } },
          },
        },
        {
          id: 'b',
          label: 'Decouple: demo from the UAT build and roll out to RMs after the freeze',
          cost: 1,
          grade: 'okay',
          insight:
            'Decoupling the event from the release is legitimate and often wise: a demo needn\'t be production. But it moves the date 600 RMs were promised, so try the exception first, and take this to the sponsor as an option, not a done deal.',
          outcome: {
            text: "The demo will run from the UAT build with Familie Muster's data, and rollout moves to the first window after the freeze. {sponsor} accepts it, unhappily.",
            effects: { targetDay: 2, trust: -3, morale: 2, rel: { sponsor: -3, sre: 3 } },
          },
        },
        {
          id: 'c',
          label: 'Build the exception pack with {sre}: small change, proven rollback, business case',
          cost: 2,
          grade: 'best',
          insight:
            "Freeze exceptions are earned with evidence. Make the change small and safe (app and backend only, messaging behind a flag, a rehearsed rollback), show the business cost of waiting, and ask the gatekeeper what the CAB needs. Respect for the control is your strongest argument.",
          outcome: {
            text: '{sre} walks you through what the CAB will ask. The pack has test evidence, a 25-minute rollback and the business case. The CAB grants a narrow exception: app and backend only, messaging behind a feature flag.',
            effects: {
              trust: 3,
              rel: { sre: 6, security: 2 },
              readiness: ['featureFlags'],
              block: { ws: 'platform', days: 1, reason: 'Freeze: release waiting for a CAB exception' },
            },
          },
        },
        {
          id: 'd',
          label: 'Push the release out tonight, before the freeze notice reaches every team in the bank',
          cost: 2,
          grade: 'poor',
          insight:
            "Deploying into a freeze you know about, before it's 'official', is the kind of change that ends vendor relationships. If it breaks, it breaks in the middle of the bank's incident. Never race a control.",
          outcome: {
            text: "{sre} refuses to press the button, in writing, copying the CIO's office. You have now been mentioned in a freeze memo.",
            effects: { trust: -8, rel: { sre: -10, sponsor: -4 } },
          },
        },
      ],
      ignored: {
        text: 'No pack, no exception. The conference demo runs on a UAT build, and the rollout waits until the freeze lifts.',
        effects: { targetDay: 2, trust: -6, rel: { sponsor: -5, sre: -3 } },
      },
    },

    // ───────────── Risk trigger (dormant): the margin review ─────────────
    {
      id: 'ar-margin-review',
      scenarios: ['alpenrose'],
      title: 'Account review: where did the margin go?',
      channel: 'meeting',
      from: 'boss',
      body: 'Monthly account review, {player}. Alpenrose margin is down from 24% to 13%. Finance counts 41 person-days of work with no change request behind it. Rupert wants to send the bank a retroactive CR for all of it. Before I agree, tell me how this happened, and how it stops.',
      urgency: 'high',
      expires: 2,
      weight: 0,
      concept: 'client-delivery',
      skill: 'comms',
      choices: [
        {
          id: 'a',
          label: 'Show the bank its 41 days as visible goodwill, and price every ask from today',
          cost: 2,
          grade: 'best',
          insight:
            'Unrecorded goodwill is just lost margin. Make the gift visible (the client should know what it received), draw a line, and run every future ask through a shared change log with a size and a decision. Retroactive bills feel like ambushes; open ledgers feel like partnership.',
          outcome: {
            text: "{pm} reads the ledger and winces: 'All of this was extra?' He agrees a change log on the spot and signs two pending asks as CRs. {boss} calls it the best account review he's had all year.",
            effects: { budget: 12, trust: 2, rel: { boss: 6, pm: 2 }, flags: ['ar:change-log'] },
          },
        },
        {
          id: 'b',
          label: 'Back Rupert: send the retroactive CR for all 41 days',
          cost: 0,
          grade: 'poor',
          insight:
            'A surprise invoice for work the client thought was included destroys trust faster than it recovers margin. An invoice should never be the first time a client hears something cost money: price changes before the work, not after.',
          outcome: {
            text: "The bank's procurement rejects it within a day and asks for 'a conversation about the relationship'. {sponsor} cancels her next meeting with Rupert. {boss} wishes he hadn't asked.",
            effects: { budget: 5, trust: -8, rel: { sponsor: -8, pm: -6, boss: -2 } },
          },
        },
        {
          id: 'c',
          label: 'Write off the 41 days as an investment, and promise {boss} more discipline next time',
          cost: 0,
          grade: 'okay',
          insight:
            "Accepting a loss you can explain beats fighting the client over it. But 'more discipline' is a promise, not a mechanism: without a change log and one intake channel, the same leak reopens next week.",
          outcome: {
            text: "{boss} accepts the write-off with a long exhale. Two new 'small asks' arrive from Zurich before the meeting ends.",
            effects: { budget: -5, rel: { boss: -3 } },
          },
        },
        {
          id: 'd',
          label: 'Claw the margin back by trimming QA days for the rest of the program',
          cost: 2,
          grade: 'poor',
          insight:
            "Cutting quality to repair margin moves the cost to the client's users and your firm's reputation, usually at a higher price. Fix the leak (unrecorded scope), not the symptom.",
          outcome: {
            text: 'QA drops to half-time. The margin graph twitches upward. So does the defect count.',
            effects: { budget: 8, quality: -8, morale: -4, rel: { lead: -6 } },
          },
        },
      ],
      ignored: {
        text: "You skip the review. Rupert's retroactive CR goes out with your name in the cc line.",
        effects: { budget: 5, trust: -6, rel: { sponsor: -6, boss: -4 } },
      },
    },

    // ───────────── Flavour: the role-play that redesigned the redesign ─────────────
    {
      id: 'ar-rm-shadowing',
      scenarios: ['alpenrose'],
      title: 'The role-play that redesigned the redesign',
      channel: 'slack',
      from: 'pm',
      body: "Grazie for joining the RM role-play! Did you see? When Sandra turned the tablet to show her 'client' the portfolio, the sidebar listed eleven other clients by name. Every RM makes that turn, in every meeting. And half our clients are over 70: the font is tiny. We need a client presentation mode. It's small, right?",
      urgency: 'normal',
      weight: 2,
      when: { minDay: 2, maxDay: 9 },
      concept: 'scope-creep',
      skill: 'stakeholder',
      choices: [
        {
          id: 'a',
          label: "Build it quietly this week: it's obviously right, and {pm} will love you for it",
          cost: 1,
          grade: 'poor',
          insight:
            "It's obviously right, which is why it deserves a proper decision. Building it unrecorded hides a real change from the client, eats margin, and teaches the client that discoveries are free. Size it and agree the trade-off in the open.",
          outcome: {
            text: 'Presentation mode ships within a week, unplanned and unbilled. {pm} loves it. Your burn-down does not.',
            effects: { scope: { client: 10 }, quality: 2, morale: -2, rel: { pm: 6 }, addRisks: ['ar-risk-margin'] },
          },
        },
        {
          id: 'b',
          label: 'Log it for v3: the design was signed off months ago',
          cost: 0,
          grade: 'poor',
          insight:
            "A signed-off design that shows one client another client's name is still a confidentiality bug. 'It's per spec' wins disputes and loses accounts. Treat research findings like defects: size them, prioritise, decide.",
          outcome: {
            text: '{pm} goes quiet. Two days later {security}, who heard about it from {pm}, files it as a CID finding against the release.',
            effects: {
              trust: -4,
              rel: { pm: -6, security: -4 },
              block: { ws: 'review', days: 1, reason: 'CID finding: other clients visible in the sidebar' },
            },
          },
        },
        {
          id: 'c',
          label: 'Raise a CR for presentation mode and start once the bank approves it',
          cost: 2,
          grade: 'okay',
          insight:
            "Correct process, slow outcome. Waiting on procurement while a confidentiality issue sits in the design burns days you don't have. A scope swap the product owner can approve today often beats a CR that needs a signature next week.",
          outcome: {
            text: "The CR waits five days for procurement in Zurich. Presentation mode squeezes into the final week, and so does everyone's weekend.",
            effects: { scope: { client: 8 }, budget: 8, morale: -3, rel: { pm: -2 } },
          },
        },
        {
          id: 'd',
          label: 'Size it with {lead}, then offer {pm} a swap: presentation mode in, widgets out',
          cost: 2,
          grade: 'best',
          insight:
            'Research that changes the design is a gift, if you control the change. Size it fast, then offer the product owner a like-for-like swap so scope, date and margin stay whole. Write it down: a swap is still a scope change, just one that costs nothing.',
          outcome: {
            text: '{lead} sizes it at four days. {pm} trades the dashboard widgets nobody uses for presentation mode and signs the change note. Sandra mentions the RM Academy is training from screenshots three versions old. {security} sends a thumbs-up.',
            effects: {
              trust: 3,
              quality: 4,
              scope: { client: 2 },
              rel: { pm: 5, security: 3, lead: 3 },
              revealRisks: ['ar-risk-adoption'],
            },
          },
        },
      ],
      ignored: {
        text: 'Nobody replies. {pm} asks Wei Ting directly, and she starts building presentation mode on Saturday.',
        effects: { scope: { client: 8 }, morale: -3, rel: { pm: -3 }, addRisks: ['ar-risk-margin'] },
      },
    },

    // ───────────── Flavour: "just one field" ─────────────
    {
      id: 'ar-just-one-field',
      scenarios: ['alpenrose'],
      title: "'Just one field', asked directly of your engineer",
      channel: 'slack',
      from: 'lead',
      body: "Eh, {pm} messaged Arvind directly: 'Can you just add the client's risk profile to the portfolio header? One field only.' Arvind already started. It's not one field: a different API, suitability rules, and {compliance} will want to approve the wording. That's the third direct ask this week.",
      urgency: 'normal',
      weight: 2,
      when: { minDay: 3, maxDay: 12 },
      concept: 'vendor-mgmt',
      skill: 'leadership',
      choices: [
        {
          id: 'a',
          label: 'Let Arvind finish it: one field keeps the client happy',
          cost: 0,
          grade: 'poor',
          insight:
            "'One field' is how fixed-price projects die: unpriced, unreviewed and invisible until the margin review. Worse, it teaches the client that your engineers are a shortcut around you. Welcome the idea; route the ask.",
          outcome: {
            text: "Arvind takes three days, not one. {compliance} rejects the wording, so he redoes it. {pm}, delighted, sends Arvind two more 'tiny' ideas.",
            effects: { scope: { core: 6, client: 4 }, rel: { pm: 4, lead: -5 }, addRisks: ['ar-risk-margin'] },
          },
        },
        {
          id: 'b',
          label: 'Thank {pm}, size it into the change log, and agree one intake channel',
          cost: 1,
          grade: 'best',
          insight:
            'Clients go straight to engineers because it works. Make the official path just as easy: one backlog, a quick size, a visible decision. Thank the client for the idea, protect your engineer from saying yes, and never let a change go unrecorded.',
          outcome: {
            text: "{pm} laughs: 'I was being a bad client, no?' The field is sized at four days and traded against a low-value report. Approving the wording, {compliance} asks an innocent question about how long messages are kept.",
            effects: { quality: 2, rel: { pm: 3, lead: 5 }, flags: ['ar:change-log'], revealRisks: ['ar-risk-retention'] },
          },
        },
        {
          id: 'c',
          label: 'Tell Arvind to stop, and remind the team that every client ask goes through you',
          cost: 0,
          grade: 'okay',
          insight:
            "Right rule, wrong audience. Your engineer did nothing wrong by being helpful, and it's the client who needs a better path. Fix the channel with the client, kindly, rather than policing your own team.",
          outcome: {
            text: "Arvind stops, embarrassed. {pm}'s next idea goes to Wei Ting instead.",
            effects: { rel: { lead: -2, pm: -2 } },
          },
        },
        {
          id: 'd',
          label: 'Email {sponsor} that her product owner keeps bypassing the agreed process',
          cost: 0,
          grade: 'poor',
          insight:
            'Escalating a friendly product owner to his boss over one field turns a habit into a feud, and vendors rarely win those. Talk to him first; escalate a pattern only after the direct conversation fails.',
          outcome: {
            text: '{sponsor} forwards your email to {pm} without comment. {pm} stops asking your engineers for things. He also stops telling you things.',
            effects: { trust: -2, rel: { pm: -10, sponsor: -2 } },
          },
        },
      ],
      ignored: {
        text: "Arvind keeps going. Two days later the 'one field' has a new API call, two edge cases and a wording dispute with {compliance}.",
        effects: { scope: { core: 6, client: 4 }, rel: { lead: -3 }, addRisks: ['ar-risk-margin'] },
      },
    },

    // ───────────── Flavour: the dinner promise ─────────────
    {
      id: 'ar-dinner-promise',
      scenarios: ['alpenrose'],
      title: 'Rupert promised what at dinner?',
      channel: 'email',
      from: 'sponsor',
      body: 'Dear {player}, a lovely dinner with Rupert last night. He confirmed {company} will add offline mode for the conference: our RMs often visit clients in chalets with no signal. Thank you for the flexibility. Could you share the plan within two days? Kind regards, R. Steiner',
      urgency: 'normal',
      weight: 2,
      when: { minDay: 3, maxDay: 11 },
      concept: 'client-delivery',
      skill: 'comms',
      choices: [
        {
          id: 'a',
          label: 'Confirm it: contradicting your own account director in public would embarrass the firm',
          cost: 0,
          grade: 'poor',
          insight:
            "One voice to the client matters, but agreeing to an unsized promise turns someone else's dinner into your team's weekend. Align internally first, then go back to the client with one position and real options.",
          outcome: {
            text: "Your plan includes offline mode and no extra days. {lead} reads it, closes her laptop and goes for a long walk.",
            effects: { scope: { core: 8, client: 10 }, trust: 2, morale: -5, rel: { sponsor: 3, lead: -8 } },
          },
        },
        {
          id: 'b',
          label: 'Reply to {sponsor} that offline mode was never in scope',
          cost: 0,
          grade: 'poor',
          insight:
            'Correcting your own account director in writing to the client is a public split: it embarrasses your firm and teaches the client to play you against each other. Align with him first, then answer together.',
          outcome: {
            text: "{sponsor} forwards your reply to Rupert: 'Please clarify.' Rupert calls you from Zurich. It is not a short call.",
            effects: { trust: -3, rel: { sponsor: -4, boss: -5 } },
          },
        },
        {
          id: 'c',
          label: 'Align with Rupert first, then offer offline viewing now and full offline as a CR',
          cost: 2,
          grade: 'best',
          insight:
            "When your own side over-promises, align internally before you answer: same facts, one position, no public correction. Then turn the promise into options with prices. Clients forgive 'here is what we can do by when'; they never forgive hearing two stories.",
          outcome: {
            text: "Rupert admits he 'may have been enthusiastic'. You reply together: cached read-only portfolios for the conference, full offline editing as a priced phase 2. {sponsor} accepts both. {boss} asks Rupert to take you to the next dinner.",
            effects: { scope: { client: 4 }, trust: 4, budget: 10, rel: { sponsor: 3, boss: 4 } },
          },
        },
        {
          id: 'd',
          label: 'Ask {boss} to make Rupert walk the promise back with the client himself',
          cost: 1,
          grade: 'okay',
          insight:
            'Escalating through your own leadership is right when someone on your side over-commits. But a forced walk-back costs Rupert face with his client. Agree the fix together first, then let leadership back it.',
          outcome: {
            text: '{boss} and Rupert have a frosty call. Rupert walks it back, and {sponsor} now wonders which of you speaks for the firm.',
            effects: { trust: -2, rel: { sponsor: -3, boss: 2 } },
          },
        },
      ],
      ignored: {
        text: 'Two days pass. {sponsor} tells {pm} offline mode is confirmed, and {pm} tells the RM champions.',
        effects: { scope: { core: 6, client: 8 }, trust: -2, rel: { lead: -4 } },
      },
    },

    // ───────────── Flavour: the call that keeps moving ─────────────
    {
      id: 'ar-zurich-call',
      scenarios: ['alpenrose'],
      title: 'Your 7am Zurich call is now at midnight. Yours.',
      channel: 'calendar',
      from: 'pm',
      body: "Scusa {player}, a client breakfast came up, so I must move our 7am call again. Could we do 5pm Zurich? That's midnight for you, I think. Only 30 minutes, and we need decisions on the client view before your team builds it. Third move this week, I know. An RM's calendar belongs to the clients.",
      urgency: 'normal',
      weight: 2,
      when: { minDay: 2, maxDay: 12 },
      concept: 'cross-timezone',
      skill: 'comms',
      choices: [
        {
          id: 'a',
          label: 'Put decisions in writing with 24h to reply; protect one 8am Zurich slot a week',
          cost: 2,
          grade: 'best',
          insight:
            "If a decision needs a meeting that keeps moving, the meeting is the bottleneck. Write decisions up with options and a reply-by time, protect one overlap slot the client's calendar can't eat, and let silence default to your recommendation. Async beats midnight.",
          outcome: {
            text: '{pm} loves the decision doc: he answers it from the tram between clients. The protected slot survives two client breakfasts, and your team gets its evenings back.',
            effects: { morale: 4, quality: 2, rel: { pm: 4, lead: 4 } },
          },
        },
        {
          id: 'b',
          label: "Take the midnight call: the client's calendar comes first",
          cost: 1,
          grade: 'poor',
          insight:
            'Accommodating once is service; accommodating by default trains the client to treat your night as their afternoon. You make worse decisions at midnight, and decisions are what this call is for.',
          outcome: {
            text: 'You take the call at midnight. {pm} joins at 12:20 from a taxi. You agree something about the client view that neither of you remembers the same way next morning.',
            effects: { energy: -10, quality: -3, rel: { pm: 3 } },
          },
        },
        {
          id: 'c',
          label: 'Ask {boss} to fund an onsite business analyst in Zurich until the conference is done',
          cost: 2,
          grade: 'okay',
          insight:
            "An onsite coordinator is a classic offshore-delivery fix, and it builds relationships fast. But it's costly and slow to set up mid-program, and it doesn't change how decisions get made. Fix the decision process first; add people second.",
          outcome: {
            text: '{boss} funds a two-week onsite stint for a business analyst. Decisions get faster. The budget gets smaller.',
            effects: {
              budget: -12,
              rel: { pm: 4, boss: -2 },
              velocity: { ws: 'client', mult: 1.1, days: 3, label: 'Onsite analyst speeding decisions' },
            },
          },
        },
        {
          id: 'd',
          label: 'Skip it, and let the team build the client view on its best guess',
          cost: 0,
          grade: 'poor',
          insight:
            "Building on guesses to save a meeting moves the cost into rework, and as the vendor, rework is usually yours to pay for. If you can't get a decision live, get it in writing before you build.",
          outcome: {
            text: "The team builds its best guess. {pm}'s feedback arrives two days later: 'Very nice! But no.'",
            effects: { progress: { client: -4 }, rel: { pm: -3 } },
          },
        },
      ],
      ignored: {
        text: 'The call slides by a day, then by another. The team builds on assumptions in the meantime.',
        effects: { morale: -2, progress: { client: -3 }, rel: { pm: -2 } },
      },
    },
  ],
}
