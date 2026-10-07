import type { ScenarioDef } from '../../game/types'

/**
 * Lion City Bank — "The Merlion Cutover" (difficulty 3).
 *
 * The player inherits a RED program three weeks before cutover weekend at a fictional
 * Singapore retail bank. It teaches the bank flavour of the TPM job: SI/vendor management,
 * SIT vs UAT, the Change Advisory Board, cutover rehearsals with a point of no return, and
 * MAS technology-risk expectations (critical-system RTO, incident notification, security
 * testing, outsourcing) plus PDPA breach handling.
 *
 * Tuning at neutral play (start morale 45 / quality 55 → velocity factor ≈ 0.895):
 *   platform Day 10 · core Day 13 · data Day 15 · review Day 16 · client Day 17
 *   → projected launch Day 17. Critical chain: client ← core (the vendor build gates the
 *   last quarter of channel integration). Recovery levers: re-baseline (Day 1), descope a
 *   channel to wave 2 or buy vendor capacity (Day 8), and raise morale/quality.
 */
export const LIONCITY: ScenarioDef = {
  id: 'lioncity',
  name: 'The Merlion Cutover',
  company: 'Lion City Bank',
  companyBlurb:
    'A 70-year-old Singapore retail bank: 1.4 million customers, 60 branches, one very senior mainframe and a 30th-floor boardroom overlooking Raffles Place.',
  program: 'Project Merlion',
  product: 'Retail Payments Hub',
  tagline: 'The status report says green. The defect log disagrees.',
  difficulty: 3,
  setting: 'Raffles Place, Singapore · vendor delivery centre in Chennai & Bangalore',
  brief: [
    'Welcome to {company}, {player}. Your predecessor on {program} resigned last Friday, leaving you a lanyard, a desk near Raffles Place and eight weeks of status reports that all say GREEN.',
    "{program} moves the {product} off a mainframe-era stack and onto the bank's private cloud. It is the plumbing behind every PayNow, FAST and GIRO payment a customer makes: in the app, online, at an ATM or over a branch counter. The build is outsourced to Infynix Solutions, whose dates have slipped twice. Cutover weekend starts on Day 15.",
    "In a bank, a TPM is less 'move fast' and more 'land safely': vendor contracts, SIT and UAT, a Change Advisory Board, a cutover runbook with a point of no return, and MAS technology-risk expectations. Morale and trust are low. Contingency, for once, is not. Spend it wisely.",
  ],
  targetDay: 15,
  maxDay: 20,
  start: { morale: 45, trust: 35, quality: 55, budget: 150 },
  hue: 355,
  icon: '🦁',

  cast: {
    boss: {
      role: 'boss',
      name: 'Gerald Fernandez',
      short: 'Gerald',
      title: 'Head of Technology Delivery, Consumer Banking',
      avatar: '🧭',
      hue: 220,
      power: 4,
      interest: 4,
      location: 'Raffles Place, CBD',
      bio: "Hired you to fix this. Calm, dry, allergic to 40-page decks. Wants one page: what's true, what you need, and what you've already tried.",
    },
    sponsor: {
      role: 'sponsor',
      name: 'Wong Mei Ling',
      short: 'Mdm Wong',
      title: 'Managing Director, Consumer Banking Technology',
      avatar: '🏛️',
      hue: 350,
      power: 5,
      interest: 4,
      location: '30th floor, Raffles Place',
      bio: 'Three decades in banking, three core migrations, zero tolerance for surprises. Bring bad news early, in writing, with options and a recommendation.',
    },
    pm: {
      role: 'pm',
      name: 'Nur Aisyah binte Rahman',
      short: 'Aisyah',
      title: 'Head of Retail Payments Operations (Business Owner)',
      avatar: '🧾',
      hue: 170,
      power: 4,
      interest: 5,
      location: 'Ops centre, Changi Business Park',
      bio: "Her team answers the phones when payments break, so she owns UAT sign-off and won't sign what her people haven't tested. Month-end is sacred.",
    },
    lead: {
      role: 'lead',
      name: 'Daniel Koh Wei Jie',
      short: 'Daniel',
      title: 'Lead Solution Architect',
      avatar: '📐',
      hue: 28,
      power: 3,
      interest: 5,
      location: 'Raffles Place, CBD',
      bio: 'Knows every mainframe interface because he built half of them. Owns channel integration and the migration scripts. Blunt, brilliant, hates slideware.',
    },
    partner: {
      role: 'partner',
      name: 'Karthik Ramanathan',
      short: 'Karthik',
      title: 'Delivery Manager, Infynix Solutions',
      avatar: '🤝',
      hue: 268,
      power: 3,
      interest: 5,
      location: 'Onsite at Raffles Place · team in Chennai & Bangalore',
      bio: "Runs 60 engineers across Chennai and Bangalore and knows the SOW by heart. Says 'can' when his account director is listening; tells you the truth over kopi.",
    },
    sre: {
      role: 'sre',
      name: 'Faizal bin Osman',
      short: 'Faizal',
      title: 'Private Cloud Platform Lead',
      avatar: '🧯',
      hue: 120,
      power: 3,
      interest: 3,
      location: 'Data centre ops, Tampines',
      bio: "Runs the bank's private cloud and its DR site. Firewall changes take five working days and he won't apologise for it. Get into his queue early.",
    },
    security: {
      role: 'security',
      name: 'Priya Menon',
      short: 'Priya',
      title: 'Technology Risk Manager',
      avatar: '🔍',
      hue: 48,
      power: 4,
      interest: 3,
      location: 'Raffles Place, CBD',
      bio: 'Reads the MAS TRM Guidelines for fun. Not the department of no: she needs evidence, not assurances. Share findings early and she will back you at CAB.',
    },
    compliance: {
      role: 'compliance',
      name: 'Hazel Ong Li Ting',
      short: 'Hazel',
      title: 'Compliance Lead & Data Protection Officer',
      avatar: '⚖️',
      hue: 305,
      power: 4,
      interest: 2,
      location: 'Raffles Place, CBD',
      bio: 'Owns PDPA and the outsourcing register. Unflappable, until customer data leaves a controlled environment. Wants incidents in minutes, not sprints.',
    },
  },

  workstreams: [
    {
      role: 'core',
      name: 'Payments Hub Build (Infynix)',
      icon: '🏦',
      owner: 'partner',
      work: 160,
      done: 80,
      velocity: 7,
      description:
        "Infynix's build of the new hub: PayNow/FAST, GIRO and ATM-transfer interfaces, plus burning down the SIT defect backlog. Fixed-price SOW, and the critical path.",
    },
    {
      role: 'client',
      name: 'Channels Integration',
      icon: '📱',
      owner: 'lead',
      work: 100,
      done: 40,
      velocity: 6,
      deps: [{ on: 'core', capAt: 0.75 }],
      description:
        'Internet and mobile banking, ATMs and branch teller systems re-pointed to the new hub. The last quarter of the work needs a stable hub to integrate against.',
    },
    {
      role: 'platform',
      name: 'Private Cloud Landing Zone',
      icon: '☁️',
      owner: 'sre',
      work: 70,
      done: 35,
      velocity: 4,
      description: "Network zones, firewall rules, HSM keys, observability and the DR site on the bank's private cloud.",
    },
    {
      role: 'data',
      name: 'Data Migration & Reconciliation',
      icon: '🧮',
      owner: 'lead',
      work: 80,
      done: 28,
      velocity: 6,
      deps: [{ on: 'platform', capAt: 0.6 }],
      description:
        'Mock migrations of payees, GIRO mandates and future-dated payments, reconciled to the cent. Full-volume runs need the finished landing zone.',
    },
    {
      role: 'review',
      name: 'Tech Risk, VAPT & Compliance',
      icon: '🛡️',
      owner: 'security',
      work: 60,
      done: 12,
      velocity: 5,
      deps: [{ on: 'core', capAt: 0.75 }],
      description:
        'Technology risk assessment, VAPT and retests, outsourcing and PDPA checks, and the CAB change pack. The gate between you and go-live.',
    },
  ],

  risks: [
    {
      id: 'lc-risk-sit-sev1',
      title: 'Sev-1s hiding in the SIT backlog',
      description:
        "Infynix's SIT exit triggers a milestone payment, and severity is self-assessed. Real Sev-1s may be tagged 'cosmetic' to hit the date, then surface in UAT or on cutover night.",
      ws: 'core',
      owner: 'lead',
      likelihood: 4,
      impact: 4,
      initial: 'hidden',
      earliestDay: 3,
      mitigation: {
        label: 'Joint severity re-triage of the SIT backlog',
        cost: 2,
        text: "You, Daniel and Karthik re-triage the backlog against the SOW's severity definitions. Three 'Sev-3s' turn out to be Sev-1s, found now instead of on cutover night.",
        effects: { quality: 4, scope: { core: 4 } },
      },
      trigger: 'lc-sev1-hiding',
    },
    {
      id: 'lc-risk-recon',
      title: "Migration won't reconcile to the cent",
      description:
        'Mock migrations of future-dated payments and GIRO mandates must reconcile exactly. Transform bugs on edge cases (weekend dates, closed accounts) can leave unexplained breaks.',
      ws: 'data',
      owner: 'lead',
      likelihood: 3,
      impact: 5,
      initial: 'open',
      earliestDay: 5,
      mitigation: {
        label: 'Add a full-reconciliation mock migration',
        cost: 2,
        text: "You book an extra mock run with full reconciliation, every record and every cent, and make 'reconciliation fully explained' a go/no-go criterion.",
        effects: { budget: -10, quality: 3 },
      },
      trigger: 'lc-recon-break',
    },
    {
      id: 'lc-risk-vapt',
      title: 'VAPT finds high-severity holes',
      description:
        'VAPT on the internet-facing payment APIs is scheduled late. High-severity findings must be fixed and retested before Tech Risk will sign the assessment.',
      ws: 'review',
      owner: 'security',
      likelihood: 3,
      impact: 4,
      initial: 'open',
      earliestDay: 6,
      mitigation: {
        label: 'Pull the VAPT forward onto the SIT build',
        cost: 2,
        text: "Priya books the testers a week early against the SIT build, so findings land while there's still time to fix them properly.",
        effects: { budget: -12, rel: { security: 4 } },
      },
      trigger: 'lc-vapt-highs',
    },
    {
      id: 'lc-risk-key-person',
      title: "Vendor's lead architect rolled off",
      description:
        "Infynix's lead architect is in demand on another account. If the vendor rotates him off before cutover, the design knowledge walks out with him.",
      ws: 'core',
      owner: 'partner',
      likelihood: 3,
      impact: 4,
      initial: 'hidden',
      earliestDay: 4,
      mitigation: {
        label: 'Confirm key personnel in writing with Infynix',
        cost: 1,
        text: "You email Karthik to confirm the SOW's named key personnel and the consent-plus-overlap rule for any swap. Polite, specific, in writing. He forwards it upstairs, looking slightly relieved.",
        effects: { rel: { partner: 2 } },
      },
      trigger: 'lc-key-person',
    },
    {
      id: 'lc-risk-uat-users',
      title: 'UAT testers lost to month-end',
      description:
        'UAT overlaps month-end close. The business testers are the same people who clear payment exceptions, and month-end always wins.',
      ws: 'client',
      owner: 'pm',
      likelihood: 3,
      impact: 3,
      initial: 'open',
      earliestDay: 6,
      mitigation: {
        label: 'Book UAT testers and month-end backfill now',
        cost: 2,
        text: "You and Aisyah lock eight testers' calendars and pre-book temp backfill for month-end. It costs money. It's cheaper than thin UAT.",
        effects: { budget: -10, rel: { pm: 5 } },
      },
      trigger: 'lc-uat-month-end',
    },
    {
      id: 'lc-risk-dr-rto',
      title: 'DR failover misses the 4-hour RTO',
      description:
        'The new hub is a critical system, so it must recover within a 4-hour RTO. Nobody has failed it over to the DR site yet.',
      ws: 'platform',
      owner: 'sre',
      likelihood: 2,
      impact: 5,
      initial: 'hidden',
      earliestDay: 7,
      mitigation: {
        label: 'Run an early DR failover drill',
        cost: 2,
        text: "Faizal books a DR drill on the new landing zone in week 2. If recovery is slow, you'll find out with time left to fix it.",
        effects: { rel: { sre: 3 } },
      },
      trigger: 'lc-dr-rto',
    },
    {
      id: 'lc-risk-test-data',
      title: 'Real customer data in test',
      description:
        'Non-production should hold masked data only. If a production extract slipped into SIT, offshore vendor staff may have seen customer data: a PDPA and outsourcing problem.',
      ws: 'data',
      owner: 'compliance',
      likelihood: 2,
      impact: 4,
      initial: 'hidden',
      earliestDay: 4,
      mitigation: {
        label: 'Scan non-prod for real data; review vendor access',
        cost: 2,
        text: 'Hazel and Faizal scan every non-production environment for unmasked customer data and review who can reach it from offshore. Two stale accounts are removed.',
        effects: { rel: { compliance: 5 } },
      },
      trigger: 'lc-test-data-leak',
    },
    {
      id: 'lc-risk-tiger-team',
      title: 'Tiger team slows the core team',
      description:
        "Twelve late-joining Infynix engineers need onboarding from the people fixing Sev-1s. Brooks's law: the team may get slower before it gets faster.",
      ws: 'core',
      owner: 'lead',
      likelihood: 4,
      impact: 3,
      initial: 'dormant',
      earliestDay: 9,
      mitigation: {
        label: 'Ring-fence the tiger team on defect queues',
        cost: 1,
        text: "You put the newcomers on isolated, well-specified defect queues with their own lead, so Daniel's architects stop being a help desk.",
        effects: { rel: { lead: 3 } },
      },
      trigger: 'lc-tiger-team',
    },
  ],

  assumptions: [
    'Go/no-go is on Day 15; the cutover outage runs overnight that weekend. CAB holds one fallback window soon after; then the year-end change freeze begins.',
    'Infynix delivers to a fixed-price SOW: anything not in Schedule B is a change request.',
    'The Retail Payments Hub is a critical system: recovery time objective of 4 hours or less, DR tested before go-live.',
    'UAT needs eight business testers from Retail Payments Operations for four days.',
    'Non-production environments hold masked test data only.',
    'Digital channels may be offline for up to 6 hours overnight during cutover; customers are notified in advance.',
  ],

  events: [
    // ───────────── Story beat: Day 1 — the watermelon ─────────────
    {
      id: 'lc-watermelon',
      scenarios: ['lioncity'],
      title: 'The status report says green',
      channel: 'slack',
      from: 'lead',
      body: "Since nobody else will tell you: the GREEN on {program}'s status report is paint. 212 open SIT defects, Infynix has missed two milestones, and the cutover runbook is a Word doc that says TBC a lot. {sponsor}'s SteerCo deck still says green. Welcome to {company} lah.",
      urgency: 'high',
      expires: 2,
      weight: 0,
      fixedDay: 1,
      concept: 'rag-status',
      skill: 'comms',
      choices: [
        {
          id: 'a',
          label: 'Give it a week: verify everything yourself before changing any colours',
          cost: 0,
          grade: 'poor',
          insight:
            "Verifying is wise; a week of silence isn't. Every day a red program reports green, the bill grows, and sponsors forgive bad news far faster than late news. Say 'likely red, full picture by Wednesday' today.",
          outcome: {
            text: "You spend the week 'getting up to speed'. {sponsor}'s pre-read still says green, and every day it does, it becomes a little more yours. {lead} stops cc'ing you on defect triage.",
            effects: {
              morale: -3,
              rel: { lead: -5 },
              flags: ['lc:sat-on-red'],
              followUps: [{ event: 'lc-sponsor-hears-first', inDays: 4 }],
            },
          },
        },
        {
          id: 'b',
          label: 'Go RED today: re-baseline to the fallback window, with a recovery plan',
          cost: 2,
          grade: 'best',
          insight:
            "Bad news early, with a plan, is the job. A credible red with a recovery plan and a date you believe beats a green that dies at SteerCo. Sponsors don't need you to be lucky; they need no surprises.",
          outcome: {
            text: "You spend the morning in the defect log and Infynix's burn-down, then walk up to the 30th floor. {sponsor} is silent for five long seconds. 'Thank you. Nobody has said red to me in two months.' She approves the fallback window, and expects you to hit it.",
            effects: {
              trust: 4,
              morale: 4,
              targetDay: 2,
              rel: { sponsor: 6, boss: 5, lead: 5 },
              flags: ['lc:red-early', 'lc:rebaselined'],
              revealRisks: ['lc-risk-sit-sev1'],
            },
          },
        },
        {
          id: 'c',
          label: "Call it AMBER, 'recovering', until you've had time to build a real replan",
          cost: 1,
          grade: 'poor',
          insight:
            'Amber-washing is a watermelon with better PR. If the critical path misses the date without intervention, it is red, and red with a plan is a respectable status. Amber means at risk, but the plan you already have still lands it.',
          outcome: {
            text: 'The SteerCo deck goes amber. {sponsor} nods and moves on. {lead} says nothing, which says plenty.',
            effects: {
              trust: 2,
              rel: { lead: -6 },
              flags: ['lc:amber-washed'],
              followUps: [{ event: 'lc-sponsor-hears-first', inDays: 4 }],
            },
          },
        },
        {
          id: 'd',
          label: 'Go RED but keep Day 15: promise a recovery sprint to claw it back',
          cost: 1,
          grade: 'okay',
          insight:
            'Honest colour, wishful date. A recovery plan that relies on overtime and luck is the next watermelon. Re-baseline to the date the evidence supports, then try to beat it: sponsors remember dates, not effort.',
          outcome: {
            text: "{sponsor} appreciates the candour, then minutes 'Day 15 confirmed'. The team hears 'recovery sprint' and starts cancelling weekend plans.",
            effects: {
              trust: 2,
              morale: -5,
              rel: { sponsor: 3 },
              velocity: { ws: 'all', mult: 1.15, days: 3, label: 'Recovery sprint' },
              flags: ['lc:red-early'],
            },
          },
        },
      ],
      ignored: {
        text: "Monday becomes Wednesday. The SteerCo pre-read still says green, and it's starting to have your name on it.",
        effects: {
          trust: -3,
          rel: { lead: -5 },
          flags: ['lc:sat-on-red'],
          followUps: [{ event: 'lc-sponsor-hears-first', inDays: 3 }],
        },
      },
    },

    // ───────────── Chain: the sponsor hears it from the vendor ─────────────
    {
      id: 'lc-sponsor-hears-first',
      scenarios: ['lioncity'],
      title: '15 minutes with {sponsor}. No agenda.',
      channel: 'calendar',
      from: 'sponsor',
      body: "I'll be brief, {player}. Infynix's account director told me over lunch that {program} is 'facing headwinds'. Your pre-read says otherwise. So tell me: why am I hearing this from a vendor?",
      urgency: 'critical',
      weight: 0,
      concept: 'escalation',
      skill: 'comms',
      choices: [
        {
          id: 'a',
          label: 'Explain, calmly, that you inherited reports built on a false baseline',
          cost: 0,
          grade: 'poor',
          insight:
            "True, and irrelevant. Once your name is on the report, it's yours. Blaming the inheritance sounds like you still aren't owning it: own it, show the real picture, and talk about the plan, not the past.",
          outcome: {
            text: "{sponsor}: 'You've had a week, {player}.' The meeting ends four minutes early. {boss} gets a phone call shortly after.",
            effects: { trust: -8, rel: { sponsor: -8, boss: -4 } },
          },
        },
        {
          id: 'b',
          label: 'Ask for a week to bring a full re-plan to SteerCo',
          cost: 1,
          grade: 'okay',
          insight:
            'A re-plan is right, but asking for another week after a week of silence spends credibility you no longer have. Share what you know now, even rough, and commit to a date for the detail.',
          outcome: {
            text: "'Fine. Wednesday.' {sponsor} writes something down. You suspect it's your name.",
            effects: { trust: -5, rel: { sponsor: -4 } },
          },
        },
        {
          id: 'c',
          label: 'Own it: go RED, re-baseline to the fallback window, show the plan',
          cost: 2,
          grade: 'best',
          insight:
            "When a sponsor hears bad news from someone else, the only recovery is complete ownership, immediately: the real status, the plan, a date you believe, and how you'll keep them ahead of it from now on.",
          outcome: {
            text: "You show her the defect curve, the recovery plan and a date you believe. She approves the fallback window, coolly. 'Next time, I hear it from you first.' Fair.",
            effects: {
              trust: -2,
              targetDay: 2,
              rel: { sponsor: 3 },
              flags: ['lc:rebaselined'],
              clearFlags: ['lc:sat-on-red', 'lc:amber-washed'],
            },
          },
        },
      ],
      ignored: {
        text: 'You miss the slot. {sponsor} calls {boss} instead, {boss} calls you, and nobody enjoys any of it.',
        effects: { trust: -10, rel: { sponsor: -10, boss: -6 } },
      },
    },

    // ───────────── Story beat: Day 8 SteerCo (behind) ─────────────
    {
      id: 'lc-steerco-behind',
      scenarios: ['lioncity'],
      title: 'SteerCo, 30th floor: the projection is late',
      channel: 'meeting',
      from: 'sponsor',
      body: "Your projection misses the cutover date. Infynix's account director tells me more engineers will fix it. {pm} tells me nobody touches UAT. I don't want a menu, {player}. I want your recommendation.",
      urgency: 'high',
      weight: 0,
      fixedDay: 8,
      when: { behindSchedule: true },
      concept: 'iron-triangle',
      skill: 'stakeholder',
      choices: [
        {
          id: 'a',
          label: 'Recommend branch payments move to a wave 2; keep the cutover date',
          cost: 2,
          grade: 'best',
          insight:
            "Recommend, don't just present a menu. Moving a lower-volume channel to a later wave shrinks cutover-night risk and protects quality. Name its cost, a short dual-running period with its own reconciliation, and minute the decision.",
          outcome: {
            text: '{sponsor} asks two sharp questions about dual-running, then agrees. {pm} is quietly relieved: fewer moving parts on cutover night. Branch payments move to wave 2, and the decision goes in the minutes.',
            effects: {
              scope: { client: -20 },
              trust: 5,
              morale: 4,
              rel: { sponsor: 5, pm: 4, lead: 4 },
              flags: ['lc:branch-wave-2'],
            },
          },
        },
        {
          id: 'b',
          label: "Approve Infynix's CR for a twelve-engineer tiger team",
          cost: 1,
          grade: 'okay',
          insight:
            "More people is the vendor's favourite answer because it's billable, and late joiners need onboarding from your busiest engineers (Brooks's law). If you buy capacity, buy named, experienced people on isolated work.",
          outcome: {
            text: 'Signed before lunch. Infynix sends a fruit hamper. Twelve new laptops now need firewall access by Monday, which {sre} hears about from you, today.',
            effects: {
              budget: -45,
              trust: 2,
              velocity: { ws: 'core', mult: 1.25, days: 4, label: 'Infynix tiger team' },
              rel: { partner: 6, sre: -3 },
              addRisks: ['lc-risk-tiger-team'],
            },
          },
        },
        {
          id: 'c',
          label: 'Hold the date with mandatory weekend work until cutover',
          cost: 1,
          grade: 'poor',
          insight:
            "Overtime is a sprint tool, not a plan. Exhausted teams inject defects, and in payments a defect is somebody's money. Trade scope, time or cost, never quality.",
          outcome: {
            text: "{sponsor} likes the resolve. The team likes nothing. Saturday's commits are fast; so are Monday's new defects.",
            effects: {
              velocity: { ws: 'all', mult: 1.2, days: 3, label: 'Mandatory weekends' },
              morale: -10,
              quality: -6,
              energy: -5,
              trust: 2,
              rel: { lead: -6, partner: -4 },
            },
          },
        },
        {
          id: 'd',
          label: 'Use the fallback window: move cutover and rebook the CAB slot',
          cost: 1,
          grade: 'okay',
          requires: { notFlags: ['lc:rebaselined'] },
          lockedHint: 'You already spent the fallback window when you re-baselined',
          insight:
            "Using time is legitimate when scope and cost can't absorb the slip, but this burns the last window before the year-end freeze. If anything else breaks, the next slot is January. Spend your last reserve last.",
          outcome: {
            text: '{sponsor} agrees, without enthusiasm. The change manager rebooks the window. Your buffer is now exactly zero days.',
            effects: { targetDay: 2, trust: -2, morale: 3, rel: { sponsor: -2 }, flags: ['lc:rebaselined'] },
          },
        },
      ],
      ignored: {
        text: "You're stuck on an Infynix call and miss the slot. SteerCo decides without you: hold the date and 'work smarter'. Everyone knows what that means.",
        effects: {
          trust: -6,
          morale: -6,
          rel: { sponsor: -6 },
          velocity: { ws: 'all', mult: 1.1, days: 2, label: "'Work smarter'" },
        },
      },
    },

    // ───────────── Story beat: Day 8 SteerCo (on track) ─────────────
    {
      id: 'lc-steerco-ontrack',
      scenarios: ['lioncity'],
      title: 'SteerCo: on track, so Finance wants your buffer',
      channel: 'meeting',
      from: 'sponsor',
      body: "For the first time this year, {program}'s projection meets its date. Well done. Group Finance wants unspent contingency back before quarter-end, and the cards program is short. I'm proposing we release S$60k of yours. Objections, {player}?",
      urgency: 'high',
      weight: 0,
      fixedDay: 8,
      when: { behindSchedule: false },
      concept: 'risk-mgmt',
      skill: 'risk',
      choices: [
        {
          id: 'a',
          label: 'Release the full S$60k: on track is exactly the moment to be a team player',
          cost: 0,
          grade: 'poor',
          insight:
            "Contingency covers risks that haven't fired yet, and VAPT, the dress rehearsal and cutover are all still ahead. Handing it back because the dashboard turned green is how programs end up red with no money to fix it.",
          outcome: {
            text: '{sponsor} thanks you in front of the room, and the cards program head buys you kopi. Your RAID log looks at you reproachfully.',
            effects: { budget: -60, trust: 5, rel: { sponsor: 6, boss: -3 } },
          },
        },
        {
          id: 'b',
          label: 'Object: every dollar stays committed until cutover is done',
          cost: 0,
          grade: 'okay',
          insight:
            "Right on substance, wrong in delivery. A flat no sounds like hoarding. Show which open risks each tranche covers and you'll usually keep most of it, and look like you're managing, not guarding.",
          outcome: {
            text: "{sponsor}'s eyebrows rise a millimetre. 'Noted.' You keep the money and lose a little warmth.",
            effects: { trust: -3, rel: { sponsor: -5 } },
          },
        },
        {
          id: 'c',
          label: 'Offer a schedule: S$20k now, the rest as the risks it covers retire',
          cost: 2,
          grade: 'best',
          insight:
            "Release reserve as the risks it covers retire. In PMP terms it's contingency reserve for identified risks: walk the RAID log, hand back what no longer has a risk behind it, and release the rest after hypercare.",
          outcome: {
            text: 'You walk the room through each open risk and what it would cost if it fired. {sponsor} takes S$20k now and minutes the rest for after hypercare. Finance gets a schedule; you keep a buffer.',
            effects: { budget: -20, trust: 5, rel: { sponsor: 4, boss: 4 }, skills: { risk: 1 } },
          },
        },
        {
          id: 'd',
          label: 'Park it in a quick Infynix PO first, so it counts as committed',
          cost: 2,
          grade: 'poor',
          insight:
            'Parking money in a vendor PO to dodge a budget review is gaming the books. Finance and Audit notice, and now the vendor holds your contingency. Make the case on risk instead.',
          outcome: {
            text: 'Procurement queries the PO within the hour. {boss} asks you, quietly, what you were thinking. Infynix is delighted.',
            effects: { budget: -25, trust: -6, rel: { boss: -6, partner: 4 } },
          },
        },
      ],
      ignored: {
        text: "You're dialled into another call. Silence is consent: S$60k leaves your contingency before you unmute.",
        effects: { budget: -60, trust: -2 },
      },
    },

    // ───────────── Story beat: Day 11 — the dress rehearsal ─────────────
    {
      id: 'lc-dress-rehearsal',
      scenarios: ['lioncity'],
      title: 'Dress rehearsal blew the cutover window',
      channel: 'meeting',
      from: 'sre',
      body: "Dress rehearsal debrief, and I've had no sleep. Migration took 9h40m in a 6-hour slot. We passed the point of no return before rollback was even rehearsed, and three runbook steps still say TBC. Overrun like that on the night and it's unscheduled downtime. A critical system gets four hours of that in any 12 months.",
      urgency: 'high',
      expires: 2,
      weight: 0,
      fixedDay: 11,
      concept: 'launch-readiness',
      skill: 'execution',
      choices: [
        {
          id: 'a',
          label: "Log it as 'completed with actions': CAB only asks whether it happened",
          cost: 0,
          grade: 'poor',
          insight:
            "A rehearsal that blew its window and never tested rollback has told you the plan doesn't work. Treat its findings as go/no-go criteria, not paperwork: cutover night is the most expensive place to relearn them.",
          outcome: {
            text: "The CAB pack now says 'Dress rehearsal: completed'. Technically true. {sre} stops making eye contact with you.",
            effects: { quality: -5, rel: { sre: -6 }, flags: ['lc:rehearsal-waved'] },
          },
        },
        {
          id: 'b',
          label: 'Ask to widen the outage window: reopen digital channels at 8am, not 6am',
          cost: 2,
          grade: 'okay',
          insight:
            "Widening the window is a real lever, but it moves the pain to customers and needs fresh customer notices. Use it after you've squeezed the runbook, not instead of finding out why migration overran.",
          outcome: {
            text: '{sponsor} approves a two-hour extension, reluctantly, and customer notices are reissued. The runbook is still slow; it is just less late.',
            effects: { trust: -3, budget: -5, rel: { sponsor: -3 } },
          },
        },
        {
          id: 'c',
          label: 'Save hours by sampling the reconciliation instead of running it in full',
          cost: 1,
          grade: 'poor',
          insight:
            'Never buy time by cutting the controls that prove the money moved correctly. Find hours in parallelism, pre-staged static data and removed waits, never in reconciliation.',
          outcome: {
            text: 'The window fits on paper. {pm} reads the new runbook and asks, very calmly, how she is meant to sign off balances nobody fully checked.',
            effects: { quality: -8, progress: { data: 4 }, rel: { pm: -8 } },
          },
        },
        {
          id: 'd',
          label: 'Re-time the runbook and rehearse migration + rollback again midweek',
          cost: 3,
          grade: 'best',
          insight:
            "A rehearsal's job is to fail somewhere safe. Re-time every step, pre-stage static data, put a name on every TBC, then rehearse the riskiest slice again, rollback included, against go/no-go checkpoints.",
          outcome: {
            text: 'Wednesday night, partial rehearsal: migration in 5h20m, rollback proven in 70 minutes, and every TBC replaced by a name. {sre} buys the kopi.',
            effects: {
              readiness: ['rollbackPlan'],
              quality: 5,
              energy: -8,
              progress: { data: 3 },
              rel: { sre: 6, lead: 4 },
            },
          },
        },
      ],
      ignored: {
        text: 'Nobody owns the findings, so nobody fixes them. The runbook goes to CAB with three TBCs and a prayer.',
        effects: { quality: -4, trust: -3, flags: ['lc:rehearsal-waved'] },
      },
    },

    // ───────────── Story beat: Day 13 — the CAB ─────────────
    {
      id: 'lc-cab',
      scenarios: ['lioncity'],
      title: 'CAB at 3pm: where is your point of no return?',
      channel: 'slack',
      from: 'security',
      body: 'CAB is at 3pm. The chair will ask three things: where is the point of no return, who makes the go/no-go call at each checkpoint, and how do we roll back if reconciliation breaks at 4am on Sunday? The change pack answers none of them. I want this approved, so help me help you.',
      urgency: 'critical',
      weight: 0,
      fixedDay: 13,
      concept: 'change-mgmt',
      skill: 'risk',
      choices: [
        {
          id: 'a',
          label: 'Present the pack as it is: CAB approves most changes with conditions anyway',
          cost: 1,
          grade: 'okay',
          insight:
            "Sometimes it works, usually because someone at the table vouches for you. That spends goodwill on a gap you could have closed. A change pack should answer CAB's questions before they're asked.",
          chance: {
            base: 0.35,
            rel: 'security',
            success: {
              text: '{security} answers half the questions for you. Approved with conditions: PONR and rollback documented by Friday noon. You owe her lunch, and she will remember.',
              effects: { readiness: ['signoff'], rel: { security: -2 } },
            },
            failure: {
              text: "Rejected: 'Resubmit with a defined point of no return.' The next slot is Friday morning, hours before your go/no-go.",
              effects: { trust: -5, block: { ws: 'review', days: 2, reason: 'CAB rejected the change; resubmission Friday' } },
            },
          },
        },
        {
          id: 'b',
          label: 'Ask {sponsor} to have a quiet word with the CAB chair',
          cost: 0,
          grade: 'poor',
          insight:
            "Using seniority to get around a control is exactly what auditors and MAS inspectors look for. CAB's questions are the cheapest rehearsal you'll ever get; answer them instead.",
          outcome: {
            text: "The CAB chair takes {sponsor}'s call, then rejects the change anyway: 'Rollback undefined.' Now {security} and {sponsor} are both unimpressed with you.",
            effects: {
              trust: -6,
              rel: { security: -8, sponsor: -4 },
              block: { ws: 'review', days: 2, reason: 'CAB rejected: rollback plan undefined' },
            },
          },
        },
        {
          id: 'c',
          label: 'Clear the afternoon with {sre} and {lead}: PONR, checkpoints, named owners',
          cost: 3,
          grade: 'best',
          insight:
            'A cutover plan is decisions, not steps: go/no-go checkpoints with named owners, a point of no return after a rehearsed rollback, and a hypercare bridge that knows MAS must hear of a severe incident within the hour.',
          outcome: {
            text: 'PONR: Sunday 05:00, after reconciliation sign-off. Four checkpoints, each with a named decision owner. CAB approves with one condition. {security} sends a single thumbs-up, which from her is a parade.',
            effects: { readiness: ['rollbackPlan', 'signoff'], trust: 5, energy: -6, rel: { security: 6, sre: 3 } },
          },
        },
        {
          id: 'd',
          label: 'Walk CAB through the rehearsal timings and the proven rollback',
          cost: 1,
          grade: 'best',
          requires: { readiness: ['rollbackPlan'] },
          lockedHint: 'Needs a rehearsed rollback plan first (see the dress rehearsal)',
          insight:
            "Evidence beats assurance. A rehearsed rollback with real timings answers CAB's hardest question before it's asked, which is exactly what rehearsals are for.",
          outcome: {
            text: 'You show the evidence: rollback timed, PONR after reconciliation sign-off, an owner for every checkpoint. Two questions, no conditions. Approved.',
            effects: { readiness: ['signoff'], trust: 6, rel: { security: 5 } },
          },
        },
      ],
      ignored: {
        text: "Nobody presents. CAB defers the change to next week's slot, which is after your cutover weekend.",
        effects: { trust: -8, rel: { security: -6 }, block: { ws: 'review', days: 3, reason: 'Change deferred by CAB' } },
      },
    },

    // ───────────── Risk trigger: Sev-1s hiding in SIT ─────────────
    {
      id: 'lc-sev1-hiding',
      scenarios: ['lioncity'],
      title: "Fourteen 'cosmetic' defects post payments twice",
      channel: 'slack',
      from: 'lead',
      body: "Went through Infynix's SIT backlog line by line. Fourteen defects tagged 'Sev-3, cosmetic' are PayNow transfers posting twice when the app retries. That is Sev-1 in any language. Their SIT exit report says zero open Sev-1s, and SIT exit triggers a milestone payment. Funny, that.",
      urgency: 'high',
      weight: 0,
      concept: 'vendor-mgmt',
      skill: 'technical',
      choices: [
        {
          id: 'a',
          label: "Re-triage jointly against the SOW's severity definitions; hold the payment",
          cost: 2,
          grade: 'best',
          insight:
            "Vendors manage to the milestones you pay for. Re-triage jointly against the contract's own definitions, hold the milestone until exit criteria are truly met, and keep it factual: {partner} needs a way to say yes upstairs.",
          outcome: {
            text: '{partner} reads the SOW definitions, exhales, and agrees: Sev-1. Infynix stands up a fix squad and the milestone payment waits. For the first time, the defect curve tells the truth.',
            effects: { quality: 6, scope: { core: 4 }, trust: 2, rel: { lead: 5, partner: -2 } },
          },
        },
        {
          id: 'b',
          label: "Fix them with {lead}'s team: faster than arguing with Infynix",
          cost: 2,
          grade: 'poor',
          insight:
            'The tech-lead reflex. Bank engineers patching vendor code muddies accountability, warranty and the milestone, and pulls your architect off the critical path. Make the vendor fix it under the contract.',
          outcome: {
            text: "{lead}'s team fixes nine by Thursday, two of them with side effects. Channel work stalls, and Infynix invoices the SIT exit milestone anyway.",
            effects: {
              quality: -2,
              morale: -4,
              energy: -4,
              velocity: { ws: 'client', mult: 0.7, days: 3, label: 'Architects fixing vendor bugs' },
              rel: { lead: -4, partner: 3 },
            },
          },
        },
        {
          id: 'c',
          label: "Accept Infynix's severity call: SIT exit is theirs to call under the contract",
          cost: 0,
          grade: 'poor',
          insight:
            "Severity is defined by customer impact, not by who has to fix it or which milestone it delays. Double-posting customers' money is Sev-1, full stop. Re-triage against the contract's definitions.",
          outcome: {
            text: "SIT exit is signed. The fourteen defects drift into UAT, where {pm}'s testers find them on day one.",
            effects: { quality: -8, rel: { lead: -6, pm: -4 }, flags: ['lc:sev-downgraded'] },
          },
        },
      ],
      ignored: {
        text: "The defects stay 'cosmetic'. Infynix declares SIT exit, invoices the milestone, and moves its testers to UAT support.",
        effects: { quality: -6, rel: { lead: -4 }, flags: ['lc:sev-downgraded'] },
      },
    },

    // ───────────── Risk trigger: reconciliation break ─────────────
    {
      id: 'lc-recon-break',
      scenarios: ['lioncity'],
      title: 'Mock migration is out by S$41,870.55',
      channel: 'slack',
      from: 'lead',
      body: "Mock migration #3 done: 1.56 million future-dated payments and GIRO mandates. Reconciliation is out by 312 records and S$41,870.55. Infynix calls it 0.02%, 'within tolerance'. {pm} says there is no tolerance for customers' money. Your call.",
      urgency: 'high',
      expires: 2,
      weight: 0,
      concept: 'launch-readiness',
      skill: 'technical',
      choices: [
        {
          id: 'a',
          label: 'Accept 0.02% as tolerance and log it in the risk register',
          cost: 0,
          grade: 'poor',
          insight:
            "On a payments migration there's no materiality threshold for a customer's money: every break needs a root cause. 0.02% of 1.56 million is still 312 wrong payments, and a business owner who won't sign.",
          outcome: {
            text: 'Logged. {pm} refuses to sign data migration acceptance and copies {sponsor} on her reasons. They are good reasons.',
            effects: { trust: -5, quality: -6, rel: { pm: -8 } },
          },
        },
        {
          id: 'b',
          label: 'Stop the line: root-cause every break before mock migration #4',
          cost: 2,
          grade: 'best',
          insight:
            "A reconciliation break is a stop-the-line signal. Classify every break, find the root cause, fix the transform and re-run. 'Fully reconciled and explained' belongs in your go/no-go criteria.",
          outcome: {
            text: 'Two days of forensics: weekend-dated GIRO payments shifted by a day in a timezone conversion. Fixed, re-run, reconciled to the cent. {pm} prints the report. She may frame it.',
            effects: { progress: { data: -5 }, quality: 6, rel: { pm: 6, lead: 3 } },
          },
        },
        {
          id: 'c',
          label: 'Script manual fixes for the 312 records into the runbook',
          cost: 2,
          grade: 'okay',
          insight:
            "Manual fixes are a fair last resort for a known, explained set of records, but you haven't explained these yet. Root-cause first; if the fix stays manual, script it, peer-check it and rehearse it.",
          outcome: {
            text: "Twenty-eight steps go into the runbook. Nobody knows why the records broke, so nobody knows whether it'll be 312 next time.",
            effects: { quality: -2, progress: { data: 2 }, rel: { sre: -3 } },
          },
        },
      ],
      ignored: {
        text: "Nobody decides, so Infynix's 'within tolerance' becomes the default. The break carries into mock migration #4, and grows.",
        effects: { quality: -5, rel: { pm: -5 } },
      },
    },

    // ───────────── Risk trigger: VAPT high findings ─────────────
    {
      id: 'lc-vapt-highs',
      scenarios: ['lioncity'],
      title: "VAPT: change one digit, see a stranger's payees",
      channel: 'email',
      from: 'security',
      body: "VAPT report on the new payment APIs: two highs, five mediums. One high is an IDOR: change the account number in the request and you get a stranger's payee list. Internet-facing, customer data. I can't sign the tech risk assessment with that open. What's the plan?",
      urgency: 'high',
      expires: 2,
      weight: 0,
      concept: 'mas-trm',
      skill: 'risk',
      choices: [
        {
          id: 'a',
          label: 'Argue the IDOR down to medium: it needs a logged-in session',
          cost: 2,
          grade: 'poor',
          insight:
            "Authenticated isn't harmless: any of a million logged-in customers could enumerate other people's payees. Arguing severity to save schedule spends credibility with the one function that can stop your go-live.",
          outcome: {
            text: '{security} listens politely, then forwards the exploit video. It takes eleven seconds. The finding stays high.',
            effects: { trust: -2, rel: { security: -6 } },
          },
        },
        {
          id: 'b',
          label: 'Fix both highs and retest before go-live; risk-accept mediums with dates',
          cost: 2,
          grade: 'best',
          insight:
            'MAS TRM expects security testing before go-live, and testing only matters if you act on it. Fix and retest high-severity findings on internet-facing systems; risk-accept mediums with owners, dates and compensating controls.',
          outcome: {
            text: 'Infynix patches the IDOR in two days and the retest is clean. Mediums go into the risk register with owners and dates. {security} signs the assessment.',
            effects: { scope: { core: 3 }, quality: 3, readiness: ['securityReview'], rel: { security: 6 } },
          },
        },
        {
          id: 'c',
          label: 'Go live on schedule and patch it in the first release after cutover weekend',
          cost: 0,
          grade: 'poor',
          insight:
            "'Patch after go-live' means knowingly exposing customer data from day one. Tech Risk won't sign, CAB won't approve, and if it's exploited you'll be explaining to the regulator why you knew.",
          outcome: {
            text: '{security} declines to sign the risk assessment and minutes exactly why. Your CAB pack now has a hole in it the shape of an IDOR.',
            effects: { trust: -6, rel: { security: -10 }, unready: ['securityReview'] },
          },
        },
      ],
      ignored: {
        text: 'The report sits unanswered. {security} escalates to {sponsor}: open high-severity findings, no remediation plan.',
        effects: { trust: -6, rel: { security: -8 }, unready: ['securityReview'] },
      },
    },

    // ───────────── Risk trigger: vendor key person rolled off ─────────────
    {
      id: 'lc-key-person',
      scenarios: ['lioncity'],
      title: "Infynix's lead architect is rolling off",
      channel: 'whatsapp',
      from: 'partner',
      body: "Hi {player}, small update. Venkat, our lead architect, moves to another client from Monday. Management decision. The new architect is very senior, just needs a few days to ramp up. Don't worry, can.",
      urgency: 'high',
      weight: 0,
      concept: 'vendor-mgmt',
      skill: 'stakeholder',
      choices: [
        {
          id: 'a',
          label: "Accept it: Infynix's staffing is Infynix's business",
          cost: 0,
          grade: 'poor',
          insight:
            "Losing the one person who understands the design right before cutover is very much your business. Check the SOW's key-personnel clause: swaps usually need the client's consent and a handover overlap.",
          outcome: {
            text: 'Venkat leaves on Friday. His replacement spends a week asking questions Venkat could have answered in a minute.',
            effects: { velocity: { ws: 'core', mult: 0.75, days: 4, label: 'New architect ramping up' }, quality: -3 },
          },
        },
        {
          id: 'b',
          label: 'Ask {partner}, off the record, what it would take to keep Venkat',
          cost: 1,
          grade: 'okay',
          insight:
            "Back channels work when the relationship is strong, and they let the vendor keep face. But goodwill doesn't replace the contract: if the quiet ask fails, invoke the clause the same day.",
          chance: {
            base: 0.45,
            rel: 'partner',
            success: {
              text: '{partner} admits the new client pays better. He keeps Venkat through cutover, quietly. You owe him one.',
              effects: { rel: { partner: 3 } },
            },
            failure: {
              text: "{partner} sighs: 'Not my call, {player}.' Venkat leaves on Friday, and you've lost days you could have spent on the contract.",
              effects: { velocity: { ws: 'core', mult: 0.75, days: 3, label: 'New architect ramping up' } },
            },
          },
        },
        {
          id: 'c',
          label: "Invoke the SOW's key-personnel clause and ask for a two-week overlap",
          cost: 1,
          grade: 'best',
          insight:
            "Contract clauses exist for exactly this week. Invoke it calmly and in writing, and give {partner} something to take upstairs: an overlap and a named handover plan. He didn't make this call; help him fight it.",
          outcome: {
            text: '{partner} forwards your email upstairs with visible relief. Venkat stays two more weeks, part-time on the new account, with handover sessions in the calendar.',
            effects: {
              velocity: { ws: 'core', mult: 0.9, days: 2, label: 'Architect handover' },
              trust: 2,
              rel: { partner: 4 },
            },
          },
        },
      ],
      ignored: {
        text: "You see the message on Monday. Venkat's farewell lunch was on Friday.",
        effects: { velocity: { ws: 'core', mult: 0.7, days: 4, label: 'New architect ramping up' }, quality: -3 },
      },
    },

    // ───────────── Risk trigger: UAT testers vs month-end ─────────────
    {
      id: 'lc-uat-month-end',
      scenarios: ['lioncity'],
      title: 'UAT week, meet month-end close',
      channel: 'hallway',
      from: 'pm',
      body: 'Paiseh, {player}. Month-end close lands right in UAT week, and my eight UAT testers are the same people who clear payment exceptions. I can spare two, maybe three. Either UAT moves, or it gets very thin.',
      urgency: 'high',
      expires: 2,
      weight: 0,
      concept: 'uat',
      skill: 'execution',
      choices: [
        {
          id: 'a',
          label: 'Fund month-end backfill so her testers can do UAT; exception scripts first',
          cost: 2,
          grade: 'best',
          insight:
            'Business testers are a scarce resource, so plan them like one. Buy their time with backfill or overtime rather than shrinking UAT, and order scripts by operational risk so the ugly cases get tested first.',
          outcome: {
            text: "S$12k buys two contract ops staff and some overtime. {pm}'s testers start Monday with the ugliest exception scripts first. She brings kueh.",
            effects: { budget: -12, quality: 3, rel: { pm: 8 }, readiness: ['uat'] },
          },
        },
        {
          id: 'b',
          label: "Let Infynix's testers run the UAT scripts instead: they're the same scripts anyway",
          cost: 0,
          grade: 'poor',
          insight:
            "UAT run by the vendor isn't acceptance, it's SIT with extra steps. The point of UAT is that the people who will operate the system prove it works for their real processes.",
          outcome: {
            text: "Infynix's testers pass 98% of the scripts. {pm} declines to sign: 'My team hasn't touched it.' She's right.",
            effects: { quality: -3, rel: { pm: -8 }, unready: ['uat'] },
          },
        },
        {
          id: 'c',
          label: 'Run UAT with three testers on the happy paths only',
          cost: 1,
          grade: 'okay',
          insight:
            'Happy-path UAT misses what ops actually handles: returns, rejections, duplicates, cut-off times. If UAT must shrink, cut by risk: exceptions first, easy scripts last.',
          outcome: {
            text: 'The happy paths pass. Nobody tests a returned GIRO payment. That is a problem for future you.',
            effects: { quality: -4, progress: { client: 2 } },
          },
        },
      ],
      ignored: {
        text: "UAT starts with whoever turns up. By day two, that's one tester and an intern.",
        effects: {
          quality: -4,
          rel: { pm: -4 },
          velocity: { ws: 'client', mult: 0.8, days: 2, label: 'Thin UAT' },
        },
      },
    },

    // ───────────── Risk trigger: DR misses RTO ─────────────
    {
      id: 'lc-dr-rto',
      scenarios: ['lioncity'],
      title: 'DR drill: 5h50m to recover. The RTO is 4h',
      channel: 'slack',
      from: 'sre',
      body: "Alamak. DR failover drill on the new hub: 5 hours 50 minutes to restore payments at the DR site. It's a critical system, so the RTO is four hours, and that's MAS's line, not mine. Bottlenecks: a manual database re-seed and 37 firewall rules nobody replicated to DR.",
      urgency: 'high',
      expires: 2,
      weight: 0,
      concept: 'mas-trm',
      skill: 'technical',
      choices: [
        {
          id: 'a',
          label: 'Add a second DR shift to run the manual steps in parallel',
          cost: 2,
          grade: 'okay',
          insight:
            'Parallel hands can shave an hour, but a recovery that depends on heroics at 3am is fragile. Use it as a bridge while you automate, not as the fix.',
          outcome: {
            text: 'Two shifts and a lot of kopi get the re-run down to 4h10m. Close. Not compliant.',
            effects: { budget: -6, energy: -4, trust: -2, rel: { sre: 2 }, flags: ['lc:dr-borderline'] },
          },
        },
        {
          id: 'b',
          label: 'Get {sponsor} to sign a risk acceptance and fix it after go-live',
          cost: 1,
          grade: 'poor',
          insight:
            "Internal standards can sometimes be risk-accepted; a regulatory requirement can't be waived by a program. A critical system that can't recover within the 4-hour RTO isn't ready: fix it and prove it.",
          outcome: {
            text: '{sponsor} reads the memo twice and hands it to {security}, who hands it back to you. Nobody signs.',
            effects: { trust: -5, rel: { sponsor: -4, security: -6 } },
          },
        },
        {
          id: 'c',
          label: 'Automate the recovery bottlenecks and re-run the drill',
          cost: 2,
          grade: 'best',
          insight:
            'Treat the RTO as a requirement, not a hope. Remove the bottlenecks (automate the re-seed, codify firewall rules so DR cannot drift), then re-run the drill. A passed DR test is the evidence CAB and auditors will ask for.',
          outcome: {
            text: "{sre}'s team scripts the re-seed and codifies the firewall rules. Re-run: 3h05m. The evidence goes straight into the CAB pack.",
            effects: { budget: -8, quality: 4, trust: 2, progress: { review: 3 }, rel: { sre: 6 } },
          },
        },
        {
          id: 'd',
          label: "Reclassify the hub as non-critical so the 4-hour RTO doesn't apply",
          cost: 1,
          grade: 'poor',
          insight:
            "Every channel depends on the payments hub; it's critical by any honest assessment. Reclassifying a system to dodge a requirement is exactly the pattern auditors and MAS inspectors look for.",
          outcome: {
            text: "{security} replies with one line: 'PayNow is down and it's non-critical?' The classification stays. Your credibility takes a dent.",
            effects: { trust: -4, rel: { security: -8 } },
          },
        },
      ],
      ignored: {
        text: "The drill report sits in {sre}'s outbox. Internal Audit finds it before CAB does, which is the wrong order.",
        effects: { trust: -6, quality: -3, rel: { sre: -4 } },
      },
    },

    // ───────────── Risk trigger: customer data in SIT ─────────────
    {
      id: 'lc-test-data-leak',
      scenarios: ['lioncity'],
      title: 'Real customer data in the SIT environment',
      channel: 'incident',
      from: 'compliance',
      body: "A DLP scan just flagged a 2.1GB file in SIT: an unmasked production extract with 380,000 customers' names, NRIC numbers and balances. Infynix's offshore team has had access to that environment for three weeks. I need facts within the hour, not within the sprint.",
      urgency: 'critical',
      weight: 0,
      concept: 'pdpa',
      skill: 'risk',
      choices: [
        {
          id: 'a',
          label: 'Contain it: revoke access, keep the logs, assess it with {compliance}',
          cost: 2,
          grade: 'best',
          insight:
            "Data incidents run on clocks. Contain, preserve evidence, then assess with the DPO; if it's notifiable, PDPC must hear within 3 calendar days of that assessment. Outsourcing work doesn't outsource accountability.",
          outcome: {
            text: "Access revoked in 20 minutes, logs preserved. Root cause: a 'temporary' copy a bank DBA made in June. Two vendor log-ins touched it, so {compliance} notifies PDPC well inside the 3 days, with a clean evidence trail.",
            effects: {
              trust: 2,
              block: { ws: 'data', days: 1, reason: 'SIT frozen for breach assessment' },
              rel: { compliance: 8, partner: -2 },
              flags: ['lc:breach-handled'],
            },
          },
        },
        {
          id: 'b',
          label: 'Ask Infynix to investigate and report back by end of day',
          cost: 1,
          grade: 'okay',
          insight:
            'The vendor must help, but the bank owns the assessment: you cannot delegate it to the party under review. And end of day is fine for facts, not for containment; revoke access first.',
          outcome: {
            text: "Infynix's report lands at 7pm: 'No misuse found.' It doesn't say how they know. {compliance} restarts the assessment herself, a day later than she'd like.",
            effects: { trust: -3, rel: { compliance: -6 } },
          },
        },
        {
          id: 'c',
          label: 'Have the file deleted quietly, then re-brief everyone on data masking rules',
          cost: 1,
          grade: 'poor',
          insight:
            'Deleting before assessing destroys the evidence you need to decide whether it is notifiable, and it looks like a cover-up. Contain, preserve, assess, then remediate.',
          outcome: {
            text: 'The file is gone, and with it any way to show what was in it or who copied it. {compliance} is now having a very different kind of day.',
            effects: { trust: -10, rel: { compliance: -12 }, flags: ['lc:evidence-deleted'] },
          },
        },
      ],
      ignored: {
        text: 'The hour passes. {compliance} escalates to {sponsor} and freezes all vendor access to non-production environments.',
        effects: {
          trust: -8,
          rel: { compliance: -10, sponsor: -4 },
          block: { ws: 'data', days: 2, reason: 'Vendor access frozen pending breach review' },
        },
      },
    },

    // ───────────── Risk trigger (dormant): the tiger team ─────────────
    {
      id: 'lc-tiger-team',
      scenarios: ['lioncity'],
      title: 'Twelve new engineers, zero payments context',
      channel: 'slack',
      from: 'lead',
      body: "Infynix's tiger team has landed. Good engineers, but half have never worked on payments. My two best people now spend all day answering questions, and our defect fix rate went DOWN this week. Brooks's law, live in Raffles Place.",
      urgency: 'normal',
      weight: 0,
      concept: 'brooks-law',
      skill: 'leadership',
      choices: [
        {
          id: 'a',
          label: 'Give it a week: ramp-up always dips before it pays off',
          cost: 0,
          grade: 'poor',
          insight:
            "Ramp-up does dip, but with days left it won't recover in time. On a short horizon, new joiners are a net loss unless their work is isolated and they need almost no hand-holding.",
          outcome: {
            text: "The dip deepens. By the time the newcomers are useful, it's cutover week and their CR is ending.",
            effects: {
              velocity: { ws: 'core', mult: 0.8, days: 3, label: 'Tiger-team onboarding drag' },
              morale: -3,
              rel: { lead: -4 },
            },
          },
        },
        {
          id: 'b',
          label: 'Keep the four payments veterans on isolated queues; release the rest',
          cost: 1,
          grade: 'best',
          insight:
            'Late capacity only helps if it is experienced and isolated: separable work, clear queues, minimal hand-holding. Release the rest early and say why; sunk cost is not a reason to keep people on a critical path.',
          outcome: {
            text: "{partner} grumbles about the CR, then agrees: four stay on isolated queues with their own lead, the rest roll off with a partial refund. {lead}'s engineers get their days back.",
            effects: {
              budget: 15,
              velocity: { ws: 'core', mult: 1.1, days: 3, label: 'Focused tiger team' },
              rel: { lead: 6, partner: -3 },
            },
          },
        },
        {
          id: 'c',
          label: 'Ask Infynix to add a dedicated tiger-team lead to field all the questions',
          cost: 1,
          grade: 'okay',
          insight:
            'A dedicated lead shields your architects, which helps, but adding a manager to fix a too-many-people problem adds cost, not knowledge. Shrink the team to what can be productive, then add structure.',
          outcome: {
            text: "A tiger-team lead arrives on Wednesday and books a three-hour 'knowledge transfer' with {lead}.",
            effects: { budget: -8, velocity: { ws: 'core', mult: 0.9, days: 2, label: 'Tiger-team onboarding' } },
          },
        },
      ],
      ignored: {
        text: "The tiger team keeps asking; {lead}'s team keeps answering. Nothing gets fixed faster, at premium rates.",
        effects: {
          velocity: { ws: 'core', mult: 0.85, days: 3, label: 'Tiger-team drag' },
          morale: -3,
          rel: { lead: -4 },
        },
      },
    },

    // ───────────── Flavour: the vendor's "out-of-scope" change request ─────────────
    {
      id: 'lc-vendor-cr',
      scenarios: ['lioncity'],
      title: "CR-017: it's 'not in the SOW'",
      channel: 'email',
      from: 'partner',
      body: "Attaching CR-017: ATM transfer message mapping for the new debit card ranges. It's not in SOW Schedule B, so it's a change request: S$48k, 15 days. My account director needs approval by Thursday or the team moves off this item. Sorry, {player}. My hands are tied.",
      urgency: 'normal',
      weight: 2,
      when: { minDay: 3, maxDay: 11 },
      concept: 'negotiation',
      skill: 'stakeholder',
      choices: [
        {
          id: 'a',
          label: 'Sign it: S$48k is cheaper than a slip',
          cost: 0,
          grade: 'poor',
          insight:
            "Paying a CR without reading the scope teaches the vendor that every ambiguity is billable. Most 'out-of-scope' fights are really requirements ambiguity: check the clause and the original requirement first.",
          outcome: {
            text: "Approved by lunch. By Friday, CR-018 and CR-019 arrive, both 'not in Schedule B'.",
            effects: { budget: -45, trust: -2, rel: { partner: 5 } },
          },
        },
        {
          id: 'b',
          label: 'Reject it: ATM integration is in scope, and Infynix knows it',
          cost: 1,
          grade: 'okay',
          insight:
            "You may be right, but a flat no without walking the clause invites 'work to rule'. Settle scope disputes on the text of the contract, quickly, before the work stalls.",
          outcome: {
            text: "{partner} escalates to his account director. The ATM work pauses 'pending commercial alignment'.",
            effects: { velocity: { ws: 'core', mult: 0.85, days: 2, label: 'ATM work paused' }, rel: { partner: -6 } },
          },
        },
        {
          id: 'c',
          label: "Walk Schedule B with {partner}; pay only for what's genuinely new",
          cost: 2,
          grade: 'best',
          insight:
            "Vendor management is contract management plus relationship. Read the clause together, split what was always in scope from what's genuinely new, and approve the new part fast. Fair and quick beats cheap and slow.",
          outcome: {
            text: 'Schedule B covers the ATM interface; the new card ranges arrived after signing. You settle at S$15k and six days. Over teh tarik afterwards, {partner} lets slip which of his people his bosses want elsewhere.',
            effects: { budget: -15, trust: 2, rel: { partner: 6, lead: 2 }, revealRisks: ['lc-risk-key-person'] },
          },
        },
      ],
      ignored: {
        text: "Thursday passes. Infynix moves the ATM developers to another item 'until commercial alignment'.",
        effects: { velocity: { ws: 'core', mult: 0.85, days: 3, label: 'ATM work deprioritised' }, rel: { partner: -4 } },
      },
    },

    // ───────────── Flavour: the stakeholder nobody consulted ─────────────
    {
      id: 'lc-branch-ops',
      scenarios: ['lioncity'],
      title: 'Branch Network was never consulted',
      channel: 'hallway',
      from: 'boss',
      body: 'Heads-up. Mr Rajan, Head of Branch Network, just called me. He found out from a teller that branch payments are being re-platformed. Sixty branches, new end-of-day procedures, and nobody asked him. He wants it on the SteerCo agenda. Honestly? He has a point.',
      urgency: 'normal',
      weight: 2,
      when: { minDay: 3, maxDay: 12 },
      concept: 'stakeholder-map',
      skill: 'stakeholder',
      choices: [
        {
          id: 'a',
          label: 'Send him the training deck, the FAQ and the cutover date, with an apology',
          cost: 1,
          grade: 'poor',
          insight:
            'Informing is not consulting. A high-power stakeholder who hears about a change from a teller wants influence, not slides. Anyone whose process changes needs a voice before the design is locked.',
          outcome: {
            text: 'Mr Rajan replies-all to the deck with eleven questions and copies {sponsor}. Question four is a real gap.',
            effects: { trust: -5, rel: { boss: -3, sponsor: -3 } },
          },
        },
        {
          id: 'b',
          label: 'Meet him today: walk the impacts, give Branch a seat in UAT and cutover',
          cost: 2,
          grade: 'best',
          insight:
            "Own the miss, then give him real influence: a seat in UAT, a checkpoint in the cutover runbook, input on training. Late stakeholders become allies when they're consulted, not just informed.",
          outcome: {
            text: "Mr Rajan arrives with a printed list. Item three, mall branches that open on Sunday mornings, isn't in your runbook. Now it is. He leaves almost cheerful.",
            effects: { trust: 4, quality: 3, rel: { boss: 4, pm: 3 }, readiness: ['commsPlan'] },
          },
        },
        {
          id: 'c',
          label: 'Ask {sponsor} to remind him that {program} is a group priority',
          cost: 0,
          grade: 'poor',
          insight:
            "Pulling rank on a stakeholder you forgot to consult turns an oversight into a feud, and silences someone who knows things you don't. Fix the miss yourself first.",
          outcome: {
            text: "{sponsor} declines to referee and asks why Branch Network wasn't on your stakeholder map. Good question.",
            effects: { trust: -4, rel: { sponsor: -4 } },
          },
        },
      ],
      ignored: {
        text: "Mr Rajan raises it at SteerCo himself, with photos of confused tellers. {sponsor} asks why you weren't aware.",
        effects: { trust: -6, rel: { sponsor: -4, boss: -3 } },
      },
    },
  ],
}
