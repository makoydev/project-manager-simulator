import { animate, AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { Delta } from '../../game/effects'
import type { Character, Rag } from '../../game/types'
import { cx, hueBg } from '../../lib/cx'

export function Avatar({ c, size = 40, ring, className }: { c: Pick<Character, 'avatar' | 'hue' | 'short'>; size?: number; ring?: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cx('inline-grid shrink-0 place-items-center rounded-full', className)}
      style={{
        width: size,
        height: size,
        background: hueBg(c.hue, 30),
        fontSize: size * 0.52,
        boxShadow: ring ? `0 0 0 2px var(--surface), 0 0 0 4px ${ring}` : undefined,
      }}
    >
      {c.avatar}
    </span>
  )
}

/** Focus cost as lightning pips. */
export function CostPips({ cost, className }: { cost: number; className?: string }) {
  if (cost === 0) return <span className={cx('font-mono text-[11px] text-muted', className)}>free</span>
  return (
    <span className={cx('inline-flex items-center gap-0.5', className)} aria-label={`${cost} focus`}>
      {Array.from({ length: cost }, (_, i) => (
        <svg key={i} viewBox="0 0 12 16" className="h-3.5 w-2.5 fill-accent">
          <path d="M7 0 0 9h4.5L3.5 16 12 6H7.4L7 0Z" />
        </svg>
      ))}
    </span>
  )
}

export function deltaText(d: Delta): string {
  if (d.value === undefined) return d.label
  const sign = d.value > 0 ? '+' : '−'
  const abs = Math.abs(d.value)
  const v = d.unit === 'k' ? `S$${abs % 1 ? abs.toFixed(1) : abs}k` : `${abs % 1 ? abs.toFixed(1) : abs}${d.unit === '%' ? '%' : d.unit === 'd' ? 'd' : ''}`
  return `${d.label} ${sign}${v}`
}

/** Consequence chips that pop in one by one. */
export function DeltaChips({ deltas, delay = 0, className }: { deltas: Delta[]; delay?: number; className?: string }) {
  if (!deltas.length) return null
  return (
    <ul className={cx('flex flex-wrap gap-1.5', className)}>
      {deltas.map((d, i) => (
        <motion.li
          key={`${d.label}-${i}`}
          initial={{ opacity: 0, scale: 0.6, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: delay + i * 0.07, type: 'spring', stiffness: 420, damping: 22 }}
          className={cx(
            'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12.5px] font-semibold',
            d.good ? 'border-good/30 bg-good-soft text-good-ink' : 'border-bad/30 bg-bad-soft text-bad-ink',
          )}
        >
          <span aria-hidden>{d.icon}</span>
          <span>{deltaText(d)}</span>
        </motion.li>
      ))}
    </ul>
  )
}

const RAG_META: Record<Rag, { label: string; cls: string; dot: string; icon: string }> = {
  green: { label: 'Green', cls: 'bg-good-soft text-good-ink border-good/35', dot: 'bg-good', icon: '●' },
  amber: { label: 'Amber', cls: 'bg-warn-soft text-warn-ink border-warn/45', dot: 'bg-warn', icon: '▲' },
  red: { label: 'Red', cls: 'bg-bad-soft text-bad-ink border-bad/35', dot: 'bg-bad', icon: '■' },
}

export function RagChip({ rag, className, size = 'md' }: { rag: Rag; className?: string; size?: 'sm' | 'md' }) {
  const m = RAG_META[rag]
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full border font-bold uppercase tracking-wide',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]',
        m.cls,
        className,
      )}
    >
      <span aria-hidden className={cx('inline-block rounded-full', m.dot, size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2')} />
      {m.label}
    </span>
  )
}

/** Animated number that counts to its new value. */
export function CountUp({ value, decimals = 0, className, prefix = '', suffix = '' }: { value: number; decimals?: number; className?: string; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const prev = useRef(value)
  const reduce = useReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fmt = (v: number) => `${prefix}${v.toFixed(decimals)}${suffix}`
    if (reduce) {
      el.textContent = fmt(value)
      prev.current = value
      return
    }
    const controls = animate(prev.current, value, {
      duration: 0.7,
      ease: [0.2, 0.8, 0.2, 1],
      onUpdate: (v) => (el.textContent = fmt(v)),
    })
    prev.current = value
    return () => controls.stop()
  }, [value, decimals, prefix, suffix, reduce])
  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  )
}

/** Reveals text character by character; click to finish instantly. */
export function Typewriter({ text, speed = 14, className, onDone }: { text: string; speed?: number; className?: string; onDone?: () => void }) {
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? text.length : 0)
  const done = useRef(false)
  useEffect(() => {
    if (reduce) {
      setN(text.length)
      return
    }
    setN(0)
    done.current = false
    const id = window.setInterval(() => {
      setN((v) => {
        const next = Math.min(text.length, v + 2)
        if (next >= text.length) window.clearInterval(id)
        return next
      })
    }, speed)
    return () => window.clearInterval(id)
  }, [text, speed, reduce])
  useEffect(() => {
    if (n >= text.length && !done.current) {
      done.current = true
      onDone?.()
    }
  }, [n, text.length, onDone])
  return (
    <span className={className} onClick={() => setN(text.length)}>
      <span>{text.slice(0, n)}</span>
      <span aria-hidden className="invisible">
        {text.slice(n)}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  )
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="rounded border border-line-strong bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted">{children}</kbd>
}

export function Section({ title, aside, children, className }: { title: ReactNode; aside?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cx('min-w-0', className)}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="eyebrow">{title}</h3>
        {aside}
      </div>
      {children}
    </section>
  )
}

/** Small "+3" that floats up from a value when it changes. */
export function FloatDelta({ value, unit = '' }: { value: number; unit?: string }) {
  const [items, setItems] = useState<{ id: number; v: number }[]>([])
  const prev = useRef(value)
  const seq = useRef(0)
  useEffect(() => {
    const diff = Math.round((value - prev.current) * 10) / 10
    prev.current = value
    if (Math.abs(diff) < 0.5) return
    const id = ++seq.current
    setItems((xs) => [...xs, { id, v: diff }])
    const t = window.setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 1400)
    return () => window.clearTimeout(t)
  }, [value])
  return (
    <span className="pointer-events-none absolute -top-1 right-0">
      <AnimatePresence>
        {items.map((it) => (
          <motion.span
            key={it.id}
            initial={{ opacity: 0, y: 4, scale: 0.8 }}
            animate={{ opacity: 1, y: -18, scale: 1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className={cx('absolute right-0 font-mono text-[12px] font-bold', it.v > 0 ? 'text-good-ink' : 'text-bad-ink')}
          >
            {it.v > 0 ? '+' : '−'}
            {Math.abs(it.v)}
            {unit}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  )
}
