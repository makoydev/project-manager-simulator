import type { ScenarioDef } from '../../game/types'

/**
 * Scenario 1 — ShiokPay Later (difficulty 1, the friendly first program).
 *
 * Shiok, a Southeast Asian super-app, launches buy-now-pay-later at checkout before the 11.11
 * mega-sale. Marketing has teased the date publicly, so time is fixed and scope is the lever.
 * Teaches: listening tours, the iron triangle, vendor management, guardrail metrics, decoupling
 * deploy from release, engaging Compliance early, PDPA consent, and launch readiness.
 *
 * Tuning at neutral performance (morale 65, quality 70 → velocity factor 1.02):
 * data Day 10, platform Day 11, core Day 12, review Day 12 (capped at 90% until core lands),
 * client Day 14 (capped at 80% until core lands) → projected launch Day 14 vs a Day 15 target.
 * Critical path: core → client. Client finishes 2 days after core across a wide range of
 * morale/quality, and idles at its cap for ~3 days in week 2 — that float is what the
 * sp-mobile-tugofwar event teaches the player to spot.
 */
export const SHIOKPAY: ScenarioDef = {
  id: 'shiokpay',
  name: 'ShiokPay Later',
  company: 'Shiok',
  companyBlurb:
    "Southeast Asia's favourite super-app for rides, food delivery and payments, run from a very air-conditioned tower at one-north.",
  program: 'Project Kaya',
  product: 'ShiokPay Later',
  tagline: 'Buy now, pay later, ship before 11.11.',
  difficulty: 1,
  setting: 'one-north, Singapore · Fintech · 3 weeks to 11.11',
  brief: [
    "Welcome to Shiok, {player}. You've just joined as the TPM for Project Kaya: ShiokPay Later, a pay-in-3 option at checkout for rides, food and Shiok Mart, launching in Singapore before the 11.11 mega-sale.",
    'Marketing has already teased the date on every MRT ad panel from Buona Vista to Jurong East, so the date is not moving. Scope, on the other hand, is negotiable, if you can make the case with data.',
    'Five workstreams, eight stakeholders, a partner bank, and a Head of Compliance who knows the BNPL code of conduct by heart. Land it by Day 15 with the team still speaking to you.',
  ],
  targetDay: 15,
  maxDay: 20,
  start: { morale: 65, trust: 60, quality: 70, budget: 60 },
  hue: 100,
  icon: '🛍️',

  cast: {
    boss: {
      role: 'boss',
      name: 'Evelyn Tan Hui Min',
      short: 'Evelyn',
      title: 'Director, Program Management',
      avatar: '👩🏻‍💼',
      hue: 205,
      power: 4,
      interest: 3,
      location: 'one-north, Singapore',
      bio: 'Your manager. An ex-TPM with three 11.11 launches behind her. Hates surprises far more than bad news, so bring her problems early, with options.',
    },
    sponsor: {
      role: 'sponsor',
      name: 'Rohan Mehta',
      short: 'Rohan',
      title: 'VP, Fintech',
      avatar: '👨🏽‍💼',
      hue: 25,
      power: 5,
      interest: 4,
      location: 'one-north, Singapore',
      bio: 'Owns the ShiokPay P&L. Lives in dashboards and wants the answer in the first line. Bring him numbers and a recommendation, not a story.',
    },
    pm: {
      role: 'pm',
      name: 'Nurul Huda Binte Ismail',
      short: 'Nurul',
      title: 'Product Manager, ShiokPay Later',
      avatar: '🧕🏽',
      hue: 320,
      power: 3,
      interest: 5,
      location: 'one-north, Singapore',
      bio: 'Owns the what, the why and the credit policy. Customer-obsessed and great with Marketing, sometimes too great. Help her turn wishlists into trade-offs.',
    },
    lead: {
      role: 'lead',
      name: 'Ng Jun Hao',
      short: 'Jun Hao',
      title: 'Tech Lead, Payments',
      avatar: '🧑🏻‍💻',
      hue: 150,
      power: 3,
      interest: 4,
      location: 'one-north, Singapore',
      bio: "Wrote half the ledger. Guards his team's focus time like a chope-d hawker table and is allergic to meetings. Earn his trust by removing blockers, not adding rituals.",
    },
    partner: {
      role: 'partner',
      name: 'Rizky Pratama',
      short: 'Rizky',
      title: 'Engineering Manager, Mobile',
      avatar: '🤹🏽‍♂️',
      hue: 275,
      power: 3,
      interest: 2,
      location: 'Jakarta, Indonesia',
      bio: 'Runs the Shiok app squad from Jakarta. His team also builds the 11.11 campaign screens, so every sprint is a tug-of-war. Clear priorities beat guilt trips.',
    },
    sre: {
      role: 'sre',
      name: "Marcus D'Cruz",
      short: 'Marcus',
      title: 'SRE Lead',
      avatar: '🧑🏽‍🚒',
      hue: 5,
      power: 3,
      interest: 4,
      location: 'one-north, Singapore',
      bio: 'Was on call when 11.11 melted checkout two years ago and still has the incident channel pinned. Loves load tests, runbooks and the word "rollback".',
    },
    security: {
      role: 'security',
      name: 'Nguyen Thuy Linh',
      short: 'Linh',
      title: 'AppSec Lead',
      avatar: '🕵🏻‍♀️',
      hue: 250,
      power: 3,
      interest: 2,
      location: 'one-north, Singapore',
      bio: "Calm, precise, threat-model first. Will find your broken access control before the pen-testers do. Show her designs early and she'll save you weeks.",
    },
    compliance: {
      role: 'compliance',
      name: 'Kavitha Subramaniam',
      short: 'Kavitha',
      title: 'Head of Compliance & Legal',
      avatar: '👩🏾‍⚖️',
      hue: 45,
      power: 4,
      interest: 2,
      location: 'one-north, Singapore',
      bio: "Also Shiok's Data Protection Officer. Knows the BNPL code of conduct and PDPA by heart. Brief her early and she's your fastest ally; surprise her in week 3 and she's your No-Go.",
    },
  },

  workstreams: [
    {
      role: 'core',
      name: 'Payments & Credit Backend',
      icon: '💳',
      owner: 'lead',
      work: 80,
      velocity: 6,
      done: 10,
      description:
        'Credit decisioning API, instalment ledger, PayNow and card repayments, and the partner-bank funding integration. The critical path.',
    },
    {
      role: 'client',
      name: 'Mobile Checkout',
      icon: '📱',
      owner: 'partner',
      work: 60,
      velocity: 5,
      done: 6,
      deps: [{ on: 'core', capAt: 0.8 }],
      description:
        'The pay-later option at checkout, the instalment picker and Singpass Myinfo onboarding in the Shiok app. Can only get so far until the backend APIs are done.',
    },
    {
      role: 'platform',
      name: 'Platform & SRE',
      icon: '🛠️',
      owner: 'sre',
      work: 50,
      velocity: 4,
      done: 8,
      description: '11.11 capacity, load testing, observability, kill switches, feature flags and the on-call rota.',
    },
    {
      role: 'data',
      name: 'Risk & Fraud Models',
      icon: '🧠',
      owner: 'pm',
      work: 45,
      velocity: 4,
      done: 6,
      description:
        'Credit-limit and affordability rules (Product owns the policy) plus fraud scoring, built with the Risk Data Science squad.',
    },
    {
      role: 'review',
      name: 'Compliance & Legal Review',
      icon: '⚖️',
      owner: 'compliance',
      work: 40,
      velocity: 4,
      deps: [{ on: 'core', capAt: 0.9 }],
      description:
        'BNPL code of conduct checks, PDPA consent for credit checks, customer T&Cs and AppSec sign-off. Final sign-off needs a finished backend.',
    },
  ],

  risks: [
    {
      id: 'sp-risk-bank-sandbox',
      title: 'Partner bank sandbox is late',
      description:
        "The partner bank's funding and settlement sandbox was promised for Day 3. Without it, {ws.core} can't integration-test disbursements, and the bank's change board only meets weekly.",
      ws: 'core',
      owner: 'lead',
      likelihood: 3,
      impact: 4,
      initial: 'open',
      earliestDay: 3,
      mitigation: {
        label: 'Agree the API contract and build a stub',
        cost: 2,
        text: "{lead} and the bank's integration lead freeze the API contract on a call, and the team builds a contract-tested stub. A sandbox wobble now costs hours, not days.",
        effects: { quality: 2, rel: { lead: 3 }, flags: ['sp:bank-stub'] },
      },
      trigger: 'sp-bank-sandbox-down',
    },
    {
      id: 'sp-risk-peak-traffic',
      title: '11.11 peak overwhelms credit decisions',
      description:
        'The credit decision service has only been load-tested at 3x normal traffic. The 11.11 midnight peak is roughly 10x, and every checkout calls it synchronously.',
      ws: 'platform',
      owner: 'sre',
      likelihood: 3,
      impact: 5,
      initial: 'open',
      earliestDay: 7,
      mitigation: {
        label: 'Design for 10x: async calls, pre-booked capacity',
        cost: 2,
        text: '{sre} and {lead} move bureau calls off the hot path, pre-book 11.11 capacity and agree a degraded mode with {pm}. The load test is still on your readiness list, but now it has a fighting chance.',
        effects: { budget: -5, quality: 2 },
      },
      trigger: 'sp-load-test-melt',
    },
    {
      id: 'sp-risk-fraud-fp',
      title: 'Fraud model blocks good customers',
      description:
        "The fraud model was trained on rides and food orders, not credit. It may flag many first-time BNPL users, cratering approval rates and {pm}'s conversion targets.",
      ws: 'data',
      owner: 'pm',
      likelihood: 3,
      impact: 3,
      initial: 'hidden',
      earliestDay: 5,
      mitigation: {
        label: 'Run the fraud model in shadow mode first',
        cost: 2,
        text: 'The model scores real staff-pilot checkouts in shadow mode without declining anyone. Risk Data Science tunes thresholds on real data before the model can say no to a real customer.',
        effects: { quality: 3, rel: { pm: 3 } },
      },
      trigger: 'sp-fraud-false-positives',
    },
    {
      id: 'sp-risk-app-review',
      title: 'App store review delays the release',
      description:
        'The checkout changes ship in a new app binary. Store review before 11.11 is slow because everyone submits at once, and one rejection could cost {ws.client} several days.',
      ws: 'client',
      owner: 'partner',
      likelihood: 2,
      impact: 4,
      initial: 'hidden',
      earliestDay: 8,
      mitigation: {
        label: 'Plan to submit early with the feature flagged off',
        cost: 1,
        text: "{partner} agrees to submit the binary a week early with {product} hidden behind a remote flag. If review bounces it, there's time to fix; launch becomes a config flip, not a release.",
        effects: { rel: { partner: 3 } },
      },
      trigger: 'sp-app-rejected',
    },
    {
      id: 'sp-risk-affordability',
      title: 'Compliance changes affordability rules',
      description:
        "{compliance} hasn't yet checked the credit-limit and affordability rules against the BNPL code of conduct. A late finding means rework in {ws.core} and {ws.data}, plus new T&Cs.",
      ws: 'review',
      owner: 'compliance',
      likelihood: 3,
      impact: 4,
      initial: 'hidden',
      earliestDay: 6,
      mitigation: {
        label: 'Walk Compliance through the rules now',
        cost: 2,
        text: 'You book {compliance} for a 45-minute walkthrough of limits, late fees and T&Cs. She flags two changes on the spot: cheap to fix in week 1, expensive in week 3.',
        effects: { scope: { core: 4 }, progress: { review: 5 }, rel: { compliance: 6 } },
      },
      trigger: 'sp-affordability-change',
    },
    {
      id: 'sp-risk-ict',
      title: 'Key engineer away on reservist ICT',
      description:
        "Hafiz, the only engineer who really knows the repayment-schedule engine, has reservist In-Camp Training (ICT) coming up. It's on his calendar, but not in the plan.",
      ws: 'core',
      owner: 'lead',
      likelihood: 2,
      impact: 3,
      initial: 'hidden',
      earliestDay: 6,
      mitigation: {
        label: 'Pair and hand over before ICT starts',
        cost: 1,
        text: "Hafiz pairs with two teammates for a couple of days and writes the runbook he's been meaning to write since last year. The bus factor goes from one to three.",
        effects: {
          velocity: { ws: 'core', mult: 0.9, days: 2, label: 'Pairing & handover' },
          quality: 2,
          flags: ['sp:ict-handover'],
        },
      },
      trigger: 'sp-ict-callup',
    },
    {
      id: 'sp-risk-myinfo',
      title: 'Myinfo eKYC differs in production',
      description:
        'Singpass Myinfo onboarding has only been tested with sandbox test profiles. Real profiles have gaps (e.g. no income data for some self-employed users), and production keys and settings differ.',
      ws: 'client',
      owner: 'security',
      likelihood: 2,
      impact: 3,
      initial: 'hidden',
      earliestDay: 7,
      mitigation: {
        label: 'Staff pilot on production Myinfo',
        cost: 2,
        text: 'Fifty colleagues onboard with their real Singpass in production, behind a flag. You catch the missing-income edge case and a key-config typo long before customers would have.',
        effects: { quality: 3, rel: { security: 3 } },
      },
      trigger: 'sp-myinfo-prod',
    },
    {
      id: 'sp-risk-bureau-limit',
      title: 'Credit bureau throttles our checks',
      description:
        "Every credit check calls the credit bureau's API, which has a contractual rate limit. A big batch job or an 11.11 spike could hit it and leave customers stuck on 'checking…'.",
      ws: 'core',
      owner: 'pm',
      likelihood: 4,
      impact: 3,
      initial: 'dormant',
      earliestDay: 5,
      mitigation: {
        label: 'Negotiate a burst quota and add a queue',
        cost: 2,
        text: "{pm} gets the bureau to agree a temporary burst quota for 11.11, and {lead}'s team adds a queue with a friendly 'we'll confirm in a minute' state.",
        effects: { budget: -5, rel: { pm: 3 } },
      },
      trigger: 'sp-bureau-throttle',
    },
  ],

  assumptions: [
    'The launch date is fixed: Marketing has publicly teased ShiokPay Later for 11.11.',
    'Singapore only, pay-in-3 at launch. Pay-in-6 is a stretch goal.',
    "The partner bank's funding and settlement sandbox is available from Day 3.",
    'Customers verify their identity with Singpass Myinfo. No manual KYC at launch.',
    'Credit limits follow the industry BNPL code of conduct; Compliance signs off before Go/No-Go.',
    'The mobile squad shares its capacity with the 11.11 campaign.',
  ],

  events: [
    // ───────────────────────────── Story beats ─────────────────────────────
    {
      id: 'sp-kickoff',
      scenarios: ['shiokpay'],
      title: 'Day 1: welcome to Project Kaya',
      channel: 'slack',
      from: 'boss',
      body: "Welcome to Shiok, {player}! Quick context: {product} launches before 11.11, and Marketing has already teased the date on every MRT ad panel in the west. Your predecessor left a Jira board with 412 tickets and a 63-slide deck. Nobody has read either. How do you want to spend your first day?",
      urgency: 'high',
      weight: 0,
      fixedDay: 1,
      concept: 'tpm-role',
      skill: 'stakeholder',
      choices: [
        {
          id: 'a',
          label: 'Roll out a full process on day one: charter, RACI and a daily 1-hour sync',
          cost: 2,
          grade: 'poor',
          insight:
            "Process before trust reads as 'the new TPM doesn't trust us'. Learn how the team already works, then add the lightest process that fixes a problem they actually feel. Earn the right to change the system before you change it.",
          outcome: {
            text: 'Your kickoff has a 14-slide charter and a 40-row RACI. {lead} declines the daily sync with "Focus time". By lunch, the team has renamed it the Daily Meeting About Meetings.',
            effects: { morale: -6, trust: 2, energy: -6, rel: { lead: -8, partner: -3 }, flags: ['sp:process-first'] },
          },
        },
        {
          id: 'b',
          label: 'Do a listening tour: kopi with each lead, and ask what keeps them up at night',
          cost: 3,
          grade: 'best',
          insight:
            "A TPM's first job is to understand the system: people, incentives and the risks nobody has written down. Asking 'what worries you?' surfaces risks that never reach Jira, and builds the relationships you will spend later.",
          outcome: {
            text: "Five kopi-o-kosongs later, you know more than the deck ever told you. {compliance} hasn't seen the credit rules yet, and {pm} admits the fraud model has never scored a loan. Your RAID log grows. So does your caffeine level.",
            effects: {
              energy: -4,
              rel: { lead: 5, pm: 4, sre: 5, compliance: 6, partner: 3 },
              revealRisks: ['sp-risk-affordability', 'sp-risk-fraud-fp'],
              skills: { stakeholder: 1 },
            },
          },
        },
        {
          id: 'c',
          label: 'Dive into Jira and the architecture docs, and re-estimate the plan yourself',
          cost: 2,
          grade: 'okay',
          insight:
            "Understanding the architecture is valuable for any TPM. But estimates belong to the people doing the work; re-estimating alone undermines ownership and misses the risks that live in people's heads, not in tickets.",
          outcome: {
            text: 'By 11pm you have a beautiful spreadsheet, strong opinions about the ledger schema, and one real find: Myinfo has only ever been tested with sandbox profiles. Your estimate matches the team\'s to the day.',
            effects: { energy: -8, rel: { lead: -2 }, revealRisks: ['sp-risk-myinfo'], skills: { technical: 1 } },
          },
        },
        {
          id: 'd',
          label: 'Book {sponsor} tomorrow to reset expectations on the date',
          cost: 1,
          grade: 'poor',
          insight:
            "Never renegotiate a commitment before you have data. On day one you don't know the plan, the team or the risks, so you'd be spending the sponsor's trust on a guess. Gather evidence first, then bring options.",
          outcome: {
            text: '{sponsor} gives you ten minutes. "Reset to what? Based on what?" You don\'t have a good answer. He\'s back on his laptop before you reach the door.',
            effects: { trust: -8, rel: { sponsor: -8, boss: -3 } },
          },
        },
      ],
      ignored: {
        text: 'You spend Day 1 fighting SSO, a laptop update and 14 Slack channels. Nobody is quite sure who the new TPM is yet.',
        effects: { trust: -2, rel: { lead: -2, boss: -2 } },
      },
    },
    {
      id: 'sp-steerco-behind',
      scenarios: ['shiokpay'],
      title: "SteerCo: we're late and the date is on a billboard",
      channel: 'meeting',
      from: 'sponsor',
      body: 'Week 2 SteerCo. {sponsor} squints at your burn-up chart. "We\'re projecting late. 11.11 is on billboards and in the CEO\'s slides, so the date doesn\'t move. What\'s the plan?" {lead} studies his kopi. {pm} studies you.',
      urgency: 'high',
      weight: 0,
      fixedDay: 8,
      when: { behindSchedule: true },
      concept: 'iron-triangle',
      skill: 'comms',
      choices: [
        {
          id: 'a',
          label: 'Commit to the date and ask the team to work the next two weekends',
          cost: 0,
          grade: 'poor',
          insight:
            "Overtime is a loan at a brutal interest rate: a few days of speed, then fatigue, defects and resignations. It's a last resort for a small, known gap, never the plan. When the date is fixed, lead with scope.",
          outcome: {
            text: '{sponsor} nods: "Good. Commitment." The team hears it secondhand. Velocity jumps for a few days; so does the defect rate, and {lead} stops replying after 10pm.',
            effects: {
              velocity: { ws: 'all', mult: 1.2, days: 3, label: 'Weekend crunch' },
              morale: -10,
              quality: -6,
              trust: 3,
              rel: { sponsor: 4, lead: -10 },
              flags: ['sp:crunch'],
            },
          },
        },
        {
          id: 'b',
          label: 'Compress UAT and the security review to win back three days',
          cost: 1,
          grade: 'poor',
          insight:
            "Cutting testing doesn't remove work; it moves it into production, where customers and regulators find it for you. On a credit product, quality is not the slack variable. Trade scope first, then cost, then time.",
          outcome: {
            text: "On paper, you're back on track. {security} goes very quiet in the chat, and {compliance} asks, in writing, who approved skipping UAT on a credit product.",
            effects: {
              progress: { review: 10 },
              quality: -10,
              rel: { security: -8, compliance: -8 },
              unready: ['uat', 'securityReview'],
              flags: ['sp:cut-testing'],
            },
          },
        },
        {
          id: 'c',
          label: 'Pitch an 11.11 MVP: pay-in-3 now, pay-in-6 behind a flag',
          cost: 2,
          grade: 'best',
          insight:
            'When the date is fixed, scope is your lever. Bring options with a recommendation: the smallest product that keeps the 11.11 promise, with the rest dark-launched behind flags as a fast-follow. Executives own the trade-off; you make it clear.',
          outcome: {
            text: 'Three options, each with a date and a cost. {sponsor} picks the MVP in four minutes. {pm} winces, then admits most customers asked for pay-in-3 anyway. Pay-in-6 ships dark behind a flag for December.',
            effects: {
              scope: { core: -12, client: -10, data: -8 },
              trust: 5,
              rel: { sponsor: 5, lead: 6, pm: -3 },
              readiness: ['featureFlags'],
              flags: ['sp:mvp-cut'],
              skills: { stakeholder: 1 },
            },
          },
        },
        {
          id: 'd',
          label: 'Ask for S$25k of contract testers so engineers stay on the build',
          cost: 1,
          grade: 'okay',
          insight:
            'Money can buy time when the work is well-bounded, like test automation. It rarely closes a big gap on its own, and new people always cost your seniors some onboarding. Pair spend with a scope decision.',
          outcome: {
            text: '{sponsor} approves the spend. The testers are sharp once they have laptops and access, which takes two days. You claw back about a day.',
            effects: {
              budget: -25,
              velocity: { ws: 'all', mult: 1.1, days: 4, label: 'Contract testers' },
              rel: { sponsor: -2 },
              flags: ['sp:contract-testers'],
            },
          },
        },
      ],
      ignored: {
        text: 'You let SteerCo drift without a recommendation, so {sponsor} decides for you: "Everyone works weekends until launch."',
        effects: {
          velocity: { ws: 'all', mult: 1.15, days: 3, label: 'Mandated weekends' },
          morale: -12,
          trust: -6,
          flags: ['sp:crunch'],
        },
      },
    },
    {
      id: 'sp-steerco-ontrack',
      scenarios: ['shiokpay'],
      title: 'SteerCo: green, so… more?',
      channel: 'meeting',
      from: 'sponsor',
      body: 'Week 2 SteerCo. {sponsor} scans your burn-up: "On track. Nice." Then the follow-up you were dreading: "Since we\'re ahead, let\'s add pay-in-6 for 11.11. Big-ticket electronics, bigger baskets. Doable?" {pm} is already nodding.',
      urgency: 'high',
      weight: 0,
      fixedDay: 8,
      when: { behindSchedule: false },
      concept: 'scope-creep',
      skill: 'comms',
      choices: [
        {
          id: 'a',
          label: "Say yes: the team's ahead, so ride the momentum",
          cost: 0,
          grade: 'poor',
          insight:
            "A buffer is not spare capacity; it's what absorbs the risks you haven't hit yet. Adding scope because you're green turns a safe launch into a coin flip. Size the ask, show what it displaces, and let the sponsor choose.",
          outcome: {
            text: 'Pay-in-6 joins the plan. {lead} does the maths on a napkin and his face does the rest. Your buffer quietly evaporates.',
            effects: { scope: { core: 12, client: 8, data: 8 }, trust: 3, morale: -5, rel: { sponsor: 5, lead: -8 } },
          },
        },
        {
          id: 'b',
          label: 'Offer to launch two days early instead, and bank the goodwill',
          cost: 0,
          grade: 'poor',
          insight:
            'Pulling a date in to impress spends the buffer you were given for risk. Under-promise, over-deliver: a calm launch on the agreed date beats an early launch with an incident.',
          outcome: {
            text: '{sponsor} loves it and messages the CEO before the meeting ends. Your target is now two days earlier, and your buffer is theoretical.',
            effects: { targetDay: -2, trust: 5, morale: -4, rel: { sponsor: 6, lead: -6 } },
          },
        },
        {
          id: 'c',
          label: 'Keep SteerCo short: report green and take the pay-in-6 ask offline',
          cost: 0,
          grade: 'okay',
          insight:
            "Taking a big ask offline buys time, but a sponsor left waiting fills the silence with assumptions. If you defer, set a time and a format: 'sizing by Thursday, with options'.",
          outcome: {
            text: "The meeting ends early, which everyone loves. By Thursday, {sponsor} has told Marketing pay-in-6 is 'likely'. Now you're negotiating against a rumour.",
            effects: { scope: { core: 5, client: 4 }, trust: -2, rel: { sponsor: -2 } },
          },
        },
        {
          id: 'd',
          label: 'Price pay-in-6 in days, offer a fast-follow, pre-agree a Plan B',
          cost: 2,
          grade: 'best',
          insight:
            'Green is the best time to make hard calls, because nobody is panicking. Show what the buffer protects, price the new ask in days, and pre-agree the trigger for Plan B. Decisions made calmly beat decisions made at midnight.',
          outcome: {
            text: 'Pay-in-6 costs three days, so {sponsor} picks a December fast-follow. You also leave with a written Plan B: if anything slips past Day 11, the promo carousel gets cut. It goes straight into the decision log.',
            effects: { trust: 6, rel: { sponsor: 4, lead: 5 }, flags: ['sp:plan-b'], skills: { risk: 1 } },
          },
        },
      ],
      ignored: {
        text: 'You miss SteerCo for a production issue. {sponsor} takes your absence as a yes to pay-in-6.',
        effects: { scope: { core: 10, client: 8, data: 6 }, trust: -5, rel: { sponsor: -5 } },
      },
    },
    {
      id: 'sp-war-room',
      scenarios: ['shiokpay'],
      title: '11.11 war room: who is on call?',
      channel: 'slack',
      from: 'sre',
      body: 'Two years ago, checkout fell over at 00:03 on 11.11 and I spent the night on a bridge call with 60 people and no runbook. Not again. Launch is days away, the rota has holes over the Deepavali long weekend, and nobody has told me how we roll back or who talks to customers. Your call, {player}.',
      urgency: 'high',
      weight: 0,
      fixedDay: 12,
      concept: 'launch-readiness',
      skill: 'execution',
      choices: [
        {
          id: 'a',
          label: 'Leave it with {sre}: ops is his job, yours is shipping features',
          cost: 0,
          grade: 'poor',
          insight:
            'Launch readiness is cross-functional: rollback, on-call, support scripts, comms and sign-offs live in five teams, and only the TPM sees all of them. Delegating the pieces is fine; abdicating the whole is how launches fail at 00:03.',
          outcome: {
            text: '{sre} writes a solid infra runbook. Nobody writes the support script, the rollback call has no owner, and Marketing learns about the kill switch on the night.',
            effects: { trust: -3, rel: { sre: -8 }, unready: ['commsPlan'] },
          },
        },
        {
          id: 'b',
          label: 'Put yourself on call every night of launch week to lead by example',
          cost: 1,
          grade: 'poor',
          insight:
            "A TPM on call at 3am can't fix the decision service and won't be sharp for the Go/No-Go. Heroics hide gaps instead of closing them. Build a rota with real owners and save your energy for the calls only you can make.",
          outcome: {
            text: "You add yourself to every shift. The engineers appreciate the gesture; {sre} gently points out that you can't restart a pod. You start launch week already tired.",
            effects: { energy: -15, morale: 2, rel: { sre: -3 } },
          },
        },
        {
          id: 'c',
          label: 'Ask {sre} to draft a runbook and review it together on launch eve',
          cost: 1,
          grade: 'okay',
          insight:
            'Asking the expert to write the runbook is right; reviewing it the night before is not. Readiness needs time to rehearse and to fix what the review finds. Start readiness checks a week out, not the evening before.',
          outcome: {
            text: "{sre}'s runbook is excellent. Reading it at 11pm on launch eve, you both realise nobody has ever tested the rollback. Too late to rehearse now.",
            effects: { readiness: ['monitoring'], rel: { sre: 2 } },
          },
        },
        {
          id: 'd',
          label: 'Run a pre-mortem, then a readiness review: owners, rota and a rehearsal',
          cost: 3,
          grade: 'best',
          insight:
            "A pre-mortem ('it's 11.12 and we failed: why?') surfaces failure modes people are too polite to raise. Turn each into a readiness item with an owner: rota, rollback criteria, kill switch, support scripts, comms. Then rehearse.",
          outcome: {
            text: 'The pre-mortem produces 23 ways to fail, three of them terrifying. By evening each has an owner, the rota covers Deepavali, the rollback rehearsal is booked, and {sre} sends you a GIF of a man weeping with joy.',
            effects: {
              energy: -4,
              trust: 4,
              rel: { sre: 8 },
              readiness: ['oncall', 'commsPlan'],
              skills: { execution: 1 },
            },
          },
        },
      ],
      ignored: {
        text: 'Nobody owns readiness, so nobody does it. At 11pm {sre} posts "we are not ready" in the launch channel. Nobody replies.',
        effects: { trust: -4, morale: -3, rel: { sre: -8 } },
      },
    },

    // ───────────────────────────── Risk triggers ─────────────────────────────
    {
      id: 'sp-bank-sandbox-down',
      scenarios: ['shiokpay'],
      title: "Bank sandbox down 'for maintenance'",
      channel: 'slack',
      from: 'lead',
      body: 'The partner bank\'s sandbox is down for "scheduled maintenance" until Thursday. First we\'ve heard of it. We can\'t test disbursements or settlement files, so {ws.core} is basically stuck. Their account manager says the change board only meets weekly. Sian.',
      urgency: 'high',
      weight: 0,
      concept: 'vendor-mgmt',
      skill: 'stakeholder',
      choices: [
        {
          id: 'a',
          label: "Call the bank's delivery owner: date in writing, stub meanwhile",
          cost: 2,
          grade: 'best',
          insight:
            'Vendor management is relationship management with a paper trail. Go peer-to-peer with the person who can fix it, agree a recovery date in writing, and decouple your critical path with a contract-tested stub. Escalate only if the date slips.',
          outcome: {
            text: "Their delivery owner admits the maintenance surprised her too. Sandbox back Wednesday, a 15-minute check-in daily until then, and {lead}'s team keeps building against a stub.",
            effects: { block: { ws: 'core', days: 1, reason: 'Partner bank sandbox down' }, trust: 2, rel: { lead: 5 } },
          },
        },
        {
          id: 'b',
          label: "Ask {sponsor} to call the bank's head of partnerships today",
          cost: 0,
          grade: 'okay',
          insight:
            'Executive escalation works, but spending it on a first miss costs goodwill with the people you work with every day. Try the working level first, with a deadline; escalate with facts and options if that fails.',
          outcome: {
            text: "{sponsor} makes the call. The sandbox is back a day early, and the bank's integration team now replies to your emails with the warmth of a walk-in freezer.",
            effects: {
              block: { ws: 'core', days: 1, reason: 'Partner bank sandbox down' },
              trust: -2,
              rel: { sponsor: -4 },
              flags: ['sp:bank-escalated'],
            },
          },
        },
        {
          id: 'c',
          label: "Wait it out: it's the bank's problem, and Thursday really isn't that far",
          cost: 0,
          grade: 'poor',
          insight:
            "A vendor's delay is your critical-path problem. Waiting is a decision too, and an expensive one. Get a date in writing, find a workaround for the gap, and update the plan so nobody is surprised on Friday.",
          outcome: {
            text: 'Thursday becomes Monday. {ws.core} spends three days writing unit tests for code it can\'t integrate, and {lead} starts calling the bank "they who must not be named".',
            effects: { block: { ws: 'core', days: 3, reason: 'Partner bank sandbox down' }, morale: -3 },
          },
        },
        {
          id: 'd',
          label: 'Switch to the stub you built and keep going',
          cost: 1,
          grade: 'best',
          requires: { flags: ['sp:bank-stub'] },
          lockedHint: 'Needs the bank API stub (mitigate this risk early)',
          insight:
            'This is what mitigation buys you: when the risk fires, the plan already exists. Keep the critical path moving on the stub, then hold the vendor to a written recovery date.',
          outcome: {
            text: "{lead}'s team points the integration tests at the stub and barely breaks stride. You still get the bank to commit to a recovery date in writing.",
            effects: { trust: 2, rel: { lead: 4 } },
          },
        },
      ],
      ignored: {
        text: 'Nobody chases the bank. The sandbox comes back on Monday, and the bank seems surprised anyone was waiting.',
        effects: { block: { ws: 'core', days: 3, reason: 'Partner bank sandbox down' }, trust: -2, morale: -3 },
      },
    },
    {
      id: 'sp-load-test-melt',
      scenarios: ['shiokpay'],
      title: 'Load test: decision service melts at 4x',
      channel: 'incident',
      from: 'sre',
      body: "Game-day rehearsal last night: the credit decision service fell over at 4x normal traffic. p99 went from 200ms to 9 seconds, then to 'connection refused'. The new instalment preview added a synchronous bureau call, and the DB pool is tiny. 11.11 midnight is roughly 10x.",
      urgency: 'high',
      weight: 0,
      concept: 'risk-mgmt',
      skill: 'risk',
      choices: [
        {
          id: 'a',
          label: 'Triple the instances tonight and move on',
          cost: 0,
          grade: 'poor',
          insight:
            'Scaling out a service whose bottleneck is a database pool or a downstream API just moves the queue. Find the constraint first by profiling under load, fix it, then add capacity. Spending without a diagnosis buys a bigger outage.',
          outcome: {
            text: 'The cloud bill triples. The rerun dies at 4.5x instead of 4x: the DB connection pool is still the bottleneck, now with more friends queueing for it.',
            effects: { budget: -15, quality: -3, unready: ['loadTest'] },
          },
        },
        {
          id: 'b',
          label: 'Cap sign-ups at peak with a virtual queue and a "try again soon" screen',
          cost: 1,
          grade: 'okay',
          insight:
            'Load shedding is a legitimate safety valve and beats falling over. But a waiting room on the biggest sale of the year is a business decision: bring in {pm} and {sponsor}, and still fix the root cause.',
          outcome: {
            text: "{sre} adds a virtual queue for new sign-ups. Safe, but {pm} winces at the 'try again soon' copy, and the root cause is still waiting for you.",
            effects: { budget: -5, quality: 2, rel: { pm: -3 } },
          },
        },
        {
          id: 'c',
          label: 'Log it in the RAID log as accepted: 11.11 traffic might not even come',
          cost: 0,
          grade: 'poor',
          insight:
            "Writing a known failure into the RAID log isn't mitigation; it's documentation. 11.11 is the most predictable traffic spike of the year. When a test fails, the plan has to change.",
          outcome: {
            text: 'The RAID log now says "Accepted". {sre} replies with a single "ok", the most menacing message in engineering.',
            effects: { quality: -5, rel: { sre: -10 }, unready: ['loadTest'], flags: ['sp:accepted-load-risk'] },
          },
        },
        {
          id: 'd',
          label: 'Swarm it: profile, fix the hot path, add a degraded mode, re-test',
          cost: 2,
          grade: 'best',
          insight:
            "A failed load test is a gift: you found the incident before your customers did. Timebox a focused fix, add graceful degradation so the worst case is 'slower', not 'down', then re-test to prove it.",
          outcome: {
            text: "{lead} and {sre} pair on it: async bureau calls, a bigger pool, and a 'we'll confirm in a minute' state. The rerun survives 12x. {ws.core} takes a two-day hit; on 11.11 checkout might be slow, but it won't be down.",
            effects: {
              velocity: { ws: 'core', mult: 0.7, days: 2, label: 'Performance swarm' },
              quality: 6,
              rel: { sre: 6 },
              readiness: ['loadTest'],
            },
          },
        },
      ],
      ignored: {
        text: 'Nobody picks it up. {sre} reruns the test alone at 2am: same result. The incident channel from two years ago gets a new pinned message.',
        effects: { quality: -6, rel: { sre: -6 }, unready: ['loadTest'] },
      },
    },
    {
      id: 'sp-fraud-false-positives',
      scenarios: ['shiokpay'],
      title: 'Fraud model flags 38% of applicants',
      channel: 'slack',
      from: 'pm',
      body: "Help. Staff pilot results: the fraud model flags 38% of applicants as high-risk, including our CFO. It thinks anyone without a long ride history is a fraudster. Risk Data Science says a proper retrain takes a week. Marketing's 11.11 target is an 80% approval rate. Alamak.",
      urgency: 'high',
      weight: 0,
      concept: 'metrics',
      skill: 'technical',
      choices: [
        {
          id: 'a',
          label: 'Switch the fraud model off for launch: approvals first, fraud later',
          cost: 0,
          grade: 'poor',
          insight:
            "Removing a control to hit a conversion target swaps a model problem for a fraud and credit-loss problem on a regulated product. Tune, don't remove: adjust thresholds, add a manual-review band, and watch approval and fraud rates together.",
          outcome: {
            text: 'Approval rate: 97%. {compliance} asks which control replaced it. {security} asks the same question, in capital letters.',
            effects: { progress: { data: 8 }, quality: -8, rel: { compliance: -6, security: -6 }, flags: ['sp:fraud-model-off'] },
          },
        },
        {
          id: 'b',
          label: 'Do the proper retrain, even if {ws.data} slips by a week',
          cost: 1,
          grade: 'okay',
          insight:
            "Fixing the root cause is right, but a week's slip against a fixed date needs a stopgap. Pair the long fix with a short one: tuned thresholds and manual review now, the retrained model as a fast-follow.",
          outcome: {
            text: 'The data scientists are delighted. The schedule is not: {ws.data} is now uncomfortably close to the critical path.',
            effects: { block: { ws: 'data', days: 3, reason: 'Retraining the fraud model' }, quality: 4, rel: { pm: -2 } },
          },
        },
        {
          id: 'c',
          label: 'Tune thresholds, route the grey zone to review, track both rates',
          cost: 2,
          grade: 'best',
          insight:
            'Pair your goal metric with a guardrail metric: approval rate AND fraud rate. Thresholds plus a manual-review band for the grey zone fix most false positives in days, and the retrain becomes a fast-follow instead of a blocker.',
          outcome: {
            text: 'New thresholds, plus a manual-review band for the grey zone. Approvals hit 79% with fraud flat. The CFO is approved, and is oddly proud of it.',
            effects: {
              velocity: { ws: 'data', mult: 0.8, days: 2, label: 'Threshold tuning' },
              budget: -5,
              quality: 3,
              rel: { pm: 6 },
            },
          },
        },
      ],
      ignored: {
        text: 'The model keeps flagging a third of applicants. {pm} discovers the full picture on a dashboard, live, in a demo to {sponsor}.',
        effects: { trust: -5, rel: { pm: -5 }, progress: { data: -5 } },
      },
    },
    {
      id: 'sp-app-rejected',
      scenarios: ['shiokpay'],
      title: 'App store rejected the 11.11 build',
      channel: 'email',
      from: 'partner',
      body: "The store rejected our build. The reviewer couldn't test the pay-later flow (no demo account) and flagged our fee wording as unclear. Review queues before 11.11 are brutal because everyone submits at once. I can fix and resubmit, or ship the campaign build without {product}. Your call.",
      urgency: 'high',
      weight: 0,
      concept: 'phased-rollout',
      skill: 'execution',
      choices: [
        {
          id: 'a',
          label: 'Resubmit as-is and argue the case in the appeal notes',
          cost: 0,
          grade: 'poor',
          insight:
            'Arguing with a gatekeeper rarely beats giving them what they asked for. Read a rejection as requirements: fix, resubmit, explain clearly. Save appeals for genuine misunderstandings.',
          outcome: {
            text: 'The appeal is eloquent. The second rejection arrives three days later, same reasons, with a longer queue behind it.',
            effects: { block: { ws: 'client', days: 3, reason: 'Store rejected the build twice' }, rel: { partner: -4 } },
          },
        },
        {
          id: 'b',
          label: 'Pull {product} out of this build and ship it in a release after 11.11',
          cost: 1,
          grade: 'poor',
          insight:
            'Cutting the feature protects the campaign but misses the whole point of the program. Before you cut, check whether a smaller fix gets you through review; most rejections are about missing evidence, not the feature itself.',
          outcome: {
            text: 'The campaign build sails through. {product} misses 11.11, and {sponsor} finds out from the release notes.',
            effects: { progress: { client: -10 }, trust: -8, rel: { sponsor: -8 } },
          },
        },
        {
          id: 'c',
          label: 'Fix wording and demo account, resubmit with the feature flagged off',
          cost: 2,
          grade: 'best',
          insight:
            'Decouple deploy from release. Give the reviewer what they need, resubmit with the feature behind a remote flag, and launch becomes a config change you control, not a store review you wait on.',
          outcome: {
            text: "{compliance} supplies the fee wording, {partner}'s team sets up a demo account, and the feature ships dark behind a flag. Approved in a day and a half. Launch is now a switch {pm} can flip.",
            effects: {
              block: { ws: 'client', days: 1, reason: 'Store resubmission' },
              readiness: ['featureFlags'],
              rel: { partner: 5, compliance: 3 },
            },
          },
        },
      ],
      ignored: {
        text: "With no decision from you, {partner} ships the campaign build without {product}. He isn't wrong; he has his own 11.11 to land.",
        effects: { block: { ws: 'client', days: 2, reason: 'Store review, no decision' }, trust: -4, rel: { partner: -3 } },
      },
    },
    {
      id: 'sp-affordability-change',
      scenarios: ['shiokpay'],
      title: 'Compliance: the credit limits must change',
      channel: 'email',
      from: 'compliance',
      body: "I've reviewed the credit rules against the BNPL code of conduct. Two issues: starter limits for brand-new customers are higher than I can support without stronger affordability checks, and the late-fee wording in the T&Cs is unclear. Both must be fixed before I sign. I'm aware of the date. I'm also aware of the regulator.",
      urgency: 'high',
      weight: 0,
      concept: 'change-mgmt',
      skill: 'risk',
      choices: [
        {
          id: 'a',
          label: 'Ask her to accept the current rules and fix them after launch',
          cost: 0,
          grade: 'poor',
          insight:
            "Compliance findings on a credit product aren't negotiable backlog items; they're launch criteria. Arguing them down spends trust you'll need at Go/No-Go. Ask instead: what's the smallest change that meets the requirement?",
          outcome: {
            text: '{compliance} listens politely, then writes "No-Go unless fixed" in the sign-off tracker. In red. In bold.',
            effects: { trust: -4, rel: { compliance: -10 }, flags: ['sp:compliance-red'] },
          },
        },
        {
          id: 'b',
          label: 'Workshop it today: the smallest compliant fix, with owners and dates',
          cost: 2,
          grade: 'best',
          insight:
            'Treat a late requirement as a change request: understand the why, find the smallest compliant fix, re-plan with owners and dates, and log the decision. Late changes are cheapest when met with curiosity, not resistance.',
          outcome: {
            text: 'In one hour {compliance}, {pm} and {lead} agree on a lower starter limit that grows with on-time repayments, and plain-English late-fee wording. Two days of work, logged and owned.',
            effects: { scope: { core: 6, data: 5 }, progress: { review: 6 }, quality: 3, rel: { compliance: 8, pm: 3 } },
          },
        },
        {
          id: 'c',
          label: 'Accept everything and ask the team to absorb it this sprint',
          cost: 0,
          grade: 'okay',
          insight:
            'Saying yes to Compliance is right; silently piling the work onto a full sprint is not. Every new requirement needs a re-plan: what moves, who owns it, does the date still hold? Otherwise the team pays in late nights.',
          outcome: {
            text: "{compliance} is pleased. {lead}'s team finds out at standup and does it at night. The rework is bigger than it needed to be, because nobody asked what the minimum was.",
            effects: { scope: { core: 12, data: 8 }, morale: -5, rel: { compliance: 5, lead: -5 } },
          },
        },
        {
          id: 'd',
          label: 'Escalate to {sponsor}: Compliance is blocking the launch',
          cost: 0,
          grade: 'poor',
          insight:
            "Framing a control function as 'blocking' starts a fight you'll lose, and should. Escalate when peers can't agree on a trade-off, not to overrule a regulatory requirement.",
          outcome: {
            text: '{sponsor} asks {compliance} what the problem is. She explains in two sentences. He turns to you: "So fix it." Everyone remembers who escalated.',
            effects: { scope: { core: 8 }, trust: -5, rel: { compliance: -8, sponsor: -4 } },
          },
        },
      ],
      ignored: {
        text: '{compliance} marks the launch "Not approved" in the sign-off tracker and copies {boss}.',
        effects: {
          trust: -4,
          rel: { compliance: -8, boss: -4 },
          block: { ws: 'review', days: 2, reason: 'Compliance findings unanswered' },
        },
      },
    },
    {
      id: 'sp-ict-callup',
      scenarios: ['shiokpay'],
      title: "Hafiz's reservist ICT starts Monday",
      channel: 'whatsapp',
      from: 'lead',
      body: "Eh, heads up. Hafiz's reservist ICT starts Monday and runs right through launch. It's been on his calendar for months. He's also the one person who really knows the repayment-schedule engine. How do you want to play it?",
      urgency: 'high',
      weight: 0,
      concept: 'team-health',
      skill: 'leadership',
      choices: [
        {
          id: 'a',
          label: 'Take over the repayment engine yourself: how hard can a ledger be?',
          cost: 2,
          grade: 'poor',
          insight:
            "Stepping in as the engineer feels responsible, but your job is a system that works without heroes, you included. While you're debugging ledgers, nobody is managing the bank, Compliance or the launch plan.",
          outcome: {
            text: 'You spend two evenings in the repayment engine. You fix one bug and introduce a rounding error of S$0.01 per instalment. Meanwhile, three emails from {compliance} sit unanswered for 48 hours.',
            effects: {
              velocity: { ws: 'core', mult: 0.85, days: 3, label: 'Hafiz on ICT' },
              energy: -12,
              quality: -4,
              trust: -3,
              rel: { compliance: -3 },
              flags: ['sp:tpm-coded'],
            },
          },
        },
        {
          id: 'b',
          label: 'Ask Hafiz to apply for a deferment: this launch matters more right now',
          cost: 0,
          grade: 'poor',
          insight:
            "National service isn't a scheduling preference, and deferment isn't yours to grant. Pressuring someone to defer for a sprint costs trust far beyond this launch. Treat known absences as plan inputs: pair, hand over, re-sequence.",
          outcome: {
            text: 'Hafiz goes quiet. {lead} goes quieter. The deferment doesn\'t happen anyway, and now the whole team knows how you think about their time.',
            effects: {
              velocity: { ws: 'core', mult: 0.8, days: 3, label: 'Hafiz on ICT, no handover' },
              morale: -8,
              trust: -2,
              rel: { lead: -10 },
            },
          },
        },
        {
          id: 'c',
          label: 'Pair him up for two days, get a handover doc, re-sequence his work',
          cost: 2,
          grade: 'best',
          insight:
            'A bus factor of one is a risk, not a surprise. Use the time left: pair, write down the tribal knowledge, and re-sequence so his critical pieces land before he leaves. Then add leave and NS calendars to your planning checklist.',
          outcome: {
            text: 'Hafiz pairs with two teammates and finally writes the runbook. His critical tickets move up; the rest are shared out. He leaves for camp with a clear conscience, and the team keeps a map.',
            effects: {
              velocity: { ws: 'core', mult: 0.9, days: 3, label: 'Hafiz on ICT (handed over)' },
              morale: 3,
              quality: 2,
              rel: { lead: 6 },
            },
          },
        },
        {
          id: 'd',
          label: 'Confirm the cover plan you already made and wish him well',
          cost: 1,
          grade: 'best',
          requires: { flags: ['sp:ict-handover'] },
          lockedHint: 'Needs a handover plan (mitigate the ICT risk early)',
          insight:
            'Early mitigation turns a known absence into a non-event. Confirm the cover, check the critical-path tickets really moved, and keep leave and NS dates in the plan from now on.',
          outcome: {
            text: 'The handover happened last week, so this is a two-minute check: critical tickets done, runbook written, cover named. Hafiz leaves for camp with the team\'s blessing.',
            effects: {
              velocity: { ws: 'core', mult: 0.95, days: 2, label: 'Hafiz on ICT (covered)' },
              morale: 3,
              rel: { lead: 4 },
            },
          },
        },
      ],
      ignored: {
        text: 'Hafiz leaves for camp with the repayment engine in his head. On Tuesday a rounding bug appears and nobody knows where to look.',
        effects: { velocity: { ws: 'core', mult: 0.7, days: 4, label: 'Hafiz on ICT, no handover' }, morale: -3 },
      },
    },
    {
      id: 'sp-myinfo-prod',
      scenarios: ['shiokpay'],
      title: 'Myinfo: fine in sandbox, not in production',
      channel: 'slack',
      from: 'security',
      body: 'Staff pilot on production Myinfo: 22% of onboardings fail. Real profiles have gaps the sandbox test personas never had (no income data for some self-employed staff, odd address formats), and one key is configured for the wrong environment. Mobile wants to hot-patch tonight.',
      urgency: 'high',
      weight: 0,
      concept: 'uat',
      skill: 'technical',
      choices: [
        {
          id: 'a',
          label: 'Launch only to users with complete profiles; include the rest later',
          cost: 1,
          grade: 'okay',
          insight:
            "Narrowing the launch audience is a legitimate phased rollout and protects the date. Make it explicit, though: tell {pm} and {sponsor} who is excluded, how many, and when they'll be included. And still fix the key.",
          outcome: {
            text: "Users with gaps see a polite 'coming soon'. Safe and simple, but one in five keen 11.11 customers is turned away, and {pm} has to explain that number to {sponsor}.",
            effects: { scope: { client: -5 }, trust: -2, rel: { pm: -3 } },
          },
        },
        {
          id: 'b',
          label: 'Add graceful fallbacks, fix the key through the pipeline, re-test with staff',
          cost: 2,
          grade: 'best',
          insight:
            'Sandboxes are tidy; production is people. Design for missing and messy data with a graceful fallback (ask the customer, or route to manual review), fix config through the pipeline, and re-test with real profiles before customers see it.',
          outcome: {
            text: 'Missing income? The app asks politely and routes the case to manual review. The key is fixed through the pipeline, with a config check added. Staff pilot failures drop to 2%.',
            effects: {
              velocity: { ws: 'client', mult: 0.8, days: 2, label: 'Myinfo edge cases' },
              quality: 5,
              rel: { security: 5, pm: 2 },
            },
          },
        },
        {
          id: 'c',
          label: 'Let Mobile hot-patch it tonight so the pilot keeps moving',
          cost: 0,
          grade: 'poor',
          insight:
            'Hot-patching eKYC on a credit product trades a known problem for an unknown one. Move fast, but through the pipeline: reproduce with realistic data, cover the missing cases, re-test, then roll out to staff first.',
          outcome: {
            text: 'The hot-patch fixes addresses and breaks income parsing for everyone else. {security} is now writing an incident report instead of reviewing your launch.',
            effects: { block: { ws: 'client', days: 1, reason: 'Rolling back the Myinfo hot-patch' }, quality: -8, rel: { security: -6 } },
          },
        },
      ],
      ignored: {
        text: 'Failures continue all week. A Slack thread titled "is Singpass down??" gets 40 replies. It isn\'t.',
        effects: { quality: -4, rel: { security: -4 }, block: { ws: 'client', days: 1, reason: 'Myinfo onboarding failures' } },
      },
    },
    {
      id: 'sp-bureau-throttle',
      scenarios: ['shiokpay'],
      title: 'Credit bureau: 429 Too Many Requests',
      channel: 'incident',
      from: 'lead',
      body: "The credit bureau is throttling us: HTTP 429 on a third of checks since the pre-approval batch started. Our contract caps us at a fixed rate per second, and their account manager is on leave. Real customers in the pilot are stuck on 'checking…'.",
      urgency: 'critical',
      weight: 0,
      concept: 'incident-mgmt',
      skill: 'technical',
      choices: [
        {
          id: 'a',
          label: 'Pause the batch, queue with backoff, ask for a burst quota',
          cost: 2,
          grade: 'best',
          insight:
            'In an incident, stop the bleeding before you fix the cause: pause non-urgent load, queue with backoff so customers wait gracefully, then negotiate capacity with data. Vendor rate limits belong in your capacity plan.',
          outcome: {
            text: "Batch paused, real customers first, queue with backoff. {pm} reaches the bureau's backup contact with your traffic numbers and gets a temporary burst quota for 11.11.",
            effects: {
              velocity: { ws: 'core', mult: 0.85, days: 2, label: 'Bureau queueing' },
              budget: -8,
              quality: 3,
              rel: { pm: 4, lead: 4 },
            },
          },
        },
        {
          id: 'b',
          label: 'Crank up the retries until the checks go through',
          cost: 0,
          grade: 'poor',
          insight:
            'Retrying into a rate limit is a self-inflicted denial of service: you get throttled harder and may breach the contract. Back off, queue, put real customers ahead of batch jobs, and fix capacity with the vendor.',
          outcome: {
            text: "Retries triple the traffic. The bureau suspends your API key for 'abuse', and the account manager's backup sends a very formal email.",
            effects: { block: { ws: 'core', days: 2, reason: 'Bureau API key suspended' }, quality: -5, trust: -4 },
          },
        },
        {
          id: 'c',
          label: 'Skip bureau checks for small limits until the throttling stops',
          cost: 0,
          grade: 'poor',
          insight:
            'Removing a credit control to work around a vendor limit swaps an outage for a credit and compliance risk. Degrade gracefully instead: queue, prioritise, and tell customers honestly that approval may take a minute.',
          outcome: {
            text: 'Approvals flow again. Then {compliance} asks who approved lending without credit checks, and the answer is you.',
            effects: { trust: -6, quality: -4, rel: { compliance: -10 } },
          },
        },
      ],
      ignored: {
        text: 'The 429s continue. The pilot funnel looks like a cliff, and the bureau sends a formal warning about contract limits.',
        effects: { block: { ws: 'core', days: 1, reason: 'Bureau throttling' }, trust: -3, quality: -2 },
      },
    },

    // ───────────────────────────── Flavour ─────────────────────────────
    {
      id: 'sp-livestream',
      scenarios: ['shiokpay'],
      title: 'Marketing wants a live-stream "Pay Later" button',
      channel: 'slack',
      from: 'pm',
      body: "Marketing's 11.11 plan just dropped: a live shopping stream with a celebrity host, and a 'Pay Later' button that pops up during flash deals, in sync with the stream. They say it's \"just a button\". They also say the host is already booked. Can we squeeze it in?",
      urgency: 'normal',
      when: { minDay: 3, maxDay: 10 },
      concept: 'negotiation',
      skill: 'stakeholder',
      choices: [
        {
          id: 'a',
          label: 'Ask what they need: a deep link and promo code may do it',
          cost: 1,
          grade: 'best',
          insight:
            "Negotiate interests, not positions. Marketing's real goal is 'viewers can pay later during the stream', and a deep link plus a promo code does that with zero new features. Find the need behind the ask before you size the ask.",
          outcome: {
            text: 'Turns out Marketing wants clicks, not a feature. A deep link straight to checkout plus a SHIOKLATER promo code does the job, and the host still gets to shout "Shiok!" on camera.',
            effects: { trust: 3, rel: { pm: 5, partner: 3 }, skills: { stakeholder: 1 } },
          },
        },
        {
          id: 'b',
          label: "Say yes: it's the 11.11 headline, and the team will find a way",
          cost: 0,
          grade: 'poor',
          insight:
            "'Just a button' on a live stream means real-time sync, traffic spikes on cue and new fraud patterns. Agreeing before sizing hands Marketing your buffer. Ask what outcome they need, then offer options with costs.",
          outcome: {
            text: 'Marketing is thrilled. {lead} and {partner} find out from a deck called FINAL_v7_REALFINAL. {ws.client} grows a live-sync feature overnight.',
            effects: {
              scope: { client: 15, core: 6 },
              morale: -4,
              rel: { pm: 4, lead: -6, partner: -8 },
              flags: ['sp:livestream-yes'],
            },
          },
        },
        {
          id: 'c',
          label: 'Say no: scope is frozen until after launch, full stop',
          cost: 0,
          grade: 'okay',
          insight:
            "Protecting scope is right, but a flat no leaves Marketing with a booked host and no plan. 'No, but here's what we can do' keeps both the relationship and the date.",
          outcome: {
            text: "Marketing escalates to {sponsor}, who asks why 'a button' is impossible. You spend an afternoon explaining real-time sync to a VP.",
            effects: { energy: -4, rel: { pm: -4, sponsor: -3 } },
          },
        },
      ],
      ignored: {
        text: 'Silence reads as yes. Marketing announces the live "Pay Later" button in the 11.11 teaser.',
        effects: { scope: { client: 12, core: 5 }, trust: -3, flags: ['sp:livestream-yes'] },
      },
    },
    {
      id: 'sp-hawker-lunch',
      scenarios: ['shiokpay'],
      title: 'Chicken rice and the truth',
      channel: 'hallway',
      from: 'lead',
      body: '{lead} catches you at the lift: "Lunch? Chicken rice, my treat." Halfway through, he puts down his spoon. "Honestly ah, the board says repayments are 80% done. It\'s more like 60. Refunds and partial repayments aren\'t built. The last TPM shouted at whoever brought bad news, so… nobody did."',
      urgency: 'normal',
      expires: 1,
      when: { minDay: 4, maxDay: 10 },
      concept: 'rag-status',
      skill: 'leadership',
      choices: [
        {
          id: 'a',
          label: 'Thank him, re-plan it openly with the team, and report amber',
          cost: 2,
          grade: 'best',
          insight:
            'How you react to the first piece of bad news decides whether you get the second. Thank the messenger, re-plan with the team, and report honestly. A watermelon status (green outside, red inside) only delays the pain and makes it bigger.',
          outcome: {
            text: 'You thank him, then walk the team through a re-plan without a single raised voice. The board tells the truth again, and people start telling you things before they become problems.',
            effects: { scope: { core: 8 }, morale: 6, quality: 3, trust: 2, rel: { lead: 12 }, flags: ['sp:honest-replan'] },
          },
        },
        {
          id: 'b',
          label: 'Keep it between you two until you have a recovery plan',
          cost: 0,
          grade: 'okay',
          insight:
            'Buying a day or two to prepare options is reasonable; sitting on known bad news is not. Set yourself a deadline to tell stakeholders, ideally with the recovery plan, before the next status report.',
          outcome: {
            text: "You agree to keep it quiet until Friday. It's a long week of nodding along in standups while knowing the board is wrong.",
            effects: { scope: { core: 8 }, energy: -4, rel: { lead: 4 }, flags: ['sp:sat-on-bad-news'] },
          },
        },
        {
          id: 'c',
          label: 'Tell him the team must still hit the plan: the dates were committed',
          cost: 0,
          grade: 'poor',
          insight:
            "Insisting on the plan after hearing it's wrong teaches people to stop telling you. A plan is a forecast, not a promise; when reality changes, change the plan and manage expectations upward.",
          outcome: {
            text: "{lead} nods and finishes his chicken rice in silence. He won't bring you bad news again; next time you'll hear it from the incident channel.",
            effects: { scope: { core: 8 }, morale: -6, rel: { lead: -12 }, flags: ['sp:shot-messenger'] },
          },
        },
        {
          id: 'd',
          label: 'Raise it with {boss} today and ask how this was hidden from the plan',
          cost: 1,
          grade: 'poor',
          insight:
            "Turning a disclosure into a blame hunt guarantees it's the last one. Escalate the impact, not the person: 'repayments were underestimated; here's the re-plan.' Blameless framing keeps the truth flowing.",
          outcome: {
            text: '{boss} asks the right question: "What\'s the plan?" You don\'t have one yet. Within the hour, {lead} hears that you went upstairs about his team.',
            effects: { scope: { core: 8 }, morale: -4, trust: -2, rel: { lead: -10, boss: -3 } },
          },
        },
      ],
      ignored: {
        text: 'You say you\'ll "think about it", then get swallowed by meetings. {lead} takes the silence as an answer, and the missing work surfaces later anyway.',
        effects: { scope: { core: 8 }, rel: { lead: -5 } },
      },
    },
    {
      id: 'sp-townhall-promise',
      scenarios: ['shiokpay'],
      title: 'The CEO promised what at the town hall?',
      channel: 'slack',
      from: 'sponsor',
      body: 'Did you catch the town hall? Our CEO told 4,000 staff that on 11.11 every Shiok user will open the app to a pre-approved {product} limit. So: let\'s run credit checks on all 2 million active users this week and push their limits on the day. Simple, right?',
      urgency: 'high',
      when: { minDay: 3, maxDay: 9 },
      concept: 'pdpa',
      skill: 'risk',
      choices: [
        {
          id: 'a',
          label: 'Kick off the batch tonight: the CEO said it on stage',
          cost: 0,
          grade: 'poor',
          insight:
            "Credit checks on 2 million people who never applied raise serious consent questions under PDPA and the bureau's rules, and hammer capacity too. 'The CEO said so' isn't a lawful basis. Translate the intent into something you can actually do.",
          outcome: {
            text: "The batch starts at midnight. By 9am {compliance} has three questions about consent, and the bureau's API is answering slower than usual.",
            effects: {
              trust: 2,
              scope: { core: 8 },
              rel: { compliance: -10 },
              addRisks: ['sp-risk-bureau-limit'],
              flags: ['sp:batch-preapproval'],
            },
          },
        },
        {
          id: 'b',
          label: 'Tell {sponsor} it breaches PDPA, so the answer is no',
          cost: 0,
          grade: 'okay',
          insight:
            "You're right to worry about consent, but a flat no to a CEO promise leaves your sponsor stranded, and legal conclusions belong to Legal. Bring in Compliance, and bring a version that keeps the headline.",
          outcome: {
            text: '{sponsor} replies "Noted" and takes it to {compliance} himself. You weren\'t wrong, but you weren\'t in the room when the answer was found.',
            effects: { trust: -2, rel: { sponsor: -5 } },
          },
        },
        {
          id: 'c',
          label: "Bring in {compliance}: pitch 'your limit in one tap', with consent",
          cost: 2,
          grade: 'best',
          insight:
            "Keep the promise's intent, change its mechanics. With consent captured in-app, each user sees their limit seconds after one tap, so the headline survives, PDPA is respected and bureau load spreads out. Bring the lawyer early, with a solution.",
          outcome: {
            text: "{compliance} drafts a consent screen in an afternoon. New headline: 'Your 11.11 limit is one tap away'. The CEO's office likes it more than the original, and {sponsor} forwards it with 'see, simple'.",
            effects: { trust: 5, scope: { client: 5 }, rel: { compliance: 6, sponsor: 5, pm: 3 }, skills: { risk: 1 } },
          },
        },
        {
          id: 'd',
          label: "Ask {boss} to get the CEO's office to quietly walk the promise back",
          cost: 1,
          grade: 'poor',
          insight:
            "Asking a CEO to retract a public promise is the most expensive option on the table and rarely necessary. Solve within the intent first; escalate only if no compliant version of the promise exists.",
          outcome: {
            text: '{boss} raises an eyebrow: "You want me to tell the CEO he was wrong, before we\'ve looked for a way to make it right?" You do not, it turns out.',
            effects: { trust: -3, rel: { boss: -6, sponsor: -4 } },
          },
        },
      ],
      ignored: {
        text: '{sponsor} decides no news is good news and asks {lead} to start the batch himself.',
        effects: {
          trust: -3,
          scope: { core: 6 },
          rel: { compliance: -5 },
          addRisks: ['sp-risk-bureau-limit'],
          flags: ['sp:batch-preapproval'],
        },
      },
    },
    {
      id: 'sp-mobile-tugofwar',
      scenarios: ['shiokpay'],
      title: 'Mobile devs pulled onto the 11.11 campaign',
      channel: 'slack',
      from: 'partner',
      body: "Heads up: Marketing moved the 11.11 campaign screens up a week, so I'm moving two of my three checkout devs onto them until Friday. The campaign is my squad's OKR; {product} is… yours. Sorry, but that's the call unless someone above me says otherwise.",
      urgency: 'normal',
      when: { minDay: 3, maxDay: 9 },
      concept: 'critical-path',
      skill: 'execution',
      choices: [
        {
          id: 'a',
          label: "Escalate to both VPs today: checkout has to be everyone's priority",
          cost: 1,
          grade: 'poor',
          insight:
            "Before escalating a resource conflict, check whether it actually hits the critical path. Spending escalation capital on work that has float makes you the TPM who cries wolf, and costs you a peer you'll need later.",
          outcome: {
            text: "Both VPs take the meeting. {partner}'s VP points out that checkout is waiting on {ws.core} anyway. {sponsor} looks at you over his glasses.",
            effects: { trust: -4, rel: { partner: -8, sponsor: -3 }, flags: ['sp:escalated-mobile'] },
          },
        },
        {
          id: 'b',
          label: 'Check the critical path, then agree a return date with {partner}',
          cost: 1,
          grade: 'best',
          insight:
            'Not every delay matters; delays on the critical path do. Checkout is capped until the backend lands, so it has float this week. Trade that float for goodwill, and agree in writing when the devs come back, before it turns critical.',
          outcome: {
            text: 'The numbers say checkout has float until {ws.core} lands. You tell {partner}: "Take them till Friday, but I need all three from Monday." He shakes on it, visibly relieved.',
            effects: {
              velocity: { ws: 'client', mult: 0.6, days: 3, label: 'Devs on 11.11 campaign' },
              rel: { partner: 10 },
              flags: ['sp:mobile-deal'],
            },
          },
        },
        {
          id: 'c',
          label: 'Ask {partner} for a favour: leave one more dev on checkout',
          cost: 1,
          grade: 'okay',
          insight:
            "Favours work when you've banked goodwill, and cost you when you haven't. Either way, a favour doesn't resolve the underlying priority clash. Know your critical path before you spend relationship capital.",
          chance: {
            base: 0.5,
            rel: 'partner',
            success: {
              text: '{partner} grins: "Okay, for you." Two devs stay on checkout. You owe him a kopi, and probably a favour back.',
              effects: { velocity: { ws: 'client', mult: 0.85, days: 3, label: 'One dev on 11.11 campaign' }, rel: { partner: -2 } },
            },
            failure: {
              text: '{partner} sighs: "Can\'t. My VP is watching the campaign burn-down." The devs move anyway, and no return date is agreed.',
              effects: { velocity: { ws: 'client', mult: 0.6, days: 5, label: 'Devs on 11.11 campaign' }, rel: { partner: -3 } },
            },
          },
        },
      ],
      ignored: {
        text: "No reply from you, so the devs move with no return date. 'Until Friday' quietly becomes 'until after 11.11'.",
        effects: { velocity: { ws: 'client', mult: 0.5, days: 6, label: 'Devs on 11.11 campaign' }, rel: { partner: -2 } },
      },
    },
  ],
}
