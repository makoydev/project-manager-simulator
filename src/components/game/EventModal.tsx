import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { getEvent } from '../../game/content'
import { choiceLocked } from '../../game/engine'
import { CHANNEL_META, SKILL_META } from '../../game/meta'
import { chanceOf } from '../../game/state'
import { fill } from '../../game/text'
import type { Grade } from '../../game/types'
import { CONCEPTS } from '../../content/guide/concepts'
import { cx } from '../../lib/cx'
import { play } from '../../lib/sfx'
import { useGame, type Modal as ModalState } from '../../store/game'
import { useMeta } from '../../store/meta'
import { Avatar, CostPips, DeltaChips, Kbd, Typewriter } from '../ui/bits'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { useRun, useScenario } from './hooks'

export const GRADE_META: Record<Grade, { label: string; icon: string; cls: string; ring: string }> = {
  best: { label: 'Seasoned TPM move', icon: '✅', cls: 'bg-good-soft text-good-ink', ring: 'border-good' },
  okay: { label: 'Workable', icon: '🟡', cls: 'bg-warn-soft text-warn-ink', ring: 'border-warn' },
  poor: { label: 'Rookie mistake', icon: '❌', cls: 'bg-bad-soft text-bad-ink', ring: 'border-bad' },
}

export function GradeStamp({ grade, delay = 0 }: { grade: Grade; delay?: number }) {
  const m = GRADE_META[grade]
  useEffect(() => {
    const id = window.setTimeout(() => play(grade === 'poor' ? 'bad' : grade === 'best' ? 'good' : 'stamp'), delay * 1000)
    return () => window.clearTimeout(id)
  }, [grade, delay])
  return (
    <motion.span
      initial={{ scale: 2.2, rotate: -14, opacity: 0 }}
      animate={{ scale: 1, rotate: -3, opacity: 1 }}
      transition={{ delay, type: 'spring', stiffness: 520, damping: 18 }}
      className={cx('inline-flex items-center gap-1.5 rounded-lg border-2 px-2.5 py-1 font-display text-[12px] font-bold tracking-wide uppercase', m.cls, m.ring)}
    >
      <span aria-hidden>{m.icon}</span>
      {m.label}
    </motion.span>
  )
}

/** A needle sweeps across the odds bar and lands in the zone the dice chose. */
function RollBar({ odds, success }: { odds: number; success: boolean }) {
  const reduce = useReducedMotion()
  const landing = useMemo(() => {
    const lo = success ? 0.04 : odds + 0.03
    const hi = success ? odds - 0.03 : 0.96
    return Math.max(0.02, Math.min(0.98, lo + Math.random() * Math.max(0.01, hi - lo)))
  }, [odds, success])
  return (
    <div className="mt-3">
      <div className="mb-1 flex justify-between text-[11px] font-semibold text-muted">
        <span>🎲 Odds of success {Math.round(odds * 100)}%</span>
        <span className={success ? 'text-good-ink' : 'text-bad-ink'}>{success ? 'It worked' : 'It didn’t land'}</span>
      </div>
      <div className="relative h-3 overflow-hidden rounded-full bg-bad-soft">
        <div className="absolute inset-y-0 left-0 bg-good/70" style={{ width: `${odds * 100}%` }} />
        <motion.div
          className="absolute inset-y-[-3px] w-1 rounded-full bg-ink"
          initial={reduce ? { left: `${landing * 100}%` } : { left: '0%' }}
          animate={{ left: reduce ? `${landing * 100}%` : ['0%', '96%', '8%', `${landing * 100}%`] }}
          transition={{ duration: 1.1, times: [0, 0.35, 0.7, 1], ease: 'easeInOut' }}
        />
      </div>
    </div>
  )
}

