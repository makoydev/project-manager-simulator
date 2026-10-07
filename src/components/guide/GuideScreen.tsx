import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState, type ReactNode } from 'react'
import { ACHIEVEMENTS } from '../../game/achievements'
import type { ConceptId } from '../../game/types'
import { CAREER } from '../../content/guide/career'
import { CONCEPTS } from '../../content/guide/concepts'
import type { CareerBlock, ConceptEntry } from '../../content/types'
import { cx } from '../../lib/cx'
import { useGame, type GuideTab } from '../../store/game'
import { useMeta } from '../../store/meta'
import { Button } from '../ui/Button'
import { SettingsControls } from '../ui/Settings'

const CATEGORIES: ConceptEntry['category'][] = ['The Role', 'Planning', 'Execution', 'Risk', 'People', 'Communication', 'Launch', 'Singapore']

function Callout({ tone, title, children }: { tone: 'tip' | 'warn' | 'info' | 'sg' | 'pmp'; title: string; children: ReactNode }) {
  const styles = {
    tip: 'border-good/40 bg-good-soft',
    warn: 'border-bad/35 bg-bad-soft',
    info: 'border-line bg-surface-2',
    sg: 'border-accent/35 bg-accent-soft',
    pmp: 'border-ws-core/35 bg-surface-2',
  }
  return (
    <div className={cx('rounded-2xl border p-4', styles[tone])}>
      <p className="text-[12px] font-bold tracking-wide text-ink uppercase">{title}</p>
      <div className="mt-1 text-[14.5px] leading-relaxed text-ink-2">{children}</div>
    </div>
  )
}

