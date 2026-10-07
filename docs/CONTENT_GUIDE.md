# Content Guide — writing scenarios & events for *Ship It, Lah!*

*Ship It, Lah!* is a Technical Program Manager (TPM) simulator set in Singapore. The player is a
new TPM (often an ex–tech lead with a PMP) who must land a 3-week program. Everything the player
learns comes from **events**: realistic dilemmas with 2–4 choices, each graded the way a
seasoned TPM would grade it, with an insight that teaches *why*.

All content is typed data — see `src/game/types.ts` (the source of truth) and validated by
`src/game/validate.ts`. Run `npx vitest run src/content` to validate.

---

## 1. How the simulation works (so your numbers make sense)

* **Days.** Day 1 is a Monday. Weeks are Days 1–5, 6–10, 11–15. Target launch is usually Day 15.
  Every Friday (Day 5, 10, 15) the player writes a RAG status report. Go/No-Go happens on the
  target day. Slips can extend to `maxDay` (usually 20).
* **Focus ⚡.** The player has **6 focus points per day**. Each choice costs 0–3. Handling everything
  is impossible, so triage matters. Unanswered events **expire** and apply their `ignored` outcome.
* **Meters** (0–100): `morale` (team), `trust` (stakeholders/execs), `quality` (code/test health,
  drives incident risk), `energy` (the player's own stamina). `budget` is the remaining contingency
  in **S$ thousands** (can go negative).
* **Workstreams.** Five per scenario: `core`, `client`, `platform`, `data`, `review`. Each has
  `work` points and a base `velocity` (points/day). At the end of each day every workstream gains
  `velocity × f × modifiers`, where `f = 0.55 + 0.4·morale/100 + 0.3·quality/100`
  (≈1.0 at morale 60–65 and quality 65–70). Blocked workstreams gain nothing.
* **Dependencies.** `deps: [{ on: 'core', capAt: 0.7 }]` means the workstream cannot pass 70% until
  `core` is 100%. This is how the critical path emerges. `relaxDependency` raises a cap (e.g. after
  agreeing an API contract and building mocks).
* **Projected launch** = the day the last workstream finishes at current pace. The player sees it
  live. Being late is the main source of tension.
* **Risks (RAID log).** Each scenario has 5–9 risks with likelihood × impact (1–5 each). Each day an
  active risk materialises with probability ≈ `likelihood × 3%` (×0.25 if mitigated). When it fires,
  its `trigger` event lands in the inbox. Hidden risks are revealed by risk reviews or by having
  kopi (1:1s) with the risk's `owner`.
* **Relationships** (0–100 per role, start ~50). `chance` outcomes use them:
  `p = base + (rel − 50)/100`. This is how "build relationships before you need them" is taught.
* **Skill XP.** Each event names a primary `skill`; best choices give +3 XP, okay +1, poor 0.

## 2. Voice & tone

* **Fun, warm, witty — and real.** Every event should feel like something that actually happens to
  TPMs: Slack pings at 11pm, a VP "quick question", a dependency team that quietly slipped, a
  vendor that says "can" to everything.
* **Singapore flavour, lightly.** Hawker lunches, kopi, MRT, one-north / CBD / Changi Business Park,
  CNY / Hari Raya / Deepavali leave, 11.11 sales, NS reservist call-ups (ICT), MC (medical
  certificate), "kiasu" stakeholders, GE/budget-season freezes. Singaporean characters may use
  light Singlish (*lah, leh, lor, can or not, alamak, steady, paiseh, shiok, sian*) — **max one
  particle per message, not every message**. Never mock accents, ethnicity, or nationality.
  Characters from Shenzhen, Bangalore, Seattle, Jakarta etc. are competent professionals.
* **Second person** in outcomes: "You book a room and…".
* **No real companies, people, or products** as characters. Regulations and public frameworks are
  fine and encouraged where accurate (MAS TRM Guidelines, PDPA, IM8, Payment Services Act).
  If you are not sure a regulatory detail is accurate, keep it general.
* Keep it concise. Players read dozens of these per run.

## 3. Writing great choices (the most important part)

* **2–4 choices**, usually 3. Exactly one `best` (occasionally two), at least one `poor`.
* **Don't telegraph the grade.** The best answer must not always be the longest, the most
  "balanced"-sounding, or the first. Poor choices should be *tempting* — the thing a stressed
  ex–tech lead or a by-the-book PMP would plausibly do (jump in and code, write a 40-page plan,
  say yes to keep the peace, escalate immediately, hide bad news, over-process).
* **Real trade-offs.** Best choices often cost more ⚡ focus (doing the right thing takes time) and
  may cost something now for a payoff later. Poor choices are often cheap now and expensive later
  — use `followUps` and `flags` to make the bill arrive.
* **Insight** (1–3 sentences, ≤ 340 chars): the lesson. Explain the principle, name the concept,
  and for poor choices say what to do instead. Written so it reads well under the header
  *"Mentor's take"*. Avoid "This is the best choice because…" — just teach.
  ✔ "Escalation isn't failure — surprise is. Escalate with options and a recommendation, after
  you've tried peer-to-peer, and tell the other EM before you go over their head."
* **ignored** outcome: what happens when the player never answers. Usually mildly bad; for
  `critical` urgency, seriously bad.

### Effect magnitude guide

| Effect | Small | Medium | Large (rare) |
|---|---|---|---|
| morale / trust / quality | ±2–4 | ±5–8 | ±10–15 |
| energy | −3 to −5 | −6 to −10 | −12 to −20 |
| rel (per role) | ±3–5 | ±6–10 | ±12–15 |
| budget (S$k) | −1 to −5 | −10 to −25 | −40 to −60 |
| progress (% points) | ±2–3 | ±4–6 | ±8–10 |
| scope (%) | ±5 | ±10–15 | ±20–25 |
| block days | 1 | 2 | 3–4 |
| velocity mult | 0.9 / 1.1 | 0.8 / 1.2 | 0.7 / 1.3 (2–4 days) |

Validator hard limits: meters ±20 (energy ±25), rel ±20, progress ±15, scope ±30, budget −80…+60,
block 1–4 days, velocity mult 0.4–1.6 for 1–6 days, focus ±3, targetDay −2…+5, cost 0–3.

## 4. Text tokens

Use tokens instead of hard-coded names in **generic** events (scenario events may use either):

| Token | Example output |
|---|---|
| `{pm}` `{lead}` `{boss}` `{sponsor}` `{partner}` `{sre}` `{security}` `{compliance}` | short name — "Nurul" |
| `{pm.full}` | full name — "Nurul Huda" |
| `{pm.title}` | job title — "Product Manager, ShiokPay" |
| `{ws.core}` `{ws.client}` `{ws.platform}` `{ws.data}` `{ws.review}` | workstream name |
| `{company}` `{program}` `{product}` `{player}` `{target}` `{day}` | context |

## 5. Flags, follow-ups & chains

* Flags are kebab-case strings. **Namespace them by file**: `p:` people events, `d:` delivery
  events, `sp:` / `kl:` / `lc:` scenario events. E.g. `p:said-yes-to-feature`.
* Engine-owned flags you may *read* in conditions (never set them):
  `sys:watermelon` (player reported better than reality), `sys:escalated`, `sys:coded`
  (player wrote code themselves), `sys:rebaselined`, `sys:contractor`, `sys:no-go`.
* `followUps` may only reference events **in the same file**. Chain events (only reachable via
  follow-up) must have `weight: 0`.
* Use `when` to keep events sensible: `minDay`, `maxDay`, `progressAtLeast`, `behindSchedule`,
  `background: ['builder', 'hybrid']` for ex–tech-lead temptations, etc.

## 6. Scenario files

A scenario (`ScenarioDef`) needs:

* **Cast:** all 8 roles, diverse and believable for the setting, each with an emoji avatar, a hue,
  stakeholder-map `power`/`interest` (1–5), location, and a short bio that hints at what they care
  about and how to work with them.
* **Workstreams:** exactly one per `WsRole`. Tune `work`/`velocity`/`done`/`deps` so that at neutral
  performance the projected launch is: difficulty 1 → Day 14–15; difficulty 2 → Day 15–16;
  difficulty 3 → Day 16–17 (the player must act to recover). Typical velocities 4–9 points/day.
* **Risks:** 5–9, ids prefixed with the scenario prefix (`sp-`, `kl-`, `lc-`). Mix initial states:
  ~2 `open`, ~3–4 `hidden`, 0–2 `dormant` (brought in by events via `addRisks`). Each has a
  mitigation (cost 1–3 ⚡) and a `trigger` event (weight 0) in the same scenario.
* **Events:** 12–16, all ids prefixed and `scenarios: ['<id>']`:
  * a **Day 1 story beat** (`fixedDay: 1`) that sets the tone with a meaningful first decision;
  * a **Day 8 SteerCo** beat, ideally two variants gated by `when: { behindSchedule: true }` /
    `{ behindSchedule: false }` exercising the iron triangle (scope / time / cost / quality);
  * one more story beat in week 3 (Day 11–13) about launch readiness;
  * one trigger event per risk;
  * a few random flavour events unique to the setting.

## 7. Example event

```ts
{
  id: 'p-hallway-feature',
  title: 'A "tiny" feature request',
  channel: 'hallway',
  from: 'sponsor',
  body: "Eh {player}, quick one — can we add a referral bonus to {product} for launch? Marketing says it's tiny. Just one button, right?",
  urgency: 'normal',
  when: { minDay: 3, maxDay: 12 },
  concept: 'scope-creep',
  skill: 'stakeholder',
  choices: [
    {
      id: 'a',
      label: 'Say yes on the spot — keep the sponsor happy',
      cost: 0,
      grade: 'poor',
      insight: 'Agreeing in a hallway bypasses change control. "Just one button" usually means new APIs, fraud rules and copy reviews. Acknowledge, then size it with the team before committing.',
      outcome: {
        text: '{sponsor} beams. {lead} does not, when you tell them at standup.',
        effects: { trust: 4, rel: { sponsor: 5, lead: -8 }, scope: { core: 12, client: 8 }, morale: -5, flags: ['p:yes-in-hallway'] },
      },
    },
    {
      id: 'b',
      label: 'Get a 30-min sizing from {lead}, then bring options: now, cut X, or fast-follow',
      cost: 2,
      grade: 'best',
      insight: 'Never say yes or no to scope without data. Size it, then present trade-offs (add it and drop X, or ship it as a fast-follow) and let the sponsor decide. That is change control without the bureaucracy.',
      outcome: {
        text: 'Sized at 4 days. {sponsor} picks "fast-follow two weeks after launch". Nobody loses face.',
        effects: { trust: 5, rel: { sponsor: 3, lead: 5, pm: 4 }, skills: { stakeholder: 2 } },
      },
    },
    {
      id: 'c',
      label: 'Tell them flatly: scope is frozen, no changes',
      cost: 0,
      grade: 'okay',
      insight: 'Protecting scope is right, but a flat "no" to your sponsor spends trust. Say "yes, and here is what it costs" — let the decision-maker own the trade-off.',
      outcome: {
        text: '{sponsor} raises an eyebrow. "Okay… noted." You will hear about this at SteerCo.',
        effects: { trust: -4, rel: { sponsor: -6 } },
      },
    },
  ],
  ignored: {
    text: '{sponsor} takes your silence as a yes and tells Marketing it is in.',
    effects: { scope: { core: 10, client: 6 }, trust: -2, flags: ['p:yes-in-hallway'] },
  },
}
```
