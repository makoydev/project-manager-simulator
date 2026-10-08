import type { LiveEpisode } from '../types'

/**
 * Live episode · "Fireworks at Ten": Wednesday of week 2 on Project Kaya (ShiokPay Later).
 *
 * The day turns on one decision: how checkout gets a credit decision. Jun Hao (Tech Lead,
 * Payments, the decider) wants a synchronous bureau call (A). Andrea (Staff Engineer, Risk
 * Platform) wants asynchronous pre-approval with cached limits (B). The facts that settle it
 * are scattered across the desktop: Marcus's 11.11 peak (morning DM), the bureau contract cap
 * (Hakim's DM, mid-review) and a consent requirement (Kavitha's RFC comment, mid-review).
 * The good outcome is C: sync with a timeout, circuit breaker and rate limiter, a fallback that
 * hides Pay Later, and B as a dated fast-follow, decided by the tech lead rather than the TPM.
 *
 * Flags (read:<id> flags come from key messages, comments and dashboards):
 *   prep:both-options, prep:backchannel          set by morning / desk DM replies
 *   standup:parked | tl-fix | asked | raid | dragged
 *   arch:framed, arch:sided-b, arch:cap-said (you said it in the review), arch:cap-known (the cap
 *   reached the room, from you or Nurul), arch:consent-raised, arch:pushed-b, arch:escalated,
 *   arch:committed, arch:recap, arch:dated-followup
 *   fact:bureau-cap                               you said the contract cap out loud (review or exec)
 *   decision:c | decision:b | decision:a | decision:none   exactly one, set as the review ends
 *   exec:honest, exec:watermelon, exec:caved, exec:cap-explained, exec:fallback-approved
 */
