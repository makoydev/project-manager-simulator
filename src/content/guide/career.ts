import type { CareerSection } from '../types'

/**
 * Career Kit — always unlocked. Practical transition material for engineers and tech leads
 * (often PMP-certified) moving into TPM roles in Singapore.
 * Rules: employer categories only (no private companies), no salary figures, regulatory details kept general.
 */
export const CAREER: CareerSection[] = [
  {
    id: 'what-tpms-do',
    title: 'What a TPM actually does',
    icon: '📆',
    blurb: "A realistic week, and the altitude shift from ‘how’ to ‘when, who and in what order’.",
    blocks: [
      {
        type: 'p',
        text: "Forget the job ads for a moment. Here's a realistic week for a TPM running a mid-sized program: say, a new payments feature touching five engineering teams, one vendor, Security and Compliance.",
      },
      {
        type: 'steps',
        items: [
          {
            title: 'Monday: plan the week',
            text: "Skim what moved overnight (hello, US teams). Update the milestone tracker and RAID log. Run the 30-minute program sync: critical path, new risks, blockers that need decisions. 1:1 with the PM to settle two scope questions before they turn into debates.",
          },
          {
            title: 'Tuesday: dependencies',
            text: "The partner team's API has slipped three days. Meet their EM, agree a contract-first plan with mocks so the client team keeps moving, and update the plan. Sit in on an architecture review asking about failure modes, data migration and rollback, not frameworks. Weekly vendor call in the afternoon: a demo, not slides.",
          },
          {
            title: 'Wednesday: stakeholders',
            text: "Pre-wire next week's SteerCo with the sponsor. Kopi with the security lead to check the review timeline (and discover a new requirement, pleasantly early). Draft a one-page decision memo: full scope late, or the core on time with a fast-follow?",
          },
          {
            title: 'Thursday: risk and readiness',
            text: "Walk the launch-readiness checklist with its owners. Chase the load-test date. Close out overdue actions. Take the late call with Seattle and write up the decisions so Bangalore sees them first thing tomorrow.",
          },
          {
            title: 'Friday: tell the truth, in writing',
            text: "Send the weekly status report: RAG, milestones planned vs forecast, top risks, one clear ask. Update the decision log. Thank people by name. Spend an hour planning next week, then log off on time.",
          },
        ],
      },
      {
        type: 'p',
        text: "Notice what's missing: writing production code, owning a design, running anyone's performance review. Notice what's there: lots of writing, lots of conversations, and constant re-planning as reality changes.",
      },
      {
        type: 'table',
        headers: ['', 'As a tech lead', 'As a TPM'],
        rows: [
          ['You own', 'The how: design and code quality for one team', 'The when, who and in what order, across teams'],
          ['Time horizon', 'This sprint, this design', 'This quarter, this launch, the next dependency'],
          ['Success', 'A clean, working system', 'The right outcome shipped, on a date people trusted'],
          ['Main tools', 'IDE, design docs, code review', 'Plans, RAID log, status reports, conversations'],
          ['When it breaks', 'You fix it', 'The right person fixes it, and everyone who needs to know, knows'],
          ['Your authority', 'Technical, over your own team', "Borrowed: credibility and relationships with people who don't report to you"],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'The one-sentence version',
        text: "A TPM makes sure a complex, multi-team technical initiative succeeds by making the plan, the risks and the decisions visible, and by removing whatever is in the way.",
      },
    ],
  },
  {
    id: 'role-compare',
    title: 'TPM vs Tech Lead vs EM vs PM vs Project Manager vs Scrum Master',
    icon: '🆚',
    blurb: 'Six roles that sound alike but own different things. Here is the cheat sheet.',
    blocks: [
      {
        type: 'p',
        text: "Titles vary a lot between companies, so treat this as the default pattern and verify it locally. In interviews, explaining these differences crisply is itself a signal that you understand the job.",
      },
      {
        type: 'table',
        headers: ['Role', 'Owns', 'Accountable for', 'Success looks like', 'Typical day'],
        rows: [
          [
            'TPM',
            'Cross-team execution: plan, dependencies, risks, communication',
            'Landing the program outcome on a credible date',
            'Shipped on time (or reset early), no surprises, status people believe',
            'Syncs and 1:1s, RAID review, writing updates, unblocking, design reviews as a risk-spotter',
          ],
          [
            'Tech Lead',
            'Technical design and quality for one team',
            'A system that works, scales and can be maintained',
            'Sound architecture, healthy codebase, a team shipping steadily',
            'Design, code review, some coding, mentoring, technical decisions',
          ],
          [
            'Engineering Manager',
            'People and team delivery',
            'Team performance, hiring, growth and delivery commitments',
            'A healthy, productive team that keeps its promises',
            '1:1s, hiring, planning, performance conversations, cross-team alignment',
          ],
          [
            'Product Manager',
            'The what and why: problem, priorities, requirements',
            'Product outcomes: adoption, revenue, customer value',
            'Users get value and the metrics move',
            'Customer research, roadmap, specs, prioritisation, stakeholder alignment',
          ],
          [
            'Project Manager',
            "A defined project's scope, schedule and budget",
            'Delivering to plan, within governance',
            'On time, on budget, signed off',
            'Plans, governance reports, RAID, vendors, steering committees',
          ],
          [
            'Scrum Master / Agile Coach',
            'Team process and agile practice',
            'Team effectiveness and continuous improvement',
            'A team that self-organises and keeps getting better',
            'Facilitating ceremonies, removing impediments, coaching',
          ],
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: "Overlaps are normal. In smaller companies one person may be TL and EM, or PM and TPM. In banks, a ‘Project Manager’ or ‘Delivery Manager’ often does much of what a TPM does at a tech company, with more governance and less system design.",
      },
      {
        type: 'p',
        text: "Three questions that reveal which role you're really being hired for:",
      },
      {
        type: 'list',
        items: [
          'Which decisions will I own, and which will I only influence?',
          'How many teams will I work across, and who do they report to?',
          'How will you judge success in my first six months?',
        ],
      },
    ],
  },
  {
    id: 'sg-market',
    title: 'The TPM market in Singapore',
    icon: '🦁',
    blurb: 'Who hires TPMs here, what the role means in each corner, and how to decode a job ad.',
    blocks: [
      {
        type: 'p',
        text: "Singapore is a regional hub, so ‘TPM’ covers a spectrum: from engineering-heavy roles at global tech companies' APAC hubs to governance-heavy delivery roles in banks and government. Knowing which flavour you're looking at saves wasted applications and tells you how to pitch yourself.",
      },
      {
        type: 'table',
        headers: ['Employer category', 'What the role tends to mean', 'What they value most'],
        rows: [
          [
            'Big-tech APAC hubs',
            'Cross-team engineering programs, often with HQ teams in other time zones; strong written culture; system design interviews are common',
            'Technical depth, operating at scale, comfort with ambiguity, crisp writing',
          ],
          [
            'Banks & financial institutions',
            'Technology programs under heavy governance (MAS TRM, change boards, audit, vendors); often titled Technical Project Manager, Delivery Lead or IT Project Manager; scaled agile is common',
            'Regulatory awareness, business-and-tech stakeholder management, vendor management; PMP is often valued',
          ],
          [
            'Fintech & super-apps',
            'Fast product launches with payments, partner and licensing dependencies; scrappy; may blend TPM with product operations',
            'Speed with judgement, pragmatism, comfort with regulation, multi-market launches',
          ],
          [
            'E-commerce & logistics',
            'High-scale systems, peak events such as big sale days, operations-heavy launches, warehouse and partner integrations',
            'Reliability and peak-readiness planning, close work with operations, data-driven decisions',
          ],
          [
            'Public sector & government tech agencies',
            'Digital government services delivered across agencies, under IM8 policies and government procurement rules; agile delivery is increasingly common',
            'Cross-agency stakeholder management, procurement and vendor management, security and data governance',
          ],
          [
            'Consultancies & systems integrators',
            'Client-facing delivery for banks, government and enterprises; billable; formal methods and documentation; often more project than program',
            'Client management, structured delivery, commercial awareness (scope, change requests, margins); PMP is a common requirement',
          ],
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Public bodies worth knowing',
        text: "MAS regulates financial institutions and issues the TRM Guidelines. PDPC administers the PDPA. CSA, the Cyber Security Agency, oversees national cybersecurity, including critical information infrastructure. IMDA develops and regulates the infocomm and media sector. GovTech builds many of the government's digital services. You'll meet their rules, frameworks or programmes in almost any Singapore TPM role.",
      },
      {
        type: 'p',
        text: 'The title zoo. Same job, different names; different jobs, same name. Use this as a first-pass decoder:',
      },
      {
        type: 'table',
        headers: ['Title', 'Usually means', 'Clues in the job ad'],
        rows: [
          [
            'Technical Program Manager',
            'Cross-team engineering programs; technical depth expected',
            '‘Multiple engineering teams’, ‘cross-functional’, ‘system design’, ‘technical trade-offs’, ‘drive alignment’, ‘ambiguity’',
          ],
          [
            'Technical Project Manager',
            'One substantial project with technical content, often in banks or SIs; delivery-focused',
            '‘SDLC’, ‘project plan’, ‘UAT’, ‘go-live’, ‘budget tracking’, ‘PMP preferred’',
          ],
          [
            'Delivery Manager',
            'Delivery across one or more agile teams or products; may include vendor or people management; client delivery at consultancies',
            '‘Agile delivery’, ‘squads’, ‘release management’, ‘delivery governance’, ‘client’',
          ],
          [
            'IT Project Manager',
            'Classic IT projects (infrastructure, upgrades, migrations, packaged software) with formal governance',
            '‘Waterfall/hybrid’, ‘steering committee’, ‘project charter’, ‘change requests’, ‘PMP or PRINCE2’',
          ],
          [
            'Scrum Master / Agile Coach',
            'Team process and coaching, not program ownership',
            '‘Facilitate ceremonies’, ‘CSM/PSM’, ‘coach teams’, ‘impediments’, ‘agile transformation’',
          ],
        ],
      },
      {
        type: 'steps',
        items: [
          {
            title: 'Find the verbs',
            text: "‘Drive’, ‘own’, ‘define’ and ‘influence’ point to a program role. ‘Coordinate’, ‘track’, ‘support’ and ‘report’ point to a coordinator role with less authority.",
          },
          {
            title: 'Count the teams',
            text: "‘Across multiple engineering teams or markets’ suggests a true TPM. ‘For the X system’ suggests a project role.",
          },
          {
            title: 'Weigh the technical asks',
            text: "APIs, distributed systems, cloud architecture or ‘system design’ mean they'll test technical depth. ‘Familiarity with the SDLC’ means they probably won't.",
          },
          {
            title: 'Spot the governance words',
            text: 'MAS TRM, audit, change management, vendor management: a regulated environment, where your PMP and governance experience are selling points.',
          },
          {
            title: 'Ask in the first call',
            text: '“Which decisions does this role own?” “How many teams?” “Who does it report to?” “What does success look like at six months?”',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Where to look',
        text: "MyCareersFuture, the government's job portal, lists many Singapore roles, alongside company career pages, professional networks and specialist recruiters. Search every title in the zoo, not just ‘Technical Program Manager’; some of the best TPM-shaped jobs are called something else.",
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'If you need a work pass',
        text: "Foreign professionals typically need an Employment Pass (EP). The employer applies, and the Ministry of Manpower (MOM) assesses it, including under the COMPASS points-based framework, which weighs individual factors such as salary and qualifications alongside employer factors such as workforce diversity and support for local employment. Criteria change, so check MOM's website for the current rules, and ask recruiters early whether a role can support a pass.",
      },
    ],
  },
  {
    id: 'unfair-advantage',
    title: 'Your unfair advantage: Tech Lead + PMP',
    icon: '🃏',
    blurb: 'What transfers, what to unlearn, and how to tell the story.',
    blocks: [
      {
        type: 'p',
        text: "Most TPM candidates bring either technical depth or delivery discipline. You bring both: six years of building systems and leading engineers, plus a formal framework for planning, risk and stakeholders. Your job is to make that combination impossible to miss.",
      },
      {
        type: 'table',
        headers: ['You already have', 'How it shows up as a TPM'],
        rows: [
          ['Systems and architecture knowledge', 'Spotting integration risks, challenging estimates credibly, holding your own in design reviews, translating tech risk for executives'],
          ["Leading a team's delivery", 'Breaking down work, planning, clearing blockers, now at multi-team scale'],
          ['Incidents and on-call', 'Running incident comms, readiness checklists and blameless post-mortems'],
          ['Engineer empathy', "Knowing when an estimate is padded and when a team is drowning; earning engineers' trust fast"],
          ['PMP: risk, scope, schedule, stakeholders', 'A shared vocabulary for structuring ambiguous programs, and instant credibility in governance-heavy places like banks, SIs and the public sector'],
        ],
      },
      { type: 'p', text: 'What to unlearn:' },
      {
        type: 'list',
        items: [
          "Being the best engineer in the room. You'll be judged on outcomes across teams, not on your solutions.",
          'Fixing it yourself. Your instinct to dive in is now a liability; route problems to owners and clear their path.',
          'Heavyweight PMBOK artefacts. Tech companies want a one-page plan and a living RAID log, not a 40-page management plan. Keep the thinking, drop the paperwork.',
          '‘Done’ means merged. Done now means launched, adopted and measured.',
          'The best argument wins. Now you need alignment, and alignment comes from interests, not correctness.',
        ],
      },
      {
        type: 'steps',
        items: [
          {
            title: 'Pitch, part 1: the hook',
            text: "“I've spent six years building and leading engineering teams, and increasingly the hardest problems weren't technical. They were cross-team.”",
          },
          {
            title: 'Part 2: the evidence',
            text: '“As tech lead on our payments migration, I coordinated three teams and a vendor, owned the cutover plan and risk log, and we launched two weeks early with no SEV1s.” (Use your own story and your own numbers.)',
          },
          {
            title: 'Part 3: the framework',
            text: '“My PMP gave structure to what I was already doing (risk, scope, stakeholder management), and I want to do it full-time, at program scale.”',
          },
          {
            title: 'Part 4: the fit',
            text: "“That's why this role: [their program, their scale, their domain].” Research enough to fill the brackets with something specific.",
          },
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: "Don't apologise for the career change. Frame it as a natural progression: you moved from owning one team's technical outcome to owning cross-team outcomes, and you've been doing more of the latter than your title suggests.",
      },
    ],
  },
  {
    id: 'cv-rewrite',
    title: 'Rewrite your CV',
    icon: '✍️',
    blurb: 'Before/after bullets that turn tech-lead work into TPM evidence.',
    blocks: [
      {
        type: 'p',
        text: 'TPM hiring managers scan for scope (how many teams, how big), cross-team impact, risks handled, and outcomes with numbers. Most tech-lead CVs list technologies and tasks instead. Rewrite each bullet as: action + scope + how + measurable outcome.',
      },
      {
        type: 'table',
        headers: ['Before (tech-lead voice)', 'After (TPM voice)'],
        rows: [
          [
            'Led migration of the payment service from a monolith to microservices on Kubernetes.',
            'Drove a six-month payments-platform migration across 4 teams and 2 vendors; owned the cutover plan and RAID log; delivered with zero customer-facing downtime and ~30% lower infrastructure cost.',
          ],
          [
            'Built a new API for the mobile team.',
            'Negotiated the API contract between the backend and 2 client teams up front, enabling parallel development against mocks and cutting integration time from 3 weeks to 1.',
          ],
          [
            'Mentored 5 junior engineers.',
            "Raised a 7-person team's delivery predictability: introduced estimation and sprint-planning practices that lifted commitments delivered from ~60% to ~85%, while mentoring 5 engineers.",
          ],
          [
            'Handled production incidents.',
            'Served as incident commander for 12 SEV1/SEV2 incidents; introduced blameless post-mortems and a launch-readiness checklist that cut repeat incidents by ~40% over two quarters.',
          ],
          [
            'Worked with product and QA on releases.',
            'Coordinated quarterly releases across Product, QA, Security and Operations; ran go/no-go reviews and phased rollouts to 1.2M users with no rollbacks in 18 months.',
          ],
          [
            'Upgraded the database to the latest version.',
            'Planned and de-risked a database upgrade affecting 20+ dependent services (dependency mapping, staging rehearsal, rollback plan, stakeholder comms) and completed it in a single 2-hour window.',
          ],
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: "The numbers above are illustrative. Use your own, and estimate honestly (‘~’, ‘about’) when you don't have exact figures; a credible estimate beats a suspiciously precise one.",
      },
      {
        type: 'list',
        items: [
          "Open with a three-line summary that names the target role, so screeners don't file you under ‘engineer’.",
          'Lead each bullet with scope: teams, engineers, vendors, users, markets, budget.',
          'Name the program artefacts and rituals you owned: roadmap, RAID log, status reports, go/no-go, SteerCo updates.',
          'Quantify outcomes: time saved, incidents reduced, revenue enabled, cost cut, dates hit.',
          "Keep the tech stack, but shrink it to one skills line. It supports credibility; it isn't the headline.",
          "Put your PMP near the top. In banks, SIs and the public sector it's often a screening keyword.",
        ],
      },
      {
        type: 'callout',
        tone: 'warn',
        text: "Only claim what you'd happily be grilled on. Every bullet is an interview question waiting to happen (“tell me more about that migration”), so prepare a STAR story behind each one.",
      },
    ],
  },
  {
    id: 'interview-loop',
    title: 'The interview loop, decoded',
    icon: '🎤',
    blurb: 'The typical rounds, what each one is really testing, and how to prepare.',
    blocks: [
      {
        type: 'p',
        text: 'Loops vary, but most TPM hiring processes combine some of the rounds below. Global tech hubs tend to run the full loop; banks and SIs often compress it into two or three conversations focused on delivery experience and governance.',
      },
      {
        type: 'steps',
        items: [
          {
            title: 'Recruiter screen (20–30 min)',
            text: "Probes: motivation, role fit, notice period, work-pass status, expectations. Prep: a 60-second career story that ends in ‘why TPM, why here’; know your notice period; research market ranges before the call, not during it.",
          },
          {
            title: 'Hiring manager conversation',
            text: "Probes: the scale of programs you've run, how you operate, team fit. Prep: two or three flagship stories with numbers, and a sharp question about their biggest program risk right now.",
          },
          {
            title: 'Program / execution deep dive',
            text: "Probes: how you plan, track dependencies, manage risk and recover from slips. Expect “walk me through a program from kickoff to launch”. Prep: one program end to end: goal, teams, plan, risks, the crisis, the outcome, what you'd change.",
          },
          {
            title: 'Technical / system design at TPM depth',
            text: 'Probes: do you understand architecture, trade-offs and failure modes well enough to drive decisions? You may design or critique a system (a payments flow, a notification service) at whiteboard level: APIs, data stores, scaling, reliability, rollout. Prep: talk through three or four classic designs, focusing on trade-offs, risks, migration and rollout rather than code.',
          },
          {
            title: 'Behavioural (STAR)',
            text: 'Probes: leadership, conflict, failure, influence without authority, ambiguity. Prep: eight to ten STAR stories mapped to the themes below, each with a quantified result, and one genuine failure among them.',
          },
          {
            title: 'Stakeholder and conflict scenarios',
            text: 'Probes: judgement under pressure. “The VP wants a new feature two weeks before launch.” “Two teams both claim the same service.” Prep: answer with a visible structure: clarify the goal → gather facts → options with trade-offs → recommendation → communicate and document.',
          },
          {
            title: 'Written exercise or presentation (sometimes)',
            text: 'Probes: clear, structured writing. You might turn a messy scenario into a status update, sketch a program plan, or present a past program. Prep: practise a one-page plan and a RAG status report; make them skimmable and lead with the ask.',
          },
        ],
      },
      {
        type: 'table',
        headers: ['Story theme', 'Your story should show'],
        rows: [
          ['Influence without authority', "Getting a team that doesn't report to you to commit, and how you did it"],
          ['Conflict', 'Resolving a disagreement between teams or with a stakeholder without burning the bridge'],
          ['Failure', 'Owning a miss, what you learned, and what you changed afterwards'],
          ['Ambiguity', 'Turning a fuzzy goal into a plan people could execute'],
          ['Bad news', 'Escalating early, with options and a recommendation'],
          ['Technical judgement', 'Spotting a technical risk others had missed'],
          ['Prioritisation', 'Saying no, or trading scope, while keeping the relationship'],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'STAR, properly',
        text: "Situation, Task, Action, Result. Keep Situation and Task to about 20% of the answer, spend 60% on Action (say ‘I’, not ‘we’), and finish with a Result in numbers, plus one line on what you learned.",
      },
    ],
  },
  {
    id: 'first-90-days',
    title: 'Your first 30-60-90 days as a TPM',
    icon: '🌱',
    blurb: 'Listen, then map, then deliver: a plan for your first three months.',
    blocks: [
      {
        type: 'p',
        text: "Your first 90 days set your reputation. The goal isn't to change everything; it's to understand the landscape, earn trust, and land a visible win that proves the value of the role.",
      },
      {
        type: 'steps',
        items: [
          {
            title: 'Days 1–30: listen and learn',
            text: "Meet every key stakeholder (20–30 one-to-ones is normal) and ask what's working, what's broken, what they expect from you and what keeps them up at night. Read the architecture docs, roadmaps, past post-mortems and status reports. Learn how decisions, change approvals and budgets really work. Shadow an incident review or an on-call handover. Don't change any process yet.",
          },
          {
            title: 'Days 31–60: map and start owning',
            text: 'Write the program brief, milestone plan, dependency map, RAID log and stakeholder map. Set your cadence: weekly sync, weekly written status, decision log. Get owners on the top three risks. Pick one quick win (a stuck dependency, a missing readiness checklist, a meeting nobody needs) and fix it.',
          },
          {
            title: 'Days 61–90: deliver and improve',
            text: "Run the program on your cadence and hit a milestone, or reset one early and well. Make one process improvement grounded in what you've learned, such as a launch checklist or a better intake process. Share a 90-day reflection with your manager: what you've learned, what you're changing, where you need support.",
          },
        ],
      },
      { type: 'p', text: 'Questions worth asking in your first 1:1s:' },
      {
        type: 'list',
        items: [
          'What does success look like for this program, and for me, in six months?',
          "What's the one thing most likely to make us fail?",
          "Who should I get to know who isn't on the org chart?",
          'How do you like to receive updates, and how often?',
          "What did the last person in this role do that you'd like me to keep doing, or stop?",
        ],
      },
      {
        type: 'callout',
        tone: 'warn',
        text: 'The new-TPM trap: arriving with a 12-step process straight from the PMP textbook. Earn the right to change things by first understanding why they are the way they are.',
      },
    ],
  },
  {
    id: 'practice-plan',
    title: 'A 4-week practice plan',
    icon: '🏋️',
    blurb: 'Four weeks, about an hour a day, from curious to interview-ready.',
    blocks: [
      {
        type: 'p',
        text: "This plan assumes roughly an hour on weekdays plus a longer weekend session; stretch it if you need to. The rule: produce things, don't just read. TPM interviews reward people who can show clear artefacts and tell crisp stories.",
      },
      {
        type: 'steps',
        items: [
          {
            title: 'Week 1: learn the job',
            text: "Play a full run of Ship It, Lah! on the easiest scenario and read every Mentor's take. Study the Field Guide entries you unlock, starting with The Role, Planning and Communication. Write a one-page program brief for a project you actually led: goal, scope, teams, milestones, risks, decision-makers.",
          },
          {
            title: 'Week 2: build your artefacts',
            text: 'Create a sample RAID log (10–15 rows) for that past project, then write three weekly status reports for it: one Green, one Amber, one Red. Replay a scenario with a different background and compare your decision logs. Rewrite your CV using the before/after patterns.',
          },
          {
            title: 'Week 3: stories and system design',
            text: 'Write eight to ten STAR stories from your tech-lead years using the story-bank themes. Practise three system design walkthroughs at TPM depth (a payments flow, a notification service, a data migration), focusing on trade-offs, risks and rollout. Play an Interview Arcade round daily and read every explanation.',
          },
          {
            title: 'Week 4: mock and polish',
            text: 'Run two or three mock interviews with a friend or a peer TPM: one behavioural, one program deep dive, one design. Replay the hardest scenario, aiming for an honest status report every Friday and a clean go/no-go. Tailor your pitch for three to five target employers across different categories.',
          },
        ],
      },
      { type: 'p', text: 'Daily habits that compound:' },
      {
        type: 'list',
        items: [
          'One Interview Arcade round a day, and read why the wrong answers are wrong.',
          'Read one public incident post-mortem or engineering blog post and ask: what would the TPM have done here?',
          'One coffee chat a week with a working TPM. Ask for 20 minutes, arrive with three good questions, and follow up with thanks.',
          'Say your 60-second pitch out loud until it sounds like you, not a script.',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: "Your practice artefacts double as interview props: walking through a RAID log or status report you wrote is concrete evidence that you think like a TPM. Just never share an employer's confidential material; sanitise everything.",
      },
    ],
  },
  {
    id: 'office-singlish',
    title: 'Office Singlish for the new TPM',
    icon: '🗣️',
    blurb: 'A friendly mini-glossary for meetings, pantry chats and team chat threads.',
    blocks: [
      {
        type: 'p',
        text: "Singlish is affectionate, efficient and everywhere: in pantry chats, team chat threads and the occasional SteerCo. You don't need to speak it (please don't force it), but understanding it helps you read the room.",
      },
      {
        type: 'table',
        headers: ['Say what?', 'Meaning', 'Heard at work'],
        rows: [
          ['Can or not?', 'Is it possible? Will you do it?', '“Launch by Friday, can or not?” Answer with a trade-off, not just “can”.'],
          ['Can', 'Yes, doable', "“Can.” Always confirm what ‘can’ includes, and by when."],
          ['lah', 'Particle for emphasis or reassurance', "“Don't worry lah, the team will settle it.”"],
          ['leh', 'Particle that softens a request or a mild protest', '“This one quite urgent leh.”'],
          ['lor', "Particle of resignation: that's just how it is", '“Vendor late, so we wait lor.”'],
          ['alamak', 'Oh no! Oh dear!', '“Alamak, prod is down.”'],
          ['paiseh', 'Embarrassed; sorry (for something small)', '“Paiseh, I missed your message.”'],
          ['kiasu', 'Afraid of missing out; extra-cautious or competitive', 'The stakeholder who books the go/no-go room three weeks early and wants five backup plans.'],
          ['chope', 'To reserve (classically with a tissue packet on a hawker table)', '“Can chope the big meeting room for go/no-go?”'],
          ['sian', 'Bored, tired, fed up', '“Another regression cycle… sian.”'],
          ['shiok', 'Fantastic, deeply satisfying', '“Load test passed first time. Shiok!”'],
          ['lepak', 'To chill, hang out', '“Launch done. Lepak at the hawker centre later?”'],
          ['on? / on!', 'Deal? Are you in? / Deal!', '“Lunch at 12, on?” “On!”'],
          ['take MC', 'Take medical leave (with a medical certificate)', "“Ravi took MC today.” Replan; don't chase."],
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Read ‘can’ carefully',
        text: "A cheerful “can!” may mean “it's possible” rather than “it's committed, with a date”. Follow up warmly: “Great, by when, and what do you need from us?”",
      },
    ],
  },
]
