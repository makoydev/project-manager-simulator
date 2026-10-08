import type { ScenarioDef } from '../../game/types'

/**
 * Tamarind — "The January Promise" (difficulty 2).
 *
 * The player is the TPM at the Singapore engineering hub of a fictional Toronto-headquartered
 * employee-benefits platform. Program: launch a Lifestyle Spending Account (LSA) plus a rebuilt
 * claims auto-adjudication flow for 23 enterprise employers before a January 1 plan year that the
 * employers already announced at open enrollment. Themes: a lean team that inherited a codebase
 * built by three times as many people, AI-assisted delivery that needs guardrails, member health
 * data (HIPAA / PIPEDA / SOC 2, kept general), follow-the-sun work 13 hours from HQ, and B2B client
 * delivery where the date is fixed and scope must flex (phasing employers into waves).
 *
 * Tuning at neutral play (start morale 56 / quality 62 → velocity factor ≈ 0.96):
 *   platform Day 12 · core Day 13 · data Day 14 · review Day 15 · client Day 16
 *   → projected launch Day 16. Critical chain: client ← core (employer configs can't be finally
 *   validated until the engine is done; client idles at its 75% cap from Day 9). Recovery levers:
 *   wave the employers at SteerCo (Day 8, client −20% → Day 15), protect the engine from
 *   interruptions, buy capacity, or raise morale/quality. Anything added to core costs a day.
 */