export function EventModal({ modal }: { modal: Extract<ModalState, { kind: 'event' }> }) {
  const g = useRun()
  const sc = useScenario()
  const choose = useGame((s) => s.choose)
  const setModal = useGame((s) => s.setModal)
  const openGuide = useGame((s) => s.openGuide)
  const knownConcepts = useMeta((s) => s.concepts)
  const e = getEvent(modal.eventId)
  const c = sc.cast[e.from]
  const ch = CHANNEL_META[e.channel]
  const result = modal.result
  const [showOthers, setShowOthers] = useState(false)
  const [typed, setTyped] = useState(false)
  // Snapshot whether the concept was new *before* this choice was recorded.
  const [conceptWasNew] = useState(() => !knownConcepts.includes(e.concept))
  const concept = CONCEPTS.find((x) => x.id === e.concept)
  const close = () => setModal(null)

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (result) {
        if (ev.key === 'Enter') close()
        return
      }
      const idx = Number(ev.key) - 1
      const choice = e.choices[idx]
      if (choice && !choiceLocked(g, e.id, choice.id)) choose(choice.id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const chosen = result ? e.choices.find((x) => x.id === result.choiceId) : null

  return (
    <Modal label={fill(e.title, g)} onClose={close} size="lg">
      <div className="p-5 sm:p-7">
        <div className="flex items-start gap-3">
          <motion.span initial={{ scale: 0.6, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }}>
            <Avatar c={c} size={52} />
          </motion.span>
          <div className="min-w-0 flex-1">
            <p className="text-[12.5px] text-muted">
              <span className="font-bold text-ink">{c.name}</span> · {c.title}
            </p>
            <p className="text-[12px] text-muted">
              {ch.icon} {ch.label} · {c.location}
              {e.urgency === 'critical' && <span className="ml-2 font-bold text-bad-ink">URGENT</span>}
            </p>
          </div>
          <button type="button" onClick={close} className="rounded-lg p-1.5 text-muted hover:bg-surface-3 hover:text-ink" aria-label="Close">
            ✕
          </button>
        </div>

        <h2 className="mt-4 font-display text-[clamp(19px,2.4vw,24px)] leading-tight font-bold">{fill(e.title, g)}</h2>
        <div className="mt-3 rounded-2xl rounded-tl-md border border-line bg-surface-2 p-4 text-[15.5px] leading-relaxed text-ink">
          {result ? fill(e.body, g) : <Typewriter text={fill(e.body, g)} onDone={() => setTyped(true)} />}
        </div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="choices" exit={{ opacity: 0, y: -8 }} className="mt-5">
              <p className="eyebrow mb-2">What do you do?</p>
              <ol className="flex flex-col gap-2">
                {e.choices.map((ch, i) => {
                  const locked = choiceLocked(g, e.id, ch.id)
                  const odds = ch.chance ? chanceOf(g, ch.chance) : null
                  return (
                    <motion.li
                      key={ch.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (typed ? 0 : 0.25) + i * 0.07 }}
                    >
                      <motion.button
                        type="button"
                        disabled={!!locked}
                        onClick={() => choose(ch.id)}
                        whileHover={locked ? undefined : { x: 4 }}
                        whileTap={locked ? undefined : { scale: 0.985 }}
                        className={cx(
                          'flex w-full items-start gap-3 rounded-2xl border-2 bg-surface p-3.5 text-left transition-colors',
                          locked ? 'border-line opacity-55' : 'border-line hover:border-accent hover:bg-accent-soft/40',
                        )}
                      >
                        <span className="mt-0.5 hidden sm:block">
                          <Kbd>{i + 1}</Kbd>
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[14.5px] leading-snug font-semibold text-ink">{fill(ch.label, g)}</span>
                          {locked && <span className="mt-1 block text-[12px] text-bad-ink">🔒 {locked}</span>}
                          {odds !== null && !locked && (
                            <span className="mt-1 block text-[12px] text-muted">
                              🎲 {Math.round(odds * 100)}% odds{ch.chance?.rel ? ` · depends on your relationship with ${sc.cast[ch.chance.rel].short}` : ''}
                            </span>
                          )}
                        </span>
                        <CostPips cost={ch.cost} className="mt-1" />
                      </motion.button>
                    </motion.li>
                  )
                })}
              </ol>
              <p className="mt-3 text-[12px] text-muted">
                Not now? Close it and come back. It expires{' '}
                {g.inbox.find((x) => x.uid === modal.uid)?.expiresDay === g.day ? 'at the end of today' : 'in a day or two'}.
              </p>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[13px] text-muted">
                  You chose: <span className="font-semibold text-ink">{result.label}</span>
                </p>
                <GradeStamp grade={result.grade} delay={result.odds !== undefined ? 1.15 : 0.15} />
              </div>
              {result.odds !== undefined && result.success !== undefined && <RollBar odds={result.odds} success={result.success} />}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: result.odds !== undefined ? 1.1 : 0.1 }}
                className="mt-3 text-[15.5px] leading-relaxed"
              >
                {result.text}
              </motion.p>
              <DeltaChips deltas={result.deltas} className="mt-3" delay={result.odds !== undefined ? 1.2 : 0.25} />

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: result.odds !== undefined ? 1.4 : 0.45 }}
                className="mt-5 rounded-2xl border border-accent/30 bg-accent-soft p-4"
              >
                <p className="flex items-center gap-2 text-[12px] font-bold tracking-wide text-accent uppercase">
                  <span aria-hidden>☕</span> Mentor’s take
                  {result.grade !== 'poor' && (
                    <span className="ml-auto font-sans text-[11px] font-semibold tracking-normal text-ink-2 normal-case">
                      +{result.grade === 'best' ? 3 : 1} {SKILL_META[result.skill].label} XP
                    </span>
                  )}
                </p>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink">{result.insight}</p>
                {concept && (
                  <button
                    type="button"
                    onClick={() => openGuide('concepts', concept.id)}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-surface px-3 py-1 text-[12px] font-semibold text-accent hover:bg-accent hover:text-accent-ink"
                  >
                    {concept.icon} Field Guide: {concept.title}
                    {conceptWasNew && <span className="rounded-full bg-accent px-1.5 text-[10px] text-accent-ink">NEW</span>}
                  </button>
                )}
              </motion.div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setShowOthers((v) => !v)}
                  className="text-[13px] font-semibold text-ink-2 hover:text-accent"
                  aria-expanded={showOthers}
                >
                  {showOthers ? '▾' : '▸'} How would the other options have graded?
                </button>
                <AnimatePresence initial={false}>
                  {showOthers && (
                    <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      {e.choices
                        .filter((x) => x.id !== chosen?.id)
                        .map((x) => (
                          <li key={x.id} className="mt-2 rounded-xl border border-line p-3">
                            <div className="flex items-start justify-between gap-3">
                              <p className="text-[13.5px] font-semibold">{fill(x.label, g)}</p>
                              <span className={cx('shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold', GRADE_META[x.grade].cls)}>
                                {GRADE_META[x.grade].icon} {GRADE_META[x.grade].label}
                              </span>
                            </div>
                            <p className="mt-1 text-[13px] leading-snug text-ink-2">{fill(x.insight, g)}</p>
                          </li>
                        ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
              <div className="mt-5 flex justify-end">
                <Button variant="primary" onClick={close}>
                  Continue <Kbd>↵</Kbd>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  )
}
