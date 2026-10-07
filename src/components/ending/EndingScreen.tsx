import { motion } from 'motion/react'
import { useEffect } from 'react'
import { ACHIEVEMENT_BY_ID } from '../../game/achievements'
import { BACKGROUNDS } from '../../game/backgrounds'
import { getScenario } from '../../game/content'
import { skillProfile } from '../../game/scoring'
import { CONCEPTS } from '../../content/guide/concepts'
import { confetti } from '../../lib/confetti'
import { cx } from '../../lib/cx'
import { play } from '../../lib/sfx'
import { useGame } from '../../store/game'
import { SkillsRadar } from '../charts/SkillsRadar'
import { SlipChart } from '../charts/SlipChart'
import { CountUp } from '../ui/bits'
import { Button } from '../ui/Button'
import { SettingsControls } from '../ui/Settings'

const GRADE_TONE: Record<string, string> = {
  S: 'var(--accent)',
  A: 'var(--good)',
  B: 'var(--ws-core)',
  C: 'var(--warn)',
  D: 'var(--bad)',
}

export function EndingScreen() {
  const game = useGame((s) => s.game)
  const score = useGame((s) => s.score)
  const earned = useGame((s) => s.runAchievements)
  const go = useGame((s) => s.go)
  const openGuide = useGame((s) => s.openGuide)

  useEffect(() => {
    if (!game || !score) {
      go('title')
      return
    }
    const t1 = window.setTimeout(() => play('stamp'), 650)
    const t2 = window.setTimeout(() => {
      if (score.grade === 'S' || score.grade === 'A') confetti({ count: 160 })
    }, 900)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [game, score, go])

  if (!game || !score) return null
  const sc = getScenario(game.scenarioId)
  const poor = game.log.filter((d) => d.grade === 'poor').slice(-4).reverse()
  const best = game.log.filter((d) => d.grade === 'best').slice(-3)
  const concepts = CONCEPTS.filter((c) => game.conceptsSeen.includes(c.id))
  const tone = GRADE_TONE[score.grade]
  const launch = game.launch

  return (
    <div className="scroll-y h-full">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <header className="flex items-center justify-between gap-3">
          <p className="eyebrow">FY2026 performance review · confidential</p>
          <SettingsControls compact />
        </header>

        <section className="mt-6 grid items-center gap-6 rounded-3xl border border-line bg-surface p-6 sm:p-8 md:grid-cols-[auto_1fr]">
          <motion.div
            initial={{ scale: 3, rotate: -30, opacity: 0 }}
            animate={{ scale: 1, rotate: -8, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 380, damping: 16 }}
            className="mx-auto grid h-36 w-36 place-items-center rounded-full border-[6px] font-display text-[72px] font-extrabold"
            style={{ borderColor: tone, color: tone }}
            aria-label={`Grade ${score.grade}`}
          >
            {score.grade}
          </motion.div>
          <div className="min-w-0">
            <p className="text-[13px] text-muted">
              {game.playerName} · Technical Program Manager · {BACKGROUNDS[game.background].subtitle}
            </p>
            <h1 className="mt-1 font-display text-[clamp(24px,4vw,36px)] leading-tight font-bold">
              {score.ratingNum} · {score.rating}
            </h1>
            <p className="mt-2 text-[15.5px] leading-relaxed text-ink-2">{score.headline}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-[13px]">
              <span className="rounded-full bg-accent-soft px-3 py-1 font-semibold text-accent">
                🧧 Bonus: {score.bonusMonths} month{score.bonusMonths === 1 ? '' : 's'} + 1 month AWS
              </span>
              <span className="rounded-full bg-surface-3 px-3 py-1 font-semibold">
                {sc.icon} {sc.program}
              </span>
              <span className="rounded-full bg-surface-3 px-3 py-1 font-semibold">
                Score <CountUp value={score.total} />
                /100
              </span>
            </div>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            {
              label: 'Launch',
              value: game.ending === 'fired' ? 'Replaced' : launch ? (launch.tier === 'smooth' ? 'Clean' : launch.tier === 'bumpy' ? 'Bumpy' : 'Sev-1') : '—',
              sub: launch ? `Day ${launch.day} · ${launch.mode === 'phased' ? 'phased' : 'big bang'}` : '',
            },
            { label: 'Schedule', value: score.launchDelay <= 0 ? 'On time' : `+${score.launchDelay} days`, sub: `target Day ${game.originalTargetDay}` },
            { label: 'Scope shipped', value: `${Math.round(score.completion * 100)}%`, sub: `${game.counters.descopes} descope${game.counters.descopes === 1 ? '' : 's'}` },
            { label: 'Decisions', value: `${Math.round(score.bestPct * 100)}%`, sub: `${score.decisions.best} best · ${score.decisions.poor + score.decisions.ignored} poor` },
          ].map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.08 }}
              className="rounded-2xl border border-line bg-surface p-4"
            >
              <p className="eyebrow">{t.label}</p>
              <p className="mt-1 text-[22px] font-bold">{t.value}</p>
              <p className="text-[12px] text-muted">{t.sub}</p>
            </motion.div>
          ))}
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="eyebrow mb-3">How the score adds up</h2>
            <ul className="space-y-3">
              {score.lines.map((l, i) => (
                <li key={l.key}>
                  <div className="flex items-baseline justify-between gap-2 text-[13.5px]">
                    <span className="font-semibold">
                      <span aria-hidden>{l.icon}</span> {l.label}
                    </span>
                    <span className="font-mono text-[12.5px] tabular">
                      {l.score}/{l.max}
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-3">
                    <motion.div
                      className="h-full rounded-full bg-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${(l.score / l.max) * 100}%` }}
                      transition={{ delay: 1.1 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="mt-0.5 text-[11.5px] text-muted">{l.note}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="eyebrow mb-3">Your TPM skills</h2>
            <SkillsRadar values={skillProfile(game)} />
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-line bg-surface p-5">
          <h2 className="eyebrow mb-2">Launch ETA over the program</h2>
          <SlipChart history={game.history} />
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="eyebrow mb-3">{poor.length ? 'What a seasoned TPM would do differently' : 'Your best calls'}</h2>
            <ul className="space-y-3">
              {(poor.length ? poor : best).map((d, i) => (
                <motion.li key={`${d.eventId}-${i}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }}>
                  <p className="text-[13.5px] font-semibold">
                    D{d.day} · {d.title}
                  </p>
                  <p className="text-[12.5px] text-muted">You: {d.choiceLabel}</p>
                  <p className={cx('mt-1 border-l-2 pl-3 text-[13px] leading-relaxed text-ink-2', poor.length ? 'border-bad' : 'border-good')}>{d.insight}</p>
                </motion.li>
              ))}
              {!poor.length && !best.length && <li className="text-[13px] text-ink-2">No graded decisions recorded.</li>}
            </ul>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-line bg-surface p-5">
              <h2 className="eyebrow mb-3">Concepts you met ({concepts.length})</h2>
              <div className="flex flex-wrap gap-1.5">
                {concepts.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => openGuide('concepts', c.id)}
                    className="rounded-full border border-line px-2.5 py-1 text-[12px] font-semibold transition-colors hover:border-accent hover:text-accent"
                  >
                    {c.icon} {c.title}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-5">
              <h2 className="eyebrow mb-3">Achievements this run ({earned.length})</h2>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {earned.map((id, i) => {
                  const a = ACHIEVEMENT_BY_ID[id]
                  if (!a) return null
                  return (
                    <motion.li
                      key={id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1.2 + i * 0.07, type: 'spring', stiffness: 300, damping: 16 }}
                      className={cx('flex items-center gap-2 rounded-xl border p-2', a.shame ? 'border-line' : 'border-accent/40 bg-accent-soft')}
                    >
                      <span className="text-xl" aria-hidden>
                        {a.icon}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[12.5px] font-bold">{a.name}</span>
                        <span className="block truncate text-[11px] text-muted">{a.description}</span>
                      </span>
                    </motion.li>
                  )
                })}
              </ul>
            </div>
          </div>
        </section>

        <footer className="mt-6 flex flex-wrap justify-center gap-2 pb-6">
          <Button variant="primary" size="lg" onClick={() => go('setup')} sound="ping">
            Run another program →
          </Button>
          <Button size="lg" onClick={() => openGuide('concepts')}>
            📖 Field Guide
          </Button>
          <Button size="lg" onClick={() => go('arcade')}>
            🎯 Interview Arcade
          </Button>
          <Button size="lg" variant="ghost" onClick={() => go('title')}>
            Title screen
          </Button>
        </footer>
      </div>
    </div>
  )
}
