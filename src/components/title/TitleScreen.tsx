import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { ACHIEVEMENTS } from '../../game/achievements'
import { getScenario, SCENARIOS } from '../../game/content'
import { CONCEPTS } from '../../content/guide/concepts'
import { INTERVIEW_QUESTIONS } from '../../content/interview'
import { useGame } from '../../store/game'
import { useMeta } from '../../store/meta'
import { Button } from '../ui/Button'
import { SettingsControls } from '../ui/Settings'
import { NetworkArt } from './NetworkArt'

const PINGS = [
  { who: '🧑🏻‍💼', text: 'Quick one — are we still green?' },
  { who: '👩🏽‍💻', text: 'Can we add one tiny button?' },
  { who: '🧔🏻', text: 'Staging down again, alamak' },
  { who: '👩🏻‍⚖️', text: 'Has legal seen this?' },
  { who: '🧑🏾‍🔧', text: 'Who owns the rollback plan?' },
  { who: '👨🏻‍💼', text: 'Can or not by Friday?' },
]

/** Slack-style pings popping up beside the map: the soundtrack of TPM life. */
function Pings() {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => setI((v) => v + 1), 2600)
    return () => window.clearInterval(id)
  }, [reduce])
  const p = PINGS[i % PINGS.length]
  const spots = ['top-[2%] right-[4%]', 'bottom-[4%] right-[6%]', 'top-[2%] left-[22%]']
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 12, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
        className={`absolute ${spots[i % spots.length]} hidden max-w-[240px] items-center gap-2 rounded-2xl rounded-br-md border border-line bg-surface px-3 py-2 text-[13px] text-ink-2 shadow-[var(--shadow-card)] md:flex`}
      >
        <span aria-hidden className="text-lg">
          {p.who}
        </span>
        <span>{p.text}</span>
      </motion.div>
    </AnimatePresence>
  )
}

const TITLE = ['Ship', 'It,', 'Lah!']

export function TitleScreen() {
  const go = useGame((s) => s.go)
  const openGuide = useGame((s) => s.openGuide)
  const continueGame = useGame((s) => s.continueGame)
  const save = useGame((s) => s.savedGame)()
  const meta = useMeta()
  const savedScenario = save ? getScenario(save.scenarioId) : null

  return (
    <div
      className="scroll-y relative h-full"
      style={{ backgroundImage: 'radial-gradient(var(--line) 1.2px, transparent 1.2px)', backgroundSize: '22px 22px' }}
    >
      <div className="mx-auto flex min-h-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-3">
          <span className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">TPM simulator · Singapore edition</span>
          <SettingsControls compact />
        </header>

        <main className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[1.05fr_1fr] lg:gap-4">
          <div className="min-w-0">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-[12.5px] font-semibold text-ink-2"
            >
              <span className="h-2 w-2 rounded-full bg-good" aria-hidden />
              {SCENARIOS.length} programs · {CONCEPTS.length} field-guide entries · {INTERVIEW_QUESTIONS.length} interview drills
            </motion.p>
            <h1 className="font-display text-[clamp(46px,9vw,100px)] leading-[0.95] font-extrabold tracking-[-0.03em]">
              {TITLE.map((w, i) => (
                <motion.span
                  key={w}
                  className={i === 2 ? 'inline-block text-accent' : 'mr-[0.22em] inline-block'}
                  initial={{ opacity: 0, y: 40, rotate: i === 2 ? -8 : 0 }}
                  animate={{ opacity: 1, y: 0, rotate: i === 2 ? -4 : 0 }}
                  transition={{ delay: 0.1 + i * 0.12, type: 'spring', stiffness: 260, damping: 18 }}
                  whileHover={i === 2 ? { rotate: 3, scale: 1.05 } : undefined}
                >
                  {w}
                </motion.span>
              ))}
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-5 max-w-[34rem] text-[17px] leading-relaxed text-ink-2"
            >
              You’ve shipped code for years. Now ship a <em className="font-semibold text-ink not-italic">program</em>: three weeks, five teams,
              eight stakeholders and zero direct reports. Learn what a Technical Program Manager actually does by doing it, from RAID logs and RAG
              reports to the Go/No-Go call.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              {savedScenario && save ? (
                <>
                  <Button variant="primary" size="lg" onClick={continueGame} sound="ping">
                    Continue · {savedScenario.program}, Day {save.day} →
                  </Button>
                  <Button size="lg" onClick={() => go('setup')}>
                    New program
                  </Button>
                </>
              ) : (
                <Button variant="primary" size="lg" onClick={() => go('setup')} sound="ping" className="shine">
                  Start your first program →
                </Button>
              )}
            </motion.div>
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => go('live')}
              className="mt-4 flex w-full max-w-md items-center gap-3 rounded-2xl border border-line bg-surface p-3 text-left shadow-[var(--shadow-card)] transition-colors hover:border-accent"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-call-bg text-[22px]" aria-hidden>
                🎧
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-2 text-[14px] font-bold">
                  Live: a day in the life
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold tracking-wide text-accent-ink uppercase">New · immersive</span>
                </span>
                <span className="block text-[12.5px] text-ink-2">Sit in the meetings. Read the room, check Slack mid-call, and walk out with a decision.</span>
              </span>
            </motion.button>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-3 flex flex-wrap gap-2">
              <Button variant="ghost" onClick={() => openGuide('concepts')}>
                📖 Field Guide
              </Button>
              <Button variant="ghost" onClick={() => go('arcade')}>
                🎯 Interview Arcade
              </Button>
              <Button variant="ghost" onClick={() => openGuide('career')}>
                🧭 Career Kit
              </Button>
              <Button variant="ghost" onClick={() => openGuide('achievements')}>
                🏆 Achievements
              </Button>
            </motion.div>
          </div>

          <div className="relative min-w-0">
            <NetworkArt className="mx-auto w-full max-w-[560px]" />
            <Pings />
          </div>
        </main>

        <footer className="grid gap-3 border-t border-line pt-4 text-[13px] text-ink-2 sm:grid-cols-3">
          <Stat label="Field Guide" value={`${meta.concepts.length}/${CONCEPTS.length}`} hint="concepts met in play" />
          <Stat label="Achievements" value={`${meta.achievements.length}/${ACHIEVEMENTS.length}`} hint="unlocked" />
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="eyebrow">Best reviews</span>
            {SCENARIOS.map((s) => (
              <span key={s.id} className="inline-flex items-center gap-1">
                <span aria-hidden>{s.icon}</span>
                <span className="font-mono text-[12px]">{meta.best[s.id]?.grade ?? '–'}</span>
              </span>
            ))}
          </div>
        </footer>
      </div>
    </div>
  )
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="eyebrow">{label}</span>
      <span className="font-mono text-[13px] font-semibold text-ink">{value}</span>
      <span className="text-muted">{hint}</span>
    </div>
  )
}
