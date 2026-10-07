import type { InterviewQuestion } from './types'

/**
 * Interview Arcade question bank.
 *
 * Each item is an interviewer's question with four candidate answers. Distractors are the
 * answers a nervous ex–tech lead (too hands-on) or a textbook PMP (process for its own sake)
 * would plausibly give. Keep option lengths similar so the right answer is never telegraphed,
 * and keep regulatory facts to what is stated in docs/CONTENT_GUIDE.md or general.
 */
export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // ───────────────────────────── Behavioral ─────────────────────────────
  {
    id: 'iq-01',
    category: 'Behavioral',
    prompt:
      'Tell me about a time you had a serious disagreement with an engineering manager on another team whose work your program depended on.',
    options: [
      'I rewrote their design doc over a weekend to prove my approach worked, then walked them through it line by line. They came round and we hit the date.',
      'I logged it in the RAID log and raised it at SteerCo so leadership could make a formal call, rather than letting it fester between the two teams.',
      'I met them 1:1 to learn their constraints, reframed it around our shared launch goal, and agreed a phased plan. We shipped; we still partner.',
      'I let them have it their way to protect the relationship, then quietly padded my own plan to absorb the extra delivery risk on our side.',
    ],
    answer: 2,
    explanation:
      'Strong conflict stories lead with curiosity (their constraints), anchor on a shared goal, end with a concrete result and keep the relationship. Rewriting their design wins the argument but shows you will bypass owners; jumping to SteerCo skips the peer-to-peer step; quiet padding just hides the risk.',
    lookFor: 'Seeks to understand before persuading, resolves it peer-to-peer, gives a concrete outcome, and the relationship survives.',
  },
  {
    id: 'iq-02',
    category: 'Behavioral',
    prompt: 'Tell me about a time a program you ran failed or missed its goal. What was your part in it?',
    options: [
      "I missed that a dependency team had reprioritised, and we slipped four weeks. I now run fortnightly owner check-ins; they've caught two slips since.",
      'A vendor under-delivered and we slipped six weeks. I escalated early, but the contract gave us little leverage, so it was mostly out of my hands.',
      'A launch was slipping, so I worked every weekend for a month to keep it on track. We shipped on time, though I learned I take on too much.',
      'We missed a launch date, so I introduced stage gates, a change control board and detailed weekly reports so it could never happen again.',
    ],
    answer: 0,
    explanation:
      "Interviewers want real ownership: a cause you controlled, a specific lesson, and proof you applied it. The vendor story deflects blame; the weekend-hero story isn't a failure at all (and hero culture is a red flag); piling on gates and boards is over-correction, not a targeted fix.",
    lookFor: 'Genuine ownership, a specific root cause within your control, and evidence the lesson changed how you work.',
  },
  {
    id: 'iq-03',
    category: 'Behavioral',
    prompt:
      "Your program needs the payments team to ship an API change that isn't on their roadmap, and you have no authority over them. Walk me through how you've handled a situation like this.",
    options: [
      'I asked my VP to raise it with their VP as a company-level priority, so it would land on their roadmap this quarter without a long negotiation.',
      'As the change was small, I had one of our engineers build it in their repo and raise the PR, so their team only needed to review it.',
      'I submitted a formal request through their intake process, logged it as a dependency, and tracked it weekly until they scheduled it.',
      'I learned their OKRs, showed how the change cut their own support tickets, offered an engineer to pair, and agreed a date with their EM.',
    ],
    answer: 3,
    explanation:
      "Influence without authority starts with their incentives: tie the ask to their goals, quantify the value, make yes cheap. Going VP-to-VP first spends goodwill you'll need later; pushing code into their repo uninvited bypasses the owners who will run it in production; a ticket in their queue isn't influence.",
    lookFor: "Understands the other team's incentives, makes the ask easy to accept, and treats escalation as a last resort.",
  },
  {
    id: 'iq-04',
    category: 'Behavioral',
    prompt: 'Tell me about a time you had to tell senior leadership that a launch would miss its date.',
    options: [
      "I waited until engineering confirmed a firm new date, so I wouldn't alarm the execs with half-information, then presented the full recovery plan.",
      'As soon as the critical path slipped, I told the sponsor what happened, the impact, three options with trade-offs, and my recommendation.',
      'I changed the status to amber in the weekly report and detailed the slip in the risks section, so it was on record before SteerCo.',
      "I had the team work two weekends to claw the time back quietly, and only flagged it once it was clear that wouldn't be enough.",
    ],
    answer: 1,
    explanation:
      "Bad news doesn't improve with age. Tell the sponsor early, with impact, options and a recommendation, while they can still act. Waiting for a firm date feels responsible but removes the exec's choices; an amber line in a report is on record but not communicated; secret weekend crunches still end in surprise.",
    lookFor: 'Escalates early and in person, quantifies impact, brings options and a recommendation, and owns the message.',
  },
  {
    id: 'iq-05',
    category: 'Behavioral',
    prompt: 'Tell me about a time you said no to a senior stakeholder.',
    options: [
      'A VP wanted a feature added two weeks before launch. I declined, pointing to the scope freeze every stakeholder had signed off at kickoff.',
      'I said yes since the VP was our sponsor, then found the time by trimming the test cycle and asking the team to stretch for two weeks.',
      'A VP asked for a late feature. I sized it with the team and showed the cost: slip two weeks or drop a feature. They chose a fast-follow.',
      "I told them scope decisions sit with the product manager and asked them to take it up there, since a TPM shouldn't own that call.",
    ],
    answer: 2,
    explanation:
      "The strongest 'no' is a priced trade-off: size the ask, show what it displaces, and let the decision-maker choose. Citing the signed-off freeze is defensible but sounds bureaucratic and spends trust; trimming testing to say yes swaps a visible ask for hidden quality risk; deflecting to the PM dodges the conversation.",
    lookFor: 'Says no with data and options, protects the team and quality, and keeps the stakeholder relationship intact.',
  },
  {
    id: 'iq-06',
    category: 'Behavioral',
    prompt:
      "Tell me about a time someone on a team you didn't manage kept missing commitments that your program relied on.",
    options: [
      'I asked them 1:1 what was blocking them and fixed an unclear spec. When slips continued, I gave their manager specific impact, privately.',
      'I reassigned their open tasks to stronger engineers to protect the timeline, then let their manager know what I had changed and why I did it.',
      'I raised it in the team retro so everyone could discuss accountability openly, but framed it generally, without singling anyone out by name.',
      'I recorded each missed commitment in the weekly status report, so the pattern was visible to leadership and formally on the record.',
    ],
    answer: 0,
    explanation:
      'Start with the person: repeated slips often come from unclear specs or hidden blockers. If it persists, give their manager specific, observed impact, privately. Reassigning their work yourself oversteps your authority and erodes trust; airing it in a retro or status report turns a performance issue into public blame.',
    lookFor: 'Assumes positive intent, addresses it directly and privately, respects line management, and adjusts plan risk.',
  },
  {
    id: 'iq-07',
    category: 'Behavioral',
    prompt: "You've been a strong tech lead for six years. Why do you want to move into a TPM role now?",
    options: [
      "I'm ready to step away from day-to-day coding, and TPM looks like the fastest route from where I am now into senior leadership roles.",
      'My PMP gives me formal tools for scope, schedule and cost, and I want to bring that PMBOK rigour to engineering teams that often lack it.',
      'As a TPM I can keep solving the hardest technical problems myself while owning the schedule too, so I get the best of both roles.',
      'The best part of being a TL was the cross-team work: aligning teams, sequencing, unblocking launches. I want that full-time.',
    ],
    answer: 3,
    explanation:
      "A credible answer shows you already do TPM work and want more of it. 'Fastest route to leadership' sounds like escaping engineering; leading with PMBOK suggests process over outcomes; 'solving the hardest problems myself' is the hands-on trap a TPM must outgrow, because the job is making the teams succeed.",
    lookFor: 'A pull toward the role (not away from coding), evidence of TPM-like work already done, and an accurate picture of the job.',
  },
  {
    id: 'iq-08',
    category: 'Behavioral',
    prompt: 'Tell me about a time you introduced a process change that the engineers resisted.',
    options: [
      'I got our director to mandate it so it was non-negotiable, then tracked adoption on a weekly dashboard until compliance reached 100% across teams.',
      'I asked what pain they felt, piloted a lighter version with one team for two sprints, measured the result, and let that team sell it.',
      'I ran a lunch-and-learn on the PMBOK practice behind it, so they saw it was industry standard and not just my personal preference.',
      'I dropped it: engineers know their workflow best, and forcing a process on them would have cost more morale than it was worth.',
    ],
    answer: 1,
    explanation:
      'Process sticks when it fixes a pain engineers already feel: start from their problem, pilot small, measure, and let peers carry it. A director mandate buys compliance theatre, not adoption; citing PMBOK makes it sound like process for its own sake; dropping it entirely leaves the real problem unsolved.',
    lookFor: 'Leads change through empathy, small experiments and evidence, not authority or certification.',
  },

  // ───────────────────────────── Program Sense ─────────────────────────────
  {
    id: 'iq-09',
    category: 'Program Sense',
    prompt: 'You own a six-month launch spanning five engineering teams. How do you build the plan?',
    options: [
      "Take the exec's target date, split the work evenly across the months, and assign each team milestones that fit that date.",
      'Write a detailed task-level Gantt chart for all six months, so every dependency and date is visible to everyone upfront.',
      'Have each team lead estimate their own work, then combine the estimates into one integrated schedule exactly as submitted.',
      'Agree milestones with leads, get ranged estimates, map dependencies to find the critical path, and pool buffer at program level.',
    ],
    answer: 3,
    explanation:
      "Good plans are built with the teams and integrated by the TPM: shared milestones, ranged estimates, explicit dependencies, a known critical path and pooled buffer. A six-month task-level Gantt is false precision that's stale within weeks; stitching team estimates together misses integration work and cross-team dependencies.",
    lookFor: 'Bottom-up estimates plus top-down integration: dependencies, critical path, buffer and honest confidence levels.',
  },
  {
    id: 'iq-10',
    category: 'Program Sense',
    prompt:
      'Mid-program, Mobile is two weeks late but has three weeks of float. Backend is three days late with zero float. Where do you focus?',
    options: [
      "Mobile: it's the biggest slip by far, so it's the workstream most likely to threaten the launch if it keeps on sliding like this.",
      "Backend: it's on the critical path, so every day moves launch. Keep an eye on Mobile, which has only a week of float left.",
      'Shift two engineers from Backend to Mobile, since Mobile has by far the larger gap and Backend is only a few days behind.',
      'Neither yet: re-baseline the whole schedule first, so every team is working to accurate dates before you intervene.',
    ],
    answer: 1,
    explanation:
      "Slips only move the launch when they're on the critical path. Backend has zero float, so its three days are three days of launch; Mobile's two weeks are absorbed, but watch its last week of float. Chasing the biggest number is the trap, and moving engineers off the critical path makes it worse.",
    lookFor: 'Fluency with critical path and float, and prioritising attention by launch impact rather than the size of a slip.',
  },
  {
    id: 'iq-11',
    category: 'Program Sense',
    prompt: 'What makes a good milestone for a cross-team program?',
    options: [
      "An integrated outcome you can demo, with objective exit criteria, e.g. 'end-to-end payment works in staging, p95 < 300 ms, no Sev-1s'.",
      "A date by which each team marks its own deliverables as 'done' in the tracker, then reviews them together at the weekly status meeting.",
      "A formal phase gate, where every stakeholder signs off on that phase's deliverables before the next phase is allowed to start.",
      'A sprint boundary, so that the milestones line up every two weeks with the cadence the engineering teams already work in.',
    ],
    answer: 0,
    explanation:
      "Good milestones prove progress: an integrated outcome you can demo, with binary exit criteria, so 'done' is verified rather than reported. Team-by-team 'done' hides integration risk until late; sign-off-heavy phase gates add ceremony without proving the system works; a sprint boundary is a cadence, not a milestone.",
    lookFor: 'Outcome-based milestones with measurable exit criteria that expose integration risk early.',
  },
  {
    id: 'iq-12',
    category: 'Program Sense',
    prompt: 'You need to migrate 30 services to a new deployment platform this year. How do you sequence them?',
    options: [
      'Start with the most critical, highest-traffic service, so the biggest risk is retired first while the team has the most energy.',
      'Migrate all 30 in parallel with their owning teams, and cut over in one weekend to keep the dual-running period short.',
      'Pilot a low-risk service that exercises the main patterns, harden the playbook, then migrate in waves by dependency and risk.',
      'Go in order of team readiness: whoever volunteers first goes first, so motivated teams build momentum for the rest.',
    ],
    answer: 2,
    explanation:
      'Sequence to learn cheaply, then scale: a representative, low-blast-radius pilot proves the tooling and runbook, then waves follow dependencies and risk. Starting with the most critical service makes your first-time mistakes the most expensive ones; a big-bang cutover removes the chance to learn and roll back.',
    lookFor: 'Pilot-then-waves thinking, sequencing by dependency and risk, and protecting reversibility.',
  },
  {
    id: 'iq-13',
    category: 'Program Sense',
    prompt:
      "A VP tells you: 'Checkout conversion dropped. Fix it this quarter.' There's no plan, no team and no spec. What's your first move?",
    options: [
      'Form a tiger team this week and start shipping quick UX fixes right away, because a quarter is short and momentum matters.',
      'Frame it with data first: where in the funnel it drops, since when, for whom. Then agree a target and size the options.',
      "Draft a charter, RACI and communication plan, and get the VP's sign-off on all three before any work begins, to avoid churn.",
      "Ask the PM to own the problem and write a PRD first, since a TPM's work really starts once the requirements are clear.",
    ],
    answer: 1,
    explanation:
      'Ambiguous mandates need framing before planning: pin the problem down with data, agree a measurable target, then shape workstreams around the likeliest causes. Shipping fixes in week one feels decisive but may solve the wrong problem; a charter and RACI first is ceremony before anyone knows what the work is.',
    lookFor: 'Comfort with ambiguity: frames the problem, defines success metrics, then structures the work.',
  },
  {
    id: 'iq-14',
    category: 'Program Sense',
    prompt: "You're running tomorrow's go/no-go meeting for a major launch. How do you make the decision objective?",
    options: [
      "Go round the room and ask each team lead for a thumbs-up on readiness; if every single team says it's green, we launch.",
      'Hold the launch until every known bug is fixed, so that we never ship anything to paying customers with known defects.',
      'Present the overall status, then let the most senior exec in the room make the call, since they own the business risk of launching.',
      'Review evidence against criteria agreed weeks earlier: quality bars met, rollback tested, on-call staffed, support ready.',
    ],
    answer: 3,
    explanation:
      "Go/no-go is objective only if the criteria were agreed before launch pressure hit; then you review evidence against them, including a tested rollback. Team thumbs-ups invite optimism and social pressure; 'zero known bugs' is unrealistic, as the real question is whether known issues sit within the agreed risk tolerance.",
    lookFor: 'Pre-agreed, evidence-based launch criteria, operational readiness, and a tested rollback plan.',
  },
  {
    id: 'iq-15',
    category: 'Program Sense',
    prompt: 'Your program depends on 12 deliverables from other teams. How do you manage those dependencies?',
    options: [
      'Give each an owner, need-by date and agreed interface, lock contracts early, and review status weekly with the owning teams.',
      "File each one as a ticket in the owning team's backlog, then check their board every week to see when it gets picked up and started.",
      'Have my team build stubs for all 12 so we are never blocked, then integrate each one whenever the real version finally arrives.',
      "Escalate all 12 to the steering committee at kickoff, so leadership formally commits the other teams' capacity upfront.",
    ],
    answer: 0,
    explanation:
      "Dependencies need explicit agreements: a named owner, a need-by date tied to your critical path, a defined interface and a regular check-in. Stubs are a good mitigation, but 'integrate whenever' hides the riskiest work until late; a ticket in someone's backlog isn't a commitment; escalating everything on day one spends credibility.",
    lookFor: 'Explicit dependency agreements with owners and dates, early interface contracts, and proactive tracking.',
  },
  {
    id: 'iq-16',
    category: 'Program Sense',
    prompt:
      'Your launch date is fixed by a marketing campaign, and stakeholders have asked for more scope than fits. How do you decide what goes into the MVP?',
    options: [
      'Include everything that was requested, then add more engineers later on if the timeline starts to look tight.',
      'Let engineering pick whatever is technically easiest to finish by the date, since they understand the effort and risk best.',
      'Rank scope with the PM by customer value and risk, commit only what fits with buffer, and pre-agree what gets cut if we slip.',
      'Run a MoSCoW workshop with all stakeholders and commit to every Must and Should, so that everyone stays aligned on scope.',
    ],
    answer: 2,
    explanation:
      "With a fixed date, scope is the lever. Rank by value and risk with the PM, commit what fits with buffer, and agree the cut line before you need it. Committing every Must and Should feels aligned, but the Shoulds are exactly what you'll need to cut; adding people late rarely saves a date; 'easiest first' optimises effort, not value.",
    lookFor: 'Treats scope as the variable for a fixed date, prioritises by value with the PM, and pre-agrees the cut line.',
  },

  // ───────────────────────────── Technical Depth ─────────────────────────────
  {
    id: 'iq-17',
    category: 'Technical Depth',
    prompt: 'A risky change to the payments service is ready to ship. How would you want it rolled out?',
    options: [
      'Behind a feature flag: canary to 1% with pre-agreed success metrics and fast rollback, then ramp in stages while watching errors.',
      'Deploy to everyone at 2 a.m. when traffic is lowest, so that very few customers are affected if something goes wrong.',
      'Run an extended QA cycle in staging until every test passes, then release to all users at once for a clean cutover.',
      'Release to internal staff only for a month to dogfood it, then switch it on for all customers once nobody has reported issues.',
    ],
    answer: 0,
    explanation:
      "Progressive delivery limits blast radius: the flag separates deploy from release, a small canary with pre-agreed metrics catches real-traffic issues, and rollback is fast. A 2 a.m. big bang still hits 100% of users with a sleepy team on call; staging can't reproduce production traffic; a month of dogfooding delays real feedback.",
    lookFor: 'Understands canaries, feature flags, success metrics and rollback, and thinks in terms of blast radius.',
  },
  {
    id: 'iq-18',
    category: 'Technical Depth',
    prompt:
      'Your team must move a live, high-traffic table to a new schema with zero downtime. Which approach do you push for, and why?',
    options: [
      "Schedule a maintenance window, freeze writes, migrate, then switch over. It's simpler and avoids subtle dual-write bugs.",
      "Run the migration script at the lowest-traffic hour; if anything fails, restore from last night's backup and try again.",
      'Expand and contract: add the new schema, dual-write, backfill, verify parity, move reads gradually, then retire the old path.',
      'Build the new table alongside the old one, then switch all traffic over in a single config change once it has been fully tested.',
    ],
    answer: 2,
    explanation:
      "Expand-and-contract keeps the system working at every step and makes each step reversible, with parity checks catching drift before reads move. A maintenance window is simpler but breaks the zero-downtime requirement; restoring last night's backup loses a day of customer writes; a one-shot switch has no way to sync or roll back data.",
    lookFor: 'Knows expand-and-contract, dual writes and backfills, and asks how each step is verified and reversed.',
  },
  {
    id: 'iq-19',
    category: 'Technical Depth',
    prompt:
      'Engineers propose caching product prices to cut database load before a big sale. As TPM, which questions matter most?',
    options: [
      'Which caching technology is fastest? Can we benchmark two or three options properly before we commit to one for the sale?',
      'How many story points is it, and can it fit into the current sprint without pushing any other committed work out?',
      'Can we cache everything, including cart totals and stock levels, so we get the biggest possible load reduction for the sale?',
      'How stale can a price be, how is the cache invalidated on change, and what happens on a cold start or cache failure?',
    ],
    answer: 3,
    explanation:
      "A TPM probes the trade-offs that become business risk: staleness tolerance, invalidation, and failure modes like a stampede on a cold cache mid-sale. Benchmarking products is the engineers' call; asking only about points misses that a stale price at checkout is a customer-trust and revenue problem.",
    lookFor: 'Asks about consistency, invalidation and failure modes: the risks, not the implementation details.',
  },
  {
    id: 'iq-20',
    category: 'Technical Depth',
    prompt:
      "A design makes the orders and inventory services eventually consistent via events. What's the main risk you'd confirm the team has handled?",
    options: [
      'Latency: eventual consistency is slower, so ask for load tests proving p99 stays within target before you approve the launch.',
      'Overselling: two orders can claim the last unit before inventory catches up. How is that prevented or compensated?',
      'Nothing major, provided a nightly reconciliation job finds and fixes any mismatches between the two by the next morning.',
      'Data integrity: insist on a distributed transaction that spans both services, so their records can never disagree at all.',
    ],
    answer: 1,
    explanation:
      'Eventual consistency trades instant agreement for availability and decoupling; the business risk lives in the window where services disagree, like overselling. Ask how it is prevented (reservations) or compensated (saga rollback, refunds). Mandating distributed transactions throws those benefits away; nightly reconciliation finds oversells too late.',
    lookFor: 'Translates a consistency model into concrete business risk and asks about prevention or compensation.',
  },
  {
    id: 'iq-21',
    category: 'Technical Depth',
    prompt:
      'A partner API your launch depends on is rate-limited to 100 requests/sec. Launch-day forecasts peak at 300/sec. What do you do?',
    options: [
      'Have the client retry failed calls immediately until they succeed, so that no customer request is ever dropped at peak.',
      'Assume the partner will lift the limit for launch day, since the extra traffic benefits their business as well.',
      'Ask the partner for more quota now, and design for the limit anyway: caching, batching, queues with backoff, degradation.',
      'Spread the calls across several API keys registered under different accounts, to multiply the effective limit by three.',
    ],
    answer: 2,
    explanation:
      'Treat a hard external limit as a launch risk on two tracks: negotiate quota early (commercial changes take time) and design for the limit anyway. Immediate retries turn throttling into a retry storm that makes it worse; assuming the partner will lift it is hope, not a plan; key-splitting usually breaches their terms.',
    lookFor: 'Spots the capacity gap early, pursues commercial and technical mitigations in parallel, and knows retry storms.',
  },
  {
    id: 'iq-22',
    category: 'Technical Depth',
    prompt: 'How would you know, within the first hour, whether a major launch is healthy?',
    options: [
      'SLIs agreed before launch (error rate, latency, payment success rate) with dashboards, alert thresholds and owners watching.',
      'Watch CPU and memory across the whole fleet; if utilisation stays under 70% everywhere through the first hour, the launch is healthy.',
      'Watch social media and the support queue closely, because customers will tell us fast if anything is broken for them.',
      'Have each tech lead post in the launch channel every 15 minutes, confirming that their service looks fine to them.',
    ],
    answer: 0,
    explanation:
      'Health is defined before launch: user-facing SLIs plus a business metric, each with thresholds, alerts and an owner. CPU and memory can look perfect while users see errors; complaints are a lagging signal that means the damage is done; 15-minute check-ins replace data with opinion.',
    lookFor: 'Thinks in SLIs and business metrics defined ahead of time, with alerting and clear ownership.',
  },
  {
    id: 'iq-23',
    category: 'Technical Depth',
    prompt:
      "During a launch a Sev-1 hits: payments are failing for 20% of users. You're the TPM on the incident bridge. What's your role?",
    options: [
      'Dig into the logs alongside the engineers; with my backend background I can help them find the root cause much faster.',
      'Make sure there is a clear incident commander, run stakeholder updates on a cadence, track actions, push to mitigate first.',
      'Start the post-mortem doc and timeline immediately so nothing gets forgotten, and book the blameless review for tomorrow.',
      'Email every exec and the whole company right away, then wait for engineering to report back with a fix and an ETA.',
    ],
    answer: 1,
    explanation:
      "In a Sev-1 the TPM's leverage is coordination: a clear incident commander, regular stakeholder updates, tracked actions, and a push to mitigate first (roll back, flag off) and find root cause later. Debugging alongside the engineers feels useful but leaves comms and coordination with no owner.",
    lookFor: 'Knows incident roles, prioritises mitigation over diagnosis, and keeps stakeholders informed on a cadence.',
  },
  {
    id: 'iq-24',
    category: 'Technical Depth',
    prompt:
      "A mobile team and a backend team are building in parallel, but the API isn't final. How do you stop them blocking each other?",
    options: [
      'Have the mobile team wait until the backend is code-complete, so they integrate once against the real thing.',
      'Let both teams build to their own assumptions, then plan a two-week integration phase before launch to reconcile them.',
      "Have the backend tech lead design both the API and the app's data models, so a single person owns consistency.",
      'Agree a versioned contract early, generate mocks from it, add contract tests in CI, and review any changes to it.',
    ],
    answer: 3,
    explanation:
      'Contract-first lets teams work in parallel: an agreed, versioned spec, mocks built from it, and contract tests that fail fast when either side drifts. Waiting serialises the schedule; a late integration phase is where hidden mismatches surface at the worst possible time; one lead designing both sides creates a bottleneck.',
    lookFor: 'Contract-first development, mocks and contract testing, and a lightweight change process for the interface.',
  },

  // ───────────────────────────── Stakeholders ─────────────────────────────
  {
    id: 'iq-25',
    category: 'Stakeholders',
    prompt:
      'Your program will probably miss its date, but the team believes they can still recover. Your weekly status report is due. What colour do you report?',
    options: [
      'Green: the team is confident they can recover, and showing amber now would cause panic before we know anything for sure.',
      'Amber, with the specific risk, its impact on the date, the recovery plan, and the trigger that would turn it red.',
      'Red, so that leadership pays attention and frees up extra people, even though a recovery is still realistic at this point.',
      "Keep last week's colour and brief my manager verbally instead, so nothing alarming is put in writing just yet.",
    ],
    answer: 1,
    explanation:
      "RAG is a forecast, not a mood. Amber means 'at risk, with a recovery plan', and naming the trigger for red means nobody is surprised later. Reporting green to avoid panic is a watermelon status: green outside, red inside. Crying red to get resources burns the credibility you'll need when it's real.",
    lookFor: 'Honest, forecast-based status with clear thresholds, and no watermelon reporting.',
  },
  {
    id: 'iq-26',
    category: 'Stakeholders',
    prompt: "A VP catches you in the lift and asks, 'How's your program going?' You have about a minute. What do you say?",
    options: [
      'Walk through each workstream in order, so the VP gets the complete picture before the lift reaches their floor.',
      "Say everything's on track and offer to send the full status report afterwards, so you don't take up their time.",
      'Explain the main technical blockers in some detail, so the VP understands why the work is harder than it looks.',
      'Bottom line first: on track or not, the one risk that matters, and any decision or help you need from them.',
    ],
    answer: 3,
    explanation:
      "Execs need the bottom line up front: status, the one thing that could change it, and what you need from them. A minute with a VP is a chance to get a decision or help. A workstream walkthrough runs out of time before the point; 'all on track' wastes the access and may become a surprise later.",
    lookFor: 'Concise, bottom-line-up-front communication at exec altitude that uses access to unblock the program.',
  },
  {
    id: 'iq-27',
    category: 'Stakeholders',
    prompt:
      "Another team's director keeps deprioritising a dependency on your critical path. Two rounds of peer-to-peer talks have failed. What now?",
    options: [
      'Escalate to your shared VP with a joint write-up: the conflict, impact, options and a recommendation. Tell the director first.',
      "Raise it with the VP in a meeting without telling the director beforehand, so they can't spin the story to the VP first.",
      'Keep working it peer-to-peer, since escalation damages relationships and should be avoided wherever possible in a program.',
      'Have your own engineers build the dependency themselves, so the program no longer needs the other team on its critical path.',
    ],
    answer: 0,
    explanation:
      "Escalation isn't failure; surprise is. After genuine peer attempts, escalate with a shared framing, options and a recommendation, and tell the other leader first (ideally escalate together). Going around them ambushes a peer; endless peer talks let the critical path slip; building it yourself creates a system nobody owns.",
    lookFor: 'Escalates at the right time and level, transparently, with options and a recommendation rather than blame.',
  },
  {
    id: 'iq-28',
    category: 'Stakeholders',
    prompt:
      "Two teams each believe they own the decision on the new checkout API's error format. Work has stalled for a week. What do you do?",
    options: [
      'Make the call yourself as the TPM to unblock the program, then inform both teams of the decision and your reasoning behind it.',
      'Add it to the next SteerCo agenda and ask both directors to decide it jointly in front of the leadership team.',
      'Get agreement on one accountable owner for the API design, with the other team consulted, and let that owner decide.',
      'Ask each team to implement its preferred format for now, and reconcile the two versions at integration time.',
    ],
    answer: 2,
    explanation:
      "Stalls like this usually come from unclear decision rights, not a technical disagreement. Clarify a single accountable owner (RACI), consult the other team, and the decision flows. Deciding yourself unblocks today, but you won't own the API's long-term consequences; sending it to SteerCo makes a design detail wait for executives.",
    lookFor: 'Diagnoses unclear decision rights, uses RACI pragmatically, and avoids both overstepping and over-escalating.',
  },
  {
    id: 'iq-29',
    category: 'Stakeholders',
    prompt:
      "Sales and Compliance both want your team this sprint: a big client demo vs. fixing an audit finding. You can't do both. How do you handle it?",
    options: [
      'Prioritise the demo: revenue keeps the business running, and audit deadlines can usually be extended if you ask early enough.',
      'Split capacity 50/50 so that each stakeholder gets something this sprint, and nobody feels the need to escalate it.',
      'Prioritise the audit fix and tell Sales the demo will have to wait, because in a regulated business compliance always wins.',
      'Gather the facts (audit deadline, demo value, effort), frame the trade-off, and have the leader who owns both decide.',
    ],
    answer: 3,
    explanation:
      "Don't settle a business trade-off by guessing or splitting the difference. Get the facts, frame the options, and take it to the leader who owns both outcomes. A 50/50 split often delivers neither on time; 'compliance always wins' may well be the answer here, but it should be a decision, not a reflex.",
    lookFor: 'Fact-based trade-off framing, and taking the decision to the right owner instead of guessing.',
  },
  {
    id: 'iq-30',
    category: 'Stakeholders',
    prompt:
      "Halfway through your program, a new VP sponsor arrives and starts questioning the whole roadmap. What's your first step?",
    options: [
      "Book a 1:1 to learn their goals and concerns, walk them through key decisions and trade-offs so far, and agree what's open.",
      'Defend the current plan firmly in your first meeting, with all the data showing why it was approved in the first place.',
      'Pause execution until the new VP formally re-approves the plan, to avoid wasting effort on work that may change.',
      "Keep executing quietly as planned; the previous sponsor's approval stands until you're explicitly told otherwise.",
    ],
    answer: 0,
    explanation:
      "A new sponsor needs context and a voice. Learn what they care about, explain the decisions and trade-offs made so far, and agree what's genuinely open. Defending the plan in meeting one turns them into an opponent; pausing everything burns momentum and money; executing quietly risks a far bigger reversal later.",
    lookFor: 'Re-contracts with a new sponsor: listens first, shares decision history, and adapts without losing momentum.',
  },
  {
    id: 'iq-31',
    category: 'Stakeholders',
    prompt:
      "A senior exec asks you in a meeting: 'Can you commit to launching by 1 March?' The team hasn't estimated the work yet. What do you say?",
    options: [
      "'Yes, we'll make it work.' Committing on the spot shows confidence, and the scope can always be adjusted later if needed.",
      "'No, that's not realistic for us.' It's better to set expectations low now than to disappoint the exec later.",
      'Ask what is driving 1 March, then commit to coming back by Friday with an estimate, a confidence level and options.',
      "'Engineering has to answer that one.' Then ask the tech lead to follow up with the exec directly after the meeting.",
    ],
    answer: 2,
    explanation:
      "Never commit to a date the team hasn't sized, but don't stonewall. Ask what drives the date (a hard deadline or a wish?), then return fast with a ranged estimate and options. A hopeful yes becomes a missed commitment; a reflexive no is sandbagging; handing it to the tech lead gives away the TPM's core job.",
    lookFor: 'Avoids committing without data, understands the driver behind the date, and follows up fast with options.',
  },
  {
    id: 'iq-32',
    category: 'Stakeholders',
    prompt:
      "Your program has 40 stakeholders across six teams, and many complain they don't know what's going on. What do you change?",
    options: [
      'Add a daily all-hands sync, so that everyone hears the same update at the same time, straight from you as the TPM.',
      'Tier it: a weekly written update for everyone, decision-focused SteerCos for execs, working syncs for doers.',
      'Share the tracker dashboard link with everyone, so each stakeholder can self-serve whatever level of detail they need.',
      'Ask each team lead to update their own stakeholders, so information comes from the people closest to the work.',
    ],
    answer: 1,
    explanation:
      "Different audiences need different altitudes: a predictable written update for everyone, decision-focused exec forums, and working sessions for the people doing the work. A daily all-hands spends 40 people's time to fix an information problem; a raw dashboard link pushes the synthesis, the TPM's job, onto every reader.",
    lookFor: 'Audience-tiered communication that is predictable, written and decision-focused.',
  },

  // ───────────────────────────── Execution ─────────────────────────────
  {
    id: 'iq-33',
    category: 'Execution',
    prompt: "Mid-sprint, your PM keeps adding 'small' requirements by messaging engineers directly in chat. What do you do?",
    options: [
      "Tell the engineers to ignore anything that isn't in the sprint backlog, and let the PM know about the new rule afterwards.",
      'Set up a formal change control board, with written change requests and a weekly approval meeting for any change at all.',
      'Talk to the PM privately and agree a light intake: log it, size it, and trade it off visibly against current work.',
      'Let it continue since the PM owns the product, but quietly add 20% buffer to future estimates to absorb it.',
    ],
    answer: 2,
    explanation:
      "The problem is invisible scope, not the PM's ideas. Agree a lightweight path that makes each change visible, sized and traded off, so the PM still decides priorities. Telling engineers to ignore the PM makes it adversarial; a weekly change board is heavyweight for sprint-level changes; hidden buffer hides the cost.",
    lookFor: 'Makes scope changes visible and traded off, partners with the PM, and right-sizes the process.',
  },
  {
    id: 'iq-34',
    category: 'Execution',
    prompt:
      'Your launch is three weeks behind with six weeks to go. Your director offers five more engineers. What do you do?',
    options: [
      'Accept all five straight away; more hands on deck is the fastest way to win back three weeks before the launch date.',
      'Check where they would help: separable work like tests or tooling may gain, but onboarding can slow the critical path.',
      "Decline: Brooks's law says adding people to a late project always makes it later, so they can only hurt the date.",
      'Accept them and pair each one with a senior engineer, so all five are fully productive within their first week.',
    ],
    answer: 1,
    explanation:
      "Brooks's law is a warning, not an absolute: newcomers add ramp-up and communication cost, so they help only on separable, low-onboarding work. Accepting all five blindly can slow the critical path; refusing outright ignores work that genuinely parallelises; pairing every newcomer with a senior pulls your best people off the critical path.",
    lookFor: "Nuanced use of Brooks's law: knows where extra people help, where they hurt, and why.",
  },
  {
    id: 'iq-35',
    category: 'Execution',
    prompt: "Leadership wants a metric showing whether your platform team's delivery is improving. What do you propose?",
    options: [
      'Story points completed per sprint, broken down per engineer, so that we can spot and reward the top performers on the team.',
      "Features shipped per quarter, since that's the output the business actually sees and cares about the most.",
      'Code coverage, with a target of 90% across every repository, as a solid proxy for overall engineering quality.',
      "DORA's four: deployment frequency, lead time for changes, change failure rate, time to restore, as team trends.",
    ],
    answer: 3,
    explanation:
      'DORA metrics balance speed (deployment frequency, lead time) with stability (change failure rate, time to restore) and are hard to game when tracked as team trends. Story points are team-relative and invite gaming, especially per engineer; feature counts ignore size and stability; coverage targets reward tests written for the number.',
    lookFor: 'Knows DORA, balances speed with stability, and avoids vanity or individual metrics.',
  },
  {
    id: 'iq-36',
    category: 'Execution',
    prompt: "An engineer says a feature will take 'two weeks'. How do you turn that into something you can plan with?",
    options: [
      "Ask for a range plus assumptions, e.g. '2–4 weeks if the auth API lands on time', and track the riskiest one.",
      'Add a standard 20% contingency buffer to every estimate, so a two-week estimate becomes 12 working days in the plan.',
      'Re-estimate it yourself from your own years of engineering experience, since engineers are almost always optimistic.',
      'Record two weeks as the commitment, and hold the engineer accountable to hitting that date in the plan.',
    ],
    answer: 0,
    explanation:
      "Single-point estimates hide uncertainty. Ask for a range and the assumptions behind it, then manage the riskiest assumption, because that's where schedule risk lives. A flat 20% buffer treats all work as equally uncertain; overriding the engineer with your own estimate kills ownership; treating an estimate as a commitment breeds padding.",
    lookFor: "Ranges over point estimates, surfaced assumptions, and respect for the team's ownership of its estimates.",
  },
  {
    id: 'iq-37',
    category: 'Execution',
    prompt: 'How do you run risk management on a program without it turning into paperwork?',
    options: [
      'Keep a comprehensive register of every conceivable risk, each one scored and reviewed in a monthly risk meeting.',
      'A short ranked list of top risks, each with an owner, mitigation and trigger; review it weekly and act on the top few.',
      'Handle risks when they materialise; agile teams adapt quickly, so formal risk tracking is mostly overhead.',
      'Have each team manage its own risks and escalate only the high-rated ones to you, so you get a clean program view.',
    ],
    answer: 1,
    explanation:
      "Risk management is about action, not inventory: a short, ranked list with owners, mitigations and triggers, reviewed often enough to act. A giant monthly register is paperwork nobody reads; waiting for risks to land is issue management; team-only registers miss cross-team risks, which are exactly the TPM's job.",
    lookFor: 'Lightweight, action-oriented risk management with owners and triggers, and a focus on cross-team risks.',
  },
  {
    id: 'iq-38',
    category: 'Execution',
    prompt:
      "A platform team tells you their API will be three weeks late, and it's on your critical path. What do you do first?",
    options: [
      'Escalate to their director right away, to get the original date reinstated before it slips any further than it has.',
      'Move your launch out three weeks and tell stakeholders the new date now, so expectations are reset as early as possible.',
      'Offer your own engineers to build the API for them, so that the original launch date can still hold as planned.',
      'Size the impact with your leads, list options (re-sequence, mock it, cut or phase scope), then agree a path with them.',
    ],
    answer: 3,
    explanation:
      'First understand the impact and options: re-sequence work, build against mocks, cut or phase scope, or take a partial delivery. Then agree a path with the platform team and communicate. Escalating first skips problem-solving and sours a partner; accepting the full slip may be unnecessary; lending engineers is one option, not the first move.',
    lookFor: 'A structured response to a slip: impact first, several recovery options, collaboration, then communication.',
  },
  {
    id: 'iq-39',
    category: 'Execution',
    prompt: "Your team's retros keep producing the same action items, and nothing changes. What do you do?",
    options: [
      'Move retros to monthly instead; they clearly are not adding value, and engineering time is precious right now.',
      'Try a fresh, fun retro format every sprint to re-energise participation and get new ideas flowing.',
      'Cap it at one or two actions, each with an owner and date, and open the next retro by reviewing them.',
      'Take all the action items yourself and implement them, so that they actually get done this time.',
    ],
    answer: 2,
    explanation:
      "Retros fail on follow-through, not format. Fewer actions, each with an owner and a date, reviewed at the start of the next retro, closes the loop. A new format treats the symptom; owning every action yourself makes improvement the TPM's job instead of the team's; cutting retros removes the loop entirely.",
    lookFor: 'Closes the improvement loop with ownership and follow-through, rather than more ceremony.',
  },
  {
    id: 'iq-40',
    category: 'Execution',
    prompt: "A workstream has reported '90% done' for three weeks running. What do you do?",
    options: [
      "List what's left as concrete tasks, agree a definition of done, and ask for a demo of what works today.",
      "Accept it for now; the last 10% always takes longest, and pushing too hard will only hurt the team's morale.",
      "Escalate to the team's manager, since three weeks without visible progress points to a performance problem.",
      'Add a daily status check-in with the team until the reported number finally moves past 90%, then ease off.',
    ],
    answer: 0,
    explanation:
      "'90% done' for weeks usually means the remaining work was never broken down or 'done' was never defined. Make it concrete: list what's left, agree the definition of done, see a demo. Accepting it lets the slip hide; escalating treats an estimation problem as a people problem; daily check-ins add pressure without information.",
    lookFor: 'Replaces percent-complete with concrete remaining work, a definition of done and demos.',
  },

  // ───────────────────────────── Singapore ─────────────────────────────
  {
    id: 'iq-41',
    category: 'Singapore',
    prompt:
      "You're TPM on a Singapore bank's app revamp. After a release, customers can't log in. Engineers want to debug first and decide later if it's reportable. What do you do?",
    options: [
      'Let engineering finish diagnosing first so the report to MAS is accurate; a wrong early report looks worse than a late one.',
      "Trigger the bank's incident process now so Risk and Compliance can assess it; relevant incidents must reach MAS within 1 hour.",
      "Roll back quietly, and if service recovers within the hour, treat it as a non-event that doesn't need reporting.",
      'Notify MAS directly yourself right away, since you own the release and speed matters more than process here.',
    ],
    answer: 1,
    explanation:
      "MAS expects relevant incidents to be notified within 1 hour of discovery, so the clock runs before root cause is known. The TPM's job is to trigger the bank's incident process so Risk and Compliance assess it immediately. Waiting for a clean diagnosis can blow the window; notifying MAS yourself bypasses the bank's designated channel.",
    lookFor: "Knows MAS's 1-hour expectation, treats reporting as part of incident response, and uses the bank's own process.",
  },
  {
    id: 'iq-42',
    category: 'Singapore',
    prompt:
      "Your bank's new payments platform is classified as a critical system. The vendor's disaster recovery design restores service in 8 hours. Go-live is in two months. What do you do?",
    options: [
      'Accept it for go-live and improve DR in phase 2, since 8 hours is a common recovery target for a brand-new platform.',
      'Add a contract penalty for any outage over 4 hours, so that the financial risk of a long outage is transferred to the vendor.',
      'Get the business owner to sign a risk acceptance, so the program can still go live on its current schedule.',
      'Treat it as a launch blocker: MAS expects an RTO of at most 4 hours for critical systems, so redesign and test DR.',
    ],
    answer: 3,
    explanation:
      "For critical systems, MAS expects a recovery time objective of no more than 4 hours; that's a regulatory expectation, not a stretch goal. DR must be designed and tested to meet it before go-live. A penalty clause compensates the bank but restores nothing; a business risk acceptance can't waive a regulatory requirement.",
    lookFor: 'Knows MAS critical-system expectations and treats regulatory requirements as launch criteria, not trade-offs.',
  },
  {
    id: 'iq-43',
    category: 'Singapore',
    prompt:
      "A bug in your Singapore e-commerce app exposed customers' personal data. On Monday the DPO assessed the breach as notifiable. What is the deadline, and what do you do?",
    options: [
      'PDPC within 3 calendar days of that assessment. Get the DPO the facts fast: timeline, affected users, fix status.',
      'Within 72 hours of engineering first spotting the bug, as with GDPR, which means the deadline may already have passed.',
      "Notify once the fix has shipped, so the notice confirms it's resolved and doesn't alarm customers needlessly.",
      'Within 30 days, after the full investigation is done, so the report to PDPC is complete and accurate.',
    ],
    answer: 0,
    explanation:
      "Under the PDPA, once a breach is assessed as notifiable, PDPC must be notified within 3 calendar days. The TPM's job is to feed the DPO accurate facts quickly. The GDPR answer is tempting, but the PDPA clock runs from the assessment (which itself mustn't be dragged out); waiting for the fix or a full report misses the window.",
    lookFor: 'Knows the PDPA 3-day rule, does not confuse it with GDPR, and supports the DPO with facts.',
  },
  {
    id: 'iq-44',
    category: 'Singapore',
    prompt:
      'Your bank program depends on a large systems integrator (SI). Their weekly status is always green, but your team has seen very few working demos. What do you do?',
    options: [
      'Trust their reporting; the SI is contractually accountable for delivery, and micromanaging sours the partnership.',
      "Escalate to the SI's account director and threaten contract penalties, so they take the slippage seriously.",
      'Move to evidence-based milestones (working demos, test results, defect trends) tied to contract acceptance criteria.',
      'Embed your own engineers in the SI team to review their code daily and report back on the real progress.',
    ],
    answer: 2,
    explanation:
      'With vendors, verify progress through working software, not slideware: demos, test pass rates and defect trends, mapped to acceptance criteria in the contract. Trusting green reports is how watermelon programs happen; threatening penalties before you have evidence damages the partnership; daily code reviews are micromanagement you cannot sustain.',
    lookFor: 'Outcome-based vendor governance tied to the contract: firm, but partnership-preserving.',
  },
  {
    id: 'iq-45',
    category: 'Singapore',
    prompt:
      'Your teams sit in Singapore, Bangalore, Shenzhen and Seattle. Decisions keep stalling across time zones. What do you change?',
    options: [
      'Move every key meeting into Singapore business hours, since the program is run and sponsored from the Singapore office.',
      'Go async-first: written proposals with a decision owner and deadline, plus one live sync whose time rotates.',
      'Hold one daily call that all four sites attend, even if it falls late at night or early morning for some of them.',
      'Let each site make its own decisions locally and share them in a weekly summary, so that nobody is ever blocked.',
    ],
    answer: 1,
    explanation:
      'Across far-apart time zones, async-first scales: written proposals with a named decision owner and a deadline, plus a rotating live slot so the inconvenience is shared. Singapore-hours-only quietly taxes Seattle every week; a daily all-sites call burns people out; site-by-site decisions fragment the design.',
    lookFor: 'Async-first decision-making, fairness across time zones, and clear decision ownership.',
  },
  {
    id: 'iq-46',
    category: 'Singapore',
    prompt:
      'On your multicultural team, some engineers rarely disagree in meetings, then raise concerns privately after decisions are made. How do you adapt?',
    options: [
      'Tell the team you expect everyone to speak up in meetings, because direct challenge is part of good engineering.',
      'Make the key decisions in smaller meetings with the more vocal senior engineers, so that things move faster.',
      'Take silence as agreement and move on; people will raise blockers themselves if they really matter to them.',
      'Open more channels: pre-reads with written comments, round-robin input, and 1:1s before decisions are final.',
    ],
    answer: 3,
    explanation:
      "In many cultures, disagreeing openly with a group or a senior person carries a real cost. Give people safer channels: written pre-reads, structured round-robins, 1:1s. Demanding that everyone speak up ignores why they don't; reading silence as agreement means concerns arrive after the decision, when they're expensive.",
    lookFor: 'Cultural awareness, psychological safety, and inclusive decision-making mechanisms.',
  },
  {
    id: 'iq-47',
    category: 'Singapore',
    prompt: "You're planning a Q1 launch for a Singapore retail bank. What calendar factors do you build into the plan?",
    options: [
      'Chinese New Year: heavy leave in teams and vendors, plus change freezes around peak periods. Confirm freeze dates early.',
      'Schedule go-live just before Chinese New Year, to capture the festive surge in transfers, red-packet gifting and spending.',
      "Ask the team to defer their festive leave until after launch; it's a one-off sacrifice for a key, highly visible program.",
      "Nothing specific: public holidays are already in everyone's calendar, and the team will plan around them.",
    ],
    answer: 0,
    explanation:
      'Q1 in Singapore means Chinese New Year: significant leave across teams and vendors, and many banks freeze production changes around peak periods. Confirm freeze windows with operations early and plan around them. Launching just before CNY puts a new system under peak load with a thin team; asking people to give up festive leave burns goodwill.',
    lookFor: 'Plans around local calendars, change freezes and leave, and respects festive commitments.',
  },
  {
    id: 'iq-48',
    category: 'Singapore',
    prompt: 'Last question: why do you want to be a TPM in Singapore specifically?',
    options: [
      'Singapore offers strong pay, low taxes and a stable environment, and a TPM role here would be a good salary step up for me.',
      'My PMP is well regarded by Singapore employers, especially the banks, and TPM is the natural next step for a certified project manager.',
      "Programs here are regional: multi-market launches, MAS regulation, APAC-wide teams. That's the cross-team work I've done and want to scale.",
      'TPM roles in Singapore are less technical than in the US, which suits my plan to move away from hands-on coding for good.',
    ],
    answer: 2,
    explanation:
      'Strong answers connect your experience to what makes the role here distinct: regional, multi-market, regulated, multi-timezone programs. Pay and tax are real but self-focused; leaning on the PMP alone undersells the engineering depth that makes an ex–tech lead credible; and TPM roles here still expect real technical depth.',
    lookFor: "A specific, role-centred motivation linking your experience to Singapore's regional, regulated programs.",
  },
]