export const TAMARIND: ScenarioDef = {
  id: 'tamarind',
  name: 'The January Promise',
  company: 'Tamarind',
  companyBlurb:
    'A Toronto-headquartered employee-benefits platform running health and lifestyle spending accounts for 23 enterprise employers across Canada and the US. Its engineering hub in Singapore keeps the platform running while Toronto sleeps.',
  program: 'Project Ice Kacang',
  product: 'Tamarind LSA',
  tagline: "Thirty engineers built it. Ten own it. January 1 doesn't care.",
  difficulty: 2,
  setting: 'Benefits-tech hub · Tanjong Pagar, Singapore ⇄ Toronto HQ',
  brief: [
    "Welcome to {company}'s Singapore engineering hub, {player}. {company} runs health and lifestyle spending accounts for 23 enterprise employers in Canada and the US, from a Toronto HQ 13 hours behind you. {program} (the hub named it; Toronto approved it for the 'ice') launches the {product}, a taxable wellness allowance for gyms, yoga and home-office chairs, plus a rebuilt claims flow that auto-approves the easy claims.",
    "The date isn't yours to move. Employers announced the benefit to their people at open enrollment, and their plan year starts on January 1. Go-live is Day 15, the last Friday before the year-end change freeze. Slip, and you're asking for freeze exceptions in Christmas week.",
    'The catch: about 30 engineers used to look after this codebase. After a restructuring, a lean team of ten owns it: engineers, two config specialists, two QA engineers, customer success managers acting as product owners, and support agents. The docs are stale, AI coding assistants are everywhere, and Toronto answers your questions tomorrow. Make January 1 boring.',
  ],
  targetDay: 15,
  maxDay: 20,
  start: { morale: 56, trust: 55, quality: 62, budget: 80 },
  hue: 195,
  icon: '🏡',

  // ───────────────────────────── Cast ─────────────────────────────
  cast: {
    boss: {
      role: 'boss',
      name: 'Nadia Haddad',
      short: 'Nadia',
      title: 'Director of Delivery',
      avatar: '🍁',
      hue: 0,
      power: 4,
      interest: 3,
      location: 'Toronto HQ (13 hours behind)',
      bio: "Runs delivery from Toronto, async-first, and reads your update at 7am her time. Make it stand alone: what's true, what you need, by when. Bad news is fine; surprises are not.",
    },
    sponsor: {
      role: 'sponsor',
      name: 'Catherine Mah',
      short: 'Catherine',
      title: 'VP, Product & Operations',
      avatar: '🎯',
      hue: 270,
      power: 5,
      interest: 4,
      location: 'Toronto HQ',
      bio: "Sold the LSA to the board as this year's growth story and promised the launch employers January 1 herself. Numbers-first and decisive: bring trade-offs with costs, never client surprises.",
    },
    pm: {
      role: 'pm',
      name: 'Hannah Lefebvre',
      short: 'Hannah',
      title: 'Senior CSM & Product Owner, Launch Employers',
      avatar: '📋',
      hue: 315,
      power: 3,
      interest: 5,
      location: 'Toronto HQ',
      bio: "Owns the launch employers' relationships and the product backlog. Knows every HR team's quirks. Says yes on client calls and tells you after; give her a script for 'not yet'.",
    },
    lead: {
      role: 'lead',
      name: 'Tan Hui Min',
      short: 'Hui Min',
      title: 'Staff Engineer, Claims Engine',
      avatar: '🧩',
      hue: 135,
      power: 3,
      interest: 5,
      location: 'Singapore hub, Tanjong Pagar',
      bio: 'The last engineer standing who knows why the claims engine does what it does. Fast, generous and quietly overloaded. Every question routed to her is a minute off the critical path.',
    },
    partner: {
      role: 'partner',
      name: 'Marcus Boateng',
      short: 'Marcus',
      title: 'Engineering Manager, Payments',
      avatar: '💸',
      hue: 45,
      power: 3,
      interest: 2,
      location: 'Toronto HQ',
      bio: 'Owns reimbursement runs and reconciliation for every Tamarind product, not just yours. Meticulous and stretched. Asks that arrive early, sized and in writing get a yes.',
    },
    sre: {
      role: 'sre',
      name: 'Muhammad Irfan bin Zulkifli',
      short: 'Irfan',
      title: 'Platform & SRE Lead',
      avatar: '🔦',
      hue: 225,
      power: 3,
      interest: 3,
      location: 'Singapore hub, Tanjong Pagar',
      bio: "Runs the platform, the pipelines and an on-call rota built for 30 people and staffed by 10. Dry humour, strong opinions. If it isn't in the runbook, it doesn't exist at 2am.",
    },
    security: {
      role: 'security',
      name: 'Aaron Fernandes',
      short: 'Aaron',
      title: 'Security & Privacy Engineer',
      avatar: '🔐',
      hue: 90,
      power: 4,
      interest: 3,
      location: 'Singapore hub, Tanjong Pagar',
      bio: "Wrote the team's AI-tool rules after the restructuring. Pragmatic, not the department of no: show him the data flow early and he'll help you find the safe way to yes.",
    },
    compliance: {
      role: 'compliance',
      name: 'Harpreet Gill',
      short: 'Harpreet',
      title: 'Privacy & Compliance Counsel',
      avatar: '📜',
      hue: 180,
      power: 4,
      interest: 2,
      location: 'Toronto HQ',
      bio: 'Covers HIPAA for US clients, PIPEDA in Canada and the SOC 2 audit. Calm, precise and immovable on member health data. Her first question: who can see it, and why?',
    },
  },

  // ───────────────────────────── Workstreams ─────────────────────────────
  // Neutral projection (factor ≈ 0.96): core 13, client 16 (critical: final config validation waits
  // for the engine), platform 12, data 14, review 15. Waving 18 employers to February (client −20%)
  // brings the launch to Day 15; a 1-day slip on core pushes client to Day 17.
  workstreams: [
    {
      role: 'core',
      name: 'Claims & LSA Engine',
      icon: '⚙️',
      owner: 'lead',
      work: 110,
      done: 26,
      velocity: 7,
      description:
        'The LSA wallet plus the rebuilt claims auto-adjudication: plan rules, receipt checks, duplicate detection and the eligibility service it leans on. The critical path runs through here.',
    },
    {
      role: 'client',
      name: 'Employer Configuration & Onboarding',
      icon: '🏢',
      owner: 'pm',
      work: 96,
      done: 12,
      velocity: 7,
      deps: [{ on: 'core', capAt: 0.75 }],
      description:
        "Loading 23 employers' plan rules (allowances, categories, proration, claim deadlines) and onboarding their HR teams. Final validation of each plan needs the finished engine.",
    },
    {
      role: 'platform',
      name: 'Payments & Reimbursement Runs',
      icon: '🏦',
      owner: 'partner',
      work: 70,
      done: 14,
      velocity: 5,
      description:
        "Toronto Payments' daily reimbursement batch: bank files, employer funding and reconciliation to the cent. Shared with every other Tamarind product, so your work competes for their time.",
    },
    {
      role: 'data',
      name: 'Plan Data Migration & Reporting',
      icon: '🗂️',
      owner: 'sre',
      work: 56,
      done: 6,
      velocity: 5,
      deps: [{ on: 'platform', capAt: 0.75 }],
      description:
        'Eligibility files from 23 HR systems, new plan-year balances, employer reports and the payroll export for taxable LSA payouts. Payout reports need the finished payment runs.',
    },
    {
      role: 'review',
      name: 'Privacy, Security & UAT',
      icon: '🛡️',
      owner: 'compliance',
      work: 60,
      done: 6,
      velocity: 5,
      deps: [{ on: 'core', capAt: 0.8 }],
      description:
        'Privacy impact assessment, security review and SOC 2 change evidence, plus UAT with the CSMs and launch employers. Sign-off waits for a finished engine.',
    },
  ],

  // ───────────────────────────── Risks (RAID) ─────────────────────────────
  risks: [
    {
      id: 'tm-risk-config-error',
      title: 'Wrong allowance loaded for an employer',
      description:
        "Two config specialists are hand-keying 23 employers' plan rules from PDFs. One slipped digit and a whole company sees the wrong allowance on January 1, in front of its CHRO.",
      ws: 'client',
      owner: 'pm',
      likelihood: 3,
      impact: 4,
      initial: 'open',
      earliestDay: 5,
      mitigation: {
        label: 'Four-eyes config review plus automated plan checks',
        cost: 2,
        text: "Hannah's config specialists pair-review every plan, and Hui Min's team adds a check that compares each loaded plan with its signed plan summary. Two typos die quietly in staging.",
        effects: { quality: 3, rel: { pm: 3 } },
      },
      trigger: 'tm-config-wrong-allowance',
    },
    {
      id: 'tm-risk-late-plan-change',
      title: 'Employers change plan rules after freeze',
      description:
        'Plan rules freeze on Day 5, but HR teams keep refining their LSAs. A big employer adding categories in week 3 means re-config, re-test and new employee comms, all on the critical path.',
      ws: 'client',
      owner: 'pm',
      likelihood: 3,
      impact: 3,
      initial: 'open',
      earliestDay: 6,
      mitigation: {
        label: 'Agree a change window and a February update path',
        cost: 1,
        text: "You and Hannah send every launch employer the same note: plan changes after Day 5 ship in a February update unless the law requires them sooner. Two HR teams reply 'thanks for being clear'.",
        effects: { trust: 2, rel: { pm: 3 } },
      },
      trigger: 'tm-late-plan-change',
    },
    {
      id: 'tm-risk-uat-timezone',
      title: 'UAT stalls across the 13-hour gap',
      description:
        "UAT needs CSMs and employer HR teams in Toronto hours, while fixes happen in Singapore's day. Every question costs a day, and HR teams have little patience to spare in December.",
      ws: 'review',
      owner: 'pm',
      likelihood: 4,
      impact: 3,
      initial: 'open',
      earliestDay: 6,
      mitigation: {
        label: 'Book a daily overlap hour and async UAT scripts',
        cost: 2,
        text: 'You book a daily 9pm Singapore / 8am Toronto UAT triage, rotate who stays late, and record short demos so HR testers can work async. Questions now wait hours, not days.',
        effects: { energy: -4, rel: { pm: 4 }, flags: ['tm:uat-overlap'] },
      },
      trigger: 'tm-uat-stalled',
    },
    {
      id: 'tm-risk-double-pay',
      title: 'Retries pay some claims twice',
      description:
        "The rebuilt adjudication flow and the old payment batch both pick up approved claims. If a retry isn't idempotent, some employees get reimbursed twice, and clawing money back is miserable.",
      ws: 'platform',
      owner: 'partner',
      likelihood: 3,
      impact: 4,
      initial: 'hidden',
      earliestDay: 6,
      mitigation: {
        label: 'Idempotency keys and a reconciliation dry run',
        cost: 2,
        text: "Marcus's team stamps every payout with an idempotency key and dry-runs reconciliation against a test bank file. Two paths that could pay a claim twice are closed before any real money moves.",
        effects: { quality: 3, scope: { platform: 4 }, rel: { partner: 3 } },
      },
      trigger: 'tm-double-pay',
    },
    {
      id: 'tm-risk-legacy-service',
      title: 'Eligibility service nobody understands',
      description:
        'Every claim checks the eligibility service, written by an engineer who left in the restructuring. No docs, few tests, and only Hui Min has ever changed it. Huge year-end census files are untested.',
      ws: 'core',
      owner: 'lead',
      likelihood: 3,
      impact: 4,
      initial: 'hidden',
      earliestDay: 4,
      mitigation: {
        label: 'Pair on it and pin its behaviour with tests',
        cost: 2,
        text: "Hui Min pairs two engineers on the eligibility service. They write characterisation tests that pin today's behaviour and record a walkthrough. Core slows for two days; the service now lives in three heads.",
        effects: {
          velocity: { ws: 'core', mult: 0.9, days: 2, label: 'Pairing on eligibility' },
          quality: 3,
          rel: { lead: 3 },
          flags: ['tm:eligibility-pinned'],
        },
      },
      trigger: 'tm-eligibility-down',
    },
    {
      id: 'tm-risk-phi-exposure',
      title: 'Health data in logs or AI prompts',
      description:
        "Claim receipts can show diagnoses and prescriptions. Verbose debug logs in the new flow, or a 'real example' pasted into an AI chatbot, would put member health data where it must never be.",
      ws: 'review',
      owner: 'security',
      likelihood: 2,
      impact: 5,
      initial: 'hidden',
      earliestDay: 4,
      mitigation: {
        label: 'Redact claim logs; enforce the AI data rules',
        cost: 2,
        text: 'Aaron adds redaction to the claims logs, keeps receipt text out of debug output and runs a 20-minute session: AI tools get synthetic claims only, never member data. He hands out the synthetic set himself.',
        effects: { quality: 2, rel: { security: 4, compliance: 3 } },
      },
      trigger: 'tm-phi-in-prompt',
    },
    {
      id: 'tm-risk-bank-cutoff',
      title: 'Bank moves its payment-file cutoff',
      description:
        'Reimbursements reach employees through a daily bank file. If the bank moves its cutoff for the holidays, the batch Singapore runs before dawn could miss it, and first payouts slip a day.',
      ws: 'platform',
      owner: 'partner',
      likelihood: 2,
      impact: 3,
      initial: 'hidden',
      earliestDay: 7,
      mitigation: {
        label: "Get the bank's holiday calendar; re-time the batch",
        cost: 1,
        text: "Marcus gets the bank's year-end processing calendar in writing, and Irfan re-times the batch with two hours of slack and a named owner for every run through January.",
        effects: { rel: { partner: 3, sre: 2 } },
      },
      trigger: 'tm-bank-cutoff',
    },
    {
      id: 'tm-risk-ai-regression',
      title: 'Untested AI-written change breaks rules',
      description:
        'The team ships faster with AI coding assistants. But big generated diffs with thin tests are hard to review, and one could quietly break a claims rule that has worked for years.',
      ws: 'core',
      owner: 'lead',
      likelihood: 3,
      impact: 4,
      initial: 'dormant',
      earliestDay: 5,
      mitigation: {
        label: 'Guardrails: small diffs, required tests, human review',
        cost: 2,
        text: 'Hui Min and Irfan add pipeline checks: AI-assisted pull requests stay small, ship with tests and need a human reviewer who can explain every line. Merges slow slightly; surprises drop sharply.',
        effects: {
          quality: 4,
          velocity: { ws: 'core', mult: 0.95, days: 2, label: 'Stricter review gates' },
          flags: ['tm:ai-guardrails'],
        },
      },
      trigger: 'tm-ai-regression',
    },
  ],

  assumptions: [
    'The plan year starts on January 1 for all 23 launch employers. Day 15 is the last deploy before the year-end change freeze.',
    'Employer plan rules freeze on Day 5; later changes go through change control.',
    "Tamarind's own staff are the pilot employer, with real (small) payouts from week 1.",
    "Toronto Payments sends reimbursements in a daily bank file. The bank's cutoff is 5pm Toronto time (6am in Singapore).",
    'No member health data in logs, tickets or AI tools. AI-assisted code gets the same tests and human review as any other change.',
    "LSA payouts are taxable, so every payout must appear in the employer's payroll export.",
  ],

  // ───────────────────────────── Events ─────────────────────────────
  events: [
    // ── Story beat: Day 1 — the lean team ──
    {
      id: 'tm-day1-lean-team',
      scenarios: ['tamarind'],
      title: 'Ten people, one codebase, 23 employers',
      channel: 'email',
      from: 'boss',
      body: "Welcome aboard, {player}! Sorry I'm asleep while you read this. {program} ships the {product} and the rebuilt claims auto-adjudication to 23 employers for January 1. About 30 engineers built this codebase; since the restructuring, a team of ten owns it. The design docs are three years old and roughly half true. {lead} knows the claims engine. Nobody admits to knowing the rest. Where you start is your call. — {boss}",
      urgency: 'normal',
      expires: 2,
      weight: 0,
      fixedDay: 1,
      concept: 'risk-mgmt',
      skill: 'leadership',
      choices: [
        {
          id: 'a',
          label: 'Spend two days in the code with an AI assistant, writing the missing docs',
          cost: 2,
          grade: 'okay',
          insight:
            "Technical depth earns credibility, and AI makes code-reading faster. But on Day 1 your biggest unknowns are who knows what, not how the code works, and AI-written docs nobody has checked are confident guesses. Learn the system in smaller doses, with the team.",
          outcome: {
            text: "Your AI assistant summarises 40 services in an afternoon. {lead} skims your eligibility-service doc and says, kindly, that two of its five claims are wrong. You learn a lot, mostly about how much you don't know yet.",
            effects: { energy: -6, rel: { lead: 2 }, skills: { technical: 1 } },
          },
        },
        {
          id: 'b',
          label: 'Ask {boss} for six contractors now, before the knowledge gaps bite',
          cost: 1,
          grade: 'poor',
          insight:
            "Asking for headcount on Day 1, with no data, right after a restructuring, spends credibility you haven't earned yet. Newcomers also need onboarding from your scarcest people (Brooks's law). Map the gaps first; ask for specific help, with evidence, later.",
          outcome: {
            text: "{boss} replies at 7am Toronto time: 'Happy to discuss. What would they work on, and who would onboard them?' You don't have answers yet. She notes, politely, that you asked on Day 1.",
            effects: { trust: -4, rel: { boss: -5 }, flags: ['tm:asked-headcount'] },
          },
        },
        {
          id: 'c',
          label: 'Map who knows what with the team, then plan around the gaps',
          cost: 2,
          grade: 'best',
          insight:
            "In a lean team, knowledge is the critical path. Map who knows what, what's undocumented and where one person is the only way through, then plan pairing and docs around those gaps before you promise dates. The team already knows where the risks are; ask first.",
          outcome: {
            text: 'Ninety minutes, one whiteboard, a lot of sticky notes. Red dots cluster on the eligibility service: written by someone who left, only ever changed by {lead}. You leave with a pairing plan, three doc owners and a team that feels heard.',
            effects: {
              morale: 5,
              trust: 2,
              rel: { lead: 6, sre: 3 },
              revealRisks: ['tm-risk-legacy-service'],
              flags: ['tm:knowledge-map'],
              skills: { risk: 1 },
            },
          },
        },
        {
          id: 'd',
          label: 'Tell the team to lean hard on AI assistants to cover the gaps and ship faster',
          cost: 0,
          grade: 'poor',
          insight:
            "AI assistants speed up typing, not understanding. On an unfamiliar codebase with thin tests, 'go faster with AI' without guardrails (small diffs, required tests, real review) buys speed this week and regressions next week. Set the guardrails, then turn up the speed.",
          outcome: {
            text: 'Merged pull requests double by Wednesday. So does their average size. {lead} reviews 900-line diffs at 11pm and quietly stops leaving comments on them.',
            effects: {
              velocity: { ws: 'core', mult: 1.15, days: 3, label: 'AI-assisted sprint' },
              quality: -5,
              rel: { lead: -4 },
              addRisks: ['tm-risk-ai-regression'],
              followUps: [{ event: 'tm-ai-deletes-check', inDays: 3 }],
            },
          },
        },
      ],
      ignored: {
        text: 'Onboarding sessions and HR forms eat your first two days. The team plans without you, and nobody mentions the eligibility service.',
        effects: { trust: -3, morale: -2, rel: { boss: -2 } },
      },
    },

    // ── Story beat: Day 8 SteerCo (behind) ──
    {
      id: 'tm-steerco-behind',
      scenarios: ['tamarind'],
      title: "SteerCo: the date is fixed. What isn't?",
      channel: 'meeting',
      from: 'sponsor',
      body: "Your projection lands after {target}, and January 1 doesn't move: 23 employers told 160,000 employees about this benefit at open enrollment. Finance will fund contractors if it saves the date. {pm} wants all 23 live on day one; {partner} would love fewer payment runs. I need your recommendation, {player}, not a menu.",
      urgency: 'high',
      weight: 0,
      fixedDay: 8,
      when: { behindSchedule: true },
      concept: 'iron-triangle',
      skill: 'stakeholder',
      choices: [
        {
          id: 'a',
          label: 'Fund two contract engineers for the claims engine (S$40k)',
          cost: 1,
          grade: 'okay',
          insight:
            "Buying capacity is legitimate, but on a lean team with stale docs, newcomers learn from your scarcest expert (Brooks's law). If you buy people late, buy experienced ones, give them isolated, well-specified work, and keep their onboarding off the critical path.",
          outcome: {
            text: "Two contractors start tomorrow. They're sharp. They're also asking {lead} where the eligibility rules live, roughly once an hour.",
            effects: {
              budget: -40,
              trust: 2,
              morale: -2,
              velocity: { ws: 'core', mult: 1.15, days: 4, label: 'Contractors on the engine' },
              rel: { lead: -4 },
            },
          },
        },
        {
          id: 'b',
          label: 'Keep all 23 on the date: skip UAT round two and the security retest',
          cost: 0,
          grade: 'poor',
          insight:
            "Cutting verification doesn't remove risk; it moves discovery to January 2, in front of 160,000 employees. It also cuts the wrong thing: review isn't your critical path, the engine and employer config are. Trade scope, time or money, never quality, and never silently.",
          outcome: {
            text: "{security} reads the minutes and books time with you. {compliance} asks how she's meant to sign a privacy assessment for a flow nobody retested. And the projection doesn't move: review was never the bottleneck.",
            effects: {
              progress: { review: 10 },
              quality: -8,
              rel: { security: -8, compliance: -6 },
              unready: ['securityReview'],
            },
          },
        },
        {
          id: 'c',
          label: 'Wave it: the 5 biggest employers claim from Jan 1, the other 18 from Feb 1',
          cost: 2,
          grade: 'best',
          insight:
            "With a fixed date, flex scope, not quality. Wave by contract and risk: everyone gets their allowance on January 1, but only five employers' claims flow on day one, and January receipts stay claimable. Per-employer switches keep it reversible. Log the decision; give CSMs one script.",
          outcome: {
            text: "Two sharp questions from {sponsor}: 'Does anyone lose a dollar?' (No: January receipts stay claimable.) 'Who tells the 18?' ({pm}, with one script.) Then a yes. {partner} looks almost cheerful about five payment runs instead of 23.",
            effects: {
              scope: { client: -20 },
              trust: 5,
              morale: 3,
              rel: { sponsor: 5, partner: 4, pm: 2 },
              readiness: ['featureFlags'],
              flags: ['tm:february-wave'],
            },
          },
        },
        {
          id: 'd',
          label: 'Request a freeze exception and go live in Christmas week instead',
          cost: 1,
          grade: 'okay',
          insight:
            'Time is a real lever, but this one buys days in the week with the thinnest staffing on both continents, right before employees start claiming. If you must buy time, buy it where people are around for hypercare, and pair it with a scope plan so you might not need it.',
          outcome: {
            text: '{sponsor} approves the exception without enthusiasm. The change board wants named on-call cover for Christmas Eve. {sre} looks at the rota, then at you.',
            effects: { targetDay: 2, trust: -3, morale: -3, rel: { sponsor: -3, sre: -3 } },
          },
        },
      ],
      ignored: {
        text: "A Toronto call overruns and you miss the slot. SteerCo decides without you: all 23 employers, same date, 'everyone pulls together'. Everyone knows what that means.",
        effects: {
          trust: -6,
          morale: -6,
          quality: -2,
          rel: { sponsor: -5 },
          velocity: { ws: 'all', mult: 1.1, days: 2, label: 'Everyone pulls together' },
        },
      },
    },

    // ── Story beat: Day 8 SteerCo (on track) ──
    {
      id: 'tm-steerco-ontrack',
      scenarios: ['tamarind'],
      title: 'SteerCo: Sales sold three more employers',
      channel: 'meeting',
      from: 'sponsor',
      body: "Good news first, {player}: you're on track. Better news: Sales closed three more employers last week, 9,000 employees between them, and promised them January 1, 'subject to delivery'. That's next quarter's growth story. I'd love to tell Sales yes tomorrow. Can we?",
      urgency: 'high',
      weight: 0,
      fixedDay: 8,
      when: { behindSchedule: false },
      concept: 'scope-creep',
      skill: 'stakeholder',
      choices: [
        {
          id: 'a',
          label: "Say yes to all three: on track means there's room",
          cost: 0,
          grade: 'poor',
          insight:
            "On track isn't spare capacity; it's the buffer for risks you haven't met yet. Three new employers means three plan configs, eligibility files and UAT rounds after the freeze. Size it with the people doing the work before anyone hears a yes.",
          outcome: {
            text: "{sponsor} tells Sales before the meeting ends. {pm}'s config specialists find out from the Sales channel, with emojis. By Friday the projection has slid right.",
            effects: { scope: { client: 15, data: 8 }, trust: 3, morale: -4, rel: { sponsor: 5, pm: -6 } },
          },
        },
        {
          id: 'b',
          label: 'Size it with the config team, then offer one now and two on Feb 1',
          cost: 2,
          grade: 'best',
          insight:
            "Don't say yes or no to scope on the spot: size it, then shape it. The employer whose plan fits an existing template can make January 1; the bespoke two join a dated February wave. Sales gets a date to sell, and your buffer survives.",
          outcome: {
            text: "One employer's plan copies an existing template almost exactly: two days of config. The other two want custom categories. {sponsor} takes 'one now, two on February 1' to Sales, who are mostly delighted. {pm} gets a plan she can actually run.",
            effects: { scope: { client: 3 }, trust: 4, rel: { sponsor: 4, pm: 5 }, skills: { stakeholder: 1 } },
          },
        },
        {
          id: 'c',
          label: 'Decline: the config freeze applies to everyone, Sales included',
          cost: 0,
          grade: 'okay',
          insight:
            'Protecting the freeze is right, but a flat no to your sponsor spends trust and leaves revenue on the table. Ask which part of the request you can meet safely: one plan fits a template, and the others need a date, not a refusal.',
          outcome: {
            text: "{sponsor} says 'noted', which is executive for 'not happy'. Sales escalates to the CEO, who asks {boss} why delivery is 'blocking growth'.",
            effects: { trust: -3, rel: { sponsor: -5, boss: -2 } },
          },
        },
        {
          id: 'd',
          label: 'Say yes in the room, then quietly plan all three for a February wave',
          cost: 0,
          grade: 'poor',
          insight:
            'A private plan that contradicts a public promise is a watermelon with a calendar. Sales tells the employers January 1, their HR teams tell 9,000 people, and the truth arrives in December. If the answer is February, say February now.',
          outcome: {
            text: "Everyone leaves happy. Two days later, a new employer's HR lead emails {pm} for their UAT slot 'next week, as Sales promised'. She forwards it to you with no comment, which is a comment.",
            effects: { trust: -3, scope: { client: 5 }, rel: { pm: -6 }, flags: ['tm:quiet-february'] },
          },
        },
      ],
      ignored: {
        text: '{sponsor} reads your silence as a yes. Sales tells all three employers January 1, and {pm} finds out from their kickoff invites.',
        effects: { scope: { client: 15, data: 8 }, trust: -2, rel: { pm: -5 } },
      },
    },

    // ── Story beat: Day 12 — the dress rehearsal ──
    {
      id: 'tm-dress-rehearsal',
      scenarios: ['tamarind'],
      title: 'Dress rehearsal: real bank file, fake claims',
      channel: 'slack',
      from: 'sre',
      body: 'Dress rehearsal debrief. Overnight: 500 synthetic claims through the new flow and a real penny-test file to the bank. Adjudication fine, bank file accepted. But reconciliation is out by three claims, the payroll export dropped the taxable flag for one employer, and at 4am nobody knew who could approve a re-run. Go/no-go is Friday lah.',
      urgency: 'high',
      expires: 2,
      weight: 0,
      fixedDay: 12,
      concept: 'launch-readiness',
      skill: 'execution',
      choices: [
        {
          id: 'a',
          label: 'Call it a pass: three claims in 500 is rounding error',
          cost: 0,
          grade: 'poor',
          insight:
            "There's no materiality threshold on someone's reimbursement: three breaks in 500 claims is hundreds in January, and a missing taxable flag is a payroll problem for the employer. A rehearsal's findings are go/no-go criteria, not footnotes.",
          outcome: {
            text: "The readiness deck says 'Rehearsal: passed'. {partner} reads the reconciliation report, then asks which three employees you'd like to explain it to.",
            effects: { quality: -6, rel: { partner: -6, sre: -4 }, flags: ['tm:rehearsal-waved'] },
          },
        },
        {
          id: 'b',
          label: "Ask that employer's payroll team to add the taxable flag by hand in January",
          cost: 0,
          grade: 'poor',
          insight:
            "Exporting your defect to the client turns a bug into an account problem. They pay for a platform that's right. Fix it on your side, and if a workaround is unavoidable, it's yours to run, with the client told, not the other way round.",
          outcome: {
            text: "{pm} relays the request. The employer's payroll lead replies, copying their CFO: 'Isn't this what we pay you for?' It's a fair question.",
            effects: { trust: -4, rel: { pm: -6 }, flags: ['tm:client-workaround'] },
          },
        },
        {
          id: 'c',
          label: 'Fix the three findings, skip the re-run: launch night will prove them',
          cost: 1,
          grade: 'okay',
          insight:
            "Fixing is necessary; skipping the proof isn't free. A fix that hasn't been re-run is a hypothesis, and launch night is an expensive place to test it. If time is short, re-run the riskiest slice rather than nothing.",
          outcome: {
            text: 'All three fixes merge by Thursday. Whether they work together is a question for launch night, which is exactly when nobody wants to find out.',
            effects: { quality: 2 },
          },
        },
        {
          id: 'd',
          label: 'Fix all three, re-run Wednesday, name an owner for every checkpoint',
          cost: 3,
          grade: 'best',
          insight:
            "A rehearsal's job is to fail somewhere safe. Root-cause every break, fix it, and rehearse again with a runbook where every go/no-go checkpoint has a named owner in each time zone. A plan for 4am is a list of decisions, not just steps.",
          outcome: {
            text: "Wednesday's re-run reconciles to the cent, the taxable flag survives, and the runbook now says who decides at 4am Singapore and 3pm Toronto. {partner} signs off on payments readiness with an actual smile.",
            effects: {
              readiness: ['rollbackPlan', 'oncall'],
              quality: 5,
              energy: -8,
              progress: { platform: 3 },
              rel: { sre: 5, partner: 5 },
            },
          },
        },
      ],
      ignored: {
        text: "Nobody owns the findings, so nobody fixes them. The readiness review gets a slide saying 'rehearsal complete' and a reconciliation report nobody attached.",
        effects: { quality: -4, trust: -3, flags: ['tm:rehearsal-waved'] },
      },
    },

    // ── Risk trigger: wrong allowance ──
    {
      id: 'tm-config-wrong-allowance',
      scenarios: ['tamarind'],
      title: "Bluequill's preview says $5,000, not $500",
      channel: 'email',
      from: 'pm',
      body: "{player}, Bluequill Foods' HR director just previewed their employee portal: every full-timer shows a $5,000 LSA allowance. Their plan says $500. She's 'curious' how that happened, and whether the other 22 employers are right. Honestly, so am I. She'd like an answer before her CHRO sees the screenshot.",
      urgency: 'high',
      expires: 2,
      weight: 0,
      concept: 'client-delivery',
      skill: 'risk',
      choices: [
        {
          id: 'a',
          label: 'Fix it, audit all 23 plans against the signed summaries, automate it',
          cost: 2,
          grade: 'best',
          insight:
            'One wrong plan is a symptom; the real question is how many more. Fix the instance, audit the whole population against the source of truth, and automate the comparison so the next slip cannot reach a client. Then tell the client the truth, including the boring parts.',
          outcome: {
            text: "Bluequill is fixed within the hour. The audit finds two more slips at other employers, both caught before anyone saw them. {pm} sends Bluequill a short note: what happened, what you checked, what changed. The reply: 'Thank you for being straight with us.'",
            effects: { quality: 5, trust: 3, rel: { pm: 5 }, flags: ['tm:config-audited'] },
          },
        },
        {
          id: 'b',
          label: 'Hot-fix the number now and tell her it was a display glitch',
          cost: 0,
          grade: 'poor',
          insight:
            "A 'display glitch' story collapses at the client's second question, and it skips the real one: how many other plans are wrong? Fix it, find the cause and the blast radius, and tell the client what you changed. Candour keeps clients.",
          outcome: {
            text: "The number is right by lunch. The story lasts until Thursday, when Bluequill's payroll team asks why their plan export also says $5,000. {pm} has to un-tell it.",
            effects: { trust: -6, quality: -3, rel: { pm: -6 } },
          },
        },
        {
          id: 'c',
          label: "Re-key all 23 employers' plans from scratch, with a second person checking",
          cost: 2,
          grade: 'okay',
          insight:
            "Thorough, but re-keying everything by hand repeats the process that caused the error and burns days of config time. Audit against the source documents and automate the comparison: find the bad plans, don't redo the good ones.",
          outcome: {
            text: 'Two specialists, three days, a lot of tea. They find two more errors and introduce one new one, which the second checker catches. Config work stalls in the meantime.',
            effects: {
              quality: 3,
              rel: { pm: 2 },
              velocity: { ws: 'client', mult: 0.7, days: 3, label: 'Re-keying every plan' },
            },
          },
        },
        {
          id: 'd',
          label: 'Leave it with {pm}: employer configuration is her workstream',
          cost: 0,
          grade: 'poor',
          insight:
            "It's {pm}'s workstream, but a defect that could affect 23 clients is a program risk, which makes it yours. Delegating the conversation without owning the systemic fix leaves her alone with an angry client and no answer to 'are the others right?'",
          outcome: {
            text: '{pm} handles Bluequill gracefully. Nobody checks the other 22 plans, and nobody knows whether they should be worried.',
            effects: { quality: -3, rel: { pm: -5 }, flags: ['tm:config-unaudited'] },
          },
        },
      ],
      ignored: {
        text: 'Nobody answers Bluequill for a day. Their CHRO sees the screenshot and asks their account executive whether {company} checks its work.',
        effects: { trust: -6, rel: { pm: -5, sponsor: -3 } },
      },
    },

    // ── Risk trigger: double payment in the pilot ──
    {
      id: 'tm-double-pay',
      scenarios: ['tamarind'],
      title: 'The pilot paid 14 of our own staff twice',
      channel: 'incident',
      from: 'partner',
      body: "Heads-up from Toronto. Last night's pilot run, with our own staff as the test employer, paid 14 LSA claims twice. A timeout made the new flow retry, and the old batch picked up the same approved claims. About $4,100, all colleagues, so nobody's angry yet. The same thing with an employer in January would be a very different email.",
      urgency: 'high',
      expires: 2,
      weight: 0,
      concept: 'phased-rollout',
      skill: 'technical',
      choices: [
        {
          id: 'a',
          label: "Write off the $4,100 quietly: it's our own staff, and nobody's complained",
          cost: 0,
          grade: 'poor',
          insight:
            "Writing off the money treats the symptom. The problem is a flow that can pay twice, and next time it's an employer's money and an employer's people. Fix the cause before January, then decide how to recover the money.",
          outcome: {
            text: 'Finance books the write-off. The retry bug ships with the rest of the flow and waits patiently for January.',
            effects: { budget: -4, quality: -6, flags: ['tm:double-pay-shipped'] },
          },
        },
        {
          id: 'b',
          label: 'Stop the line: make payouts idempotent and re-run the pilot',
          cost: 2,
          grade: 'best',
          insight:
            "A duplicate payment is a stop-the-line signal, and finding it in a pilot with your own staff is exactly why you pilot. Fix the cause (idempotency, so a retry can't pay twice), prove it with a re-run, then recover the money kindly.",
          outcome: {
            text: "{partner}'s team adds idempotency keys and a duplicate guard; the re-run pays everyone exactly once. Finance recovers the $4,100 with an apologetic note. {sponsor} hears the story as 'the pilot worked', which it did.",
            effects: { quality: 6, trust: 2, scope: { platform: 5 }, rel: { partner: 5 }, flags: ['tm:idempotent'] },
          },
        },
        {
          id: 'c',
          label: 'Add a manual duplicate check before every payment run for now',
          cost: 1,
          grade: 'okay',
          insight:
            'A manual check catches some duplicates and buys time, but it is a person scanning a file in another time zone. Use it as a bridge while you make the payment path idempotent, not as the fix.',
          outcome: {
            text: "Someone in Toronto now eyeballs every batch file for duplicates. It works on Tuesday and Wednesday. On Thursday, they're on leave.",
            effects: {
              quality: 1,
              rel: { partner: -2 },
              velocity: { ws: 'platform', mult: 0.9, days: 3, label: 'Manual duplicate checks' },
            },
          },
        },
      ],
      ignored: {
        text: 'Singapore assumes Toronto has it; Toronto assumes Singapore does. The pilot keeps running, and two more claims pay twice overnight.',
        effects: { quality: -5, trust: -2, rel: { partner: -5 } },
      },
    },

    // ── Risk trigger: the eligibility service falls over ──
    {
      id: 'tm-eligibility-down',
      scenarios: ['tamarind'],
      title: 'Eligibility service down, its expert on leave',
      channel: 'slack',
      from: 'sre',
      body: "Alamak. Fernhollow Retail's year-end census file, 4,200 new hires, has crashed the eligibility service three times since midnight. No new claims can be checked, so the engine team is stuck. The only person who has ever changed that service is {lead}, on year-end leave in Hokkaido until Thursday. I've restarted it twice. Ideas?",
      urgency: 'high',
      weight: 0,
      concept: 'tech-debt',
      skill: 'technical',
      choices: [
        {
          id: 'a',
          label: 'Ask {lead} for thirty minutes on a call from her holiday',
          cost: 1,
          grade: 'okay',
          insight:
            "Sometimes the expert's thirty minutes is the right call, and a good relationship makes it possible. But a plan that depends on interrupting someone's holiday is a bus factor announcing itself. Use the call to transfer knowledge, not just to fix the bug.",
          chance: {
            base: 0.5,
            rel: 'lead',
            success: {
              text: "{lead} answers from a ski lift: the service loads the whole file into memory, with a cap set years ago. Fixed in two hours. She adds, nicely, that she'd love this to be the last holiday call.",
              effects: { rel: { lead: -2 }, flags: ['tm:called-on-leave'] },
            },
            failure: {
              text: 'No signal on the mountain. Your message is delivered on Thursday, along with 46 others. The engine team waits.',
              effects: { block: { ws: 'core', days: 2, reason: 'Eligibility service down; its only expert is away' } },
            },
          },
        },
        {
          id: 'b',
          label: 'Have an engineer paste the service into an AI assistant and ship its fix',
          cost: 0,
          grade: 'poor',
          insight:
            "AI can explain unfamiliar code fast, but its first fix to a service with no tests is an unverified guess in the path of every claim. Use AI to read and explain; pin today's behaviour with tests before you change anything.",
          outcome: {
            text: "The suggested fix stops the crash by skipping any record that fails a check it doesn't understand. 312 new hires are now silently ineligible. QA finds it the next morning, thankfully.",
            effects: { quality: -8, morale: -2, progress: { core: -5 } },
          },
        },
        {
          id: 'c',
          label: 'Use the characterisation tests you already have: fix it today',
          cost: 1,
          grade: 'best',
          requires: { flags: ['tm:eligibility-pinned'] },
          lockedHint: 'Needs the eligibility service pinned with tests first (RAID log mitigation)',
          insight:
            "This is what paying down a bus factor buys you: tests that pin today's behaviour turn a mystery outage into a routine fix. Safety nets always look optional, right up until the night you need one.",
          outcome: {
            text: 'The pinned tests point straight at it: a memory cap sized for files a tenth this big. Twelve lines, reviewed and green by 3pm. The engine team loses a morning, not a week.',
            effects: {
              quality: 3,
              morale: 3,
              velocity: { ws: 'core', mult: 0.8, days: 1, label: 'Eligibility fix in progress' },
            },
          },
        },
        {
          id: 'd',
          label: 'Pair two engineers: AI to read the code, tests to pin it, then fix',
          cost: 2,
          grade: 'best',
          insight:
            'Legacy code without its author: read it with AI help, then write characterisation tests that pin what it does today before changing a line. The fix arrives a little slower and a lot safer, and two more people now understand the service.',
          outcome: {
            text: 'By evening the pair has 40 characterisation tests and the culprit: a memory cap sized for files a tenth this big. Twelve lines, reviewed and tested, plus a two-page runbook. {lead} reads it on Thursday and replies with one emoji: 🙏',
            effects: {
              velocity: { ws: 'core', mult: 0.5, days: 1, label: 'Eligibility down until the evening fix' },
              quality: 5,
              morale: 3,
              rel: { lead: 4 },
              flags: ['tm:eligibility-pinned'],
              skills: { technical: 1 },
            },
          },
        },
      ],
      ignored: {
        text: 'Nobody decides. {sre} restarts the service every two hours through the night, and the engine team loses two days waiting.',
        effects: {
          block: { ws: 'core', days: 2, reason: 'Eligibility service crashing on census files' },
          morale: -4,
          rel: { sre: -4 },
        },
      },
    },

    // ── Risk trigger: member health data pasted into an AI chatbot ──
    {
      id: 'tm-phi-in-prompt',
      scenarios: ['tamarind'],
      title: 'Real claims pasted into a personal AI chatbot',
      channel: 'incident',
      from: 'security',
      body: "To his credit, a QA engineer just told me himself: he pasted three real claims into his personal AI chatbot account to debug the receipt parser. One receipt shows a prescription and a diagnosis. That's member health data, now sitting with a provider we have no agreement with. Not malicious, just fast. {compliance} needs facts within the hour.",
      urgency: 'critical',
      weight: 0,
      concept: 'ai-governance',
      skill: 'risk',
      choices: [
        {
          id: 'a',
          label: 'Pause AI tools for the team while {security} rewrites the rules',
          cost: 1,
          grade: 'okay',
          insight:
            "A short pause while you fix the rules is defensible containment, but it isn't incident response: the data is already out and counsel needs facts. Pauses also push AI use underground. Handle the incident first, then give people an approved path.",
          outcome: {
            text: 'The tools go dark for two days. Productivity dips, the rules get clearer, and at least two engineers keep using assistants on their phones. Meanwhile {compliance} is still waiting for facts.',
            effects: {
              velocity: { ws: 'all', mult: 0.9, days: 2, label: 'AI tools paused' },
              morale: -3,
              trust: -1,
              rel: { security: 2, compliance: -3 },
            },
          },
        },
        {
          id: 'b',
          label: 'Treat it as a privacy incident: contain it and assess it with {compliance}',
          cost: 2,
          grade: 'best',
          insight:
            "Run it as a privacy incident, blamelessly: write down the facts, contain and request deletion, and let counsel assess whether it's a reportable breach under HIPAA, PIPEDA or both, and whether clients must be told. Then fix the system: an approved tool, synthetic data, rules people can follow.",
          outcome: {
            text: "Within the hour the facts are written down: three claims, two members, one provider. Only then is the chat deleted and a deletion request filed. {compliance} runs the breach assessment and briefs the employer's privacy lead herself. {security} rolls out an approved tool and synthetic claims that week.",
            effects: {
              trust: 2,
              quality: 2,
              block: { ws: 'review', days: 1, reason: 'Privacy incident assessment under way' },
              rel: { compliance: 8, security: 6 },
              flags: ['tm:phi-incident-handled'],
            },
          },
        },
        {
          id: 'c',
          label: 'Have him delete the chat and keep it in the team: an honest mistake',
          cost: 0,
          grade: 'poor',
          insight:
            "Honest mistakes still need an honest process. Deleting quietly destroys the facts counsel needs to decide whether clients or regulators must be told, and turns an accident into a cover-up. Blameless doesn't mean silent: report, assess, then fix the system.",
          outcome: {
            text: "The chat is gone, and so is any record of what was in it. When {compliance} hears about it a week later, she is no longer assessing an accident. She's assessing you.",
            effects: { trust: -8, rel: { compliance: -12, security: -6 }, flags: ['tm:phi-hidden'] },
          },
        },
        {
          id: 'd',
          label: 'Report him to HR and pull his production data access',
          cost: 0,
          grade: 'poor',
          insight:
            'Punishing the person who self-reported teaches everyone else to stay quiet next time. Contain the data, assess with counsel, and fix the conditions that made pasting real claims the fastest way to debug.',
          outcome: {
            text: 'HR opens a file. The QA channel goes very quiet, and nobody self-reports anything for the rest of the program. {compliance} still needs her facts.',
            effects: { morale: -8, trust: -2, quality: -2, rel: { security: -4 } },
          },
        },
      ],
      ignored: {
        text: "The hour passes. {compliance} escalates to {sponsor}, freezes the new flow's test environments and asks why the program had nothing to say.",
        effects: {
          trust: -8,
          rel: { compliance: -10 },
          block: { ws: 'review', days: 2, reason: 'Privacy incident: test environments frozen' },
        },
      },
    },

    // ── Risk trigger: late plan change after the freeze ──
    {
      id: 'tm-late-plan-change',
      scenarios: ['tamarind'],
      title: 'Loonstone wants pet care. By January 1.',
      channel: 'email',
      from: 'pm',
      body: "So. Loonstone Mutual's CHRO wants pet insurance and dog-walking added as LSA categories; it topped their staff survey. It's after the config freeze, I know, I know. But they're our third-biggest employer and their renewal is in March. I told her I'd 'check with the team'. What do I tell her?",
      urgency: 'high',
      expires: 2,
      weight: 0,
      concept: 'change-mgmt',
      skill: 'stakeholder',
      choices: [
        {
          id: 'a',
          label: 'Tell her yes: two new categories is just a config change',
          cost: 0,
          grade: 'poor',
          insight:
            "'Just config' after a freeze is rarely just config: new categories mean receipt rules, adjudication tests, UAT and new employee comms. Size it with the team before anyone says yes, and give the client a dated option rather than a hopeful one.",
          outcome: {
            text: "{pm} tells Loonstone yes. {lead}'s team discovers pet receipts match no existing adjudication rule, and that 'dog-walking' covers a surprising range of invoices.",
            effects: { scope: { core: 6, client: 8 }, morale: -4, rel: { pm: 4, lead: -5 } },
          },
        },
        {
          id: 'b',
          label: 'Escalate to {sponsor} so the no comes from an executive, not from {pm}',
          cost: 1,
          grade: 'okay',
          insight:
            "Executive backing helps, but you've turned a sizing question into a political one, and a client's top request into a refusal. Most late changes need a dated alternative, not a bigger no. Escalate when a trade-off needs a decision-maker, with options.",
          outcome: {
            text: "{sponsor} backs the freeze, then asks why she's refereeing pet care. {pm} feels overruled in front of her client.",
            effects: { trust: -1, rel: { sponsor: -3, pm: -4 } },
          },
        },
        {
          id: 'c',
          label: 'Offer pet care in a dated February update, with a note for staff',
          cost: 1,
          grade: 'best',
          insight:
            "Change control after a freeze isn't 'no', it's 'yes, and here's when'. Size it, offer a dated fast-follow, and give the client something to tell their people. A clear February date beats a risky January promise, especially with a renewal in sight.",
          outcome: {
            text: "{pm} sends the offer: pet care in the February 1 plan update, plus a ready-made note for Loonstone's staff. Their CHRO replies within the hour: 'Love it. The dog people will be thrilled.' The freeze holds.",
            effects: { trust: 3, rel: { pm: 6 }, flags: ['tm:feb-update'] },
          },
        },
        {
          id: 'd',
          label: 'Have {pm} tell her the freeze is a hard rule, full stop',
          cost: 0,
          grade: 'poor',
          insight:
            "A flat no to a top employer's top request, delivered by the person who owns the relationship, spends her credibility instead of yours. Protect the freeze with a dated alternative, not a wall.",
          outcome: {
            text: "{pm} delivers the message, wincing. Loonstone's CHRO replies 'noted', then mentions to their account executive that the March renewal is 'under review'.",
            effects: { trust: -3, rel: { pm: -6, sponsor: -2 } },
          },
        },
      ],
      ignored: {
        text: "{pm} doesn't hear back, so she tells Loonstone 'probably'. Loonstone tells its staff pet care is coming in January.",
        effects: { scope: { client: 8, core: 4 }, trust: -2, rel: { pm: -4 } },
      },
    },

    // ── Risk trigger: UAT stalls across time zones ──
    {
      id: 'tm-uat-stalled',
      scenarios: ['tamarind'],
      title: 'UAT: 31 open questions, 0 answers',
      channel: 'slack',
      from: 'pm',
      body: 'UAT update from Toronto: 31 open questions from employer HR testers, 0 answers. They test in their morning, your team fixes in yours, and every answer lands a day later, by which time the tester is back in their day job. Two employers have quietly stopped testing. At this pace we sign off in February.',
      urgency: 'high',
      expires: 2,
      weight: 0,
      concept: 'uat',
      skill: 'execution',
      choices: [
        {
          id: 'a',
          label: 'Daily overlap hour, a Toronto decision owner, async UAT scripts',
          cost: 2,
          grade: 'best',
          insight:
            'Across 13 hours, design for async: self-contained UAT scripts with recorded demos, one daily overlap hour spent only on decisions (rotate who stays late), and a named owner in Toronto who can accept or reject on the spot. Questions should wait hours, not days.',
          outcome: {
            text: 'From Tuesday: 9pm Singapore / 8am Toronto, 45 minutes, decisions only, with the late slot rotating. {pm} is the Toronto decision owner. The backlog drops from 31 to 6 in three days, and both stalled employers start testing again.',
            effects: {
              velocity: { ws: 'review', mult: 1.2, days: 3, label: 'UAT unstuck' },
              energy: -5,
              rel: { pm: 6 },
              flags: ['tm:uat-overlap'],
            },
          },
        },
        {
          id: 'b',
          label: 'Ask the Singapore team to work Toronto hours until UAT is done',
          cost: 0,
          grade: 'poor',
          insight:
            "Flipping a team's body clock buys overlap and costs sleep, judgment and possibly a resignation. Overlap is scarce: protect an hour a day, rotate who pays for it, and make everything else async.",
          outcome: {
            text: 'Answers get faster. So does the exhaustion: by Thursday two engineers are on MC and a fix ships with a typo nobody caught at 1am.',
            effects: {
              velocity: { ws: 'review', mult: 1.15, days: 3, label: 'Night-shift UAT' },
              morale: -8,
              quality: -4,
              rel: { lead: -4 },
            },
          },
        },
        {
          id: 'c',
          label: "Have Singapore QA run the UAT scripts so the employers don't have to",
          cost: 0,
          grade: 'poor',
          insight:
            "UAT run by your own QA isn't acceptance; it's more system testing. The point is that the employers' HR teams confirm the product fits their real processes. Make it easier for them to test; don't test for them.",
          outcome: {
            text: "QA passes 96% of the scripts in two days. {pm} asks the employers to sign off on testing they never did. Two decline, politely. One asks what 'acceptance' means at {company}.",
            effects: { progress: { review: 6 }, quality: -3, trust: -3, rel: { pm: -6 } },
          },
        },
        {
          id: 'd',
          label: 'Fly {pm} to Singapore for a week of face-to-face triage',
          cost: 1,
          grade: 'okay',
          insight:
            "Putting the decision owner next to the fixers shortens one loop and lengthens another: she's now 13 hours from the HR testers she needs to chase. Fix the decision loop itself rather than relocating it.",
          outcome: {
            text: '{pm} lands jet-lagged on Tuesday and spends her evenings on calls with Toronto. The fixers love having her there. The HR testers now wait for her instead.',
            effects: {
              budget: -8,
              velocity: { ws: 'review', mult: 1.1, days: 2, label: 'Triage in Singapore' },
              rel: { pm: 2 },
            },
          },
        },
      ],
      ignored: {
        text: 'Nothing changes. The question list grows to 44, and a third employer stops testing.',
        effects: { velocity: { ws: 'review', mult: 0.75, days: 3, label: 'UAT stalled' }, trust: -2, rel: { pm: -5 } },
      },
    },

    // ── Risk trigger (dormant): an AI-assisted regression ──
    {
      id: 'tm-ai-regression',
      scenarios: ['tamarind'],
      title: "The new flow approved 212 claims it shouldn't",
      channel: 'slack',
      from: 'lead',
      body: "QA caught it in regression: the new flow auto-approves claims filed after the plan's claim deadline. 212 test claims sailed through. Root cause: an AI-assisted refactor last week 'simplified' the deadline check away. 1,400-line diff, tests edited to match, one tired reviewer. Caught, not shipped. But it got past all of us.",
      urgency: 'high',
      weight: 0,
      concept: 'ai-delivery',
      skill: 'technical',
      choices: [
        {
          id: 'a',
          label: 'Fix it forward tonight with the assistant: quicker than a revert',
          cost: 0,
          grade: 'poor',
          insight:
            'Using the same tool, the same way, under more pressure is how one regression becomes two. Revert to known-good, restore the rule with a test that fails without it, then fix the process that let a 1,400-line diff through.',
          outcome: {
            text: 'The forward fix restores the deadline check and breaks proration for mid-year hires. QA finds that one too, on Friday.',
            effects: { quality: -5, morale: -3, progress: { core: -3 } },
          },
        },
        {
          id: 'b',
          label: 'Find out who approved that review and make sure it never happens again',
          cost: 1,
          grade: 'poor',
          insight:
            "One tired reviewer facing a 1,400-line diff is a system failure, not a personal one. Blame teaches people to hide mistakes. Fix the system: small diffs, tests that encode business rules, and reviewers allowed to say 'too big to review'.",
          outcome: {
            text: 'The reviewer apologises in the team channel. Pull requests get smaller for a week, and much less honest about how they were written.',
            effects: { morale: -6, quality: -1, rel: { lead: -5 } },
          },
        },
        {
          id: 'c',
          label: 'Revert, restore the rule with tests, then set AI guardrails',
          cost: 2,
          grade: 'best',
          insight:
            "AI-assisted delivery needs the guardrails you'd give any fast contributor, enforced in the pipeline: small reviewable changes, tests that pin business rules, and a human reviewer who can explain the change. SOC 2 auditors will ask how changes are reviewed; 'the AI wrote it' isn't an answer.",
          outcome: {
            text: "Reverted by lunch. The deadline rule gets six tests that fail loudly if anyone 'simplifies' it again. {sre} adds a pipeline flag for AI-assisted diffs over 400 lines, and 'too big to review' joins the team's vocabulary.",
            effects: { quality: 6, progress: { core: -2 }, rel: { lead: 5, sre: 3 }, flags: ['tm:ai-guardrails'] },
          },
        },
        {
          id: 'd',
          label: 'Ban AI-written code in the claims rules; allow it everywhere else',
          cost: 1,
          grade: 'okay',
          insight:
            'Fencing off the riskiest code is a reasonable guardrail, but it treats the tool as the problem. The real failures were diff size, tests edited to match the code, and review under fatigue, which bite with or without AI. Fix the process everywhere; restrict where you must.',
          outcome: {
            text: 'The rules engine goes AI-free. Work there slows, and the other services keep merging 1,000-line diffs.',
            effects: { quality: 2, velocity: { ws: 'core', mult: 0.9, days: 3, label: 'No AI on rules code' } },
          },
        },
      ],
      ignored: {
        text: 'No decision, so the refactor stays in. The rule gets fixed eventually, by another large AI-assisted diff, reviewed by the same tired reviewer.',
        effects: { quality: -6, morale: -2 },
      },
    },

    // ── Risk trigger: the bank moves its cutoff ──
    {
      id: 'tm-bank-cutoff',
      scenarios: ['tamarind'],
      title: "The bank moved its cutoff. Our batch didn't",
      channel: 'email',
      from: 'partner',
      body: "{player}, the bank's year-end notice was buried in a shared inbox: over the holidays, their file cutoff moves from 5pm to 3pm Toronto time. That's 4am Singapore, and our batch runs at 5am. On current timings, the first January payouts land a day late, for every employer. Fixable, but someone has to own it.",
      urgency: 'high',
      expires: 2,
      weight: 0,
      concept: 'cross-timezone',
      skill: 'execution',
      choices: [
        {
          id: 'a',
          label: 'Ask the bank to keep the old cutoff for our file through January',
          cost: 1,
          grade: 'okay',
          insight:
            "Asking a counterparty for an exception is fine as a parallel track, not as the plan. You don't control their calendar, and a 'no' tends to arrive when you've run out of time. Fix your side first; treat any exception as a bonus.",
          chance: {
            base: 0.25,
            rel: 'partner',
            success: {
              text: "The bank's relationship manager owes {partner} a favour and grants a 4pm cutoff for your file through January. You re-time the batch anyway, just in case.",
              effects: { rel: { partner: 2 } },
            },
            failure: {
              text: 'The bank declines, politely, after two days. You spent those days waiting, and the batch still runs at 5am Singapore.',
              effects: { trust: -2, rel: { partner: -2 }, flags: ['tm:late-first-payout'] },
            },
          },
        },
        {
          id: 'b',
          label: "Re-time the batch to 1pm Toronto, owned by the team that's awake then",
          cost: 2,
          grade: 'best',
          insight:
            'External cutoffs are dependencies: get their calendars in writing and put them on the RAID log. Then use the time zones instead of fighting them: run the job when its owning team is awake, with alerting and slack before the cutoff.',
          outcome: {
            text: "The batch moves to 1pm Toronto, two hours before the cutoff, watched by {partner}'s team in their afternoon. An alert fires if the bank hasn't accepted the file by 2pm. The bank's holiday calendar goes on the RAID log, next to both countries' public holidays.",
            effects: { quality: 3, trust: 2, readiness: ['monitoring'], rel: { partner: 5, sre: 3 } },
          },
        },
        {
          id: 'c',
          label: "Accept a one-day delay on first payouts: employees won't notice",
          cost: 0,
          grade: 'poor',
          insight:
            "Employees notice money. A day late on the first payout of a brand-new benefit becomes a support surge and a CHRO email. Don't decide silently on behalf of 23 clients: fix the timing, or tell them early with a reason.",
          outcome: {
            text: "On paper, nothing changes. In January, support gets 600 'where's my money?' tickets on day one, and {pm} gets a call from Bluequill.",
            effects: { trust: -5, quality: -2, rel: { pm: -5 }, flags: ['tm:late-first-payout'] },
          },
        },
        {
          id: 'd',
          label: 'Have the Singapore on-call run the batch by hand at 3am each night',
          cost: 0,
          grade: 'poor',
          insight:
            "A manual 3am run, every night through January, is a reliability plan built on someone's sleep. Automate the timing, give the run to the team that's awake, and alert when the file isn't accepted.",
          outcome: {
            text: "It works, nightly, until the night the alarm doesn't. {sre} adds 'human alarm clock' to the risk register, not entirely as a joke.",
            effects: { morale: -5, energy: -5, quality: -1, rel: { sre: -5 } },
          },
        },
      ],
      ignored: {
        text: 'Nobody owns it, so nothing moves. The first January payouts are set to land a day late, and nobody has told the employers.',
        effects: { trust: -4, rel: { partner: -4 }, flags: ['tm:late-first-payout'] },
      },
    },

    // ── Flavour: a client CHRO emails the CEO ──
    {
      id: 'tm-chro-email',
      scenarios: ['tamarind'],
      title: "A CHRO emailed our CEO. Subject: 'Concerned'",
      channel: 'email',
      from: 'sponsor',
      body: "Forwarded by our CEO at 11pm Toronto. Kettlewood Telecom's CHRO: their UAT shows 40% of test claims routed to manual review, and our sales deck promised 'instant approvals'. She asks whether her 30,000 employees will wait weeks to be reimbursed. The CEO wants a reply drafted by his 8am. That's 9pm your time, {player}.",
      urgency: 'high',
      expires: 1,
      when: { minDay: 5, maxDay: 13 },
      concept: 'escalation',
      skill: 'comms',
      choices: [
        {
          id: 'a',
          label: "Draft the CEO's reply tonight and promise 90% auto-approval by January 1",
          cost: 1,
          grade: 'poor',
          insight:
            "Under exec pressure, the fastest answer is a promise, and a promise made without data becomes your next escalation. Get the facts first: why 40%, what's realistic at launch, how fast manual review is. Then commit to a number you can keep.",
          outcome: {
            text: "The CEO sends it. Kettlewood's CHRO forwards it to her HR team as 'the commitment'. {lead} reads '90% by January 1' and asks, very quietly, who checked.",
            effects: { trust: 2, scope: { core: 6 }, rel: { lead: -6 }, flags: ['tm:promised-90'] },
          },
        },
        {
          id: 'b',
          label: 'Let {pm} handle it: she owns the Kettlewood relationship',
          cost: 0,
          grade: 'okay',
          insight:
            'The account owner should front the reply, but she needs facts the program owns: root cause, the realistic rate, the plan. Equip her, align the message with {sponsor}, then let her deliver it. Delegating without facts just moves the panic.',
          outcome: {
            text: "{pm} replies warmly and vaguely. The CHRO's follow-up asks for numbers. Now the CEO is asking {sponsor} why nobody has any.",
            effects: { trust: -3, rel: { sponsor: -3 } },
          },
        },
        {
          id: 'c',
          label: 'Reply to the CEO directly that the sales deck overpromised',
          cost: 0,
          grade: 'poor',
          insight:
            "Being right about the sales deck isn't a client strategy, and replying over your sponsor's head with blame makes two enemies in one email. Facts, one voice, a plan: how the promise got made belongs in the retro, not the reply.",
          outcome: {
            text: 'The CEO forwards your reply to the head of Sales with a question mark. {sponsor} hears about it from the head of Sales. Nobody has answered the CHRO.',
            effects: { trust: -6, rel: { sponsor: -8, boss: -3 } },
          },
        },
        {
          id: 'd',
          label: 'Get the facts by 4pm, align {sponsor} and {pm}, then offer the CHRO a call',
          cost: 2,
          grade: 'best',
          insight:
            'A client exec escalation needs facts fast, one voice and a plan. Find the cause, give an honest launch number with a manual-review turnaround and a dated improvement plan. The account owner fronts the call; you bring the facts.',
          outcome: {
            text: "Root cause by 4pm: blurry receipt photos and two categories with no auto-rules yet. The reply: about 75% auto-approved at launch, manual reviews within two business days, two new rules in February. The CHRO takes the call at 8am Toronto and ends it with 'that's all I needed'.",
            effects: { trust: 5, rel: { sponsor: 4, pm: 4 }, skills: { comms: 1 } },
          },
        },
      ],
      ignored: {
        text: "The CEO's morning arrives with no draft, so he replies himself, from memory of the sales deck. Kettlewood now has 'instant approvals' in writing, from the CEO.",
        effects: { trust: -6, scope: { core: 4 }, rel: { sponsor: -5 } },
      },
    },

    // ── Flavour: the support agent who saw it first ──
    {
      id: 'tm-support-pattern',
      scenarios: ['tamarind'],
      title: 'Support saw it first. Nobody asked them.',
      channel: 'hallway',
      from: 'sre',
      body: "Eh {player}, Joyce from support stopped me at the pantry. Since the pilot started: 26 tickets from our Montreal staff, because receipts in French get auto-rejected by the new flow. She's tagged each one 'user error', because the triage guide says to. Support assumed engineering knew. Engineering assumed CS owned the guide. Nobody asked Joyce.",
      urgency: 'normal',
      when: { minDay: 4, maxDay: 12 },
      concept: 'raci',
      skill: 'leadership',
      choices: [
        {
          id: 'a',
          label: 'Fix French receipts and give support a named owner for patterns',
          cost: 2,
          grade: 'best',
          insight:
            "Frontline teams see problems first; if your process files their signals as 'user error', you're flying blind. Fix the defect, then fix the path: one accountable owner for triaging support patterns, and public credit so people keep speaking up.",
          outcome: {
            text: "French receipts parse by Thursday. Support gets a 'pattern' tag routed to a named triage owner, and Joyce gets a shout-out at the all-hands. Within a week the tag catches two more patterns, and both are real.",
            effects: {
              quality: 5,
              morale: 4,
              scope: { core: 3 },
              rel: { pm: 3, sre: 3 },
              revealRisks: ['tm-risk-double-pay'],
              flags: ['tm:support-signal-path'],
            },
          },
        },
        {
          id: 'b',
          label: 'Put French receipts on the February backlog; launch is too close',
          cost: 0,
          grade: 'poor',
          insight:
            "Deferring a defect that rejects every French receipt isn't triage; it ships a broken product to every employer with Quebec staff. And it ignores the bigger problem: the signal sat in 'user error' for weeks. Fix the bug and the escalation path.",
          outcome: {
            text: "The ticket joins the February backlog. Support keeps tagging French receipts 'user error', now with official approval. Employees in Quebec are about to have a very consistent experience.",
            effects: { quality: -4, trust: -2, rel: { pm: -3 } },
          },
        },
        {
          id: 'c',
          label: 'Ask {pm} to update the triage guide so support escalates these',
          cost: 1,
          grade: 'okay',
          insight:
            "Fixing the guide helps, but it treats the symptom of a missing escalation path: next time it'll be a different pattern with no box to tick. Name one owner for frontline signals and give support a way to raise a pattern, not just a ticket.",
          outcome: {
            text: "The guide gets a new line, and French receipts get escalated properly. They're fixed a week later than they could have been, and the next pattern still has no box to tick.",
            effects: { quality: 2, scope: { core: 3 } },
          },
        },
      ],
      ignored: {
        text: "Nobody follows up. Joyce stops mentioning patterns, and tags 41 French receipts 'user error' by Friday.",
        effects: { quality: -4, morale: -2 },
      },
    },

    // ── Flavour: the AI "fix" that deletes a validation rule ──
    {
      id: 'tm-ai-deletes-check',
      scenarios: ['tamarind'],
      title: "AI 'fixed' the failing test by deleting the rule",
      channel: 'slack',
      from: 'lead',
      body: "PR review, for your awareness. A failing proration test blocked a merge, so the AI assistant offered a fix: delete the validation that caps claims at the remaining balance. Tests green, diff tiny, engineer delighted. If I hadn't read it line by line, employees could claim more than their allowance. He's asking to merge. How do we handle these?",
      urgency: 'normal',
      when: { minDay: 3, maxDay: 12 },
      concept: 'ai-delivery',
      skill: 'technical',
      choices: [
        {
          id: 'a',
          label: 'Merge it: tests are green and the engine needs the speed',
          cost: 0,
          grade: 'poor',
          insight:
            "Green tests prove the tests pass, not that the rules hold. An assistant asked to 'make the test pass' will happily delete the rule the test protected. Business rules need tests that fail if the rule disappears, and a reviewer who understands the rule.",
          outcome: {
            text: 'Merged at 6pm. On Thursday QA finds a member claiming $740 against a $500 allowance. The fix takes a day; the conversation about why takes longer.',
            effects: { quality: -6, progress: { core: 2 }, addRisks: ['tm-risk-ai-regression'] },
          },
        },
        {
          id: 'b',
          label: 'Reject it and ban AI-suggested changes to the claims rules',
          cost: 0,
          grade: 'okay',
          insight:
            'Blocking this merge is right; banning the tool on rules code treats the symptom and drives use underground. The real gaps were a rule no test protected and a review that depended on luck. Fix those and AI help becomes safe, not forbidden.',
          outcome: {
            text: 'The rules engine goes AI-free. The engineer quietly uses the assistant on his laptop anyway, and nobody reviews those suggestions any differently.',
            effects: {
              quality: 1,
              morale: -2,
              velocity: { ws: 'core', mult: 0.9, days: 2, label: 'AI paused on rules code' },
            },
          },
        },
        {
          id: 'c',
          label: 'Reject it, fix proration properly, and guard every rule with a test',
          cost: 2,
          grade: 'best',
          insight:
            'Guardrails for AI-assisted delivery: the author owns every line they merge, whoever wrote it; business rules get tests that fail if the rule is removed; and rules code needs a reviewer who knows the domain. Then the assistant speeds you up without quietly rewriting the plan.',
          outcome: {
            text: "Proration is fixed properly by lunch. {lead} tags the rules code so changes need a reviewer who knows the domain, and the team adds tests that fail if any rule disappears. The engineer volunteers to write the team's AI tips doc.",
            effects: {
              quality: 6,
              morale: 2,
              rel: { lead: 5 },
              velocity: { ws: 'core', mult: 0.95, days: 2, label: 'Adding rule tests' },
              flags: ['tm:ai-guardrails'],
            },
          },
        },
        {
          id: 'd',
          label: 'Ask {lead} to personally review every AI-assisted change until launch',
          cost: 0,
          grade: 'poor',
          insight:
            'Routing every AI-assisted change through your scarcest engineer turns her into the bottleneck on the critical path. Spread review with clear rules (small diffs, tests, domain review for business rules) instead of relying on one heroic reviewer.',
          outcome: {
            text: '{lead} reviews 31 pull requests in two days. Her own work on the engine stops. She does not thank you.',
            effects: {
              quality: 2,
              rel: { lead: -6 },
              velocity: { ws: 'core', mult: 0.8, days: 3, label: 'Lead reviewing everything' },
            },
          },
        },
      ],
      ignored: {
        text: 'The engineer takes silence as approval and merges. The validation is gone, and nobody notices. Yet.',
        effects: { quality: -5, addRisks: ['tm-risk-ai-regression'] },
      },
    },

    // ── Flavour: the 2am page from Toronto ──
    {
      id: 'tm-2am-page',
      scenarios: ['tamarind'],
      title: "2:07am: Toronto's afternoon is your night",
      channel: 'whatsapp',
      from: 'lead',
      body: "Morning. FYI, third 2am page this week: Toronto's afternoon is our 2am. Old product again; an HR admin couldn't export a report. Not urgent, but the rota pages me because I'm the only one who knows that service. I'm fine lah. Just, the claims engine is getting my 2am brain, not my 10am brain.",
      urgency: 'normal',
      when: { minDay: 2, maxDay: 11 },
      concept: 'team-health',
      skill: 'leadership',
      choices: [
        {
          id: 'a',
          label: 'Thank her, and ask her to hang in there for three more weeks',
          cost: 0,
          grade: 'poor',
          insight:
            'Gratitude without change tells your critical-path engineer that her sleep is the plan. Exhaustion on the critical path shows up as slow days and subtle bugs. Change the system: who gets paged, for what, and when.',
          outcome: {
            text: "{lead} sends a thumbs-up. The pages continue. By Friday her pull requests have the kind of bugs she'd normally catch in her sleep, if she were getting any.",
            effects: {
              morale: -4,
              quality: -4,
              rel: { lead: -5 },
              velocity: { ws: 'core', mult: 0.9, days: 3, label: 'Critical-path engineer exhausted' },
            },
          },
        },
        {
          id: 'b',
          label: 'Split on-call by daylight; only Sev-1s wake Singapore',
          cost: 2,
          grade: 'best',
          insight:
            'Follow-the-sun on-call means each site owns its own daylight: Toronto triages its afternoon with runbooks, and only real Sev-1s wake Singapore. Take your critical-path engineer off the default rota; protecting her sleep protects your launch date.',
          outcome: {
            text: "{sre} and {partner} agree a split: Toronto triages its own afternoon with three new runbooks, and the overnight pager fires only for Sev-1s, to a rotating owner who isn't {lead}. She sleeps. Her next pull request is beautiful.",
            effects: { morale: 5, quality: 3, readiness: ['oncall'], rel: { lead: 6, sre: 3, partner: 2 } },
          },
        },
        {
          id: 'c',
          label: 'Take the overnight pager yourself; you can at least triage',
          cost: 1,
          grade: 'poor',
          insight:
            "The hero TPM can't fix a reporting service at 2am and will be useless at 10am. Your leverage is designing a rota and runbooks that don't need heroes, not becoming the newest single point of failure.",
          outcome: {
            text: "You take two nights of pages. You can't fix either, so you wake {lead} anyway, now with an apology attached. Your own energy craters.",
            effects: { energy: -12, morale: -1, rel: { lead: 1 } },
          },
        },
        {
          id: 'd',
          label: 'Hand all support for the old product to Toronto until after the launch',
          cost: 1,
          grade: 'okay',
          insight:
            "Moving ownership to the time zone that's awake is the right direction, but after a restructuring Toronto may not have the knowledge. Without runbooks and a clear Sev-1 path, you've moved the pager, not the problem.",
          outcome: {
            text: "Toronto agrees, then pages {lead} on day two to ask how the reporting service works. At least it's at 9am now.",
            effects: { morale: 2, rel: { lead: 2, partner: -3 } },
          },
        },
      ],
      ignored: {
        text: 'Nobody touches the rota. The pages keep coming, and {lead} starts joining standup with her camera off.',
        effects: {
          morale: -4,
          quality: -3,
          rel: { lead: -4 },
          velocity: { ws: 'core', mult: 0.9, days: 2, label: 'Lead running on no sleep' },
        },
      },
    },
  ],
}
