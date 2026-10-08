import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'
import { BACKGROUNDS } from '../../game/backgrounds'
import { SCENARIOS } from '../../game/content'
import { ROLE_LABEL } from '../../game/meta'
import { fillText } from '../../game/text'
import type { BackgroundId, Role, ScenarioId } from '../../game/types'
import { cx, hueBg } from '../../lib/cx'
import { useGame } from '../../store/game'
import { useMeta } from '../../store/meta'
import { Avatar } from '../ui/bits'
import { Button } from '../ui/Button'

const STEPS = ['You', 'Program', 'Brief']
const ROLES: Role[] = ['sponsor', 'boss', 'pm', 'lead', 'partner', 'sre', 'security', 'compliance']

function StepLine({ step }: { step: number }) {
  return (
    <ol className="flex items-center" aria-label="Setup progress">
      {STEPS.map((s, i) => (
        <li key={s} className="flex items-center">
          <span className="flex items-center gap-2">
            <motion.span
              animate={{ scale: i === step ? 1.15 : 1 }}
              className={cx(
                'grid h-6 w-6 place-items-center rounded-full border-[3px] font-mono text-[11px] font-bold',
                i <= step ? 'border-accent bg-surface text-accent' : 'border-line-strong bg-surface text-muted',
              )}
              aria-current={i === step ? 'step' : undefined}
            >
              {i + 1}
            </motion.span>
            <span className={cx('text-[13px] font-semibold', i === step ? 'text-ink' : 'text-muted')}>{s}</span>
          </span>
          {i < STEPS.length - 1 && (
            <span className="mx-3 h-[4px] w-8 overflow-hidden rounded-full bg-line sm:w-14">
              <motion.span className="block h-full bg-accent" initial={false} animate={{ width: i < step ? '100%' : '0%' }} />
            </span>
          )}
        </li>
      ))}
    </ol>
  )
}

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`Difficulty ${n} of 3`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={cx('h-2 w-5 rounded-full', i <= n ? 'bg-accent' : 'bg-line')} />
      ))}
    </span>
  )
}

