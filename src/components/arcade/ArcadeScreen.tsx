import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ACHIEVEMENT_BY_ID } from '../../game/achievements'
import { INTERVIEW_QUESTIONS } from '../../content/interview'
import type { InterviewCategory, InterviewQuestion } from '../../content/types'
import { confetti } from '../../lib/confetti'
import { cx } from '../../lib/cx'
import { play } from '../../lib/sfx'
import { useGame } from '../../store/game'
import { useMeta } from '../../store/meta'
import { CountUp, Kbd } from '../ui/bits'
import { Button } from '../ui/Button'
import { SettingsControls } from '../ui/Settings'

const ROUND = 10
const LIVES = 3
const SECONDS = 30
const CATS: InterviewCategory[] = ['Behavioral', 'Program Sense', 'Technical Depth', 'Stakeholders', 'Execution', 'Singapore']
const LETTERS = ['A', 'B', 'C', 'D']

interface Dealt {
  q: InterviewQuestion
  order: number[]
}

interface Answer {
  dealt: Dealt
  picked: number | null
  correct: boolean
  points: number
}

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function deal(cat: InterviewCategory | 'All'): Dealt[] {
  const pool = INTERVIEW_QUESTIONS.filter((q) => cat === 'All' || q.category === cat)
  return shuffle(pool)
    .slice(0, ROUND)
    .map((q) => ({ q, order: shuffle([0, 1, 2, 3]) }))
}

function rank(correct: number, total: number): { title: string; icon: string } {
  const r = correct / Math.max(1, total)
  if (r >= 1) return { title: 'Offer letter, with a sign-on bonus', icon: '✉️' }
  if (r >= 0.8) return { title: 'Strong hire', icon: '💪' }
  if (r >= 0.6) return { title: 'Onsite loop: mixed signals', icon: '🤔' }
  if (r >= 0.4) return { title: 'Phone screen passed', icon: '📞' }
  return { title: '“We’ll keep your CV on file”', icon: '🗂️' }
}