export const KAYA_WEDNESDAY: LiveEpisode = {
  id: 'kaya-wednesday',
  title: 'Fireworks at Ten',
  subtitle: 'Two engineers, one RFC, a credit bureau with a rate limit, and a launch date on every billboard.',
  scenarioId: 'shiokpay',
  dayLabel: 'Wednesday · Week 2 of Project Kaya',
  intro: [
    'Wednesday, week 2 of Project Kaya. Launch is seven working days away, and 11.11 is on every MRT ad panel from Buona Vista to Jurong East.',
    'At 10:00 the team decides how checkout gets a credit decision. Two senior engineers have two very different answers, and both of them are partly right.',
    "Slack, the RFC and the dashboards hold the facts; the meetings hold the opinions. Some things are only worth saying if you've read them first. When it's your turn to speak, the clock is running, and silence is an answer too.",
  ],
  you: { name: 'You', title: 'Technical Program Manager' },

  people: [
    { id: 'junhao', name: 'Ng Jun Hao', short: 'Jun Hao', title: 'Tech Lead, Payments', avatar: '🧑🏻‍💻', hue: 150, location: 'one-north, Singapore', camera: true },
    { id: 'andrea', name: 'Andrea Villanueva', short: 'Andrea', title: 'Staff Engineer, Risk Platform', avatar: '👩🏽‍💻', hue: 90, location: 'one-north, Singapore', camera: true },
    { id: 'marcus', name: "Marcus D'Cruz", short: 'Marcus', title: 'SRE Lead', avatar: '🧑🏽‍🚒', hue: 5, location: 'one-north, Singapore', camera: true },
    { id: 'nurul', name: 'Nurul Huda Binte Ismail', short: 'Nurul', title: 'Product Manager, ShiokPay Later', avatar: '🧕🏽', hue: 320, location: 'one-north, Singapore', camera: true },
    { id: 'linh', name: 'Nguyen Thuy Linh', short: 'Linh', title: 'AppSec Lead', avatar: '🕵🏻‍♀️', hue: 250, location: 'one-north, Singapore', camera: true },
    { id: 'rizky', name: 'Rizky Pratama', short: 'Rizky', title: 'Engineering Manager, Mobile', avatar: '🤹🏽‍♂️', hue: 275, location: 'Jakarta, Indonesia', camera: false },
    { id: 'xinyi', name: 'Ho Xin Yi', short: 'Xin Yi', title: 'QA Engineer, Payments', avatar: '👩🏻‍🔬', hue: 60, location: 'one-north, Singapore', camera: true },
    { id: 'hakim', name: 'Hakim bin Yusof', short: 'Hakim', title: 'Partnerships Manager, Fintech', avatar: '🧔🏽‍♂️', hue: 180, location: 'one-north, Singapore', camera: true },
    { id: 'kavitha', name: 'Kavitha Subramaniam', short: 'Kavitha', title: 'Head of Compliance & Legal', avatar: '👩🏾‍⚖️', hue: 45, location: 'one-north, Singapore', camera: true },
    { id: 'rohan', name: 'Rohan Mehta', short: 'Rohan', title: 'VP, Fintech', avatar: '👨🏽‍💼', hue: 25, location: 'one-north, Singapore', camera: true },
    { id: 'evelyn', name: 'Evelyn Tan Hui Min', short: 'Evelyn', title: 'Director, Program Management', avatar: '👩🏻‍💼', hue: 205, location: 'one-north, Singapore', camera: true },
  ],

  channels: [
    { id: '#proj-kaya', name: '#proj-kaya', kind: 'channel', topic: 'ShiokPay Later · ship before 11.11 · RFC-012 review today, 10:00' },
    { id: '#checkout-war-room', name: '#checkout-war-room', kind: 'channel', topic: '11.11 readiness. Pinned: "00:03. Never again."' },
    { id: 'dm-junhao', name: 'Jun Hao', kind: 'dm', with: 'junhao' },
    { id: 'dm-marcus', name: 'Marcus', kind: 'dm', with: 'marcus' },
    { id: 'dm-andrea', name: 'Andrea', kind: 'dm', with: 'andrea' },
    { id: 'dm-hakim', name: 'Hakim', kind: 'dm', with: 'hakim' },
    { id: 'dm-evelyn', name: 'Evelyn', kind: 'dm', with: 'evelyn' },
  ],

  messages: [
    // ───────────── Waiting at 09:15 ─────────────
    {
      id: 'jh-fireworks',
      channel: 'dm-junhao',
      from: 'junhao',
      at: 'morning',
      text: "Morning. Heads-up before 10: Andrea from Risk Platform and I don't agree on the credit-decision flow. Like, at all. Expect fireworks 🎆",
    },
    {
      id: 'jh-present',
      channel: 'dm-junhao',
      from: 'junhao',
      at: 'morning',
      text: "Also, quick one. At the review, should I present just Option A, or both? A is mine, and honestly it's the one we can ship.",
      replies: [
        {
          id: 'a-only',
          text: "Just A. Keep it simple, we really don't have time for a debate this close to launch.",
          grade: 'poor',
          insight:
            "Hiding the alternative doesn't remove it; it just arrives as an ambush. A review with one visible option looks rigged and gets relitigated later. Show both, against criteria everyone can see.",
          effects: { clarity: -2 },
          response: 'Ok, A it is. Andrea will bring B anyway, but sure.',
        },
        {
          id: 'both',
          text: "Both, side by side, with the criteria at the top: peak, latency, date, compliance. If A wins against those, it wins fair. And it's still your call.",
          grade: 'best',
          insight:
            'Both options plus explicit criteria turns a pitch contest into a decision. It also protects Jun Hao: if A wins against criteria everyone saw in advance, nobody can call it a stitch-up.',
          effects: { clarity: 3, rel: { junhao: 3 }, flags: ['prep:both-options'] },
          response: 'Fair. Andrea would have presented B anyway, loudly. Adding a criteria section now.',
        },
        {
          id: 'up-to-you',
          text: "Up to you, it's your RFC!",
          grade: 'okay',
          insight:
            'Respecting ownership is right, but he asked for help. A TPM adds value by shaping how the decision gets made: both options, explicit criteria, a named decider.',
          response: "Ok. I'll lead with A and keep B in for completeness then 🤷",
        },
      ],
    },
    {
      id: 'mc-peak',
      channel: 'dm-marcus',
      from: 'marcus',
      at: 'morning',
      key: true,
      text: 'Morning! Pulled the numbers you asked for on Monday. Last 11.11, checkout peaked at ~400 req/s around 00:05. Checkout p99 is already ~1.4s on a normal day, and the SLO is 1.5s. Dashboards are in your bookmarks 📈',
    },
    {
      id: 'pk-meme',
      channel: '#proj-kaya',
      from: 'rizky',
      at: 'morning',
      text: 'Mobile squad, yesterday: fixed 9 bugs, found 11. Net progress: vibes 🫠',
    },
    {
      id: 'pk-meme-2',
      channel: '#proj-kaya',
      from: 'xinyi',
      at: 'morning',
      text: 'Four of those 11 were mine. You are welcome 🐛',
    },
    {
      id: 'pk-rfc',
      channel: '#proj-kaya',
      from: 'nurul',
      at: 'morning',
      text: 'Reminder: RFC-012 review at 10:00, Kaya Toast (L9) + video. Please read the doc BEFORE the meeting, not during 🙏',
    },
    {
      id: 'wr-spike',
      channel: '#checkout-war-room',
      from: 'marcus',
      at: 'morning',
      text: 'FYI: bureau sandbox p95 spiked to ~3s again last night (02:10–02:25). Sandbox, not prod, but that is four spikes in seven days. Graph is on the dashboards.',
    },

    // ───────────── Desk time ─────────────
    {
      id: 'an-hello',
      channel: 'dm-andrea',
      from: 'andrea',
      at: 'desk',
      text: "Hi! Andrea from Risk Platform 👋 Looking forward to 10. Fair warning: I'll argue for B. Nothing personal, I've just been paged at 3am by a sync call to a vendor before. Not doing that on 11.11.",
      replies: [
        {
          id: 'thumbs',
          text: '👍',
          grade: 'okay',
          insight:
            'Polite, but you missed a cheap chance to set expectations before the meeting: both options judged against the same criteria, with a named decider.',
        },
        {
          id: 'criteria',
          text: "Thanks for the heads-up! Bring the incident you're thinking of. We'll judge both options against the same criteria, and Jun Hao makes the call.",
          grade: 'best',
          insight:
            'Welcome the dissent, ask for evidence and set expectations before the meeting: the same criteria for both options, and a named decider. Nobody walks in expecting to win by volume.',
          effects: { clarity: 2, rel: { andrea: 3 } },
          response: "Fair. I'll bring the postmortem. It's a fun read, in a horror-movie way.",
        },
        {
          id: 'lean-b',
          text: "Between us, I'm leaning B too 😉",
          grade: 'poor',
          insight:
            'Private side-taking before a decision meeting spends your neutrality, and backchannels always surface. If you have a technical view, raise it in the room, as a question, after the criteria are agreed.',
          effects: { rel: { andrea: 2 }, flags: ['prep:backchannel'] },
          response: 'Ooh, good to know 😄 See you at 10!',
        },
      ],
    },
    {
      id: 'ev-crisp',
      channel: 'dm-evelyn',
      from: 'evelyn',
      at: 'desk',
      text: 'Rohan will ask about the date. Be crisp: first line is the answer, then the decision, the cost and your ask. He has board prep straight after 🙏',
    },
    {
      id: 'hk-later',
      channel: 'dm-hakim',
      from: 'hakim',
      at: 'desk',
      text: "Did my note land in time this morning? If Rohan asks about raising the cap: it's a contract amendment with about six weeks' lead time, so not before 11.11. Happy to join if useful.",
    },

    // ───────────── Delivered mid-meeting ─────────────
    {
      id: 'hk-cap',
      channel: 'dm-hakim',
      from: 'hakim',
      at: 'beat',
      key: true,
      text: "Hi! Saw RFC-012 in #proj-kaya. Before anyone quotes the bureau's sales team: our contract caps us at 50 calls/sec, bursts to 80 for up to 10 seconds. Above that they return HTTP 429.",
    },
    {
      id: 'hk-cap-2',
      channel: 'dm-hakim',
      from: 'hakim',
      at: 'beat',
      text: "'Fine at your volume' meant our monthly volume, not per second. I asked about an 11.11 uplift last month: December at the earliest. Paiseh, should have flagged it sooner.",
    },
  ],

  dashboards: [
    {
      id: 'dash-checkout-p99',
      title: 'Checkout API · p99 latency',
      unit: 's',
      points: [1.12, 1.15, 1.13, 1.18, 1.22, 1.2, 1.25, 1.28, 1.26, 1.31, 1.34, 1.33, 1.38, 1.41],
      span: ['14 days ago', 'today'],
      threshold: { value: 1.5, label: 'SLO 1.5s' },
      caption: 'Creeping up since the instalment preview shipped. About 0.1s of headroom left before the SLO, on a normal day.',
      key: true,
    },
    {
      id: 'dash-1111-traffic',
      title: 'Last 11.11 · checkout traffic by hour',
      unit: 'req/s',
      points: [55, 70, 95, 150, 400, 210, 105, 55, 32, 28, 40, 75, 115, 145, 170, 185, 265, 205, 170, 160, 175, 205, 235, 250],
      span: ['10 Nov, 20:00', '11 Nov, 19:00'],
      caption:
        'Peak minute in each hour. Midnight is the cliff: ~400 req/s in the first five minutes, roughly ten times a normal evening. The noon flash sale is the second wave.',
      key: true,
    },
    {
      id: 'dash-bureau-p95',
      title: 'Credit bureau sandbox · p95 latency',
      unit: 'ms',
      points: [
        740, 780, 820, 3050, 760, 720, 830, 870, 790, 760, 810, 2900, 780, 850, 760, 730, 880, 900, 3100, 800, 770, 720, 860, 810,
        790, 840, 2950, 780,
      ],
      span: ['7 days ago', 'now'],
      caption: 'Sandbox, not production, but the shape is the story: 700–900ms on a good day, and ~3s spikes four nights out of seven.',
      key: true,
    },
  ],

  docs: [
    {
      id: 'rfc-012',
      title: 'RFC-012 · Credit decision at checkout',
      author: 'junhao',
      sections: [
        {
          heading: 'Summary',
          body: [
            'Status: in review · Decider: Jun Hao (Tech Lead, Payments) · Reviewers: Andrea (Risk Platform), Marcus (SRE), Linh (AppSec), Nurul (Product)',
            'Checkout must know whether a customer can use ShiokPay Later, and their limit, before it offers the option. Today, credit decisions only happen at sign-up.',
            'Constraints: launch before 11.11 (the date is public). Checkout p99 SLO is 1.5s. 11.11 peak traffic: TBC with SRE.',
          ],
        },
        {
          heading: 'Option A · Synchronous decision at checkout',
          body: [
            'When a customer taps Pay Later, checkout calls credit-decision synchronously. credit-decision calls the credit bureau, applies our affordability rules and returns a limit.',
            'For: simple; always-fresh decisions; one code path; about 3 days of work left.',
            'Against: the bureau sits on the checkout hot path. Sandbox p95 is 700–900ms, with spikes to ~3s. Behaviour at peak: unknown.',
          ],
        },
        {
          heading: 'Option B · Asynchronous pre-approval',
          body: [
            'Pre-approve active customers in the background with a nightly batch plus events. credit-decision publishes a CreditProfileUpdated event, and checkout reads a cached limit (~5ms).',
            'For: fast and resilient; the bureau is never on the checkout path; bureau calls can be paced.',
            'Against: eventual consistency (limits can be minutes to hours stale); about 1.5 weeks more build; credit data on the event bus.',
          ],
        },
        {
          heading: 'Open questions',
          body: [
            "What is our bureau rate limit? Sales said we're 'fine at our volume'.",
            'What should customers see if a decision is slow or fails?',
            'Any compliance constraints on pre-approval?',
          ],
        },
      ],
      comments: [
        {
          id: 'c-andrea-a',
          who: 'andrea',
          at: 'morning',
          quote: 'the bureau sits on the checkout hot path',
          text: "My whole objection in eight words. A third party with 3-second spikes, on our hottest path, on our busiest night. What happens when it's slow?",
        },
        {
          id: 'c-marcus-peak',
          who: 'marcus',
          at: 'morning',
          quote: 'Behaviour at peak: unknown.',
          text: "'Unknown' is doing a lot of work here. I'll bring last year's 11.11 numbers.",
        },
        {
          id: 'c-linh-creds',
          who: 'linh',
          at: 'morning',
          quote: 'credit-decision calls the credit bureau',
          text: 'Bureau credentials live in credit-decision only, please. Checkout should never hold them, or see raw bureau responses.',
        },
        {
          id: 'c-linh-bus',
          who: 'linh',
          at: 'morning',
          quote: 'credit-decision publishes a CreditProfileUpdated event',
          text: "If this event carries bureau data, that's sensitive personal data on a shared bus. It needs payload encryption, topic-level access control and a retention limit. Happy to help design it.",
        },
        {
          id: 'c-kavitha-consent',
          who: 'kavitha',
          at: 'beat',
          key: true,
          quote: 'Pre-approve active customers in the background',
          text: "Flagging before this goes further: pre-approval means running a credit check the customer didn't ask for. Our BNPL policy needs their explicit consent first. Consent screen + legal review ≈ 1 week. Happy to help.",
        },
      ],
    },
  ],

  calendar: [
    { time: '09:30', title: 'Kaya standup', meetingId: 'standup' },
    { time: '10:00', title: 'RFC-012 review · Credit decision at checkout', meetingId: 'arch-review' },
    { time: '12:30', title: 'Lunch · hawker centre near one-north (chicken rice, obviously)' },
    { time: '14:00', title: 'Kaya check-in · Rohan & Evelyn', meetingId: 'exec' },
    { time: '17:30', title: 'Wrap-up · decision record & team update' },
  ],

  meetings: [
    // ═════════════════════════════ 09:30 · Standup ═════════════════════════════
    {
      id: 'standup',
      title: 'Kaya standup',
      start: '09:30',
      minutes: 15,
      attendees: ['junhao', 'xinyi', 'marcus', 'nurul', 'linh', 'rizky'],
      agenda: ['Yesterday, today, blockers', 'Heads-up: RFC-012 review at 10:00'],
      script: {
        start: [
          { t: 'narrate', text: "09:30. Six tiles. Rizky's is a dark square with a juggler on it. Marcus is holding a kopi the size of a flower pot." },
          { t: 'say', who: 'junhao', text: 'Morning. Quick one today, RFC review at 10. Xin Yi, start us off?', mood: 'calm' },
          { t: 'say', who: 'xinyi', text: 'Regression run: 412 passed, 3 flaky. One has been flaky since before I joined. Refund edge cases today, no blockers.', mood: 'amused' },
          { t: 'react', who: 'marcus', emoji: '😂' },
          { t: 'say', who: 'marcus', text: "Load-test environment is up. I'm building a bureau stub so we stop hammering their sandbox. Also, I've started dreaming in dashboards.", mood: 'tired' },
          { t: 'say', who: 'nurul', text: 'Instalment picker copy is signed off. Marketing wanted a teaser banner; I said after launch. They only sulked a little.', mood: 'amused' },
          { t: 'say', who: 'linh', text: 'Repayment threat model is done. I left two comments on RFC-012. Please read them before 10, not during.', mood: 'calm' },
          { t: 'say', who: 'junhao', text: 'Noted. Rizky?' },
          { t: 'pause', ms: 1800 },
          { t: 'say', who: 'junhao', text: "Rizky, you're on mute.", mood: 'amused' },
          { t: 'narrate', text: "Rizky's tile flickers. Somewhere in Jakarta, a dog barks with real conviction." },
          { t: 'say', who: 'rizky', text: "Sorry, double mute. That's Mochi. She has opinions about the delivery guy.", mood: 'amused' },
          { t: 'react', who: 'nurul', emoji: '😂' },
          { t: 'say', who: 'rizky', text: 'Screens are on track. One blocker: the plans API gives me a different order on page 2. Sometimes the same plan shows up on both pages.', mood: 'worried' },
          { t: 'say', who: 'junhao', text: "Huh. Offset paging? What's the sort key?", mood: 'excited' },
          { t: 'say', who: 'rizky', text: 'created_at, I think. Let me share… can you see my screen?' },
          { t: 'narrate', text: "Ninety seconds of 'how about now?'. Xin Yi starts answering an email. Linh opens the RFC in another tab." },
          { t: 'say', who: 'junhao', text: 'Okay, so if two plans share a created_at, the database can return them in any order, and with offset paging —', mood: 'excited' },
          { t: 'say', who: 'rizky', text: 'But it works on staging!', mood: 'annoyed', overlap: true },
          { t: 'say', who: 'junhao', text: 'Staging has fifty rows, lah. Prod has —', overlap: true },
          {
            t: 'choice',
            id: 'standup-park',
            prompt: '09:42. Standup has turned into a two-person debugging session, and four people are waiting. You say:',
            timeout: 18,
            timeoutGoto: 'park-silent',
            timeoutInsight:
              "Silence let the rabbit hole run: two people left without giving updates, and Rizky still isn't unblocked. When a standup derails, interrupt kindly and park it with names and a time.",
            options: [
              {
                id: 'tl-fix',
                text: "Oh, I know this one: offset paging on a non-unique sort. Switch to keyset pagination with id as a tie-breaker. I fixed this exact bug at my last job, it's an hour's work.",
                grade: 'poor',
                insight:
                  "Even when you're right, solving it live makes you the bottleneck and keeps four people waiting. Your value isn't the fix; it's getting the right two people a room and a time, and giving everyone else their morning back.",
                effects: { morale: -3, clarity: -2, rel: { junhao: -4 }, flags: ['standup:tl-fix'] },
                goto: 'park-tlfix',
              },
              {
                id: 'ask-group',
                text: 'Should we keep going on this, or take it offline? What does everyone think?',
                grade: 'okay',
                insight:
                  'Asking the group invites politeness, not a decision: nobody wants to be the one who says stop. Propose the next step yourself (who, when, anyone else needed?), then check for objections.',
                effects: { clarity: 1, flags: ['standup:asked'] },
                goto: 'park-asked',
              },
              {
                id: 'park',
                text: "Jun Hao, Rizky: this needs you two, not all six of us. Can you take 15 minutes right after? I'll set up the call. Anyone else needed?",
                grade: 'best',
                insight:
                  "Standups surface blockers; they don't solve them. Park it with names, a time and a room, then ask who else is needed: that question often finds the hidden dependency. Everyone else gets their morning back.",
                effects: { morale: 3, clarity: 3, rel: { rizky: 3, junhao: 2, xinyi: 2 }, flags: ['standup:parked'] },
                goto: 'park-good',
              },
              {
                id: 'raid',
                text: "Let's log the pagination issue in the RAID log and review it at Friday's risk review.",
                grade: 'poor',
                insight:
                  "A blocker on the critical path needs an owner today, not a row in Friday's log. RAID logs track risks; they don't unblock people. Get the right people talking now, and record the outcome after.",
                effects: { morale: -2, clarity: -2, rel: { rizky: -4 }, flags: ['standup:raid'] },
                goto: 'park-raid',
              },
            ],
          },
        ],
        'park-good': [
          { t: 'say', who: 'junhao', text: 'Yeah, fair. Sorry, rabbit hole.', mood: 'amused' },
          { t: 'say', who: 'rizky', text: 'Thanks. Fifteen minutes is plenty.', mood: 'calm' },
          { t: 'say', who: 'xinyi', text: 'Can I join? If the ordering is broken, my pagination tests have been lying to me.', mood: 'worried' },
          { t: 'say', who: 'junhao', text: 'Good catch. Yes, join.', mood: 'calm' },
          { t: 'goto', to: 'close' },
        ],
        'park-asked': [
          { t: 'narrate', text: 'A polite pause. Nobody wants to be the one who says stop.' },
          { t: 'say', who: 'marcus', text: 'Offline, please. I have a 9:45.', mood: 'tired' },
          { t: 'say', who: 'junhao', text: 'Okay, okay. Rizky, ping me after?' },
          { t: 'say', who: 'rizky', text: 'After when?' },
          { t: 'say', who: 'junhao', text: '…After.', mood: 'tired' },
          { t: 'react', who: 'xinyi', emoji: '😬' },
          { t: 'goto', to: 'close' },
        ],
        'park-tlfix': [
          { t: 'narrate', text: 'A beat of silence.' },
          { t: 'say', who: 'junhao', text: "Er, yes. That's where I was going.", mood: 'annoyed' },
          { t: 'say', who: 'rizky', text: "Keyset? Doesn't that change the API contract for my screens?", mood: 'worried' },
          { t: 'say', who: 'junhao', text: 'Only if we… okay, no. Let me think about it properly. After standup.', mood: 'annoyed' },
          { t: 'narrate', text: 'It takes four more minutes to agree on what you meant.' },
          { t: 'leave', who: 'linh', text: 'Sorry, I need to prep for the review.' },
          { t: 'goto', to: 'close' },
        ],
        'park-raid': [
          { t: 'say', who: 'rizky', text: "Friday? I'm blocked today.", mood: 'annoyed' },
          { t: 'say', who: 'junhao', text: "Rizky, let's just jump on a call after this. I'll ping you.", mood: 'calm' },
          { t: 'narrate', text: 'Jun Hao parks it himself, with a name and a time. The RAID log remains blissfully unaware.' },
          { t: 'goto', to: 'close' },
        ],
        'park-silent': [
          { t: 'say', who: 'junhao', text: 'So if we add id to the ORDER BY —', mood: 'excited' },
          { t: 'say', who: 'rizky', text: 'Then my cache keys change —', overlap: true },
          { t: 'narrate', text: '09:47. The standup is now a pairing session with an audience.' },
          { t: 'leave', who: 'linh', text: 'Sorry, I need to prep for 10.' },
          { t: 'leave', who: 'xinyi', text: "Dropping. I'll post my update in Slack." },
          { t: 'effects', effects: { morale: -4, clarity: -3, flags: ['standup:dragged'] } },
          { t: 'say', who: 'marcus', text: 'Shall we… wrap up?', mood: 'tired' },
          { t: 'goto', to: 'close' },
        ],
        close: [
          { t: 'say', who: 'junhao', text: "Last thing. Andrea from Risk Platform is joining the 10. Please read RFC-012 first. It'll be… lively.", mood: 'calm' },
          { t: 'say', who: 'marcus', text: "'Lively' is what you called the last incident review.", mood: 'amused' },
          { t: 'react', who: 'nurul', emoji: '👀' },
          { t: 'if', when: { flags: ['standup:parked'] }, yes: 'end-parked', no: 'close-2' },
        ],
        'close-2': [{ t: 'if', when: { flags: ['standup:dragged'] }, yes: 'end-dragged', no: 'close-3' }],
        'close-3': [{ t: 'if', when: { flags: ['standup:tl-fix'] }, yes: 'end-tlfix', no: 'end-meh' }],
        'end-parked': [
          { t: 'end', outcome: 'Standup ends at 09:44. Pagination is parked with Jun Hao, Rizky and Xin Yi, and everyone else gets their morning back.' },
        ],
        'end-dragged': [
          { t: 'end', outcome: 'Standup ends at 09:49. Two people left without giving updates, and the pagination bug still has no owner or time.' },
        ],
        'end-tlfix': [
          { t: 'end', outcome: 'Standup ends late. You were technically right, and Jun Hao is now slightly less keen to bring you problems.' },
        ],
        'end-meh': [{ t: 'end', outcome: "Standup ends a few minutes late. Rizky's blocker gets handled, more or less, but not by you." }],
      },
    },

    // ═════════════════════ 10:00 · Architecture review (RFC-012) ═════════════════════
    {
      id: 'arch-review',
      title: 'RFC-012 review · Credit decision at checkout',
      start: '10:00',
      minutes: 45,
      attendees: ['junhao', 'andrea', 'marcus', 'nurul', 'linh'],
      agenda: [
        'Decide how checkout gets a credit decision',
        'Option A: synchronous bureau call',
        'Option B: async pre-approval',
        'Owners and next steps',
      ],
      deskBefore: ['an-hello'],
      script: {
        start: [
          { t: 'narrate', text: "10:00. Andrea's tile appears first. She has printed the RFC. It has annotations." },
          { t: 'share', who: 'junhao', app: 'doc', id: 'rfc-012' },
          { t: 'say', who: 'junhao', text: "Okay, let's start. Can everyone see my screen?", mood: 'calm' },
          { t: 'say', who: 'nurul', text: "Yes, but can you zoom in? I'm on my phone in a lift lobby.", mood: 'amused' },
          { t: 'say', who: 'junhao', text: 'Zooming. So: checkout needs a credit decision before it can offer Pay Later. The question is how.' },
          { t: 'if', when: { flags: ['prep:both-options'] }, yes: 'start-both', no: 'start-a' },
        ],
        'start-both': [
          { t: 'say', who: 'junhao', text: "Both options are in the doc side by side, with the criteria at the top. Our TPM's idea.", mood: 'amused' },
          { t: 'react', who: 'andrea', emoji: '👍' },
          { t: 'goto', to: 'pitch' },
        ],
        'start-a': [
          { t: 'say', who: 'junhao', text: "I'm proposing A. B is in the doc for completeness." },
          { t: 'say', who: 'andrea', text: "'For completeness.' Cool.", mood: 'annoyed' },
          { t: 'goto', to: 'pitch' },
        ],
        pitch: [
          { t: 'say', who: 'junhao', text: 'A: you tap Pay Later, checkout calls credit-decision, it calls the bureau. Real time, always fresh, three days of work left.', mood: 'calm' },
          { t: 'say', who: 'andrea', text: 'B: we pre-approve customers in the background, and checkout reads a cached limit. Five milliseconds. The bureau never touches checkout.', mood: 'calm' },
          { t: 'say', who: 'junhao', text: "Which costs a week and a half we don't have —", mood: 'annoyed', overlap: true },
          { t: 'say', who: 'andrea', text: '— which is cheaper than paging the whole company at midnight on 11.11 —', mood: 'annoyed', overlap: true },
          { t: 'say', who: 'junhao', text: '— and gives people limits that are hours stale —', mood: 'annoyed', overlap: true },
          { t: 'narrate', text: "They're both talking now. Linh writes something down. Marcus mouths 'wow' at his camera." },
          { t: 'say', who: 'nurul', text: "Can I just say: whatever we pick, the date doesn't move. It's on every MRT ad panel in the west.", mood: 'worried' },
          { t: 'say', who: 'marcus', text: 'And whatever we pick survives the midnight peak. Two years ago checkout fell over at 00:03. I was there.', mood: 'worried' },
          { t: 'say', who: 'nurul', text: "For what it's worth, the bureau's account team told us they're fine at our volume.", mood: 'calm' },
          { t: 'react', who: 'andrea', emoji: '👀' },
          {
            t: 'choice',
            id: 'arch-frame',
            prompt: 'Two strong engineers, two designs, three worried stakeholders, and no agreed way to decide. Forty minutes left. You say:',
            timeout: 20,
            timeoutGoto: 'frame-silent',
            timeoutInsight:
              'With nobody facilitating, the loudest engineer sets the agenda and the cross-talk eats the clock. Step in early: name the decision, the decider and the criteria, then time-box it.',
            options: [
              {
                id: 'side-b',
                text: 'Honestly, B is clearly the better architecture. Async decoupling is how every big platform survives a peak like this. Jun Hao, could your team find the extra week and a half if we cut something?',
                grade: 'poor',
                insight:
                  "The moment the facilitator takes a side, the meeting becomes a vote on you and the other engineer stops listening. Your tech-lead instincts are useful as questions, after the criteria are agreed. Run the decision; don't join it.",
                effects: { clarity: -3, rel: { junhao: -6, andrea: 3 }, flags: ['arch:sided-b'] },
                goto: 'frame-sided',
              },
              {
                id: 'frame',
                text: "Let's frame it: how does checkout get a credit decision? Jun Hao decides. Criteria: survives 11.11 peak, fits the latency budget, holds the date, passes Compliance. Decision by 10:40.",
                grade: 'best',
                insight:
                  "Name the decision, the decider and the criteria before anyone argues options, then time-box it. Agreed criteria turn 'my design vs yours' into 'which one clears the bar', so two strong engineers can both win.",
                effects: { clarity: 5, rel: { junhao: 3, andrea: 2, marcus: 2 }, flags: ['arch:framed'] },
                goto: 'frame-good',
              },
              {
                id: 'turns',
                text: "Let's give each option five uninterrupted minutes. Jun Hao first, then Andrea. Questions at the end.",
                grade: 'okay',
                insight:
                  'Turn-taking stops the cross-talk, which helps. But without agreed criteria and a named decider you get two good pitches and the same stalemate. Structure the decision, not just the airtime.',
                effects: { clarity: 1, morale: 1 },
                goto: 'frame-turns',
              },
              {
                id: 'vote',
                text: "Let's keep it fair and democratic: quick show of hands, A or B? Majority wins and we move on.",
                grade: 'poor',
                insight:
                  'Architecture is not a popularity contest. Votes split the team into winners and losers and hide the trade-offs. Agree the criteria, hear everyone, then let the accountable owner decide.',
                effects: { clarity: -2, morale: -2 },
                goto: 'frame-vote',
              },
            ],
          },
        ],
        'frame-good': [
          { t: 'say', who: 'junhao', text: "Fair. Yes, it's my call, and I'm happy to be held to those.", mood: 'calm' },
          { t: 'if', when: { flags: ['prep:backchannel'] }, yes: 'frame-backchannel', no: 'frame-good-2' },
        ],
        'frame-backchannel': [
          { t: 'say', who: 'andrea', text: 'Huh. I thought you were leaning B?', mood: 'amused' },
          { t: 'react', who: 'junhao', emoji: '👀' },
          { t: 'narrate', text: 'Jun Hao looks at your tile for a long second. Backchannels always surface.' },
          { t: 'effects', effects: { rel: { junhao: -4 } } },
          { t: 'goto', to: 'frame-good-2' },
        ],
        'frame-good-2': [
          { t: 'say', who: 'andrea', text: "Works for me. As long as 'survives peak' means a load test, not a feeling.", mood: 'calm' },
          { t: 'say', who: 'marcus', text: "Can we add 'not a feeling' to the RFC template?", mood: 'amused' },
          { t: 'react', who: 'nurul', emoji: '😂' },
          { t: 'goto', to: 'debate' },
        ],
        'frame-sided': [
          { t: 'say', who: 'andrea', text: 'Thank you.', mood: 'excited' },
          { t: 'say', who: 'junhao', text: "With respect, you haven't seen the estimate. B isn't a week and a half for my team. It's my team plus hers.", mood: 'annoyed' },
          { t: 'say', who: 'junhao', text: "And it's my service, and my pager.", mood: 'annoyed' },
          { t: 'say', who: 'nurul', text: 'So… are we deciding, or agreeing with the TPM?', mood: 'worried' },
          { t: 'react', who: 'marcus', emoji: '😬' },
          { t: 'goto', to: 'debate' },
        ],
        'frame-turns': [
          { t: 'say', who: 'junhao', text: 'Okay. A is boring on purpose: one call, a fresh answer, and my team knows the code.', mood: 'calm' },
          { t: 'say', who: 'andrea', text: 'B is boring on purpose too. Nothing slow sits between a customer and the pay button.', mood: 'calm' },
          { t: 'say', who: 'marcus', text: 'Two good pitches. So… how do we pick?', mood: 'worried' },
          { t: 'goto', to: 'debate' },
        ],
        'frame-vote': [
          { t: 'narrate', text: "Two hands for A, two for B. Linh abstains: 'I'm here for the threat model.'" },
          { t: 'say', who: 'junhao', text: 'Great. A tie. Very helpful.', mood: 'annoyed' },
          { t: 'say', who: 'andrea', text: 'Architecture by show of hands. Bold.', mood: 'amused' },
          { t: 'goto', to: 'debate' },
        ],
        'frame-silent': [
          { t: 'say', who: 'junhao', text: '— and the batch job needs its own on-call —', mood: 'annoyed', overlap: true },
          { t: 'say', who: 'andrea', text: "— and your sync call needs everyone's on-call —", mood: 'annoyed', overlap: true },
          { t: 'narrate', text: 'Two more minutes of this. Nurul checks the time twice.' },
          { t: 'say', who: 'marcus', text: 'Guys. Guys. Can somebody run this meeting?', mood: 'tired' },
          { t: 'narrate', text: 'Five faces turn to your tile.' },
          { t: 'effects', effects: { morale: -2, clarity: -3 } },
          { t: 'goto', to: 'debate' },
        ],
        debate: [
          { t: 'share', who: 'marcus', app: 'dash', id: 'dash-checkout-p99' },
          { t: 'say', who: 'marcus', text: "Here's my worry with A. Checkout p99 is already 1.4 seconds against a 1.5-second SLO, and bureau calls spike to three seconds.", mood: 'worried' },
          { t: 'say', who: 'junhao', text: 'We only call it when someone taps Pay Later. Not on every checkout.', mood: 'calm' },
          { t: 'say', who: 'marcus', text: "At midnight on 11.11, a lot of people tap Pay Later. That's literally the campaign." },
          { t: 'say', who: 'andrea', text: 'Which is why B. The bureau never sees checkout traffic. We pre-approve in the background, at whatever pace we like.', mood: 'excited' },
          { t: 'say', who: 'linh', text: "One thing on B: that event puts bureau data on a shared bus. Encrypted payloads, topic access control and a retention limit, or I can't sign it off.", mood: 'calm' },
          { t: 'say', who: 'andrea', text: "Fair. We can encrypt it and lock the topic down. It's work, but not hard." },
          { t: 'say', who: 'linh', text: "'Not hard' is a phrase I collect.", mood: 'amused' },
          { t: 'say', who: 'nurul', text: "And B means stale limits? Someone repays this morning and their limit doesn't go up till tomorrow?", mood: 'worried' },
          { t: 'say', who: 'andrea', text: 'Eventually consistent. Minutes, if we build it properly.', mood: 'calm' },
          { t: 'say', who: 'junhao', text: 'Minutes when it works. Hours when the consumers lag at peak.', mood: 'annoyed', overlap: true },
          { t: 'share', who: 'junhao', app: 'doc', id: 'rfc-012' },
          { t: 'say', who: 'junhao', text: "And the bureau says they're fine at our volume, so A holds up.", mood: 'calm' },
          { t: 'slack', id: 'hk-cap' },
          { t: 'narrate', text: 'Your Slack pings. A DM from Hakim in Partnerships.' },
          { t: 'slack', id: 'hk-cap-2' },
          { t: 'pause', ms: 2500 },
          { t: 'say', who: 'andrea', text: "Do we actually know that? 'Fine' from a sales team isn't a number.", mood: 'annoyed' },
          {
            t: 'choice',
            id: 'arch-facts',
            prompt: "'The bureau says they're fine' is about to become the foundation of the design. What do you bring?",
            timeout: 22,
            timeoutGoto: 'facts-silent',
            timeoutInsight:
              "Silence let a sales line become a design assumption, while Hakim's numbers sat in your Slack. When you hold a fact that changes the decision, say it before the decision, even if you have to interrupt.",
            options: [
              {
                id: 'ask-plain',
                text: "Before we lean on that: has anyone seen the bureau's actual rate limit? 'Fine at our volume' could mean per month.",
                grade: 'okay',
                insight:
                  'Right instinct: challenge the vendor claim. But a question without data is easy to park, and this one gets parked until after the decision. Bring the number, or get it before anyone decides.',
                effects: { clarity: 1 },
                goto: 'facts-later',
              },
              {
                id: 'assume',
                text: "I'm sure they've scaled for 11.11. Every bureau plans for peak season, and they've been doing this for years. Let's not get stuck on the vendor.",
                grade: 'poor',
                insight:
                  'Reassurance from the facilitator gets treated as fact. You just turned a sales line into a design assumption. When a claim could sink the launch, verify it: one message to the contract owner would have done it.',
                effects: { clarity: -4, rel: { andrea: -3, marcus: -3 } },
                goto: 'facts-assume',
              },
              {
                id: 'cap',
                text: 'Real numbers: Hakim says our bureau contract caps us at 50 calls a second, bursts to 80. Above that, 429s. Marcus, what did checkout peak at last 11.11?',
                grade: 'best',
                needs: ['read:hk-cap'],
                lockedHint: 'Check Slack: the person who owns the bureau contract just messaged you.',
                insight:
                  'This is the job: walk into the room with the facts. One hard number from the contract owner ends a debate opinions could not, and handing the peak to Marcus lets the room do the maths itself. Name your source.',
                effects: { clarity: 6, rel: { marcus: 3, andrea: 2, hakim: 3 }, flags: ['fact:bureau-cap', 'arch:cap-said', 'arch:cap-known'] },
                goto: 'facts-cap',
              },
              {
                id: 'peak',
                text: "Last 11.11, checkout peaked around 400 requests a second. Before we trust 'fine', has anyone checked the actual limit in our bureau contract?",
                grade: 'okay',
                needs: ['read:mc-peak'],
                lockedHint: "Marcus sent you last year's 11.11 numbers this morning.",
                insight:
                  "A number makes a question urgent: 400 a second turns 'has anyone checked?' into 'let's check now'. Better still is arriving with both halves of the sum. The contract owner was one DM away.",
                effects: { clarity: 3, rel: { marcus: 2 }, flags: ['arch:cap-known'] },
                goto: 'facts-ask',
              },
            ],
          },
        ],
        'facts-cap': [
          { t: 'narrate', text: 'The room goes quiet. Andrea puts her pen down.' },
          { t: 'say', who: 'marcus', text: 'About 400 a second, for the first five minutes.', mood: 'worried' },
          { t: 'say', who: 'marcus', text: "Even if only one in five of those taps Pay Later, that's 80 a second. Right at the burst ceiling, on a good night." },
          { t: 'say', who: 'junhao', text: "Okay. That kills plain A. Every call stuck waiting on the bureau ties up a checkout thread. That's how checkout hangs for everyone.", mood: 'worried' },
          { t: 'say', who: 'andrea', text: "And it's exactly why B exists.", mood: 'calm' },
          { t: 'say', who: 'nurul', text: 'Alamak. But they told us they were fine!', mood: 'annoyed' },
          { t: 'say', who: 'marcus', text: 'Sales said fine. The contract says fifty. The contract wins.' },
          { t: 'goto', to: 'converge' },
        ],
        'facts-ask': [
          { t: 'say', who: 'marcus', text: "I haven't. I assumed Partnerships had.", mood: 'worried' },
          { t: 'say', who: 'nurul', text: 'Hakim owns the contract. Messaging him now.' },
          { t: 'narrate', text: 'Ninety seconds of typing dots. Then Nurul reads it out.' },
          { t: 'say', who: 'nurul', text: "Fifty calls a second, bursts to 80. Above that, 429s. He says he DM'd you this already.", mood: 'amused' },
          { t: 'say', who: 'marcus', text: 'Against 400 at peak. Okay. Plain A is dead.', mood: 'worried' },
          { t: 'say', who: 'junhao', text: "…Yeah. Every call stuck waiting on the bureau ties up a checkout thread. That's how checkout hangs for everyone.", mood: 'worried' },
          { t: 'goto', to: 'converge' },
        ],
        'facts-later': [
          { t: 'say', who: 'marcus', text: 'Good question. No idea.' },
          { t: 'say', who: 'nurul', text: "I'll ask Hakim after the meeting." },
          { t: 'say', who: 'junhao', text: "Let's assume it's fine for now and keep moving.", mood: 'calm' },
          { t: 'react', who: 'andrea', emoji: '😬' },
          { t: 'goto', to: 'converge' },
        ],
        'facts-assume': [
          { t: 'say', who: 'junhao', text: "Right. So rate isn't the issue. A works, we just tune the timeout.", mood: 'excited' },
          { t: 'say', who: 'andrea', text: "That's a lot of weight on the word 'sure'.", mood: 'annoyed' },
          { t: 'say', who: 'marcus', text: 'My 1.4 seconds would like a word.', mood: 'annoyed' },
          { t: 'goto', to: 'converge' },
        ],
        'facts-silent': [
          { t: 'say', who: 'junhao', text: "Exactly. Nobody's said otherwise.", mood: 'calm' },
          { t: 'narrate', text: "Hakim's numbers sit in your Slack, unsaid." },
          { t: 'goto', to: 'converge' },
        ],
        converge: [
          { t: 'say', who: 'marcus', text: 'Can I float a middle option? Call it C. Sync like A, but the bureau call gets a hard 800-millisecond budget and a circuit breaker.', mood: 'calm' },
          { t: 'say', who: 'marcus', text: 'Plus a rate limiter, so we never send more than the contract allows. Timed out, tripped or over the limit: Pay Later just hides. Card still works.' },
          { t: 'say', who: 'andrea', text: "Eight hundred milliseconds is under their p95 on a bad day. You'll be hiding Pay Later a lot.", mood: 'worried' },
          { t: 'say', who: 'marcus', text: "On the bureau's bad days, yes. A bad day for the bureau shouldn't be a bad day for checkout." },
          { t: 'say', who: 'junhao', text: "That's A plus about two days of work. Worst case at midnight is no Pay Later, not no checkout.", mood: 'excited' },
          { t: 'say', who: 'nurul', text: "So at midnight, some customers won't even see Pay Later?", mood: 'worried' },
          { t: 'say', who: 'junhao', text: "Some won't. But all of them can still pay.", mood: 'calm' },
          { t: 'say', who: 'andrea', text: 'And B?', mood: 'worried' },
          { t: 'say', who: 'marcus', text: 'B becomes the fast-follow: pre-approve returning customers in the background, at a pace the bureau can take. Then most people never wait on it at all.' },
          { t: 'join', who: 'rizky' },
          { t: 'if', when: { flags: ['standup:parked'] }, yes: 'rizky-fixed', no: 'rizky-late' },
        ],
        'rizky-fixed': [
          { t: 'say', who: 'rizky', text: "Sorry I'm late. Pagination's fixed, by the way: id as a tie-breaker. Xin Yi found two more cases.", mood: 'amused' },
          { t: 'react', who: 'junhao', emoji: '🙏' },
          { t: 'goto', to: 'converge-2' },
        ],
        'rizky-late': [
          { t: 'say', who: 'rizky', text: "Sorry I'm late, still fighting pagination. What did I miss?", mood: 'tired' },
          { t: 'say', who: 'junhao', text: 'A whole new option. Keep up.', mood: 'amused' },
          { t: 'goto', to: 'converge-2' },
        ],
        'converge-2': [
          { t: 'say', who: 'rizky', text: 'If Pay Later can hide, drive it from a flag in the payment-sheet response, not a new app build. Store review before 11.11 is brutal.', mood: 'calm' },
          { t: 'say', who: 'junhao', text: 'Server-driven. Agreed.' },
          { t: 'say', who: 'linh', text: 'C also keeps bureau data off the event bus for launch. I like C.', mood: 'calm' },
          { t: 'comment', id: 'c-kavitha-consent' },
          { t: 'narrate', text: "On the shared RFC, a new comment bubble appears beside Option B. It's from Kavitha in Compliance." },
          { t: 'say', who: 'andrea', text: "I can live with a lot. I can't live with shipping the fragile thing first and the right thing never.", mood: 'annoyed' },
          { t: 'say', who: 'junhao', text: "And I can't live with missing 11.11.", mood: 'annoyed' },
          { t: 'narrate', text: '10:31. Everyone looks at the clock, and then at your tile.' },
          {
            t: 'choice',
            id: 'arch-converge',
            prompt: "An option is taking shape, but nobody has said 'decided'. Fourteen minutes left. You:",
            timeout: 22,
            timeoutGoto: 'conv-silent',
            timeoutInsight:
              "The decision was ripe and nobody picked it up. Meetings without a closer end in 'let's pick this up later'. When an option has formed, play it back and ask the decider to call it, before people start leaving.",
            options: [
              {
                id: 'synth',
                text: "Let me play back what I'm hearing: C for 11.11, with timeout, breaker, rate limiter and a server-driven fallback, and B as the fast-follow. Jun Hao, your call: does C meet the criteria?",
                grade: 'best',
                insight:
                  "Synthesis is a facilitator's superpower: play the emerging option back in plain words, test it against the criteria, then hand the call to the accountable owner. You make the decision easy without making it yours.",
                effects: { clarity: 5, rel: { junhao: 4, marcus: 3 } },
                goto: 'conv-synth',
              },
              {
                id: 'push-b',
                text: "I'll make the call: B, done properly. It's the right architecture for a peak like 11.11, and I'll get Rohan to find us the extra week and a half.",
                grade: 'poor',
                insight:
                  "It isn't your call, and it trades a public date for an architecture preference. Kavitha's new comment means B can't launch on 11.11 anyway. Facilitate the decider to a decision; don't overrule him.",
                effects: { clarity: -3, trust: -2, rel: { junhao: -6, nurul: -6, andrea: 3 }, flags: ['arch:pushed-b'] },
                goto: 'conv-b',
              },
              {
                id: 'consent',
                text: "Kavitha just commented: pre-approval needs explicit consent first, about a week for the screen and legal review. So B can't make 11.11 regardless. C now, B next. Jun Hao, your call?",
                grade: 'best',
                needs: ['read:c-kavitha-consent'],
                lockedHint: 'A new comment just landed on the RFC. Open the doc.',
                insight:
                  "New facts dissolve old arguments. Kavitha's comment turns 'A vs B' into 'C now, B once consent exists', which respects Andrea's design and gives Jun Hao what he needs. Bring the absent expert's voice into the room.",
                effects: { clarity: 6, rel: { junhao: 4, andrea: 3, kavitha: 3 }, flags: ['arch:consent-raised'] },
                goto: 'conv-consent',
              },
              {
                id: 'escalate',
                text: "This has date impact, so it's above our pay grade. Let's take both options to Rohan at 2pm and let him decide.",
                grade: 'okay',
                insight:
                  "Escalate trade-offs the team can't make: date versus scope, money, risk appetite. Which design to build is the tech lead's call. Sending it up costs a day and teaches the team that decisions live above them.",
                effects: { clarity: -1, rel: { junhao: -3 }, flags: ['arch:escalated'] },
                goto: 'conv-escalate',
              },
            ],
          },
        ],
        'conv-synth': [
          { t: 'say', who: 'junhao', text: 'Yes. It survives peak by design, fits the latency budget, holds the date, and adds nothing new for Compliance at launch.', mood: 'calm' },
          { t: 'say', who: 'junhao', text: 'My call: C for 11.11. B for returning customers as the fast-follow.' },
          { t: 'react', who: 'marcus', emoji: '🙏' },
          { t: 'say', who: 'andrea', text: "I'll be honest. I can live with C for launch. But 'fast-follow' is where good designs go to die.", mood: 'worried' },
          { t: 'goto', to: 'commit' },
        ],
        'conv-consent': [
          { t: 'narrate', text: 'Everyone opens the comment. Andrea reads it twice.' },
          { t: 'say', who: 'andrea', text: "Consent. Of course. So B can't launch on 11.11 whatever we build.", mood: 'tired' },
          { t: 'say', who: 'junhao', text: 'Then my call: C for 11.11, and B for returning customers once consent ships.', mood: 'calm' },
          { t: 'say', who: 'andrea', text: "Fine. But I've watched 'fast-follow' turn into 'never' before.", mood: 'worried' },
          { t: 'goto', to: 'commit' },
        ],
        commit: [
          {
            t: 'choice',
            id: 'arch-commit',
            prompt: "Jun Hao has made the call. Andrea is going along with it, grudgingly, and her worry is fair. You:",
            timeout: 18,
            timeoutGoto: 'commit-silent',
            timeoutInsight:
              "Silence after a decision leaves the dissenter to decide alone whether to commit. Andrea will build what she's asked to, but she won't champion it. Close the loop: acknowledge the worry and make 'later' real.",
            options: [
              {
                id: 'reopen',
                text: "Andrea, you might be right, and I'd hate to ship something we regret. Jun Hao, should we take another look and do B properly?",
                grade: 'poor',
                insight:
                  'Reopening a decision the moment someone objects undermines the decider in public and teaches the team that nothing is ever final. Address the worry inside the decision: an owner, a date, a recorded dissent.',
                effects: { clarity: -4, rel: { junhao: -6 } },
                goto: 'commit-reopen',
              },
              {
                id: 'commit',
                text: "Fair worry, so let's make 'later' real. B goes in the ADR as the fast-follow with a date, and you own its design. Can you disagree and commit to C for launch?",
                grade: 'best',
                insight:
                  "Disagree-and-commit only works if the disagreement is heard and 'later' is real. Record the dissent, give the dissenter ownership of the follow-up and put a date on it. You get commitment, not just compliance.",
                effects: { clarity: 3, morale: 3, rel: { andrea: 6, junhao: 2 }, flags: ['arch:committed'] },
                goto: 'commit-good',
              },
              {
                id: 'note',
                text: "Noted, Andrea. Let's capture your concern in the ADR and keep moving, we're tight on time.",
                grade: 'okay',
                insight:
                  "Recording dissent is good practice, but a note isn't a commitment. Without an owner and a date for the fast-follow, 'later' quietly becomes 'never', which is exactly what she's afraid of.",
                effects: { clarity: 1, rel: { andrea: -1 } },
                goto: 'commit-note',
              },
              {
                id: 'steamroll',
                text: "The decision's made, Andrea, and we're out of time. Let's not go round in circles; we can always revisit B after 11.11 if it really matters.",
                grade: 'poor',
                insight:
                  'Shutting dissent down buys five minutes and costs you the engineer who should own the fast-follow. People commit to decisions they helped shape: acknowledge the worry, then turn it into a commitment.',
                effects: { morale: -3, rel: { andrea: -8 } },
                goto: 'commit-steamroll',
              },
            ],
          },
        ],
        'commit-good': [
          { t: 'say', who: 'andrea', text: "Deal. I disagree and I commit. Put my concerns in the ADR, and I'll own the B design.", mood: 'calm' },
          { t: 'say', who: 'linh', text: "And I'll review the event encryption before B goes anywhere near the bus.", mood: 'calm' },
          { t: 'react', who: 'junhao', emoji: '👍' },
          { t: 'goto', to: 'close' },
        ],
        'commit-reopen': [
          { t: 'say', who: 'junhao', text: 'We literally just decided.', mood: 'annoyed' },
          { t: 'narrate', text: 'Five seconds of nobody saying anything.' },
          { t: 'say', who: 'junhao', text: "No. It's C. I'm not reopening it at 10:37.", mood: 'annoyed' },
          { t: 'say', who: 'andrea', text: '…Okay. C.', mood: 'tired' },
          { t: 'goto', to: 'close' },
        ],
        'commit-note': [
          { t: 'say', who: 'andrea', text: 'Sure. Noted.', mood: 'tired' },
          { t: 'goto', to: 'close' },
        ],
        'commit-steamroll': [
          { t: 'say', who: 'andrea', text: 'Got it.', mood: 'annoyed' },
          { t: 'narrate', text: "Andrea doesn't say another word for the rest of the meeting." },
          { t: 'goto', to: 'close' },
        ],
        'commit-silent': [
          { t: 'narrate', text: 'Nobody answers Andrea. Jun Hao scrolls to the next section.' },
          { t: 'say', who: 'andrea', text: 'Okay then.', mood: 'tired' },
          { t: 'goto', to: 'close' },
        ],
        close: [
          { t: 'narrate', text: '10:39. Six minutes left. Nurul is already walking to her next meeting, phone in hand.' },
          {
            t: 'choice',
            id: 'arch-close',
            prompt: 'Decision made. Six minutes left, and people are reaching for their laptops. How do you close?',
            timeout: 18,
            timeoutGoto: 'close-silent',
            timeoutInsight:
              'People left with five versions of the decision. The last two minutes of a meeting are the most valuable: read back the decision, owners and dates before anyone leaves.',
            options: [
              {
                id: 'notes',
                text: "Great discussion, everyone, really productive. I'll write up notes and send them round after this so we're all aligned.",
                grade: 'okay',
                insight:
                  "Notes help, but people leave with their own version of the meeting. Read back the decision, owners and dates while everyone is still in the room: that's when misunderstandings are cheap to fix.",
                effects: { clarity: 1 },
                goto: 'close-notes',
              },
              {
                id: 'recap',
                text: 'Recap: C now, B as the fast-follow. Jun Hao: ADR by Thursday. Marcus: load-test the fallback against a bureau stub at peak, Friday. Linh: event encryption review. Me: date impact to Rohan at 2.',
                grade: 'best',
                insight:
                  "A decision isn't made until it has owners and dates. A 30-second readback catches misunderstandings while everyone's still in the room, and tells the team exactly what you'll say upstairs at 2pm.",
                effects: { clarity: 6, trust: 2, rel: { junhao: 2, marcus: 2, linh: 2 }, flags: ['arch:recap'] },
                goto: 'close-recap',
              },
              {
                id: 'see',
                text: "Cool. Let's build it and see how it goes.",
                grade: 'poor',
                insight:
                  "'See how it goes' is how decisions dissolve. Without owners and dates, the load test happens on launch eve and nobody briefs the sponsor. Every decision leaves the room with who, what and by when.",
                effects: { clarity: -4 },
                goto: 'close-see',
              },
            ],
          },
        ],
        'close-recap': [
          { t: 'say', who: 'junhao', text: 'Correct. ADR by Thursday.', mood: 'calm' },
          { t: 'say', who: 'marcus', text: "Friday. I'll make the stub throw 429s and three-second spikes, just to be mean.", mood: 'amused' },
          { t: 'say', who: 'linh', text: 'Encryption review is on my list.', mood: 'calm' },
          { t: 'say', who: 'nurul', text: "And I'll tell Marketing what 'Pay Later hides' means before they hear it from someone else.", mood: 'calm' },
          { t: 'effects', effects: { flags: ['decision:c'] } },
          { t: 'end', outcome: 'Decided: C for 11.11, with B as the fast-follow. Owners and dates read back in the room, and you have a clean story for Rohan at 2.' },
        ],
        'close-notes': [
          { t: 'say', who: 'junhao', text: 'Cool. Thanks all.', mood: 'calm' },
          { t: 'narrate', text: "Five people leave with five slightly different versions of who's doing what." },
          { t: 'effects', effects: { flags: ['decision:c'] } },
          { t: 'end', outcome: "Decided: C for 11.11. Owners and dates live in people's heads until your notes go out." },
        ],
        'close-see': [
          { t: 'say', who: 'marcus', text: "…Who's running the load test?", mood: 'worried' },
          { t: 'narrate', text: 'Nobody answers. Everyone has already left in their heads.' },
          { t: 'effects', effects: { flags: ['decision:c'] } },
          { t: 'end', outcome: 'Decided: C, technically. No owners, no dates, and Marcus is now worried in a whole new way.' },
        ],
        'close-silent': [
          { t: 'say', who: 'nurul', text: 'Sorry, I have to run.', mood: 'tired' },
          { t: 'leave', who: 'nurul' },
          { t: 'say', who: 'junhao', text: "Okay, I guess we're done. I'll… write something up?", mood: 'tired' },
          { t: 'effects', effects: { flags: ['decision:c'] } },
          { t: 'end', outcome: "Decided: C. Nobody read back owners or dates, and Nurul left before hearing what 'Pay Later hides' means for Marketing." },
        ],
        'conv-b': [
          { t: 'narrate', text: 'Jun Hao exhales slowly.' },
          { t: 'say', who: 'junhao', text: "It's my call, not yours. But if you're taking the date to Rohan, I won't fight you. B.", mood: 'annoyed' },
          { t: 'say', who: 'andrea', text: 'Finally.', mood: 'excited' },
          { t: 'say', who: 'nurul', text: "Wait. Who's telling Marketing the billboards are wrong?", mood: 'worried' },
          { t: 'react', who: 'marcus', emoji: '😬' },
          { t: 'say', who: 'linh', text: "Also, has anyone read Kavitha's new comment? B needs a consent screen before we pre-approve anyone. That's another week.", mood: 'calm' },
          { t: 'narrate', text: 'Every head turns to your tile.' },
          { t: 'effects', effects: { flags: ['decision:b'] } },
          { t: 'end', outcome: 'Decided: B, under pressure from you. It needs ~1.5 more weeks plus a consent screen, and 11.11 is on billboards. Your 2pm with Rohan just got a lot harder.' },
        ],
        'conv-escalate': [
          { t: 'say', who: 'junhao', text: "Rohan? He'll just ask us what we recommend.", mood: 'annoyed' },
          { t: 'say', who: 'andrea', text: 'And then pick whatever ships on 11.11.' },
          { t: 'say', who: 'marcus', text: 'Which is… probably C?', mood: 'amused' },
          { t: 'say', who: 'junhao', text: "Fine. Take it to him. I'll write up the options by one.", mood: 'tired' },
          { t: 'effects', effects: { flags: ['decision:none'] } },
          { t: 'end', outcome: "No decision. A design call the team could have made is now on a VP's desk at 2pm, and the team is mildly insulted." },
        ],
        'conv-silent': [
          { t: 'narrate', text: 'Nobody closes it. Andrea and Jun Hao start a second lap of the same argument.' },
          { t: 'say', who: 'nurul', text: 'Sorry, I have to drop at 10:45.', mood: 'worried' },
          { t: 'if', when: { flags: ['arch:cap-known'] }, yes: 'silent-known', no: 'silent-a' },
        ],
        'silent-a': [
          { t: 'say', who: 'junhao', text: "Okay. We're out of time, and it's my call: A, with a timeout. We ship on date.", mood: 'tired' },
          { t: 'say', who: 'andrea', text: "Noted. I'll put my objection in the doc. In bold.", mood: 'annoyed' },
          { t: 'say', who: 'marcus', text: "And I'll put mine in the incident channel. On 11.11.", mood: 'annoyed' },
          { t: 'effects', effects: { flags: ['decision:a'] } },
          { t: 'end', outcome: "Decided by default: plain A with a timeout. Nobody has checked the bureau's limits, and Marcus is already drafting a pre-mortem." },
        ],
        'silent-known': [
          { t: 'say', who: 'junhao', text: "I need to think about C properly. Let's pick it up next week.", mood: 'tired' },
          {
            t: 'choice',
            id: 'arch-undecided',
            prompt: "Jun Hao wants to 'pick it up next week'. Launch is seven working days away. You:",
            timeout: 15,
            timeoutGoto: 'und-silent',
            timeoutInsight:
              'The meeting ended without a decision or a date. On a fixed-date launch, every undecided day comes straight out of the buffer.',
            options: [
              {
                id: 'dated',
                text: "Next week is too late. Jun Hao, can you decide by 10 tomorrow? I'll get Hakim's limits in writing, Marcus sizes C today, and I'll brief Rohan at 2.",
                grade: 'best',
                insight:
                  "An undecided meeting can still end well: name what's missing, who gets it, and when the decision happens. 'By 10 tomorrow' protects the date; 'next week' quietly spends it.",
                effects: { clarity: 4, rel: { junhao: 2 }, flags: ['arch:dated-followup'] },
                goto: 'und-dated',
              },
              {
                id: 'nextweek',
                text: "Sure. Let's take it offline and reconvene next week, once everyone's had time to think it through properly. Better a good decision than a fast one.",
                grade: 'poor',
                insight:
                  "'Reconvene next week' on a seven-day runway is a decision to lose a week. Most of the information is already in the room. Name what's missing, assign it, and set a decision time in hours, not weeks.",
                effects: { clarity: -4, trust: -2 },
                goto: 'und-nextweek',
              },
              {
                id: 'notes',
                text: "Okay. I'll send notes and find a slot for a follow-up.",
                grade: 'okay',
                insight:
                  "Notes and a follow-up beat nothing, but 'find a slot' has no date and no decider. Leave with a deadline: who decides, by when, with what inputs.",
                goto: 'und-notes',
              },
            ],
          },
        ],
        'und-dated': [
          { t: 'say', who: 'junhao', text: "…Yeah, okay. Ten tomorrow. I'll decide.", mood: 'tired' },
          { t: 'say', who: 'marcus', text: 'C sized by tonight.', mood: 'calm' },
          { t: 'effects', effects: { flags: ['decision:none'] } },
          { t: 'end', outcome: 'No decision yet, but a deadline: Jun Hao decides by 10:00 tomorrow, with the bureau limits in writing and C sized.' },
        ],
        'und-nextweek': [
          { t: 'narrate', text: 'Everyone nods, relieved. Next week is five working days before launch.' },
          { t: 'effects', effects: { flags: ['decision:none'] } },
          { t: 'end', outcome: "No decision and no date. 'Next week' is five working days before launch." },
        ],
        'und-notes': [
          { t: 'say', who: 'junhao', text: 'Sure.', mood: 'tired' },
          { t: 'effects', effects: { flags: ['decision:none'] } },
          { t: 'end', outcome: 'No decision. Notes will go out; the follow-up has no date and no decider.' },
        ],
        'und-silent': [
          { t: 'narrate', text: 'People drop off one by one.' },
          { t: 'effects', effects: { flags: ['decision:none'] } },
          { t: 'end', outcome: "No decision. The meeting didn't end so much as evaporate." },
        ],
      },
    },

    // ═════════════════════════ 14:00 · Exec check-in ═════════════════════════
    {
      id: 'exec',
      title: 'Kaya check-in · Rohan & Evelyn',
      start: '14:00',
      minutes: 20,
      attendees: ['rohan', 'evelyn'],
      agenda: ['Are we still on track for 11.11?', 'Decisions and asks'],
      deskBefore: ['ev-crisp', 'hk-later'],
      script: {
        start: [
          { t: 'narrate', text: "14:00. Rohan's tile: glass office, three monitors, half a sandwich. Evelyn joins from a meeting pod, kopi in hand." },
          { t: 'say', who: 'rohan', text: 'Hi both. I have twenty minutes, then board prep.', mood: 'calm' },
          { t: 'say', who: 'rohan', text: 'Are we still good for 11.11? I saw a very long thread.', mood: 'worried' },
          { t: 'react', who: 'evelyn', emoji: '👀' },
          { t: 'if', when: { flags: ['decision:c'] }, yes: 'c-status', no: 'u-route' },
        ],
        'c-status': [
          {
            t: 'choice',
            id: 'exec-status-c',
            prompt: 'Rohan wants the answer in the first line. The team chose C this morning, and it costs about two days. You say:',
            timeout: 20,
            timeoutGoto: 'c-silent',
            timeoutInsight:
              'Rohan asked a yes-or-no question and got silence, so Evelyn answered for you. With executives, lead with the answer in the first sentence: colour, decision, cost, ask.',
            options: [
              {
                id: 'green',
                text: "All green! The team aligned on a design this morning, everyone's committed, and we're tracking nicely to 11.11. Nothing for you to worry about.",
                grade: 'poor',
                insight:
                  "That's a watermelon: green outside, two days of red inside. Rohan will find out when the buffer's gone, and then stop believing your greens. Report the cost while it's small and you still have options.",
                effects: { trust: -6, rel: { evelyn: -4 }, flags: ['exec:watermelon'] },
                goto: 'c-green',
              },
              {
                id: 'red',
                text: 'Red. The design change cost us two days and our buffer is gone.',
                grade: 'okay',
                insight:
                  "Honest, but over-cooked. Red means 'we will miss without help', and you have a plan that holds the date. Crying red spends exec attention you'll need later. Amber with a mitigation is the accurate call.",
                effects: { trust: -1 },
                goto: 'c-red',
              },
              {
                id: 'vague',
                text: "Mostly fine. There was a design debate, but it's sorted now.",
                grade: 'okay',
                insight:
                  "Not wrong, but Rohan can't act on 'mostly fine'. Executive status is colour, decision, cost and ask. Give him the number before he has to dig for it.",
                effects: { trust: -1 },
                goto: 'c-vague',
              },
              {
                id: 'amber',
                text: "Amber, under control. Jun Hao chose sync with a timeout and a fallback. It costs about two days, which uses our buffer. Marcus load-tests it Friday; you'll know by Monday if it slips.",
                grade: 'best',
                insight:
                  "Colour, decision, cost, mitigation, and when he'll hear next, in two breaths. Amber with a plan isn't bad news; it's evidence you're in control. Executives forgive cost. They don't forgive surprise.",
                effects: { trust: 6, rel: { rohan: 4, evelyn: 4 }, flags: ['exec:honest'] },
                goto: 'c-amber',
              },
            ],
          },
        ],
        'c-amber': [
          { t: 'say', who: 'rohan', text: 'Two days. Okay.', mood: 'calm' },
          { t: 'react', who: 'evelyn', emoji: '👍' },
          { t: 'goto', to: 'push' },
        ],
        'c-green': [
          { t: 'say', who: 'rohan', text: 'Great.', mood: 'calm' },
          { t: 'say', who: 'evelyn', text: "Didn't the RFC add work? Jun Hao's note said about two days.", mood: 'worried' },
          { t: 'narrate', text: 'Rohan looks up from his sandwich.' },
          { t: 'say', who: 'rohan', text: "So it's not green.", mood: 'annoyed' },
          { t: 'goto', to: 'push' },
        ],
        'c-red': [
          { t: 'say', who: 'rohan', text: 'Red? What do you need from me to make it not red?', mood: 'worried' },
          { t: 'narrate', text: "You realise you don't actually need anything to hold the date." },
          { t: 'say', who: 'rohan', text: "Then it isn't red.", mood: 'annoyed' },
          { t: 'goto', to: 'push' },
        ],
        'c-vague': [
          { t: 'say', who: 'rohan', text: 'Sorted how? What did it cost?', mood: 'annoyed' },
          { t: 'say', who: 'evelyn', text: "About two days, I think. They're adding a fallback.", mood: 'calm' },
          { t: 'goto', to: 'push' },
        ],
        'c-silent': [
          { t: 'say', who: 'evelyn', text: "Amber, I'd say. The team picked a safer design this morning; it costs a couple of days.", mood: 'calm' },
          { t: 'say', who: 'rohan', text: 'Thanks, Evelyn.' },
          { t: 'narrate', text: "Rohan's eyes stay on your tile a beat longer than is comfortable." },
          { t: 'effects', effects: { trust: -3 } },
          { t: 'goto', to: 'push' },
        ],
        'u-route': [{ t: 'if', when: { flags: ['arch:escalated'] }, yes: 'u-escalated', no: 'u-route-2' }],
        'u-route-2': [{ t: 'if', when: { flags: ['arch:pushed-b'] }, yes: 'u-pushed', no: 'u-status' }],
        'u-escalated': [
          { t: 'say', who: 'rohan', text: "Also, Jun Hao's note says you want me to pick the architecture?", mood: 'worried' },
          { t: 'say', who: 'rohan', text: "I'm not choosing between two designs I haven't read. What does Jun Hao recommend?", mood: 'annoyed' },
          { t: 'say', who: 'evelyn', text: "Let's start with where we are.", mood: 'calm' },
          { t: 'goto', to: 'u-status' },
        ],
        'u-pushed': [
          { t: 'say', who: 'rohan', text: "Also, I hear you've promised the team an extra week and a half. From me?", mood: 'annoyed' },
          { t: 'say', who: 'evelyn', text: "Let's start with where we are.", mood: 'worried' },
          { t: 'goto', to: 'u-status' },
        ],
        'u-status': [
          {
            t: 'choice',
            id: 'exec-status-u',
            prompt: "The credit-decision design isn't settled in a way you'd bet 11.11 on. Rohan wants the answer in the first line. You say:",
            timeout: 20,
            timeoutGoto: 'u-silent',
            timeoutInsight:
              "Silence in front of a VP reads as 'it's worse than they're saying'. When you don't have the answer yet, say so, and say when you will.",
            options: [
              {
                id: 'amber-plan',
                text: "Amber. The credit-decision design isn't settled in a way I'd bet 11.11 on yet. Jun Hao makes the call by 10 tomorrow, with the bureau's limits in writing. You'll hear from me by noon.",
                grade: 'best',
                insight:
                  "When you don't have the answer, give the date you will. Honest amber plus a dated decision plan is credible: it shows what's missing, who decides and when you'll report back.",
                effects: { trust: 5, clarity: 3, rel: { rohan: 3, evelyn: 4 }, flags: ['exec:honest', 'arch:dated-followup'] },
                goto: 'u-amber',
              },
              {
                id: 'green',
                text: "All green. There's a healthy design debate going on, which is normal at this stage, but nothing that threatens the date.",
                grade: 'poor',
                insight:
                  "A watermelon: green outside, red inside. You don't know it won't threaten the date, and Rohan will remember who said green. Report what you know, what you don't, and when you'll know.",
                effects: { trust: -6, rel: { evelyn: -4 }, flags: ['exec:watermelon'] },
                goto: 'u-green',
              },
              {
                id: 'debating',
                text: "Engineering is still debating the design. I'll keep you posted.",
                grade: 'okay',
                insight:
                  "True, but it leaves Rohan nothing to plan around. 'Still debating' needs a decider and a deadline, or it sounds like drift. Give the colour and a date.",
                effects: { trust: -2 },
                goto: 'u-debating',
              },
            ],
          },
        ],
        'u-amber': [
          { t: 'say', who: 'rohan', text: "Okay. Why isn't it settled? It's one call at checkout.", mood: 'worried' },
          { t: 'goto', to: 'push' },
        ],
        'u-green': [
          { t: 'say', who: 'evelyn', text: "Is that right? Jun Hao's message said nothing's final.", mood: 'worried' },
          { t: 'say', who: 'rohan', text: "Then it isn't green.", mood: 'annoyed' },
          { t: 'goto', to: 'push' },
        ],
        'u-debating': [
          { t: 'say', who: 'rohan', text: 'Debating until when?', mood: 'annoyed' },
          { t: 'say', who: 'evelyn', text: "Let's get a date on that before we leave this call.", mood: 'calm' },
          { t: 'goto', to: 'push' },
        ],
        'u-silent': [
          { t: 'say', who: 'evelyn', text: "Honestly, I'd call it amber. The design isn't settled.", mood: 'calm' },
          { t: 'effects', effects: { trust: -3 } },
          { t: 'goto', to: 'push' },
        ],
        push: [
          { t: 'say', who: 'rohan', text: "Honest question. Can't we just ship the simple sync version and fix it after 11.11?", mood: 'calm' },
          {
            t: 'choice',
            id: 'exec-push',
            prompt: "Rohan wants the simplest thing that ships. You know why it won't survive midnight. You say:",
            timeout: 20,
            timeoutGoto: 'push-silent',
            timeoutInsight:
              "Rohan's 'can't we just' went unanswered, which sounds like yes. When an exec proposes the shortcut, answer with the consequence in business terms, in one breath.",
            options: [
              {
                id: 'sure',
                text: "Sure, we'll make it work. I'll ask Jun Hao to keep it simple for launch, and we can harden it in the weeks after 11.11.",
                grade: 'poor',
                insight:
                  "Agreeing to keep the meeting short commits the team to a design that fails at peak, and Rohan will remember 'the TPM said yes'. Your job upward is to translate engineering constraints into business consequences.",
                effects: { trust: -4, rel: { junhao: -5 }, flags: ['exec:caved'] },
                goto: 'push-sure',
              },
              {
                id: 'cap',
                text: 'Our bureau contract caps us at 50 calls a second, and the 11.11 midnight peak blows straight through that. Plain sync means checkout hangs for everyone, not just Pay Later. The fallback is how we ship on date.',
                grade: 'best',
                needs: ['read:hk-cap'],
                lockedHint: "Hakim's DMs have the bureau contract numbers.",
                insight:
                  "Translate constraints into consequences an exec cares about: not '429s' but 'checkout hangs for everyone at midnight'. A hard number from a contract ends 'can't we just', and frames the fallback as what protects the date.",
                effects: { trust: 6, rel: { rohan: 4 }, flags: ['fact:bureau-cap', 'exec:cap-explained'] },
                goto: 'push-cap',
              },
              {
                id: 'latency',
                text: 'Checkout p99 is already 1.4 seconds against a 1.5-second limit, and bureau calls spike to 3 seconds. A plain sync call pushes checkout over the line on the biggest night of the year.',
                grade: 'okay',
                needs: ['read:dash-checkout-p99'],
                lockedHint: 'The checkout latency dashboard has the numbers.',
                insight:
                  "Good data, and it lands. But latency invites 'so tune it'. The bureau's contract cap is a constraint nobody can tune before 11.11. Lead with the fact that ends the argument.",
                effects: { trust: 3, rel: { rohan: 2 } },
                goto: 'push-latency',
              },
              {
                id: 'eng',
                text: "Engineering says no. They've looked at it.",
                grade: 'okay',
                insight:
                  "Hiding behind 'engineering says' makes you a messenger, and invites Rohan to go around you to Jun Hao. Own the reasoning: one sentence on what breaks, one on what the fallback buys.",
                effects: { trust: -1 },
                goto: 'push-eng',
              },
            ],
          },
        ],
        'push-cap': [
          { t: 'say', who: 'rohan', text: "Fifty a second. On 11.11. Okay, that's not a tuning problem.", mood: 'worried' },
          { t: 'if', when: { flags: ['decision:c'] }, yes: 'push-cap-c', no: 'push-cap-u' },
        ],
        'push-cap-c': [
          { t: 'say', who: 'rohan', text: 'Fine. Fallback it is. Good catch.', mood: 'calm' },
          { t: 'goto', to: 'ask' },
        ],
        'push-cap-u': [
          { t: 'say', who: 'rohan', text: 'Then make sure Jun Hao has that number before anything gets built.', mood: 'calm' },
          { t: 'goto', to: 'ask' },
        ],
        'push-latency': [
          { t: 'say', who: 'rohan', text: 'So add a timeout. Problem solved?', mood: 'calm' },
          { t: 'narrate', text: "Which is, more or less, the fallback. You've argued for it the long way round." },
          { t: 'goto', to: 'ask' },
        ],
        'push-sure': [
          { t: 'say', who: 'rohan', text: "Good. That's what I like to hear.", mood: 'excited' },
          { t: 'say', who: 'evelyn', text: "Let's check with Jun Hao before we promise that.", mood: 'worried' },
          { t: 'goto', to: 'ask' },
        ],
        'push-eng': [
          { t: 'say', who: 'rohan', text: 'Engineering says no to a lot of things. Why, specifically?', mood: 'annoyed' },
          { t: 'say', who: 'evelyn', text: "I'll get Jun Hao to send you the one-line reason.", mood: 'calm' },
          { t: 'goto', to: 'ask' },
        ],
        'push-silent': [
          { t: 'say', who: 'rohan', text: "I'll take that as a yes.", mood: 'calm' },
          { t: 'say', who: 'evelyn', text: "Let's not, yet. I'll get the engineering view in writing.", mood: 'worried' },
          { t: 'effects', effects: { trust: -3 } },
          { t: 'goto', to: 'ask' },
        ],
        ask: [
          { t: 'say', who: 'evelyn', text: 'What do you need from us?', mood: 'calm' },
          {
            t: 'choice',
            id: 'exec-ask',
            prompt: 'Evelyn asks the best question an exec can ask. You say:',
            timeout: 18,
            timeoutGoto: 'ask-silent',
            timeoutInsight:
              'Two senior people offered help and got silence. Walk into every exec conversation with one specific ask: the decision only they can make.',
            options: [
              {
                id: 'nothing',
                text: "Nothing, we're fine! The team has it under control.",
                grade: 'poor',
                insight:
                  "'We're fine' wastes the moment when two senior people are offering help. Have one specific ask ready for every exec conversation, even when things are going well.",
                effects: { trust: -2, rel: { evelyn: -3 } },
                goto: 'ask-nothing',
              },
              {
                id: 'engineers',
                text: "More engineers would really help. Even two or three people from another squad for the next two weeks would take a lot of pressure off Jun Hao's team.",
                grade: 'okay',
                insight:
                  'Generic headcount asks rarely land, and new people seven days from launch slow a team down. Ask for the decision only they can make, or a named person for a named job.',
                effects: { trust: -1 },
                goto: 'ask-engineers',
              },
              {
                id: 'fallback',
                text: 'One decision: approve the fallback. If credit decisions are slow at peak, Pay Later hides and card checkout carries on. Marketing should hear that from you.',
                grade: 'best',
                insight:
                  "The best ask is a decision only they can make, framed so they can say yes on the spot. 'Pay Later may hide at peak' is a business trade-off: get the sponsor to approve it before 11.11, not explain it after.",
                effects: { trust: 5, clarity: 3, rel: { rohan: 3, nurul: 2 }, flags: ['exec:fallback-approved'] },
                goto: 'ask-fallback',
              },
              {
                id: 'date',
                text: 'Could you ask Marketing to push launch back a week? It would take the pressure off everyone and give us room to do this properly.',
                grade: 'poor',
                insight:
                  "The date is on billboards and in the CEO's slides. Asking to move it before exhausting design and scope options burns credibility. Move dates last, with data, after scope and design.",
                effects: { trust: -5, rel: { rohan: -4 } },
                goto: 'ask-date',
              },
            ],
          },
        ],
        'ask-fallback': [
          { t: 'say', who: 'rohan', text: "Pay Later hides if it's slow, and card still works? Approved. I'll tell Marketing myself.", mood: 'calm' },
          { t: 'say', who: 'evelyn', text: 'Good. Put it in the ADR, and send me the one-liner for my staff meeting.', mood: 'calm' },
          { t: 'goto', to: 'finish' },
        ],
        'ask-engineers': [
          { t: 'say', who: 'rohan', text: 'Seven working days before launch? Who would you even onboard?', mood: 'annoyed' },
          { t: 'goto', to: 'finish' },
        ],
        'ask-nothing': [
          { t: 'say', who: 'evelyn', text: 'Okay.', mood: 'calm' },
          { t: 'narrate', text: "Evelyn writes something down. You suspect it says 'coach: asks'." },
          { t: 'goto', to: 'finish' },
        ],
        'ask-date': [
          { t: 'say', who: 'rohan', text: "The date is in the CEO's slides. Bring me options that don't move it.", mood: 'annoyed' },
          { t: 'goto', to: 'finish' },
        ],
        'ask-silent': [
          { t: 'say', who: 'evelyn', text: 'Think about it and message me.', mood: 'calm' },
          { t: 'goto', to: 'finish' },
        ],
        finish: [{ t: 'if', when: { flags: ['arch:cap-said'] }, yes: 'finish-cap', no: 'finish-2' }],
        'finish-cap': [
          { t: 'say', who: 'evelyn', text: "By the way, Jun Hao said you brought the bureau numbers to the review. That's the job.", mood: 'amused' },
          { t: 'goto', to: 'finish-2' },
        ],
        'finish-2': [
          { t: 'say', who: 'rohan', text: 'Right. Board prep. Thanks, both.', mood: 'calm' },
          { t: 'leave', who: 'rohan' },
          { t: 'if', when: { flags: ['exec:honest', 'exec:fallback-approved'] }, yes: 'end-great', no: 'finish-3' },
        ],
        'finish-3': [{ t: 'if', when: { flags: ['exec:watermelon'] }, yes: 'end-watermelon', no: 'finish-4' }],
        'finish-4': [{ t: 'if', when: { flags: ['exec:honest'] }, yes: 'end-honest', no: 'end-meh' }],
        'end-great': [
          { t: 'end', outcome: 'Honest amber and an approved fallback. Rohan leaves for board prep with a story he can repeat, and Evelyn sends you a 👍.' },
        ],
        'end-watermelon': [
          { t: 'end', outcome: "You said green. Evelyn has already messaged Jun Hao for the real picture, and she'll want a word." },
        ],
        'end-honest': [{ t: 'end', outcome: 'An honest status, but Rohan left without making the one decision only he could make.' }],
        'end-meh': [
          { t: 'end', outcome: 'Rohan got an answer, just not a crisp one. Evelyn books 30 minutes on Friday to talk about exec updates.' },
        ],
      },
    },
  ],

  wrapUp: {
    title: 'ADR-007 · Credit decision at checkout',
    intro:
      '17:30. The floor is emptying and someone is microwaving durian puffs. Before you log off, write the decision record, then tell the team. Record what actually happened, not what you wish had happened.',
    fields: [
      {
        id: 'decision',
        label: 'Decision',
        help: 'What did the team actually decide today?',
        options: [
          {
            id: 'a',
            text: 'A · Synchronous bureau call at checkout, with a timeout',
            correctWhen: { flags: ['decision:a'] },
            why: "Accurate if Jun Hao called A as the clock ran out. Write it down honestly, including that the bureau's limits were never checked: the record is where tomorrow's revisit starts.",
          },
          {
            id: 'b',
            text: 'B · Async pre-approval; checkout reads a cached limit',
            correctWhen: { flags: ['decision:b'] },
            why: "Accurate if B was chosen under pressure. Record the date impact and Kavitha's consent dependency, so Rohan sees the real trade-off.",
          },
          {
            id: 'c',
            text: 'C · Sync with an 800ms timeout, circuit breaker and rate limiter; Pay Later hides when slow. B for returning customers as a fast-follow, after consent',
            correctWhen: { flags: ['decision:c'] },
            why: "Accurate if Jun Hao called C. Record the fast-follow explicitly: an ADR that says 'B later' with an owner and a date is how 'later' stays real.",
          },
          {
            id: 'none',
            text: 'No decision yet; follow-up set',
            correctWhen: { flags: ['decision:none'] },
            why: "Accurate if the review ended without a call. 'Not decided yet' is a legitimate record, as long as it says who decides and by when.",
          },
        ],
      },
      {
        id: 'decider',
        label: 'Decider',
        help: 'Who owns this call?',
        options: [
          {
            id: 'junhao',
            text: 'Jun Hao · Tech Lead, Payments',
            correctWhen: {},
            why: 'He owns the service, the code and the pager, so he owns the call after hearing everyone. The RFC says so too. Whatever happened in the room, the record names him.',
          },
          {
            id: 'you',
            text: 'You · Technical Program Manager',
            why: "You own the decision process: framing, facts, criteria, follow-through. Not the architecture. A TPM who picks designs ends up owning outages they can't fix.",
          },
          {
            id: 'rohan',
            text: 'Rohan · VP, Fintech',
            why: 'Rohan owns business trade-offs, like accepting that Pay Later may hide at peak. Which design to build sits with the team that runs it.',
          },
          {
            id: 'andrea',
            text: 'Andrea · Staff Engineer, Risk Platform',
            why: "A key consulted voice, and a natural owner for the fast-follow. Consulted isn't accountable: Payments owns checkout.",
          },
        ],
      },
      {
        id: 'driver',
        label: 'Key driver',
        help: 'Which fact actually drove the outcome in the room?',
        options: [
          {
            id: 'cap',
            text: 'The bureau contract cap: 50 calls/s (bursts to 80) against ~400 req/s at last 11.11 peak',
            correctWhen: { flags: ['arch:cap-known'] },
            why: "The fact that settles it, once it reaches the room: plain sync would hit 429s at midnight and hang checkout for everyone. If it stayed in your Slack, it didn't drive anything.",
          },
          {
            id: 'latency',
            text: "Checkout's latency budget: p99 at 1.4s against a 1.5s SLO, with bureau spikes to 3s",
            correctWhen: { notFlags: ['arch:cap-known', 'decision:a'] },
            why: "Marcus's latency case carried the room when the contract cap never came up. Real, but tunable; the cap was the harder constraint, and it was one DM away.",
          },
          {
            id: 'modern',
            text: 'Async is the more modern, scalable architecture',
            why: "Never a driver. Fashion isn't a requirement: every design is judged against peak, latency, date and compliance.",
          },
          {
            id: 'simple',
            text: 'Holding the date with the simplest build',
            correctWhen: { flags: ['decision:a'] },
            why: 'Accurate if plain A won by default. Simplicity is a fair criterion; simplicity without the peak numbers is a bet nobody chose to make.',
          },
        ],
      },
      {
        id: 'followups',
        label: 'Follow-ups',
        help: 'Owners and dates. What did people actually commit to?',
        options: [
          {
            id: 'owners',
            text: 'Jun Hao: ADR by Thu · Marcus: fallback load test against a bureau stub at peak, Fri · Linh: event encryption review for the fast-follow · You: date impact to Rohan, 2pm',
            correctWhen: { flags: ['decision:c'] },
            why: "Accurate if C was decided: every action has an owner and a date. If they weren't read back in the room, this record is where they become real, so send it today.",
          },
          {
            id: 'dated',
            text: 'Jun Hao decides by 10:00 tomorrow, once Hakim confirms the bureau limits in writing',
            correctWhen: { flags: ['arch:dated-followup'] },
            why: "Accurate if you set a dated decision. 'Not decided, but decided by whom and by when' is a perfectly good follow-up.",
          },
          {
            id: 'replan',
            text: 'Re-plan the date with Rohan: B needs ~1.5 weeks more build plus a consent screen',
            correctWhen: { flags: ['decision:b'], notFlags: ['arch:dated-followup'] },
            why: "Accurate if B stands. A decision that moves a public date needs the sponsor's explicit call, today.",
          },
          {
            id: 'none',
            text: 'Nothing with an owner or a date yet',
            correctWhen: { notFlags: ['decision:c', 'decision:b', 'arch:dated-followup'] },
            why: 'If this is the truth, write it down, then fix it first thing tomorrow. A decision record with no owners or dates is a wish.',
          },
        ],
      },
    ],
    post: {
      channel: '#proj-kaya',
      prompt: 'Post the end-of-day update to #proj-kaya. Forty people read this channel, including Marketing.',
      options: [
        {
          id: 'vibes',
          text: 'Great discussion today, everyone! Exciting times, more to come 🚀',
          grade: 'poor',
          insight:
            "A post with no decision, owners or dates is noise, and noise trains people to stop reading the channel. Every update answers: what changed, who's doing what, by when.",
        },
        {
          id: 'full',
          text: '📌 RFC-012 decided (ADR-007 in thread): Option C for 11.11. Sync credit check with an 800ms timeout, circuit breaker and rate limiter; if decisions are slow, Pay Later hides and card checkout carries on. B (pre-approval for returning customers) is the fast-follow after consent review. Owners: ADR @Jun Hao by Thu · peak load test vs bureau stub @Marcus by Fri · event encryption review @Linh. Questions in the thread 🙏',
          grade: 'best',
          needs: ['decision:c'],
          lockedHint: "Needs a decision from the review: there's nothing to announce yet.",
          insight:
            "Decision, why, owners, dates and where to ask, in one post people can act on without having attended. Marketing learns 'Pay Later may hide at peak' from you today, not from an incident on 11.11.",
        },
        {
          id: 'notyet',
          text: "RFC-012 update: the design isn't final yet. Jun Hao decides by 10:00 tomorrow; before then, Hakim confirms the bureau's limits in writing. Nothing changes in anyone's sprint until then. Outcome posted here by noon.",
          grade: 'best',
          needs: ['arch:dated-followup'],
          lockedHint: 'Needs a dated decision plan: who decides, and by when.',
          insight:
            "An honest 'not yet' with a decider and a deadline is a good update. It stops rumours, tells people what not to change, and commits you to closing the loop.",
        },
        {
          id: 'lean',
          text: "RFC-012 review done today: we went through A, B and a hybrid C. I'll share where we landed, with owners, once the ADR is written.",
          grade: 'okay',
          insight:
            "Accurate, but nobody can act on it, so people fill the gap with corridor versions. Lead with the decision (or 'not yet'), then owners and dates.",
        },
      ],
    },
  },
}
