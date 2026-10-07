import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { cx } from '../../lib/cx'
import { useGame, type Toast } from '../../store/game'
import { DeltaChips } from './bits'

function ToastCard({ t }: { t: Toast }) {
  const dismiss = useGame((s) => s.dismissToast)
  const [hover, setHover] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (hover || open) return
    const ms = t.tone === 'achievement' ? 5200 : 7000
    const id = window.setTimeout(() => dismiss(t.id), ms)
    return () => window.clearTimeout(id)
  }, [hover, open, t, dismiss])

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cx(
        'pointer-events-auto w-full overflow-hidden rounded-2xl border bg-surface shadow-[var(--shadow-pop)]',
        t.tone === 'achievement' ? 'shine border-accent/50' : 'border-line',
      )}
    >
      <div className="flex items-start gap-3 p-3.5">
        <motion.span
          initial={{ rotate: -20, scale: 0.6 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 12 }}
          className={cx('grid h-9 w-9 shrink-0 place-items-center rounded-xl text-lg', t.tone === 'achievement' ? 'bg-accent-soft' : 'bg-surface-3')}
          aria-hidden
        >
          {t.icon}
        </motion.span>
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-bold leading-snug text-ink">{t.title}</p>
          {t.text && <p className="mt-0.5 text-[13px] leading-snug text-ink-2">{t.text}</p>}
          {t.deltas && t.deltas.length > 0 && <DeltaChips deltas={t.deltas} className="mt-2" delay={0.1} />}
          {t.insight && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="mt-2 text-[12px] font-semibold text-accent hover:underline"
              aria-expanded={open}
            >
              {open ? 'Hide mentor’s take' : 'Mentor’s take →'}
            </button>
          )}
          <AnimatePresence initial={false}>
            {open && t.insight && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden text-[12.5px] leading-snug text-ink-2"
              >
                <span className="mt-1 block border-l-2 border-accent pl-2">{t.insight}</span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <button type="button" onClick={() => dismiss(t.id)} className="-m-1 rounded-lg p-1 text-muted hover:text-ink" aria-label="Dismiss">
          ✕
        </button>
      </div>
    </motion.li>
  )
}

export function Toasts() {
  const toasts = useGame((s) => s.toasts)
  return (
    <ol
      aria-live="polite"
      className="pointer-events-none fixed inset-x-3 top-[calc(12px+env(safe-area-inset-top,0px))] z-[60] flex flex-col gap-2 sm:inset-x-auto sm:right-4 sm:w-[360px]"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <ToastCard key={t.id} t={t} />
        ))}
      </AnimatePresence>
    </ol>
  )
}