export function ArcadeScreen() {
  const back = useGame((s) => s.back)
  const go = useGame((s) => s.go)
  const best = useMeta((s) => s.arcadeBest)
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<'menu' | 'play' | 'over'>('menu')
  const [cat, setCat] = useState<InterviewCategory | 'All'>('All')
  const [practice, setPractice] = useState(false)
  const [deck, setDeck] = useState<Dealt[]>([])
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [lives, setLives] = useState(LIVES)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [left, setLeft] = useState(SECONDS)
  const [newBest, setNewBest] = useState(false)
  const card = useRef<HTMLDivElement>(null)

  const current = deck[idx]
  const answered = answers.length > idx ? answers[idx] : null
  const correctCount = answers.filter((a) => a.correct).length

  const start = () => {
    setDeck(deal(cat))
    setIdx(0)
    setAnswers([])
    setLives(LIVES)
    setScore(0)
    setStreak(0)
    setLeft(SECONDS)
    setNewBest(false)
    setPhase('play')
    play('ping')
  }

  const finish = useCallback(
    (finalScore: number, finalAnswers: Answer[]) => {
      setPhase('over')
      const correct = finalAnswers.filter((a) => a.correct).length
      if (!practice && useMeta.getState().setArcadeBest(finalScore)) {
        setNewBest(true)
        confetti({ count: 140 })
      }
      if (correct >= 8) {
        const fresh = useMeta.getState().unlock(['interview-ready'])
        if (fresh.length) {
          const a = ACHIEVEMENT_BY_ID['interview-ready']
          play('unlock')
          useGame.getState().toast({ icon: a.icon, title: `Achievement: ${a.name}`, text: a.description, tone: 'achievement' })
        }
      }
    },
    [practice],
  )

  const answer = useCallback(
    (picked: number | null) => {
      if (!current || answered) return
      const correct = picked !== null && current.order[picked] === current.q.answer
      const mult = 1 + Math.min(4, streak) * 0.25
      const points = correct ? Math.round((100 + (practice ? 0 : left * 5)) * mult) : 0
      play(correct ? 'good' : 'bad')
      if (correct) setStreak((s) => s + 1)
      else {
        setStreak(0)
        if (!practice) setLives((l) => l - 1)
        if (!reduce) card.current?.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(0)' }], { duration: 300 })
      }
      setScore((s) => s + points)
      setAnswers((xs) => [...xs, { dealt: current, picked, correct, points }])
    },
    [current, answered, streak, practice, left, reduce],
  )

  const next = useCallback(() => {
    const out = !practice && lives <= 0
    if (idx + 1 >= deck.length || out) return finish(score, answers)
    setIdx((i) => i + 1)
    setLeft(SECONDS)
    play('whoosh')
  }, [practice, lives, idx, deck.length, finish, score, answers])

  // Countdown
  useEffect(() => {
    if (phase !== 'play' || answered || practice) return
    if (left <= 0) {
      answer(null)
      return
    }
    const id = window.setTimeout(() => {
      setLeft((l) => l - 1)
      if (left <= 6) play('tick')
    }, 1000)
    return () => window.clearTimeout(id)
  }, [phase, answered, left, practice, answer])

  // Keyboard: 1–4 / A–D to answer, Enter for next.
  useEffect(() => {
    if (phase !== 'play') return
    const onKey = (e: KeyboardEvent) => {
      if (answered) {
        if (e.key === 'Enter') next()
        return
      }
      const k = e.key.toUpperCase()
      const i = ['1', '2', '3', '4'].indexOf(k) >= 0 ? Number(k) - 1 : LETTERS.indexOf(k)
      if (i >= 0) answer(i)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, answered, answer, next])

  const byCat = useMemo(() => {
    const m = new Map<InterviewCategory, { n: number; ok: number }>()
    for (const a of answers) {
      const c = a.dealt.q.category
      const v = m.get(c) ?? { n: 0, ok: 0 }
      m.set(c, { n: v.n + 1, ok: v.ok + (a.correct ? 1 : 0) })
    }
    return m
  }, [answers])

  const pct = left / SECONDS
  const timerTone = pct > 0.5 ? 'var(--accent)' : pct > 0.25 ? 'var(--warn)' : 'var(--bad)'

  return (
    <div className="scroll-y h-full">
      <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6">
        <header className="flex items-center justify-between gap-3">
          <Button variant="ghost" size="sm" onClick={() => (phase === 'play' ? setPhase('menu') : go(back === 'arcade' ? 'title' : back))}>
            ← {phase === 'play' ? 'Quit round' : 'Back'}
          </Button>
          <SettingsControls compact />
        </header>

        <AnimatePresence mode="wait">
          {phase === 'menu' && (
            <motion.section key="menu" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="py-8">
              <p className="eyebrow">Mock interview · TPM loop</p>
              <h1 className="mt-1 font-display text-[clamp(30px,6vw,52px)] leading-none font-extrabold tracking-tight">
                Interview <span className="text-accent">Arcade</span>
              </h1>
              <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-ink-2">
                Ten questions from real TPM loops. Pick the strongest answer before the clock runs out. Streaks multiply your score; three wrong answers end the round.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {(['All', ...CATS] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCat(c)}
                    className={cx('h-9 rounded-full border px-3.5 text-[13px] font-semibold', cat === c ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2 hover:border-line-strong')}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <label className="mt-4 flex w-fit cursor-pointer items-center gap-2 text-[14px]">
                <input type="checkbox" checked={practice} onChange={(e) => setPractice(e.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
                Practice mode (no timer, no lives, no high score)
              </label>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button variant="primary" size="lg" onClick={start} sound={null} className="shine">
                  Start round →
                </Button>
                <p className="text-[13px] text-muted">
                  High score <b className="font-mono text-ink">{best}</b>
                </p>
              </div>
            </motion.section>
          )}

          {phase === 'play' && current && (
            <motion.section key="play" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1" aria-label={`${lives} lives left`}>
                  {Array.from({ length: LIVES }, (_, i) => (
                    <motion.span key={i} animate={{ scale: i < lives || practice ? 1 : 0.7, opacity: i < lives || practice ? 1 : 0.25 }} className="text-[18px]">
                      ❤️
                    </motion.span>
                  ))}
                </div>
                <span className="font-mono text-[13px] text-muted">
                  Q{idx + 1}/{deck.length}
                </span>
                <AnimatePresence>
                  {streak >= 2 && (
                    <motion.span
                      key={streak}
                      initial={{ scale: 0.4, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      className="rounded-full bg-warn-soft px-2.5 py-0.5 text-[13px] font-bold text-warn-ink"
                    >
                      🔥 ×{(1 + Math.min(4, streak) * 0.25).toFixed(2)}
                    </motion.span>
                  )}
                </AnimatePresence>
                <span className="font-display text-[20px] font-bold">
                  <CountUp value={score} />
                </span>
              </div>
              {!practice && (
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-3" role="timer" aria-label={`${left} seconds left`}>
                  <motion.div className="h-full rounded-full" style={{ background: timerTone }} animate={{ width: `${pct * 100}%` }} transition={{ duration: 1, ease: 'linear' }} />
                </div>
              )}

              <motion.div
                ref={card}
                key={current.q.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className="mt-5 rounded-3xl border border-line bg-surface p-5 sm:p-7"
              >
                <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[11.5px] font-bold text-accent">{current.q.category}</span>
                <h2 className="mt-3 text-[clamp(17px,2.4vw,21px)] leading-snug font-bold">“{current.q.prompt}”</h2>
                <ol className="mt-5 space-y-2">
                  {current.order.map((oi, i) => {
                    const isRight = oi === current.q.answer
                    const isPicked = answered?.picked === i
                    return (
                      <li key={oi}>
                        <motion.button
                          type="button"
                          disabled={!!answered}
                          onClick={() => answer(i)}
                          whileHover={answered ? undefined : { x: 4 }}
                          whileTap={answered ? undefined : { scale: 0.98 }}
                          animate={answered && isRight ? { scale: [1, 1.03, 1] } : {}}
                          className={cx(
                            'flex w-full items-start gap-3 rounded-2xl border-2 p-3.5 text-left text-[14.5px] leading-snug transition-colors',
                            !answered && 'border-line bg-surface hover:border-accent',
                            answered && isRight && 'border-good bg-good-soft',
                            answered && isPicked && !isRight && 'border-bad bg-bad-soft',
                            answered && !isRight && !isPicked && 'border-line opacity-55',
                          )}
                        >
                          <Kbd>{LETTERS[i]}</Kbd>
                          <span className="flex-1">{current.q.options[oi]}</span>
                          {answered && isRight && <span aria-label="correct">✅</span>}
                          {answered && isPicked && !isRight && <span aria-label="your answer">❌</span>}
                        </motion.button>
                      </li>
                    )
                  })}
                </ol>
                <AnimatePresence>
                  {answered && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 space-y-3">
                      <p className={cx('font-display text-[16px] font-bold', answered.correct ? 'text-good-ink' : 'text-bad-ink')}>
                        {answered.correct ? `Nice. +${answered.points}` : answered.picked === null ? '⏰ Time’s up' : 'Not quite'}
                      </p>
                      <p className="text-[14.5px] leading-relaxed text-ink-2">{current.q.explanation}</p>
                      <p className="rounded-xl bg-surface-2 px-3 py-2 text-[13px]">
                        <b>What they’re listening for:</b> {current.q.lookFor}
                      </p>
                      <div className="flex justify-end">
                        <Button variant="primary" onClick={next} sound={null}>
                          {idx + 1 >= deck.length || (!practice && lives <= 0) ? 'See results' : 'Next question'} <Kbd>↵</Kbd>
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.section>
          )}

          {phase === 'over' && (
            <motion.section key="over" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="py-8">
              <p className="eyebrow">{practice ? 'Practice round' : 'Round complete'}</p>
              <motion.h1
                initial={{ scale: 1.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.1 }}
                className="mt-1 font-display text-[clamp(26px,5vw,42px)] leading-tight font-extrabold"
              >
                {rank(correctCount, answers.length).icon} {rank(correctCount, answers.length).title}
              </motion.h1>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  ['Score', <CountUp key="s" value={score} />],
                  ['Correct', `${correctCount}/${answers.length}`],
                  ['Best', newBest ? '🆕 ' + score : String(best)],
                ].map(([k, v]) => (
                  <div key={String(k)} className="rounded-2xl border border-line bg-surface p-4 text-center">
                    <p className="eyebrow">{k}</p>
                    <p className="mt-1 font-display text-[22px] font-bold">{v}</p>
                  </div>
                ))}
              </div>
              {byCat.size > 0 && (
                <div className="mt-5 rounded-2xl border border-line bg-surface p-4">
                  <p className="eyebrow mb-3">By category</p>
                  <ul className="space-y-2">
                    {[...byCat.entries()].map(([c, v]) => (
                      <li key={c} className="flex items-center gap-3 text-[13px]">
                        <span className="w-32 shrink-0 font-semibold">{c}</span>
                        <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-3">
                          <motion.span className="block h-full rounded-full bg-accent" initial={{ width: 0 }} animate={{ width: `${(v.ok / v.n) * 100}%` }} />
                        </span>
                        <span className="w-10 text-right font-mono">
                          {v.ok}/{v.n}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {answers.some((a) => !a.correct) && (
                <div className="mt-5 space-y-2">
                  <p className="eyebrow">Review your misses</p>
                  {answers
                    .filter((a) => !a.correct)
                    .map((a) => (
                      <details key={a.dealt.q.id} className="rounded-2xl border border-line bg-surface p-3">
                        <summary className="cursor-pointer text-[14px] font-semibold">{a.dealt.q.prompt}</summary>
                        <p className="mt-2 rounded-xl bg-good-soft px-3 py-2 text-[13.5px] text-good-ink">✅ {a.dealt.q.options[a.dealt.q.answer]}</p>
                        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">{a.dealt.q.explanation}</p>
                      </details>
                    ))}
                </div>
              )}
              <div className="mt-6 flex flex-wrap gap-2">
                <Button variant="primary" size="lg" onClick={start} sound={null}>
                  Play again
                </Button>
                <Button size="lg" onClick={() => setPhase('menu')}>
                  Change category
                </Button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