function ConceptDetail({ c, met, onBack }: { c: ConceptEntry; met: boolean; onBack: () => void }) {
  const [reveal, setReveal] = useState(false)
  return (
    <motion.article initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="mx-auto max-w-[44rem]">
      <Button variant="ghost" size="sm" onClick={onBack}>
        ← All concepts
      </Button>
      <p className="eyebrow mt-4">
        {c.category} {met ? '· met in play ✓' : '· not met in play yet'}
      </p>
      <h2 className="mt-1 flex items-center gap-3 font-display text-[clamp(24px,4vw,34px)] leading-tight font-bold">
        <span aria-hidden>{c.icon}</span>
        {c.title}
      </h2>
      <p className="mt-3 text-[17px] leading-relaxed font-medium text-ink">{c.tldr}</p>
      <div className="mt-4 space-y-3 text-[15.5px] leading-[1.7] text-ink-2">
        {c.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <h3 className="eyebrow mt-6 mb-2">In practice</h3>
      <ul className="space-y-2">
        {c.inPractice.map((p, i) => (
          <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden />
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 space-y-3">
        {c.tlTrap && (
          <Callout tone="warn" title="⚠️ The ex–tech lead trap">
            {c.tlTrap}
          </Callout>
        )}
        {c.pmpBridge && (
          <Callout tone="pmp" title="📐 From your PMP">
            {c.pmpBridge}
          </Callout>
        )}
        {c.sgContext && (
          <Callout tone="sg" title="🇸🇬 In Singapore">
            {c.sgContext}
          </Callout>
        )}
        {c.interview && (
          <Callout tone="info" title="🎯 Interview drill">
            <p className="font-semibold text-ink">“{c.interview.q}”</p>
            {reveal ? (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
                {c.interview.a}
              </motion.p>
            ) : (
              <button type="button" onClick={() => setReveal(true)} className="mt-2 text-[13px] font-semibold text-accent hover:underline">
                Think of your answer, then reveal a strong one →
              </button>
            )}
          </Callout>
        )}
      </div>
    </motion.article>
  )
}

function Block({ b }: { b: CareerBlock }) {
  switch (b.type) {
    case 'p':
      return <p className="text-[15.5px] leading-[1.7] text-ink-2">{b.text}</p>
    case 'list':
      return (
        <ul className="space-y-1.5">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      )
    case 'steps':
      return (
        <ol className="space-y-3">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-[3px] border-accent font-mono text-[12px] font-bold text-accent">{i + 1}</span>
              <span>
                <span className="block text-[15px] font-bold">{it.title}</span>
                <span className="block text-[14.5px] leading-relaxed text-ink-2">{it.text}</span>
              </span>
            </li>
          ))}
        </ol>
      )
    case 'table':
      return (
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[640px] text-left text-[13.5px]">
            <thead className="bg-surface-2">
              <tr>
                {b.headers.map((h) => (
                  <th key={h} className="px-3 py-2 text-[11.5px] font-bold tracking-wide text-muted uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {b.rows.map((r, i) => (
                <tr key={i} className="align-top">
                  {r.map((cell, j) => (
                    <td key={j} className={cx('px-3 py-2.5 leading-snug', j === 0 && 'font-semibold')}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'callout':
      return (
        <Callout tone={b.tone} title={b.title ?? (b.tone === 'tip' ? 'Tip' : b.tone === 'warn' ? 'Watch out' : 'Note')}>
          {b.text}
        </Callout>
      )
  }
}

export function GuideScreen() {
  const guide = useGame((s) => s.guide)
  const back = useGame((s) => s.back)
  const go = useGame((s) => s.go)
  const met = useMeta((s) => s.concepts)
  const unlocked = useMeta((s) => s.achievements)
  const [tab, setTab] = useState<GuideTab>(guide.tab)
  const [concept, setConcept] = useState<ConceptId | undefined>(guide.concept)
  const [section, setSection] = useState(CAREER[0]?.id)
  const [cat, setCat] = useState<ConceptEntry['category'] | 'All'>('All')
  const [q, setQ] = useState('')

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return CONCEPTS.filter((c) => (cat === 'All' || c.category === cat) && (!needle || `${c.title} ${c.tldr}`.toLowerCase().includes(needle)))
  }, [cat, q])
  const open = CONCEPTS.find((c) => c.id === concept)
  const sec = CAREER.find((s) => s.id === section) ?? CAREER[0]
  const backLabel = back === 'game' ? 'Back to the program' : back === 'ending' ? 'Back to review' : 'Title'

  return (
    <div className="scroll-y h-full">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" size="sm" onClick={() => go(back === 'guide' ? 'title' : back)}>
            ← {backLabel}
          </Button>
          <SettingsControls compact />
        </header>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Ship It, Lah! · reference</p>
            <h1 className="font-display text-[clamp(26px,4vw,38px)] font-bold tracking-tight">Field Guide</h1>
          </div>
          <div role="tablist" className="flex gap-1 rounded-2xl border border-line bg-surface p-1">
            {(
              [
                ['concepts', `📖 Concepts ${met.length}/${CONCEPTS.length}`],
                ['career', '🧭 Career Kit'],
                ['achievements', `🏆 ${unlocked.length}/${ACHIEVEMENTS.length}`],
              ] as [GuideTab, string][]
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => {
                  setTab(id)
                  setConcept(undefined)
                }}
                className={cx('relative h-9 rounded-xl px-3 text-[13px] font-semibold', tab === id ? 'text-accent-ink' : 'text-ink-2 hover:text-ink')}
              >
                {tab === id && <motion.span layoutId="guide-tab" className="absolute inset-0 rounded-xl bg-accent" />}
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 pb-10">
          <AnimatePresence mode="wait">
            {tab === 'concepts' && open && <ConceptDetail key={open.id} c={open} met={met.includes(open.id)} onBack={() => setConcept(undefined)} />}
            {tab === 'concepts' && !open && (
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search concepts…"
                    aria-label="Search concepts"
                    className="h-10 w-full rounded-xl border border-line-strong bg-surface px-3 text-[14px] outline-none focus:border-accent sm:w-64"
                  />
                  {(['All', ...CATEGORIES] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCat(c)}
                      className={cx('h-8 rounded-full border px-3 text-[12.5px] font-semibold', cat === c ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2 hover:border-line-strong')}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <div className="mb-4 h-2 overflow-hidden rounded-full bg-surface-3" aria-label={`${met.length} of ${CONCEPTS.length} concepts met in play`}>
                  <motion.div className="h-full rounded-full bg-accent" initial={{ width: 0 }} animate={{ width: `${(met.length / CONCEPTS.length) * 100}%` }} />
                </div>
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {shown.map((c, i) => {
                    const isMet = met.includes(c.id)
                    return (
                      <motion.li key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 12) * 0.025 }}>
                        <motion.button
                          type="button"
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setConcept(c.id)}
                          className="flex h-full w-full flex-col rounded-2xl border border-line bg-surface p-4 text-left transition-colors hover:border-accent"
                        >
                          <span className="flex items-center justify-between">
                            <span className="text-2xl" aria-hidden>
                              {c.icon}
                            </span>
                            <span className={cx('rounded-full px-2 py-0.5 text-[10.5px] font-bold', isMet ? 'bg-good-soft text-good-ink' : 'bg-surface-3 text-muted')}>
                              {isMet ? '✓ Met in play' : 'Not met yet'}
                            </span>
                          </span>
                          <span className="mt-2 text-[15px] font-bold">{c.title}</span>
                          <span className="mt-1 text-[13px] leading-snug text-ink-2">{c.tldr}</span>
                          <span className="eyebrow mt-auto pt-3">{c.category}</span>
                        </motion.button>
                      </motion.li>
                    )
                  })}
                </ul>
              </motion.div>
            )}
            {tab === 'career' && sec && (
              <motion.div key="career" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
                <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible" aria-label="Career Kit sections">
                  {CAREER.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSection(s.id)}
                      aria-current={section === s.id ? 'page' : undefined}
                      className={cx(
                        'shrink-0 rounded-2xl border p-3 text-left transition-colors lg:w-full',
                        section === s.id ? 'border-accent bg-accent-soft' : 'border-line bg-surface hover:border-line-strong',
                      )}
                    >
                      <span className="block text-[14px] font-bold">
                        <span aria-hidden>{s.icon}</span> {s.title}
                      </span>
                      <span className="hidden text-[12px] leading-snug text-muted lg:block">{s.blurb}</span>
                    </button>
                  ))}
                </nav>
                <motion.article key={sec.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="min-w-0 space-y-4">
                  <h2 className="font-display text-[clamp(22px,3vw,30px)] leading-tight font-bold">
                    <span aria-hidden>{sec.icon}</span> {sec.title}
                  </h2>
                  <p className="text-[16px] text-ink-2">{sec.blurb}</p>
                  {sec.blocks.map((b, i) => (
                    <Block key={i} b={b} />
                  ))}
                </motion.article>
              </motion.div>
            )}
            {tab === 'achievements' && (
              <motion.ul key="ach" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {ACHIEVEMENTS.map((a, i) => {
                  const has = unlocked.includes(a.id)
                  return (
                    <motion.li
                      key={a.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: Math.min(i, 15) * 0.02 }}
                      className={cx('flex items-center gap-3 rounded-2xl border p-3', has ? 'border-accent/40 bg-surface' : 'border-dashed border-line bg-surface-2')}
                    >
                      <span className={cx('grid h-11 w-11 shrink-0 place-items-center rounded-xl text-2xl', has ? 'bg-accent-soft' : 'bg-surface-3 grayscale')} aria-hidden>
                        {has ? a.icon : '🔒'}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[14px] font-bold">{a.name}</span>
                        <span className="block text-[12.5px] leading-snug text-ink-2">{a.description}</span>
                      </span>
                    </motion.li>
                  )
                })}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
