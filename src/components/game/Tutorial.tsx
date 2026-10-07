import { AnimatePresence, motion } from 'motion/react'
import { getScenario } from '../../game/content'
import { useLayoutEffect, useMemo, useState } from 'react'
import { useGame } from '../../store/game'
import { useMeta } from '../../store/meta'
import { Button } from '../ui/Button'

interface Step {
  target?: string
  title: string
  text: string
}

function steps(player: string, program: string): Step[] {
  return [
    { title: `Welcome aboard, ${player}`, text: `You’re the new TPM on ${program}. Nobody reports to you, but everybody is counting on you. Here’s your cockpit.` },
    {
      target: 'inbox',
      title: 'Your inbox',
      text: 'Dilemmas land here every morning. Open one to decide. Choices cost ⚡ focus, and messages you ignore expire with consequences.',
    },
    {
      target: 'meters',
      title: 'Meters & focus',
      text: 'Team morale, stakeholder trust, quality, budget and your own energy. You get 6 focus a day, so triage. Launch ETA is when the last line arrives at today’s pace.',
    },
    {
      target: 'board',
      title: 'The network map',
      text: 'Five workstreams racing to Launch. 🔒 marks a dependency, ⛔ a blocker, ◆ the critical path that decides your date.',
    },
    {
      target: 'moves',
      title: 'Proactive moves',
      text: 'Kopi chats, pre-mortems, launch readiness. Firefighting is reactive; these moves are how you get ahead of the fires.',
    },
    {
      target: 'endday',
      title: 'End the day',
      text: 'When you’ve spent your focus, end the day. Fridays bring the status report, and Day 15 the Go/No-Go. Start by opening your first message.',
    },
  ]
}

interface Box {
  left: number
  top: number
  width: number
  height: number
  right: number
  bottom: number
}

function visibleRect(sel?: string): Box | null {
  if (!sel) return null
  const els = Array.from(document.querySelectorAll<HTMLElement>(`[data-tour="${sel}"]`))
  for (const el of els) {
    const r = el.getBoundingClientRect()
    if (r.width > 0 && r.height > 0 && el.offsetParent !== null)
      return { left: r.left, top: r.top, width: r.width, height: r.height, right: r.right, bottom: r.bottom }
  }
  return null
}

const sameBox = (a: Box | null, b: Box | null) =>
  a === b || (!!a && !!b && a.left === b.left && a.top === b.top && a.width === b.width && a.height === b.height)

export function Tutorial() {
  const done = useMeta((s) => s.tutorialDone)
  const setDone = useMeta((s) => s.setTutorialDone)
  const game = useGame((s) => s.game)
  const modal = useGame((s) => s.modal)
  const [i, setI] = useState(0)
  const [rect, setRect] = useState<Box | null>(null)
  const player = game?.playerName ?? 'there'
  const program = game ? getScenario(game.scenarioId).program : ''
  const list = useMemo(() => steps(player, program), [player, program])
  const step = list[i]
  const target = step.target
  const active = !done && game?.day === 1 && !modal

  // Measure the spotlight target. Keyed on the target *string*, and state only changes when the
  // box actually moves; otherwise every render would re-measure and re-render forever.
  useLayoutEffect(() => {
    if (!active) return
    const update = () => {
      const next = visibleRect(target)
      setRect((prev) => (sameBox(prev, next) ? prev : next))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [active, target])

  if (!active || !game) return null
  const pad = 8
  const cardW = Math.min(360, window.innerWidth - 32)
  let left = window.innerWidth / 2 - cardW / 2
  let top = window.innerHeight / 2 - 110
  if (rect) {
    const spaceRight = window.innerWidth - rect.right
    if (spaceRight > cardW + 32) {
      left = rect.right + 16
      top = Math.max(16, Math.min(window.innerHeight - 260, rect.top))
    } else if (rect.left > cardW + 32) {
      left = rect.left - cardW - 16
      top = Math.max(16, Math.min(window.innerHeight - 260, rect.top))
    } else {
      left = Math.max(16, Math.min(window.innerWidth - cardW - 16, rect.left))
      top = rect.bottom + 16 < window.innerHeight - 240 ? rect.bottom + 16 : Math.max(16, rect.top - 236)
    }
  }
  const finish = () => setDone()

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Tutorial">
      <AnimatePresence>
        {rect ? (
          <motion.div
            key="spot"
            className="pointer-events-none absolute rounded-2xl"
            initial={false}
            animate={{ left: rect.left - pad, top: rect.top - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 }}
            transition={{ type: 'spring', stiffness: 200, damping: 26 }}
            style={{ boxShadow: '0 0 0 9999px var(--scrim), 0 0 0 3px var(--accent)' }}
          />
        ) : (
          <motion.div key="scrim" className="absolute inset-0 bg-[var(--scrim)]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
        )}
      </AnimatePresence>
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className="absolute rounded-3xl border border-line bg-surface p-5 shadow-[var(--shadow-pop)]"
        style={{ left, top, width: cardW }}
      >
        <p className="eyebrow">
          Onboarding · {i + 1}/{list.length}
        </p>
        <h3 className="mt-1 font-display text-[17px] font-bold">{step.title}</h3>
        <p className="mt-1.5 text-[14px] leading-relaxed text-ink-2">{step.text}</p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <button type="button" onClick={finish} className="text-[12.5px] font-semibold text-muted hover:text-ink">
            Skip tour
          </button>
          <div className="flex gap-2">
            {i > 0 && (
              <Button size="sm" onClick={() => setI(i - 1)}>
                Back
              </Button>
            )}
            <Button size="sm" variant="primary" onClick={() => (i === list.length - 1 ? finish() : setI(i + 1))} autoFocus>
              {i === list.length - 1 ? 'Let’s go' : 'Next'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