export function SetupScreen() {
  const go = useGame((s) => s.go)
  const startGame = useGame((s) => s.startGame)
  const best = useMeta((s) => s.best)
  const runs = useMeta((s) => s.runs)
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [nudge, setNudge] = useState(0)
  const nameRef = useRef<HTMLInputElement>(null)
  const [bg, setBg] = useState<BackgroundId>('hybrid')
  const [scenarioId, setScenarioId] = useState<ScenarioId>('shiokpay')
  const sc = SCENARIOS.find((s) => s.id === scenarioId)!
  const player = name.trim() || 'You'

  return (
    <div className="scroll-y h-full">
      <div className="mx-auto flex min-h-full max-w-5xl flex-col px-4 py-5 sm:px-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" size="sm" onClick={() => (step === 0 ? go('title') : setStep(step - 1))}>
            ← {step === 0 ? 'Title' : 'Back'}
          </Button>
          <StepLine step={step} />
        </header>

        <AnimatePresence mode="wait">
          <motion.main
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22 }}
            className="flex-1 py-8"
          >
            {step === 0 && (
              <div>
                <h1 className="font-display text-[clamp(26px,4vw,38px)] font-bold tracking-tight">Who’s joining as TPM?</h1>
                <p className="mt-2 max-w-2xl text-ink-2">Your background changes who trusts you on day one and which old habits will tempt you.</p>
                <label htmlFor="player-name" className="mt-6 block text-[13px] font-semibold text-ink-2">
                  What should the team call you?
                </label>
                <motion.div key={nudge} animate={nudge ? { x: [0, -10, 10, -6, 6, 0] } : undefined} transition={{ duration: 0.4 }}>
                  <input
                    ref={nameRef}
                    id="player-name"
                    value={name}
                    maxLength={24}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && name.trim() && setStep(1)}
                    placeholder="e.g. Jas, Mike, Wei Ling"
                    aria-describedby="name-hint"
                    className={cx(
                      'mt-1.5 h-12 w-full max-w-sm rounded-2xl border bg-surface px-4 text-[16px] text-ink outline-none transition-colors placeholder:text-muted focus:border-accent',
                      nudge && !name.trim() ? 'border-bad' : 'border-line-strong',
                    )}
                    autoComplete="nickname"
                  />
                </motion.div>
                <p id="name-hint" className={cx('mt-1.5 text-[12.5px]', nudge && !name.trim() ? 'text-bad-ink' : 'text-muted')}>
                  {nudge && !name.trim() ? 'Your stakeholders need something to call you.' : 'It’s how messages will address you.'}
                </p>
                <div className="mt-6 grid gap-3 md:grid-cols-3" role="radiogroup" aria-label="Background">
                  {Object.values(BACKGROUNDS).map((b, i) => (
                    <motion.button
                      key={b.id}
                      type="button"
                      role="radio"
                      aria-checked={bg === b.id}
                      onClick={() => setBg(b.id)}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      className={cx(
                        'relative flex flex-col rounded-3xl border-2 bg-surface p-5 text-left transition-colors',
                        bg === b.id ? 'border-accent shadow-[var(--shadow-pop)]' : 'border-line hover:border-line-strong',
                      )}
                    >
                      {b.id === 'hybrid' && (
                        <span className="absolute -top-2.5 right-4 rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-bold text-accent-ink">
                          Tech Lead + PMP
                        </span>
                      )}
                      <span className="text-3xl" aria-hidden>
                        {b.icon}
                      </span>
                      <span className="mt-3 font-display text-[18px] font-bold">{b.name}</span>
                      <span className="text-[13px] font-semibold text-accent">{b.subtitle}</span>
                      <span className="mt-2 text-[14px] leading-snug text-ink-2">{b.description}</span>
                      <span className="mt-4 space-y-1 text-[13px]">
                        {b.perks.map((p) => (
                          <span key={p} className="flex gap-2 text-good-ink">
                            <span aria-hidden>＋</span>
                            {p}
                          </span>
                        ))}
                        {b.traps.map((p) => (
                          <span key={p} className="flex gap-2 text-bad-ink">
                            <span aria-hidden>－</span>
                            {p}
                          </span>
                        ))}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h1 className="font-display text-[clamp(26px,4vw,38px)] font-bold tracking-tight">Pick your program</h1>
                <p className="mt-2 max-w-2xl text-ink-2">
                  Each is three working weeks to launch. They’re ordered by difficulty, so if you’re new to the role, start at the top.
                </p>
                <div className="mt-6 grid gap-3 md:grid-cols-3" role="radiogroup" aria-label="Program">
                  {SCENARIOS.map((s, i) => (
                    <motion.button
                      key={s.id}
                      type="button"
                      role="radio"
                      aria-checked={scenarioId === s.id}
                      onClick={() => setScenarioId(s.id)}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      className={cx(
                        'flex flex-col overflow-hidden rounded-3xl border-2 bg-surface text-left transition-colors',
                        scenarioId === s.id ? 'border-accent shadow-[var(--shadow-pop)]' : 'border-line hover:border-line-strong',
                      )}
                    >
                      <span className="flex items-center justify-between px-5 pt-5" style={{ color: 'var(--ink)' }}>
                        <span className="grid h-12 w-12 place-items-center rounded-2xl text-2xl" style={{ background: hueBg(s.hue, 28) }} aria-hidden>
                          {s.icon}
                        </span>
                        <Stars n={s.difficulty} />
                      </span>
                      <span className="flex flex-1 flex-col px-5 pt-3 pb-5">
                        <span className="flex items-center gap-2">
                          <span className="eyebrow">{s.company}</span>
                          {runs > 0 && !best[s.id] && (
                            <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold tracking-wide text-accent-ink uppercase">New</span>
                          )}
                        </span>
                        <span className="mt-1 font-display text-[18px] leading-tight font-bold">{s.program}</span>
                        <span className="text-[13px] font-semibold text-accent">{s.name}</span>
                        <span className="mt-2 text-[14px] leading-snug text-ink-2">{s.tagline}</span>
                        <span className="mt-auto pt-4 text-[12.5px] text-muted">
                          📍 {s.setting}
                          {best[s.id] && <span className="ml-2 font-semibold text-ink">· Best: {best[s.id]!.grade}</span>}
                        </span>
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <p className="eyebrow">
                  {sc.company} · {sc.setting}
                </p>
                <h1 className="mt-1 font-display text-[clamp(26px,4vw,38px)] font-bold tracking-tight">{sc.program}</h1>
                <div className="mt-4 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
                  <div className="min-w-0 space-y-3 text-[15.5px] leading-relaxed text-ink-2">
                    {sc.brief.map((p, i) => (
                      <motion.p key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.12 }}>
                        {fillText(p, sc, { player, targetDay: sc.targetDay, day: 1 })}
                      </motion.p>
                    ))}
                    <div className="mt-5 rounded-2xl border border-line bg-surface-2 p-4">
                      <p className="eyebrow mb-2">How a day works</p>
                      <ul className="grid gap-2 text-[14px] sm:grid-cols-2">
                        <li>
                          <b className="text-ink">📥 Inbox:</b> dilemmas arrive each morning. Unanswered ones expire, and silence has consequences.
                        </li>
                        <li>
                          <b className="text-ink">⚡ Focus:</b> 6 points a day. You can’t do everything, so triage.
                        </li>
                        <li>
                          <b className="text-ink">🚇 Network:</b> five workstreams racing to Launch. Watch the critical path.
                        </li>
                        <li>
                          <b className="text-ink">📝 Fridays:</b> write an honest RAG status report. Watermelons get caught.
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="eyebrow mb-2">Your stakeholders</p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {ROLES.map((r, i) => {
                        const c = sc.cast[r]
                        return (
                          <motion.li
                            key={r}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.15 + i * 0.05 }}
                            className="flex gap-3 rounded-2xl border border-line bg-surface p-3"
                          >
                            <Avatar c={c} size={38} />
                            <div className="min-w-0">
                              <p className="truncate text-[14px] font-bold">{c.name}</p>
                              <p className="truncate text-[12px] text-muted">
                                {c.title} · {c.location}
                              </p>
                              <p className="mt-1 text-[12.5px] leading-snug text-ink-2">{c.bio}</p>
                              <p className="mt-1 font-mono text-[10px] tracking-wide text-muted uppercase">{ROLE_LABEL[r]}</p>
                            </div>
                          </motion.li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </motion.main>
        </AnimatePresence>

        <footer className="sticky bottom-0 -mx-4 flex items-center justify-between gap-3 border-t border-line bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
          <span className="truncate text-[13px] text-muted">
            {step === 0 && `${BACKGROUNDS[bg].name} · ${BACKGROUNDS[bg].subtitle}`}
            {step === 1 && `${sc.program} · launch target Day ${sc.targetDay}`}
            {step === 2 && `Joining as ${player} · ${BACKGROUNDS[bg].name}`}
          </span>
          {step < 2 ? (
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                if (step === 0 && !name.trim()) {
                  setNudge((n) => n + 1)
                  nameRef.current?.focus()
                  return
                }
                setStep(step + 1)
              }}
            >
              Next →
            </Button>
          ) : (
            <Button variant="primary" size="lg" sound="ping" className="shine" onClick={() => startGame({ scenarioId, background: bg, playerName: player })}>
              Start Day 1 →
            </Button>
          )}
        </footer>
      </div>
    </div>
  )
}
