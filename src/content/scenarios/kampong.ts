import type { ScenarioDef } from '../../game/types'

/**
 * Kampong Labs: Project Durian (difficulty 2).
 *
 * A big-tech platform migration run from a Singapore APAC HQ. About 40 internal services must move
 * off a legacy auth service onto Kampong ID (OAuth2/OIDC) before the legacy data centre's lease ends
 * on Day 15. Themes: influence without authority, four hubs across time zones, a single expert on
 * the critical path, and an external deadline that trades time against money, scope and risk.
 *
 * Tuning: at neutral morale/quality the projection lands on Day 16 (critical path core → client),
 * so the player has to act — e.g. tier the migrations at SteerCo or protect the critical path.
 */
export const KAMPONG: ScenarioDef = {
  id: 'kampong',
  name: 'Kampong ID',
  company: 'Kampong Labs',
  companyBlurb:
    'Home of Kampong, the short-video app where 300 million people share dance challenges, hawker hauls and cat content. APAC HQ in Singapore, with engineering hubs there and in Shenzhen, Bangalore and Seattle.',
  program: 'Project Durian',
  product: 'Kampong ID',
  tagline: 'Move 40 services off legacy auth before the data centre goes dark. It’s thorny.',
  difficulty: 2,
  setting: 'Global tech APAC HQ · one-north, Singapore',
  brief: [
    "You've just joined Kampong Labs' Singapore APAC HQ as the TPM for Project Durian: moving about 40 internal services off a creaky legacy auth service onto Kampong ID, the new OAuth2/OIDC token platform. The legacy data centre's lease ends on Day 15, and the landlord already has a new tenant.",
    'You inherited Durian from Wen Jie, who moved to the Ads org. The tracker is stale, the deepest auth knowledge sits with one Staff Engineer in Shenzhen, and the teams that must migrate are spread across Singapore, Shenzhen, Bangalore and Seattle, each with its own OKRs. None of them report to you.',
    "Your tools: influence, crisp plans, honest status and a lot of kopi. Get the critical services across safely, keep everyone's sessions intact, and don't let anyone promise 'zero downtime' before asking you.",
  ],
  targetDay: 15,
  maxDay: 20,
  start: { morale: 62, trust: 50, quality: 66, budget: 120 },

  // ───────────────────────────── Cast ─────────────────────────────
  cast: {
    boss: {
      role: 'boss',
      name: 'Olivia Mensah',
      short: 'Olivia',
      title: 'Senior TPM Manager, Infrastructure',
      avatar: '🦉',
      hue: 265,
      power: 4,
      interest: 3,
      location: 'Seattle',
      bio: 'Runs the infra TPM org from Seattle, mostly async. Writes beautiful docs and reads yours closely: lead with the ask, show the data, and never let her be surprised.',
    },
    sponsor: {
      role: 'sponsor',
      name: 'Bernard Goh Teck Seng',
      short: 'Bernard',
      title: 'Head of Infrastructure, APAC',
      avatar: '🦁',
      hue: 25,
      power: 5,
      interest: 4,
      location: 'Singapore',
      bio: 'Owns the data-centre exit and the money attached to it. Kiasu about the lease date, decisive in SteerCo. Bring him options with costs, not problems.',
    },
    pm: {
      role: 'pm',
      name: 'Farhan Ismail',
      short: 'Farhan',
      title: 'Product Manager, Identity',
      avatar: '🧭',
      hue: 190,
      power: 3,
      interest: 5,
      location: 'Singapore',
      bio: 'Thinks in login success rates and user journeys. Full of ideas and great at storytelling; check with engineering before his ideas become promises.',
    },
    lead: {
      role: 'lead',
      name: 'Zhou Xinyi',
      short: 'Xinyi',
      title: 'Staff Engineer, Auth Platform',
      avatar: '🔑',
      hue: 150,
      power: 3,
      interest: 4,
      location: 'Shenzhen',
      bio: "Designed Kampong ID's token service and key rotation, and is the only one who truly knows them. Quietly overloaded: protect her focus and get the knowledge out of her head.",
    },
    partner: {
      role: 'partner',
      name: 'Diego Alvarez',
      short: 'Diego',
      title: 'Engineering Manager, Core Services',
      avatar: '🚀',
      hue: 45,
      power: 4,
      interest: 2,
      location: 'Seattle',
      bio: "Owns 18 of the services that must migrate, plus his own launch and OKRs. Fair and pragmatic. He doesn't report to you, so make migrating the easy choice.",
    },
    sre: {
      role: 'sre',
      name: 'Kavitha Raman',
      short: 'Kavitha',
      title: 'SRE Manager, APAC',
      avatar: '📟',
      hue: 210,
      power: 3,
      interest: 4,
      location: 'Singapore',
      bio: "Runs infra, networking and the session-store migration. Calm in incidents, allergic to untested rollbacks. Her dashboards know things the tracker doesn't.",
    },
    security: {
      role: 'security',
      name: 'Arjun Mehta',
      short: 'Arjun',
      title: 'Security Engineering Lead',
      avatar: '🛡️',
      hue: 0,
      power: 4,
      interest: 3,
      location: 'Bangalore',
      bio: 'Owns threat models, pen tests and key management. Rigorous, not obstructive: involve him early and he finds a way to yes; surprise him late and he finds problems.',
    },
    compliance: {
      role: 'compliance',
      name: 'Audrey Lim',
      short: 'Audrey',
      title: 'Privacy Counsel, APAC',
      avatar: '⚖️',
      hue: 300,
      power: 4,
      interest: 2,
      location: 'Singapore',
      bio: "Covers the PDPA and cross-border data transfers for the region. Practical and precise. Her first question is always 'what personal data is in this, and why?'",
    },
  },

  // ───────────────────────────── Workstreams ─────────────────────────────
  // Neutral projection: core 12, client 16 (critical: cut-over waits for core), platform 9, data 12,
  // review 15. Client reaches its cap about a day before core finishes, so poor/ignored client-side
  // choices slip the launch while the best responses hold it; anything added to core costs a day.
  workstreams: [
    {
      role: 'core',
      name: 'Kampong ID Auth Platform',
      icon: '🔐',
      owner: 'lead',
      work: 100,
      velocity: 6,
      done: 32,
      description:
        'The new OAuth2/OIDC authorization server: token issuance, JWKS key rotation and the endpoints every service will call. The critical path runs through here.',
    },
    {
      role: 'client',
      name: 'Service Migrations',
      icon: '🔀',
      owner: 'partner',
      work: 125,
      velocity: 8,
      done: 10,
      deps: [{ on: 'core', capAt: 0.72 }],
      description:
        'About 40 services across four hubs switch from legacy auth to Kampong ID. Teams can run in shadow mode early, but cut-over waits until Kampong ID is GA.',
    },
    {
      role: 'platform',
      name: 'Infra & Networking',
      icon: '🌐',
      owner: 'sre',
      work: 60,
      velocity: 5,
      done: 20,
      description:
        'New-region clusters, the API gateway and load balancers, certificates, cross-region networking, and the dashboards that tell you whether any of it works.',
    },
    {
      role: 'data',
      name: 'Session & Token Data Migration',
      icon: '🗄️',
      owner: 'sre',
      work: 60,
      velocity: 5,
      done: 6,
      deps: [{ on: 'platform', capAt: 0.75 }],
      description:
        'Move tens of millions of live sessions and refresh tokens to the new store without logging anyone out, or letting anyone who logged out back in.',
    },
    {
      role: 'review',
      name: 'Security & Privacy Review',
      icon: '🔍',
      owner: 'security',
      work: 36,
      velocity: 4,
      done: 0,
      deps: [{ on: 'core', capAt: 0.6 }],
      description:
        'Threat model, pen test of the token endpoints, key-management review, and a privacy review of token claims and cross-border data flows.',
    },
  ],

  // ───────────────────────────── Risks (RAID) ─────────────────────────────
  risks: [
    {
      id: 'kl-risk-bus-factor',
      title: 'Token service lives in one head',
      description:
        "Xinyi is the only engineer who truly understands Kampong ID's token signing and key rotation. If she is sick, on leave or pulled onto another fire, the critical path stops.",
      ws: 'core',
      owner: 'lead',
      likelihood: 2,
      impact: 5,
      initial: 'open',
      earliestDay: 4,
      mitigation: {
        label: 'Pair two engineers with Xinyi and record runbooks',
        cost: 2,
        text: 'Xinyi records three walkthroughs and pairs two engineers on signing and key rotation. Core slows for a couple of days; the knowledge now lives in three heads instead of one.',
        effects: {
          velocity: { ws: 'core', mult: 0.9, days: 2, label: 'Knowledge-transfer sessions' },
          rel: { lead: 3 },
          flags: ['kl:kt-done'],
        },
      },
      trigger: 'kl-bus-factor-hit',
    },
    {
      id: 'kl-risk-roadmap-clash',
      title: 'Core Services drops migrations',
      description:
        "Diego's Seattle team owns 18 of the services and has its own OKRs and a launch of its own. If that launch heats up, migration work is the first thing they'll drop.",
      ws: 'client',
      owner: 'partner',
      likelihood: 3,
      impact: 4,
      initial: 'open',
      earliestDay: 4,
      mitigation: {
        label: "Write migration capacity into Core Services' sprint plan",
        cost: 2,
        text: "You and Diego agree two engineers stay on migrations through Day 15, written into his sprint plan and shared with both directors. In return, your team reviews Live Gifts' auth scopes.",
        effects: { rel: { partner: 4 }, morale: -2 },
      },
      trigger: 'kl-roadmap-clash-hit',
    },
    {
      id: 'kl-risk-jwt-compat',
      title: 'Legacy services choke on new tokens',
      description:
        'Kampong ID issues signed JWTs of about 1.5 KB. Some older services expect short opaque tokens, cap request header sizes, or call the legacy /introspect endpoint directly.',
      ws: 'client',
      owner: 'lead',
      likelihood: 3,
      impact: 3,
      initial: 'open',
      earliestDay: 3,
      mitigation: {
        label: 'Plan a gateway compat adapter before shadow tests end',
        cost: 2,
        text: "Kavitha's team designs a gateway adapter that hands legacy services the short opaque tokens they expect and answers their /introspect calls. It's platform work, off the critical path.",
        effects: { scope: { platform: 6 } },
      },
      trigger: 'kl-jwt-compat-hit',
    },
    {
      id: 'kl-risk-ghost-callers',
      title: 'Unknown callers still use legacy auth',
      description:
        'The tracker lists 40 services, but legacy auth sees traffic from more client IDs than that: batch jobs and internal tools nobody inventoried. They break the day the DC goes dark.',
      ws: 'client',
      owner: 'sre',
      likelihood: 3,
      impact: 4,
      initial: 'hidden',
      earliestDay: 5,
      mitigation: {
        label: 'Trace every legacy auth client ID to a named owner',
        cost: 2,
        text: "Kavitha's team maps 30 days of legacy auth logs against the service registry. The unlisted callers each get a named owner and a migration date on the tracker.",
        effects: { trust: 2, rel: { sre: 2 } },
      },
      trigger: 'kl-ghost-callers-hit',
    },
    {
      id: 'kl-risk-session-loss',
      title: 'Session backfill drops or revives users',
      description:
        'The backfill copies tens of millions of live sessions while users keep logging in and out. Without dual-writes and tombstones, some sessions vanish and some logged-out ones come back.',
      ws: 'data',
      owner: 'sre',
      likelihood: 3,
      impact: 4,
      initial: 'hidden',
      earliestDay: 6,
      mitigation: {
        label: 'Add dual-writes and tombstones before the backfill',
        cost: 2,
        text: "Kavitha's team turns on dual-writes, makes the backfill idempotent, records logouts as tombstones and runs a nightly diff. The migration starts a little slower and finishes without surprises.",
        effects: { velocity: { ws: 'data', mult: 0.9, days: 2, label: 'Dual-write setup' } },
      },
      trigger: 'kl-session-loss-hit',
    },
    {
      id: 'kl-risk-cert-pinning',
      title: 'Old app versions pin the legacy cert',
      description:
        "App versions before 6.2 pin the legacy auth endpoint's TLS certificate. Moving that hostname to new load balancers with a new certificate would lock those users out.",
      ws: 'client',
      owner: 'security',
      likelihood: 2,
      impact: 5,
      initial: 'hidden',
      earliestDay: 7,
      mitigation: {
        label: 'Serve the pinned cert on the new edge; nudge upgrades',
        cost: 2,
        text: "Arjun's team loads the existing certificate onto the new edge so old app versions keep working, and Farhan schedules an in-app upgrade nudge for versions before 6.2.",
        effects: { scope: { platform: 4 }, rel: { security: 3 } },
      },
      trigger: 'kl-cert-pinning-hit',
    },
    {
      id: 'kl-risk-pii-claims',
      title: 'Token claims carry personal data',
      description:
        'Some tokens include phone number and date of birth for convenience. JWTs are signed, not encrypted, so anyone who logs or proxies a token can read them, in any region it travels to.',
      ws: 'review',
      owner: 'compliance',
      likelihood: 3,
      impact: 3,
      initial: 'hidden',
      earliestDay: 6,
      mitigation: {
        label: 'Run a claims-minimisation review with Audrey',
        cost: 1,
        text: 'Audrey and Arjun go through every claim: tokens keep subject, scopes and expiry; profile data moves behind /userinfo before services depend on it. The privacy review starts early, so the review track can run further ahead.',
        effects: {
          rel: { compliance: 4, security: 2 },
          relaxDependency: { ws: 'review', capAt: 0.75 },
        },
      },
      trigger: 'kl-pii-claims-hit',
    },
    {
      id: 'kl-risk-metric-gaming',
      title: 'Teams game the migration leaderboard',
      description:
        "With a public board driven by self-reported status, some teams mark 'migrated' while quietly keeping legacy auth as a fallback. The tracker turns green; the traffic doesn't.",
      ws: 'client',
      owner: 'pm',
      likelihood: 4,
      impact: 3,
      initial: 'dormant',
      earliestDay: 5,
      mitigation: {
        label: 'Measure migration from traffic, not self-reports',
        cost: 1,
        text: 'You switch the leaderboard to Kampong ID telemetry: a service counts as migrated only after 48 hours of zero legacy auth traffic. Less exciting, far more accurate.',
        effects: { trust: 2 },
      },
      trigger: 'kl-metric-gaming-hit',
    },
  ],

  assumptions: [
    'The legacy data centre lease ends on Day 15. An extension is possible, at a premium, on hardware that is out of vendor support.',
    'Services can run Kampong ID in shadow mode early; cut-over waits until Kampong ID is GA.',
    "The tracker's 40 services are the complete list of legacy auth callers.",
    'Core Services keeps two engineers on migrations through Day 15.',
    'Live sessions can be migrated without forcing anyone to log in again.',
    'Tier-1 services (login, feed, messaging, payments) cut over first.',
  ],

  // ───────────────────────────── Events ─────────────────────────────
  events: [
    // ── Day 1 story beat ──
    {
      id: 'kl-day1-inherit',
      scenarios: ['kampong'],
      title: 'Welcome to Project Durian (it’s thorny)',
      channel: 'email',
      from: 'boss',
      body: "Hi {player}, welcome to Durian! Context before I log off: Wen Jie handed over before moving to Ads. The migration tracker was last updated five weeks ago, it lists 40 services, and half their owners have never heard of Durian. The legacy DC goes dark on Day 15. {partner}'s team owns 18 of the services. Where you start is your call. — {boss}",
      urgency: 'normal',
      fixedDay: 1,
      weight: 0,
      concept: 'stakeholder-map',
      skill: 'stakeholder',
      choices: [
        {
          id: 'a',
          label: 'Email all 40 owners: migrate by Day 15 or your service breaks',
          cost: 1,
          grade: 'poor',
          insight:
            'A deadline email from a stranger, sent from a stale list, creates noise, not commitment. People act for people they know and reasons they understand. Get the real inventory first, then reach the owners who matter most, personally.',
          outcome: {
            text: "Nine owners reply 'what's Durian?'. Three forward it to their directors, asking why someone they've never met is threatening them. {partner} replies with one word: 'Context?'",
            effects: { trust: -4, rel: { partner: -6, boss: -2 } },
          },
        },
        {
          id: 'b',
          label: 'Block two days to write the full program plan and RACI first',
          cost: 3,
          grade: 'poor',
          insight:
            "A plan written alone, on stale data, is confident fiction. Plans and RACIs come out of conversations with the people doing the work. Draft them in week one, with the owners, not before you've met anyone.",
          outcome: {
            text: "Your plan is 31 colour-coded pages. {boss} replies: 'Beautiful doc. Who have you talked to?' The tracker underneath it is still five weeks stale.",
            effects: { energy: -6, trust: -3, rel: { boss: -3 } },
          },
        },
        {
          id: 'c',
          label: 'Ask {lead} for a two-hour deep-dive on the token service code',
          cost: 2,
          grade: 'okay',
          insight:
            "Technical depth earns a TPM credibility, and you'll need it. But on Day 1 your biggest unknowns are people and inventory, not code, and you just spent two hours of your critical-path engineer's time. Learn the system in smaller doses.",
          outcome: {
            text: "{lead} gives a superb tour of token signing and key rotation. You learn a lot, including that she's the only person who could have given it.",
            effects: {
              rel: { lead: 3 },
              velocity: { ws: 'core', mult: 0.9, days: 1, label: 'Lead running a deep-dive' },
              skills: { technical: 1 },
            },
          },
        },
        {
          id: 'd',
          label: 'Rebuild the inventory from legacy auth logs, then meet tier-1 owners',
          cost: 2,
          grade: 'best',
          insight:
            'Inventory from data, not spreadsheets: traffic logs show callers no tracker lists. Then spend your scarce time on the owners of the most critical services, face to face. Influence starts with knowing exactly who you need and why they should care.',
          outcome: {
            text: "{sre}'s team pulls 30 days of logs: 47 client IDs call legacy auth, not 40. You meet the owners of the 12 tier-1 services. Most hadn't heard of Durian; now they have a date, a reason and your name.",
            effects: {
              trust: 4,
              rel: { partner: 4, sre: 5 },
              scope: { client: 6 },
              velocity: { ws: 'client', mult: 1.15, days: 3, label: 'Owners engaged early' },
              revealRisks: ['kl-risk-ghost-callers'],
              skills: { risk: 1 },
            },
          },
        },
      ],
      ignored: {
        text: "Onboarding videos eat your first two days. The tracker stays stale, and {partner}'s team hears about Durian from someone else first.",
        effects: { trust: -3, rel: { partner: -3 } },
      },
    },

    // ── Day 8 SteerCo (behind schedule) ──
    {
      id: 'kl-steerco-behind',
      scenarios: ['kampong'],
      title: 'SteerCo: the lease, the date and the bill',
      channel: 'meeting',
      from: 'sponsor',
      body: "SteerCo, {player}. Your projection lands after the lease ends on Day 15, and the landlord wants an answer on extending the cage by Friday: S$45k for two more weeks, on hardware that's already out of vendor support. {partner} says his team can't go faster. I need a recommendation, not a menu.",
      urgency: 'high',
      fixedDay: 8,
      weight: 0,
      when: { behindSchedule: true },
      concept: 'iron-triangle',
      skill: 'stakeholder',
      choices: [
        {
          id: 'a',
          label: 'Recommend the S$45k extension and re-baseline the cutover to Day 18',
          cost: 1,
          grade: 'okay',
          insight:
            "Buying time is legitimate when time is the cheapest lever. Here it's pricey and the hardware is unsupported, and an extension with no scope plan often just moves the cliff. If you buy time, pair it with a plan that might make it unnecessary.",
          outcome: {
            text: '{sponsor} signs, unhappily. The team exhales, a little too much: urgency drains out of the migration channel overnight.',
            effects: {
              budget: -45,
              targetDay: 3,
              trust: -3,
              rel: { sponsor: -4 },
              velocity: { ws: 'client', mult: 0.85, days: 3, label: 'Deadline pressure eased' },
            },
          },
        },
        {
          id: 'b',
          label: 'Hold Day 15 for tier-1; tier-3 goes behind a compat bridge with a sunset date',
          cost: 2,
          grade: 'best',
          insight:
            "With a fixed date, flex scope. Cut over what matters most first and put the long tail behind a time-boxed bridge with an owner and a sunset date. Record it in the decision log as debt, so 'temporary' doesn't quietly become permanent.",
          outcome: {
            text: "You walk SteerCo through the tiers: 12 tier-1 services cut over by Day 15, the long tail behind a legacy-protocol bridge on the new platform, retired next quarter. {sponsor}: 'Finally, a plan with a shape.'",
            effects: {
              scope: { client: -20, platform: 6 },
              trust: 6,
              rel: { sponsor: 6, partner: 4 },
              flags: ['kl:compat-bridge'],
            },
          },
        },
        {
          id: 'c',
          label: 'Commit to full scope by Day 15 with two weekend pushes',
          cost: 0,
          grade: 'poor',
          insight:
            'Overtime is a loan at brutal interest: tired engineers make exactly the mistakes that cause cutover incidents. Promising everything by the date to dodge a hard conversation only moves that conversation somewhere worse.',
          outcome: {
            text: "SteerCo loves it. The team doesn't. The first weekend goes fine; on the second, someone fat-fingers a session-store config.",
            effects: {
              trust: 3,
              morale: -8,
              quality: -6,
              energy: -6,
              velocity: { ws: 'all', mult: 1.2, days: 2, label: 'Weekend push' },
              rel: { lead: -6, partner: -6 },
            },
          },
        },
        {
          id: 'd',
          label: 'Skip the cutover rehearsal and the pen-test retest — that claws back three days',
          cost: 1,
          grade: 'poor',
          insight:
            'Cutting verification doesn\'t remove risk; it moves discovery to the worst moment, live cutover. Rehearsals and retests are cheap insurance on an irreversible change. Trade scope or money before you trade safety.',
          outcome: {
            text: "{security} replies within a minute, copying {sponsor}: he won't sign off on an untested auth service. The 'saved' days get spent arguing about it.",
            effects: {
              progress: { review: 8 },
              quality: -8,
              trust: -2,
              rel: { security: -10 },
              unready: ['rollbackPlan', 'securityReview'],
            },
          },
        },
      ],
      ignored: {
        text: 'With no recommendation from you, {sponsor} signs the extension himself, then asks {boss} why the TPM had nothing to say.',
        effects: { budget: -45, targetDay: 3, trust: -8, rel: { sponsor: -6, boss: -4 } },
      },
    },

    // ── Day 8 SteerCo (on track) ──
    {
      id: 'kl-steerco-ontrack',
      scenarios: ['kampong'],
      title: 'SteerCo: a rebate for leaving early?',
      channel: 'meeting',
      from: 'sponsor',
      body: "Nice work, {player}: SteerCo has you on track. Now Finance has an idea. The landlord has a new tenant lined up and will refund S$20k if we hand back the whole cage on Day 13. Can we pull the decommission in? I'd love to take that win upstairs.",
      urgency: 'high',
      fixedDay: 8,
      weight: 0,
      when: { behindSchedule: false },
      concept: 'negotiation',
      skill: 'stakeholder',
      choices: [
        {
          id: 'a',
          label: 'Take the rebate: on track plus S$20k saved is a great story',
          cost: 0,
          grade: 'poor',
          insight:
            "The legacy stack is your rollback plan. Handing it back the moment you cut over removes your only way back if something breaks on day two. Buffer exists to absorb risk; don't sell it for a headline.",
          outcome: {
            text: "{sponsor} takes the win upstairs. {sre} quietly edits the runbook: 'Rollback: none.' The cutover date moves up two days.",
            effects: {
              budget: 20,
              targetDay: -2,
              trust: 4,
              rel: { sponsor: 4, sre: -6 },
              unready: ['rollbackPlan'],
            },
          },
        },
        {
          id: 'b',
          label: 'Counter: release the drained racks on Day 13, keep auth and sessions warm',
          cost: 2,
          grade: 'best',
          insight:
            'Negotiate the shape, not just yes or no. Phase the decommission: hand back what is already drained and keep the rollback-critical tiers warm until the bake period ends. You bank part of the saving and keep your safety net.',
          outcome: {
            text: '{sre} confirms nine racks are already empty. The landlord takes them early for an S$8k refund, while auth and session stores stay warm as rollback through Day 15. {sponsor} gets his win; you keep your net.',
            effects: {
              budget: 8,
              trust: 5,
              rel: { sponsor: 5, sre: 4 },
              readiness: ['rollbackPlan'],
            },
          },
        },
        {
          id: 'c',
          label: 'Keep the whole cage until Day 15 as rollback; spend the buffer on a second rehearsal',
          cost: 1,
          grade: 'okay',
          insight:
            "Protecting the rollback path is right, and a second rehearsal is a good use of buffer. But a flat 'no' leaves money on the table. Ask which part of a request you can meet safely; here, the drained racks could have gone early.",
          outcome: {
            text: "{sponsor} agrees, with a sigh you can hear across the table. 'Okay lah, safety first.' The second rehearsal goes cleanly.",
            effects: { quality: 3, rel: { sponsor: -2 }, readiness: ['rollbackPlan'] },
          },
        },
        {
          id: 'd',
          label: 'Use the buffer to add passkey login; {pm} has been asking',
          cost: 1,
          grade: 'poor',
          insight:
            "Being on track isn't spare capacity; it's the buffer that absorbs the risks still open. Adding scope at the midpoint quietly turns 'on track' into 'late'. Log passkeys as a fast-follow once the migration has baked.",
          outcome: {
            text: '{pm} is thrilled and announces it in the product channel. {lead} adds WebAuthn work to the critical path, and the projection slides right.',
            effects: { scope: { core: 12 }, morale: -3, rel: { pm: 6, lead: -6 } },
          },
        },
      ],
      ignored: {
        text: "{sponsor} reads your silence as a yes and tells Finance Day 13 works. {sre} finds out from the landlord's email.",
        effects: { budget: 20, targetDay: -2, trust: -3, rel: { sre: -6 }, unready: ['rollbackPlan'] },
      },
    },

    // ── Week 3 story beat: cutover rehearsal ──
    {
      id: 'kl-cutover-rehearsal',
      scenarios: ['kampong'],
      title: 'Rehearsal: cutover 4 min, rollback 47 min',
      channel: 'slack',
      from: 'sre',
      body: "Last night's game day: we shifted 5% of tier-1 login traffic to Kampong ID, then rolled back. Cutover took 4 minutes. Rollback took 47: it's a DNS flip, and some JVM services cache DNS far longer than our TTL. {sponsor} is asking if we're 'good to go'. Your call, {player}.",
      urgency: 'high',
      fixedDay: 12,
      weight: 0,
      concept: 'launch-readiness',
      skill: 'technical',
      choices: [
        {
          id: 'a',
          label: 'Move the switch to a gateway flag, then re-run the rollback drill tomorrow',
          cost: 2,
          grade: 'best',
          insight:
            "Never launch with an untested rollback. Shift traffic with a flag at the gateway, not DNS, so rolling back takes seconds and doesn't depend on client caches. Then prove it: a rollback plan is only real once you've used it.",
          outcome: {
            text: "{sre}'s team wires the switch into the gateway. The re-run: rollback in 40 seconds. The runbook gets a new first line: 'Flip flag. Breathe.'",
            effects: {
              readiness: ['rollbackPlan', 'featureFlags'],
              progress: { client: -1 },
              quality: 5,
              trust: 2,
              rel: { sre: 6 },
            },
          },
        },
        {
          id: 'b',
          label: 'Keep DNS but go slower: 1%, 10%, 50% canary steps to shrink the blast radius',
          cost: 1,
          grade: 'okay',
          insight:
            'Smaller steps limit the blast radius, and that matters. But a 47-minute rollback is still 47 minutes at every step. Phased rollout and fast rollback are complements, not substitutes: fix the switch too.',
          outcome: {
            text: 'The rollout plan grows three stages and a lot of calendar invites. Nobody can explain how the 47 minutes gets shorter.',
            effects: { readiness: ['featureFlags'], progress: { client: -3 }, quality: 2 },
          },
        },
        {
          id: 'c',
          label: "Tell {sponsor} 'rehearsal passed': the cutover itself was flawless",
          cost: 0,
          grade: 'poor',
          insight:
            "A rehearsal exists to test the way back. Reporting only the happy half is a watermelon: green outside, red inside. Report what you learned and what you're doing about it. Leaders forgive problems; they don't forgive surprises.",
          outcome: {
            text: "{sponsor} forwards 'Rehearsal passed ✅' to the CTO. {sre} reads it and goes very quiet.",
            effects: {
              trust: 3,
              quality: -5,
              rel: { sre: -8 },
              unready: ['rollbackPlan'],
              flags: ['kl:rollback-untested'],
            },
          },
        },
      ],
      ignored: {
        text: 'Nobody owns the gap, so nothing changes. The rollback plan still assumes a 47-minute DNS flip.',
        effects: { quality: -3, unready: ['rollbackPlan'] },
      },
    },

    // ── Risk trigger: bus factor ──
    {
      id: 'kl-bus-factor-hit',
      scenarios: ['kampong'],
      title: '{lead} is out — and so is the knowledge',
      channel: 'whatsapp',
      from: 'lead',
      body: "Hi {player}, sorry. High fever, and the doctor gave me three days of medical leave. The key-rotation PR is about 80% done and nobody else has worked in that code. I could probably join a short call tomorrow if it's really urgent…",
      urgency: 'high',
      weight: 0,
      concept: 'risk-mgmt',
      skill: 'risk',
      choices: [
        {
          id: 'a',
          label: 'Take her up on it: one short call tomorrow to unblock the PR',
          cost: 0,
          grade: 'poor',
          insight:
            "Accepting a sick colleague's offer to work teaches the whole team that leave isn't real, and a feverish review of key-rotation code is how security bugs ship. A single point of knowledge is a risk to mitigate early, not one to lean on harder.",
          outcome: {
            text: "{lead} joins from bed, foggy. The 'short' call runs 90 minutes. The PR merges, with a bug {security} catches two days later.",
            effects: {
              progress: { core: 3 },
              quality: -5,
              morale: -5,
              rel: { lead: -8 },
              velocity: { ws: 'core', mult: 0.6, days: 3, label: 'Lead on medical leave' },
            },
          },
        },
        {
          id: 'b',
          label: 'Let the trained pair finish the PR from her design doc',
          cost: 1,
          grade: 'best',
          requires: { flags: ['kl:kt-done'] },
          lockedHint: 'Needs the knowledge-transfer pairing (RAID mitigation) done earlier',
          insight:
            'This is why you pay for redundancy before you need it: pairing and runbooks turned a three-day outage into a speed bump. Tell {lead} to rest, and mean it.',
          outcome: {
            text: "The pair finishes the PR using {lead}'s design doc and recorded walkthroughs. She reviews it on her first morning back: two comments, approved.",
            effects: {
              morale: 3,
              rel: { lead: 6 },
              velocity: { ws: 'core', mult: 0.8, days: 2, label: 'Lead on medical leave' },
            },
          },
        },
        {
          id: 'c',
          label: 'Tell her to rest, then re-plan core around three days without its only expert',
          cost: 2,
          grade: 'okay',
          insight:
            'Protecting a sick colleague is right, and honest re-planning beats wishful thinking. But the slowdown is the price of knowledge living in one head. Next time, invest in pairing and runbooks while everyone is healthy.',
          outcome: {
            text: 'You re-plan and tell {sponsor} before he asks. Core crawls for three days. {lead} sends a thumbs-up and goes back to sleep.',
            effects: {
              trust: 2,
              rel: { lead: 5 },
              velocity: { ws: 'core', mult: 0.6, days: 3, label: 'Lead on medical leave' },
            },
          },
        },
      ],
      ignored: {
        text: 'No one decides anything. Two engineers poke nervously at the key-rotation code, then stop. Core stalls.',
        effects: {
          morale: -3,
          block: { ws: 'core', days: 3, reason: 'Key-rotation PR stuck: its only expert is on medical leave' },
        },
      },
    },

    // ── Risk trigger: Seattle roadmap clash ──
    {
      id: 'kl-roadmap-clash-hit',
      scenarios: ['kampong'],
      title: '“We’ll pick up migrations next quarter”',
      channel: 'slack',
      from: 'partner',
      body: "Hey {player}, heads-up before you hear it elsewhere: our VP pulled the Live Gifts launch forward two weeks. I'm moving my two migration engineers onto it today. We'll pick up the auth migrations next quarter. Sorry. I know about the DC date, but my OKRs are my OKRs.",
      urgency: 'high',
      weight: 0,
      concept: 'influence',
      skill: 'stakeholder',
      choices: [
        {
          id: 'a',
          label: "Escalate now to {boss} and {partner}'s VP — the DC date isn't optional",
          cost: 1,
          grade: 'poor',
          insight:
            'Escalating before talking to your peer turns a negotiation into a fight. Go to {partner} first, understand his constraint and offer help. If you still need to escalate, do it jointly, with options, and tell him before you go over his head.',
          outcome: {
            text: "The VP sends one engineer back. {partner} stops answering your DMs, and his team starts calling Durian 'the escalation project'.",
            effects: {
              rel: { partner: -12, boss: -2 },
              velocity: { ws: 'client', mult: 0.8, days: 3, label: 'One migration engineer back' },
            },
          },
        },
        {
          id: 'b',
          label: 'Accept it, and quietly start pricing a lease extension',
          cost: 0,
          grade: 'poor',
          insight:
            "Silently absorbing a dependency slip hides a schedule risk from the people who own the trade-off. 'Next quarter' after a hard external date isn't a plan; it's a cliff. Make the impact visible and negotiate before reaching for the chequebook.",
          outcome: {
            text: '{partner} is relieved. His 18 migrations stall, and the tracker stays the same shade of amber all week.',
            effects: {
              rel: { partner: 3 },
              velocity: { ws: 'client', mult: 0.65, days: 4, label: 'Core Services paused migrations' },
              flags: ['kl:accepted-slip'],
            },
          },
        },
        {
          id: 'c',
          label: 'Call {partner} at 7am his time: offer a migration pair if he keeps one reviewer',
          cost: 2,
          grade: 'best',
          insight:
            'Influence without authority: make the right thing the easy thing. Understand their constraint, lend your own capacity so their cost drops to code review, and meet them on their clock. If that fails, escalate together, with options, never around them.',
          chance: {
            base: 0.65,
            rel: 'partner',
            success: {
              text: 'Over his first coffee, {partner} agrees: your Auth engineers open the migration PRs and his team just reviews them. Live Gifts keeps its people; Durian keeps moving.',
              effects: {
                energy: -3,
                morale: -2,
                trust: 2,
                rel: { partner: 6 },
                velocity: { ws: 'client', mult: 0.9, days: 3, label: 'Auth pair doing migrations' },
              },
            },
            failure: {
              text: "{partner} appreciates the offer but can't spare even a reviewer this sprint. You agree to take it to both directors together, with options. Slower, but he's still talking to you.",
              effects: {
                energy: -3,
                rel: { partner: 3 },
                velocity: { ws: 'client', mult: 0.75, days: 3, label: 'Waiting on a joint escalation' },
              },
            },
          },
        },
      ],
      ignored: {
        text: "{partner}'s engineers move to Live Gifts. Nobody tells the 18 service owners, who assume Durian has been cancelled.",
        effects: {
          trust: -3,
          velocity: { ws: 'client', mult: 0.6, days: 4, label: 'Core Services paused migrations' },
        },
      },
    },

    // ── Risk trigger: legacy services vs new tokens ──
    {
      id: 'kl-jwt-compat-hit',
      scenarios: ['kampong'],
      title: 'Shadow traffic: 9 services reject our tokens',
      channel: 'slack',
      from: 'lead',
      body: 'Shadow-mode results: most services handle Kampong ID tokens fine. Nine do not. Three return HTTP 431 because our JWTs exceed their header-size limits; six call the legacy /introspect endpoint directly. I can add a legacy token mode to Kampong ID, but it lands on my critical path. How do you want to play it, {player}?',
      urgency: 'high',
      weight: 0,
      concept: 'critical-path',
      skill: 'technical',
      choices: [
        {
          id: 'a',
          label: "File a ticket in each of the nine teams' backlogs and chase them every week",
          cost: 1,
          grade: 'poor',
          insight:
            "Nine fixes in nine backlogs means nine prioritisation fights you don't control, on the road to a hard date. When many consumers share one problem, look for a single fix in a single place you can actually drive.",
          outcome: {
            text: "Two teams fix it in a day. Four say 'next sprint'. Three don't reply. Your week becomes a chasing exercise.",
            effects: {
              scope: { client: 8 },
              energy: -4,
              velocity: { ws: 'client', mult: 0.85, days: 3, label: 'Chasing nine backlogs' },
            },
          },
        },
        {
          id: 'b',
          label: "Have {sre}'s team run a compat adapter at the gateway; platform has slack",
          cost: 2,
          grade: 'best',
          insight:
            "Put new work where the slack is, not on the critical path. A gateway adapter can hand legacy services the short opaque tokens they expect and answer their /introspect calls on Kampong ID's behalf: nine consumers fixed in one place, off the longest chain.",
          outcome: {
            text: "{sre}'s team stands up the adapter in two days. All nine services pass in shadow mode without changing a line of their own code. Core never notices.",
            effects: { scope: { platform: 10 }, morale: -2, rel: { sre: 2, partner: 5 } },
          },
        },
        {
          id: 'c',
          label: 'Ask {lead} to add a legacy-compatible token mode to Kampong ID',
          cost: 1,
          grade: 'okay',
          insight:
            'A central fix beats nine scattered ones, but this one lands on the critical path, owned by your most overloaded engineer. Before deciding where new work goes, check where the slack is: the platform team had days to spare.',
          outcome: {
            text: '{lead} builds it quickly and well. The critical path still grows by a day and a half, and the projection slides right.',
            effects: { scope: { core: 6 }, rel: { lead: -3, partner: 3 } },
          },
        },
      ],
      ignored: {
        text: 'Nobody decides. Each of the nine teams invents its own workaround, three of them incompatible with each other.',
        effects: { scope: { client: 10 }, quality: -4 },
      },
    },

    // ── Risk trigger: session migration ──
    {
      id: 'kl-session-loss-hit',
      scenarios: ['kampong'],
      title: 'Backfill dry run: lost sessions, zombie tokens',
      channel: 'slack',
      from: 'sre',
      body: 'Session backfill dry run, diffed against legacy: 0.3% of live sessions are missing from the new store, so those users would be logged out. Worse, about 1,200 sessions people had logged out of came back to life: a race between the snapshot and the logout path. Revoked refresh tokens that work again. {security} will not love this.',
      urgency: 'high',
      weight: 0,
      concept: 'phased-rollout',
      skill: 'technical',
      choices: [
        {
          id: 'a',
          label: 'Pause: add dual-writes and logout tombstones; diff until clean',
          cost: 2,
          grade: 'best',
          insight:
            "Live-data migrations have a pattern: dual-write new changes to both stores, backfill idempotently, record deletions as tombstones so the backfill can't resurrect them, and diff until clean before switching reads. Slower start, no surprises.",
          outcome: {
            text: "Dual-writes go live, and logouts now write tombstones the backfill respects. Two days later the diff is clean, and {sre}'s dashboard proves it in real time.",
            effects: {
              progress: { data: -6 },
              quality: 6,
              rel: { security: 5, sre: 3 },
              readiness: ['monitoring'],
            },
          },
        },
        {
          id: 'b',
          label: "Force everyone to log in again at cutover, so there's nothing to migrate at all",
          cost: 1,
          grade: 'okay',
          insight:
            "Dropping the migration is a legitimate simplification, but it moves the cost to tens of millions of users, a login spike and a support queue. That's a product decision, not an engineering shortcut: bring it to {pm} with numbers.",
          outcome: {
            text: 'Engineering is delighted; the backfill job is deleted. {pm} is not delighted: a global logout means a login storm and a support spike on cutover day.',
            effects: { scope: { data: -20 }, trust: -4, rel: { pm: -8 }, flags: ['kl:forced-relogin'] },
          },
        },
        {
          id: 'c',
          label: 'Ship it: 0.3% re-logins is within tolerance, patch the zombies later',
          cost: 0,
          grade: 'poor',
          insight:
            'The headline number hid the real issue: resurrected sessions are a security bug, not a UX blip. Migrations of live state need a correctness bar, not a tolerance. Pause, fix the pattern, prove it with a clean diff.',
          outcome: {
            text: '{security} finds out from the diff report, not from you. His sign-off on the review track gets noticeably slower.',
            effects: { progress: { data: 5 }, quality: -8, rel: { security: -10 }, flags: ['kl:zombie-sessions'] },
          },
        },
      ],
      ignored: {
        text: 'The backfill runs again overnight with the same bug. Now there are 2,000 zombie sessions, and a ticket from {security} with your name on it.',
        effects: { progress: { data: -4 }, quality: -6, rel: { security: -6 } },
      },
    },

    // ── Risk trigger: certificate pinning on old app versions ──
    {
      id: 'kl-cert-pinning-hit',
      scenarios: ['kampong'],
      title: "Canary alarm: old Android app can't log in",
      channel: 'incident',
      from: 'pm',
      body: "Since this morning's canary moved 5% of login traffic to the new edge, users on app versions before 6.2 get TLS handshake failures: about 3% of Android users. Support tickets are climbing fast. {security} says those versions pin the legacy endpoint's certificate, and the new edge doesn't serve it. What do we do?",
      urgency: 'critical',
      weight: 0,
      concept: 'incident-mgmt',
      skill: 'execution',
      choices: [
        {
          id: 'a',
          label: 'Roll back the canary now, then serve the pinned cert on the new edge',
          cost: 1,
          grade: 'best',
          insight:
            "Stop the bleeding first: roll back, then fix. The certificate and its key are yours, so the new edge can serve the pinned cert until old versions age out. Next time, pin to several public keys, including a backup, so rotations don't lock users out.",
          outcome: {
            text: "Rollback takes a minute and login errors drop to zero. {security}'s team loads the existing certificate onto the new edge, and the canary resumes next morning without a blip.",
            effects: { trust: 2, rel: { security: 4, pm: 4 }, progress: { client: -2 } },
          },
        },
        {
          id: 'b',
          label: 'Keep the canary running and force-upgrade every old app version',
          cost: 0,
          grade: 'poor',
          insight:
            "Forcing upgrades while users are locked out pushes your incident onto customers, and some can't upgrade at all on older devices. Mitigate first by rolling back, then remediate on your side.",
          outcome: {
            text: "The upgrade prompt goes out. Many affected users are on older phones the new app doesn't support. Support tickets double by lunchtime.",
            effects: { trust: -8, quality: -5, morale: -3, rel: { pm: -6 } },
          },
        },
        {
          id: 'c',
          label: 'Roll back, then freeze every edge change until a full security review is done',
          cost: 1,
          grade: 'okay',
          insight:
            'Rolling back was right. Freezing everything over-corrects: the cause is narrow and fixable on your side. Respond in proportion: fix the specific cause, add a check for it to the canary, and keep moving.',
          outcome: {
            text: 'Users recover. Then the freeze stalls every cutover for two days while a review re-checks things nobody doubted.',
            effects: {
              trust: 1,
              rel: { security: 3 },
              block: { ws: 'client', days: 2, reason: 'Edge changes frozen pending a full security review' },
            },
          },
        },
      ],
      ignored: {
        text: "For four hours nobody acts. App-store reviews fill with one-star 'can't log in' rants, and {sponsor} hears about it from the CTO.",
        effects: { trust: -12, quality: -4, rel: { sponsor: -8, pm: -6 } },
      },
    },

    // ── Risk trigger: personal data in token claims ──
    {
      id: 'kl-pii-claims-hit',
      scenarios: ['kampong'],
      title: "Privacy review: what's in these tokens?",
      channel: 'email',
      from: 'compliance',
      body: "Hi {player}, privacy review finding. Kampong ID's mobile token profile carries phone number and date of birth, and three services log full tokens to a cluster in another region. JWTs are signed, not encrypted: anyone with log access can read them. Under the PDPA I need to justify each piece of personal data and where it travels. I can't sign off as is.",
      urgency: 'high',
      weight: 0,
      concept: 'pdpa',
      skill: 'risk',
      choices: [
        {
          id: 'a',
          label: 'Minimise claims to subject, scopes and expiry; stop logging full tokens',
          cost: 2,
          grade: 'best',
          insight:
            'Data minimisation: a token should carry only what every recipient needs to authorise a request; profile data comes from /userinfo when actually needed. Then stop logging full tokens. Smaller tokens, smaller blast radius, easy sign-off.',
          outcome: {
            text: "{lead} trims the claims, and services that need a phone number call /userinfo. The three teams scrub their logs. {compliance} signs off with one line: 'This is how it should look.'",
            effects: { scope: { client: 4 }, quality: 4, rel: { compliance: 8, security: 4 } },
          },
        },
        {
          id: 'b',
          label: 'Encrypt the tokens with JWE so nobody can read the claims',
          cost: 1,
          grade: 'okay',
          insight:
            "Encrypting tokens (JWE) hides the claims, but every consumer now needs decryption keys, tokens grow, and the personal data still travels everywhere the token goes. Minimising what's in the token is simpler and stronger: data you don't send can't leak.",
          outcome: {
            text: '{lead} sighs and sketches a key-distribution plan for 40 services. {compliance} is satisfied. The critical path is not.',
            effects: { scope: { core: 8 }, rel: { compliance: 4, lead: -4 } },
          },
        },
        {
          id: 'c',
          label: "Ask {compliance} to sign a risk acceptance; you'll fix the claims after cutover",
          cost: 1,
          grade: 'poor',
          insight:
            'Risk acceptance is for risks that are expensive to fix. This one is cheap now and expensive later, once 40 services depend on those claims. Privacy by design means minimising data before launch, not apologising after.',
          outcome: {
            text: '{compliance} declines, politely and in writing, copying {security}. The review track stalls for two days while everyone re-reads the PDPA.',
            effects: {
              trust: -2,
              rel: { compliance: -8 },
              block: { ws: 'review', days: 2, reason: 'Privacy sign-off withheld until token claims change' },
            },
          },
        },
      ],
      ignored: {
        text: "{compliance}'s finding sits unanswered. She escalates it to {sponsor} as a launch blocker.",
        effects: {
          trust: -4,
          rel: { compliance: -6 },
          block: { ws: 'review', days: 3, reason: 'Unresolved privacy finding escalated as a launch blocker' },
        },
      },
    },

    // ── Risk trigger: callers nobody inventoried ──
    {
      id: 'kl-ghost-callers-hit',
      scenarios: ['kampong'],
      title: 'The payout job nobody put on the tracker',
      channel: 'slack',
      from: 'sre',
      body: "Found one: a creator-payout reconciliation job authenticates to legacy auth with a hard-coded client secret. It runs once a quarter, so it never showed up in recent logs. Its owner left last year and Finance didn't know it existed. If the DC goes dark, creators don't get paid. There may be more like it.",
      urgency: 'high',
      weight: 0,
      concept: 'raci',
      skill: 'execution',
      choices: [
        {
          id: 'a',
          label: "Migrate the job yourself tonight — it's just a client-secret swap",
          cost: 2,
          grade: 'poor',
          insight:
            "Writing code in another team's critical system, alone and at night, is the tech-lead reflex at its riskiest: no owner, no reviewer, nobody on call when it breaks at quarter-end. Your job is to get it an accountable owner and the right people on it.",
          outcome: {
            text: 'The swap works in staging. In production, the job also reads a legacy session table nobody mentioned. It fails silently; {sre} spots it a day later.',
            effects: { energy: -8, quality: -6, rel: { sre: -4 } },
          },
        },
        {
          id: 'b',
          label: 'Search a full year of auth logs for rare callers; get Finance to name an owner',
          cost: 2,
          grade: 'best',
          insight:
            "An orphaned system is a RACI gap: nobody is Accountable, so nothing happens. Inventory windows must cover your slowest cycle, since quarterly and annual jobs hide in short log samples, and every orphan needs an owner named by its org's leadership.",
          outcome: {
            text: "A year of archived logs turns up two more rare callers, including an annual tax-report job. Finance's director names an owner for the payout job within a day, and {partner}'s team helps migrate it.",
            effects: { scope: { client: 5 }, trust: 4, rel: { sre: 4, partner: 2 } },
          },
        },
        {
          id: 'c',
          label: 'Run a scream test: switch legacy auth off for 15 minutes and see who shouts',
          cost: 1,
          grade: 'poor',
          insight:
            "An unannounced scream test turns production into your discovery tool and your users into the alarm. Brownouts can be a legitimate deprecation technique (announced, scheduled, short and reversible), but only after the logs have told you who's still calling.",
          outcome: {
            text: 'Four teams shout. So does the CTO: one of the callers was the live-streaming service, halfway through a big creator event.',
            effects: { trust: -10, quality: -3, scope: { client: 4 }, rel: { sponsor: -6, partner: -6 } },
          },
        },
      ],
      ignored: {
        text: 'The payout job stays orphaned. Nobody owns it, so nobody fixes it, and it still points at a data centre with an expiry date.',
        effects: { trust: -3, scope: { client: 4 } },
      },
    },

    // ── Risk trigger (dormant, added by the leaderboard): metric gaming ──
    {
      id: 'kl-metric-gaming-hit',
      scenarios: ['kampong'],
      title: 'Leaderboard says ✅. Traffic says otherwise.',
      channel: 'slack',
      from: 'sre',
      body: "Data check: six services marked 'Migrated ✅' in the tracker sent 2.1M requests to legacy auth yesterday. They kept the old client as a silent fallback so they could climb the board safely. One of them is {partner}'s. When the DC goes dark, whatever still runs through those fallbacks breaks with it.",
      urgency: 'normal',
      weight: 0,
      concept: 'metrics',
      skill: 'leadership',
      choices: [
        {
          id: 'a',
          label: 'Post the six service names, with their legacy traffic, in the main Durian channel',
          cost: 0,
          grade: 'poor',
          insight:
            'Public shaming makes people defend themselves instead of fixing things, and it teaches everyone to hide data from you. Show each owner their numbers privately, and fix the measurement that invited the gaming.',
          outcome: {
            text: "Five teams fix it by Friday. The sixth, {partner}'s, fixes it too, and stops inviting you to his planning meetings.",
            effects: { progress: { client: 3 }, morale: -4, rel: { partner: -10 } },
          },
        },
        {
          id: 'b',
          label: "Redefine 'migrated' as 48h of zero legacy traffic; DM each owner their graph",
          cost: 2,
          grade: 'best',
          insight:
            "Goodhart's law: when a measure becomes a target, it stops being a good measure. Measure the outcome you need, zero legacy traffic, from telemetry rather than self-reports, and give owners their data privately. The board stays fun and becomes true.",
          outcome: {
            text: 'The board resets to measured traffic. Each owner gets a friendly DM with a graph. Four fallbacks are gone in two days, and {partner} thanks you for not making it public.',
            effects: { quality: 4, trust: 3, rel: { partner: 4, pm: 2 } },
          },
        },
        {
          id: 'c',
          label: 'Leave it: those fallbacks die with the DC anyway',
          cost: 0,
          grade: 'poor',
          insight:
            "A silent fallback means the new path isn't carrying all the traffic, and you'll find out which part on decommission day, all at once. A deadline that 'forces' a fix is just an outage you've scheduled in advance.",
          outcome: {
            text: 'The board stays green. {sre} adds a line to the risk register, in red, with your name in the owner column.',
            effects: { trust: -2, quality: -6, flags: ['kl:silent-fallbacks'] },
          },
        },
      ],
      ignored: {
        text: 'The board stays green while the fallbacks keep quietly carrying traffic to a data centre with an expiry date.',
        effects: { quality: -4, flags: ['kl:silent-fallbacks'] },
      },
    },

    // ── Flavour: follow-the-sun handoff ──
    {
      id: 'kl-follow-the-sun',
      scenarios: ['kampong'],
      title: 'The 10pm handoff that wasn’t',
      channel: 'slack',
      from: 'sre',
      body: "Morning {player}. Our 10pm handoff to Seattle said 'session backfill ready ✅'. At 9:40pm we'd found a bug and meant to add 'DO NOT RUN'. Nobody did. Seattle ran it at 7am their time, exactly as written. Four hours of writes to roll back. Not anyone's fault, but alamak.",
      urgency: 'normal',
      when: { minDay: 3, maxDay: 13, progressAtLeast: { data: 15 } },
      concept: 'cross-timezone',
      skill: 'execution',
      choices: [
        {
          id: 'a',
          label: 'Find out who ran it and make sure their manager hears about it',
          cost: 1,
          grade: 'poor',
          insight:
            'Seattle did exactly what the handoff said. Blame lands on the wrong person and teaches everyone to hide mistakes. Look at the system: the handoff format let a critical caveat go missing. Fix the format, blamelessly.',
          outcome: {
            text: 'The Seattle engineer apologises for following instructions. {partner} points out, publicly, that Singapore wrote them.',
            effects: { progress: { data: -4 }, morale: -5, rel: { partner: -8, sre: -3 } },
          },
        },
        {
          id: 'b',
          label: 'Keep risky runs to Singapore hours only: no more overnight work',
          cost: 1,
          grade: 'okay',
          insight:
            "Removing the handoff removes this risk, but also the round-the-clock progress that justified hubs in different time zones. It's a reasonable guardrail for the riskiest steps; fix the handoff for everything else.",
          outcome: {
            text: 'Nothing breaks overnight any more. Nothing moves overnight either.',
            effects: {
              progress: { data: -4 },
              quality: 2,
              velocity: { ws: 'data', mult: 0.85, days: 3, label: 'No overnight runs' },
            },
          },
        },
        {
          id: 'c',
          label: 'Stay online till 11pm every night to run each handoff yourself',
          cost: 1,
          grade: 'poor',
          insight:
            'The hero TPM becomes the bottleneck and burns out by week three. Handoffs should survive without you: a written template, an explicit go/no-go state, and an overlap the whole team owns.',
          outcome: {
            text: 'Handoffs are flawless for four days. On the fifth, you fall asleep mid-sentence on a call with Seattle.',
            effects: { progress: { data: -4 }, energy: -12, rel: { sre: 2 } },
          },
        },
        {
          id: 'd',
          label: "Add a handoff template with a 'safe to run?' gate and a rotating overlap hour",
          cost: 2,
          grade: 'best',
          insight:
            "Follow-the-sun works only if handoffs are explicit: state, caveats and a clear 'safe to run?' gate in a fixed template. Rotate the painful overlap hour so neither hub always takes the late or early call. A blameless fix, built to last.",
          outcome: {
            text: "The new template has a big 'Safe to run? Y/N' field nobody can skip. The overlap hour rotates weekly, so Singapore and Seattle share the bad slots. Next week's handoffs are clean.",
            effects: {
              progress: { data: -4 },
              quality: 4,
              rel: { sre: 4, partner: 4 },
              readiness: ['oncall'],
              flags: ['kl:handoff-template'],
            },
          },
        },
      ],
      ignored: {
        text: 'Nothing changes. Two days later, a different caveat goes missing in a different handoff.',
        effects: { progress: { data: -6 }, morale: -3 },
      },
    },

    // ── Flavour: lost in translation ──
    {
      id: 'kl-grey-release',
      scenarios: ['kampong'],
      title: "Why is Shenzhen doing a 'grey release'?",
      channel: 'slack',
      from: 'partner',
      body: "{player}, the auto-translated update in the Auth channel says 'grey release of Kampong ID begins Thursday'. Grey release?? Nobody told my on-call about a release. Is Shenzhen pushing unannounced prod changes now? I'm about to raise it with {sponsor}.",
      urgency: 'high',
      when: { minDay: 4, maxDay: 12 },
      concept: 'cross-timezone',
      skill: 'comms',
      choices: [
        {
          id: 'a',
          label: "Ask {sponsor} to pause Thursday's rollout until Seattle is comfortable",
          cost: 1,
          grade: 'poor',
          insight:
            "Pausing a planned rollout over a vocabulary mix-up treats a communication gap as a technical risk. Clarify first: one question to the right person usually dissolves the 'crisis'. Then fix whatever let the confusion happen.",
          outcome: {
            text: "The rollout slips three days. When the misunderstanding comes out, {lead}'s team feels blamed for following the plan.",
            effects: { progress: { core: -4 }, morale: -4, rel: { lead: -8 } },
          },
        },
        {
          id: 'b',
          label: 'Ask the Shenzhen team to write all their updates in English from now on',
          cost: 0,
          grade: 'okay',
          insight:
            'A shared working language for cross-hub channels is reasonable, but imposing it right after a misunderstanding reads as blame, and English jargon confuses people too. The real fix is shared vocabulary: a glossary and one change calendar.',
          outcome: {
            text: "{lead}'s team complies, crisply and coolly. Their updates get shorter. Much shorter.",
            effects: { morale: -2, rel: { lead: -6, partner: 2 } },
          },
        },
        {
          id: 'c',
          label: 'Check with {lead}, clarify in the channel, start a glossary',
          cost: 2,
          grade: 'best',
          insight:
            "灰度发布 ('grey release') is everyday Chinese tech jargon for a canary or gradual rollout. The plan worked; the vocabulary didn't. Distributed programs need a shared glossary and one change calendar every hub reads. Clarify fast, then fix the system.",
          outcome: {
            text: '{lead} confirms: a 1% canary, exactly as planned. You post the clarification, start a Durian glossary (灰度 = canary) and put every rollout on one shared change calendar. {partner} replies with 😅.',
            effects: { trust: 2, rel: { lead: 4, partner: 4 }, skills: { comms: 1 } },
          },
        },
      ],
      ignored: {
        text: "{partner} raises an 'unannounced release' with {sponsor}. It takes a day of meetings to establish that it was the plan all along.",
        effects: { trust: -3, rel: { lead: -4, partner: -3 } },
      },
    },

    // ── Flavour: the all-hands promise ──
    {
      id: 'kl-zero-downtime',
      scenarios: ['kampong'],
      title: "The CTO promised 'zero downtime'",
      channel: 'slack',
      from: 'pm',
      body: "Did you catch the all-hands? The CTO just told 4,000 people the Kampong ID migration will be 'zero downtime, zero logouts'. 😬 Our plan has a two-minute read-only window per region, and about 1% of users on very old app versions will need to log in again. Comms wants a blog post by tomorrow.",
      urgency: 'high',
      when: { minDay: 3, maxDay: 11, notFlags: ['kl:forced-relogin'] },
      concept: 'escalation',
      skill: 'comms',
      choices: [
        {
          id: 'a',
          label: 'Say nothing for now; with luck nobody notices a two-minute blip',
          cost: 0,
          grade: 'poor',
          insight:
            "Silence turns a fixable expectation gap into a broken public promise on cutover day. Bad news doesn't age well. Surface it now, privately, through the person who can fix it.",
          outcome: {
            text: "The blog post goes out: 'zero downtime, zero logouts'. You bookmark it for the post-mortem.",
            effects: { trust: -3, flags: ['kl:zero-downtime-promise'] },
          },
        },
        {
          id: 'b',
          label: 'Reply-all on the all-hands thread with the real plan, for transparency',
          cost: 0,
          grade: 'poor',
          insight:
            'Correcting an executive in public makes it about face, not facts, and the CTO will remember who did it. Transparency matters, but so does the route: go through your sponsor, privately, with the facts and a proposed wording.',
          outcome: {
            text: "4,000 people watch you correct the CTO. {sponsor} calls you within four minutes. It isn't a fun call.",
            effects: { trust: -8, rel: { sponsor: -8, boss: -4 } },
          },
        },
        {
          id: 'c',
          label: 'Ask {lead} to cost true zero downtime before you raise anything',
          cost: 1,
          grade: 'okay',
          insight:
            'Knowing the cost of the promise is useful, but the blog post goes out tomorrow and silence until then reads as agreement. Raise the gap now with what you know; refine the numbers in parallel.',
          outcome: {
            text: '{lead} estimates two extra weeks of dual-running. By the time you have the number, the blog post is live.',
            effects: { trust: -2, rel: { lead: -2 }, flags: ['kl:zero-downtime-promise'] },
          },
        },
        {
          id: 'd',
          label: 'Brief {sponsor} privately: real numbers, the risk, and wording the CTO can use',
          cost: 2,
          grade: 'best',
          insight:
            "Expectation gaps grow with time. Give your sponsor the facts, the risk and a ready-made reframe ('no data loss, under two minutes read-only, 99% stay logged in') so they can align the exec without anyone losing face. Measurable promises beat slogans.",
          outcome: {
            text: "{sponsor} has a quiet word. By evening, the CTO's follow-up says 'no data loss and near-zero disruption', with your numbers. Comms gets a blog post that's actually true.",
            effects: { trust: 6, rel: { sponsor: 6, pm: 3 }, readiness: ['commsPlan'] },
          },
        },
      ],
      ignored: {
        text: "Comms publishes 'zero downtime, zero logouts'. It's now a public promise with your program's name on it.",
        effects: { trust: -4, flags: ['kl:zero-downtime-promise'] },
      },
    },

    // ── Flavour: gamifying adoption ──
    {
      id: 'kl-leaderboard',
      scenarios: ['kampong'],
      title: 'Gamify it! A migration leaderboard',
      channel: 'hallway',
      from: 'pm',
      body: "Idea! A migration leaderboard on the lobby screen at one-north. Teams tick 'Migrated ✅' themselves and win a durian party. Laggards go on a 'Wall of Thorns'. Gamification works, right? I can have it live by lunch. Can or not?",
      urgency: 'normal',
      when: { minDay: 2, maxDay: 9 },
      concept: 'influence',
      skill: 'leadership',
      choices: [
        {
          id: 'a',
          label: 'Ship it as designed, Wall of Thorns and all: a little public shame motivates',
          cost: 0,
          grade: 'poor',
          insight:
            'Shaming peers you have no authority over breeds resentment, and self-reported status invites gaming. Recognition works; humiliation backfires. Celebrate progress, and measure it from telemetry rather than checkboxes.',
          outcome: {
            text: "The board goes up by lunch. By 3pm, two teams on the Wall of Thorns have complained to their directors, and several others have discovered the 'Migrated' checkbox.",
            effects: {
              morale: -2,
              rel: { partner: -6, pm: 4 },
              velocity: { ws: 'client', mult: 1.1, days: 2, label: 'Leaderboard buzz' },
              addRisks: ['kl-risk-metric-gaming'],
            },
          },
        },
        {
          id: 'b',
          label: 'Skip the gimmick; a crisp weekly status email is more professional',
          cost: 0,
          grade: 'okay',
          insight:
            "Status emails inform; they rarely motivate. Without authority, a TPM needs other levers: visibility, recognition, and making the right thing easy. A well-designed leaderboard is a cheap, legitimate influence tool, as long as it's measured honestly.",
          outcome: {
            text: 'Your status email gets a 31% open rate. {pm} looks deflated.',
            effects: { rel: { pm: -4 } },
          },
        },
        {
          id: 'c',
          label: 'Yes, but rank by measured traffic and celebrate wins: no wall of shame',
          cost: 1,
          grade: 'best',
          insight:
            'Influence without authority runs on recognition and ease. Rank by Kampong ID telemetry so the board cannot be gamed, celebrate every team that crosses the line, and pair it with office hours that make migrating easy. Carrots in public, nudges in private.',
          outcome: {
            text: 'The board ranks teams by real traffic on Kampong ID. The first three teams to hit 100% get durian and a shout-out at the all-hands. Office hours fill up for the first time.',
            effects: {
              morale: 3,
              rel: { pm: 5, partner: 3 },
              velocity: { ws: 'client', mult: 1.15, days: 3, label: 'Leaderboard buzz' },
            },
          },
        },
      ],
      ignored: {
        text: '{pm} launches it anyway, Wall of Thorns and all.',
        effects: { rel: { partner: -4 }, addRisks: ['kl-risk-metric-gaming'] },
      },
    },
  ],

  hue: 95,
  icon: '🆔',
}
