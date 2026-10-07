import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { retroDue, statusReportDue } from '../../game/report'
import { cx } from '../../lib/cx'
import { useGame, type Modal as ModalState } from '../../store/game'
import { Button } from '../ui/Button'
import { EventModal } from './EventModal'
import { useRun } from './hooks'
import { InboxPanel } from './Inbox'
import { JournalBoard } from './JournalBoard'
import { DayReportOverlay } from './modals/DayReportOverlay'
import { GoNoGoModal } from './modals/GoNoGoModal'
import { LaunchModal } from './modals/LaunchModal'
import { RetroModal } from './modals/RetroModal'
import { ConfirmEndDayModal, ConfirmQuitModal, PersonModal, PickRoleModal, PickWsModal, RiskModal } from './modals/SimpleModals'
import { StatusReportModal } from './modals/StatusReportModal'
import { MovesPanel } from './MovesPanel'
import { NetworkBoard } from './NetworkBoard'
import { PeopleBoard } from './PeopleBoard'
import { RaidBoard } from './RaidBoard'
import { TopBar } from './TopBar'
import { Tutorial } from './Tutorial'

type Tab = 'inbox' | 'network' | 'raid' | 'people' | 'moves' | 'journal'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'inbox', label: 'Inbox', icon: '📥' },
  { id: 'network', label: 'Network', icon: '🚇' },
  { id: 'raid', label: 'RAID', icon: '🛡️' },
  { id: 'people', label: 'People', icon: '🤝' },
  { id: 'moves', label: 'Moves', icon: '⚡' },
  { id: 'journal', label: 'Journal', icon: '📓' },
]

function renderModal(m: ModalState) {
  switch (m.kind) {
    case 'event':
      return <EventModal key={`event-${m.uid}`} modal={m} />
    case 'pickRole':
      return <PickRoleModal key="pickRole" />
    case 'pickWs':
      return <PickWsModal key={`pickWs-${m.action}`} action={m.action} />
    case 'confirmEndDay':
      return <ConfirmEndDayModal key="confirmEndDay" expiring={m.expiring} />
    case 'statusReport':
      return <StatusReportModal key={`report-${m.result ? 'done' : 'draft'}`} result={m.result} deltas={m.deltas} />
    case 'retro':
      return <RetroModal key="retro" picked={m.picked} deltas={m.deltas} />
    case 'dayReport':
      return <DayReportOverlay key={`day-${m.report.day}`} report={m.report} />
    case 'goNoGo':
      return <GoNoGoModal key="goNoGo" />
    case 'launch':
      return <LaunchModal key="launch" result={m.result} deltas={m.deltas} />
    case 'risk':
      return <RiskModal key={`risk-${m.id}`} id={m.id} />
    case 'person':
      return <PersonModal key={`person-${m.role}`} role={m.role} />
    case 'confirmQuit':
      return <ConfirmQuitModal key="quit" />
  }
}

function EndDayButton({ floating }: { floating?: boolean }) {
  const g = useRun()
  const requestEndDay = useGame((s) => s.requestEndDay)
  const setModal = useGame((s) => s.setModal)
  const expiring = g.inbox.filter((i) => i.expiresDay <= g.day).length
  if (g.phase === 'goNoGo')
    return (
      <Button variant="primary" size="lg" className={cx('shine w-full', floating && 'shadow-[var(--shadow-pop)]')} onClick={() => setModal({ kind: 'goNoGo' })} sound="ping">
        🚀 Go/No-Go meeting →
      </Button>
    )
  const label = statusReportDue(g)
    ? 'Write status report →'
    : retroDue(g)
      ? 'Sprint retro →'
      : g.day >= g.targetDay
        ? 'End day → Go/No-Go'
        : `End Day ${g.day} →`
  return (
    <div data-tour="endday" className={cx(floating && 'drop-shadow-xl')}>
      <Button variant="primary" size="lg" className="w-full" onClick={requestEndDay} sound="whoosh">
        {label}
      </Button>
      {!floating && (
        <p className={cx('mt-1.5 text-center text-[11.5px]', expiring ? 'font-semibold text-bad-ink' : 'text-muted')}>
          {expiring
            ? `${expiring} message${expiring > 1 ? 's' : ''} will expire if you end the day`
            : g.focus > 0
              ? `Unspent focus recharges your energy (+${g.focus * 4})`
              : 'Out of focus. Time to head home.'}
        </p>
      )}
    </div>
  )
}

function TabBar({ tabs, tab, setTab }: { tabs: typeof TABS; tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <div role="tablist" aria-label="Views" className="flex gap-1 rounded-2xl border border-line bg-surface p-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          type="button"
          aria-selected={tab === t.id}
          onClick={() => setTab(t.id)}
          className={cx('relative flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl px-3 text-[13px] font-semibold transition-colors', tab === t.id ? 'text-accent-ink' : 'text-ink-2 hover:text-ink')}
        >
          {tab === t.id && <motion.span layoutId="center-tab" className="absolute inset-0 rounded-xl bg-accent" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
          <span className="relative" aria-hidden>
            {t.icon}
          </span>
          <span className="relative">{t.label}</span>
        </button>
      ))}
    </div>
  )
}

function Board({ tab }: { tab: Tab }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.16 }}>
        {tab === 'inbox' && <InboxPanel />}
        {tab === 'network' && <NetworkBoard />}
        {tab === 'raid' && <RaidBoard />}
        {tab === 'people' && <PeopleBoard />}
        {tab === 'moves' && <MovesPanel />}
        {tab === 'journal' && <JournalBoard />}
      </motion.div>
    </AnimatePresence>
  )
}

export function GameScreen() {
  const game = useGame((s) => s.game)
  const modal = useGame((s) => s.modal)
  const go = useGame((s) => s.go)
  const [tab, setTab] = useState<Tab>('network')
  const [mobileTab, setMobileTab] = useState<Tab>('inbox')
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 1280px)').matches)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1280px)')
    const on = () => setWide(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  useEffect(() => {
    if (!game) go('title')
  }, [game, go])
  // The moves panel has its own column on wide screens.
  useEffect(() => {
    if (wide && tab === 'moves') setTab('network')
  }, [wide, tab])

  if (!game) return null
  const centerTabs = TABS.filter((t) => t.id !== 'inbox' && (!wide || t.id !== 'moves'))
  const unread = game.inbox.length

  return (
    <div className="flex h-full flex-col">
      <TopBar />
      <div className="min-h-0 flex-1">
        <div className="hidden h-full lg:grid lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[330px_minmax(0,1fr)_350px]">
          <aside className="flex min-h-0 flex-col border-r border-line">
            <div className="scroll-y min-h-0 flex-1 p-4">
              <InboxPanel />
            </div>
            <div className="border-t border-line bg-surface p-4">
              <EndDayButton />
            </div>
          </aside>
          <main className="scroll-y min-w-0 p-5">
            <div className="mb-4">
              <TabBar tabs={centerTabs} tab={tab} setTab={setTab} />
            </div>
            <Board tab={tab} />
          </main>
          {wide && (
            <aside className="scroll-y border-l border-line p-4">
              <MovesPanel />
            </aside>
          )}
        </div>

        <div className="scroll-y h-full px-4 pt-4 pb-40 lg:hidden">
          <Board tab={mobileTab} />
        </div>
      </div>

      <div className="fixed inset-x-4 bottom-[calc(72px+env(safe-area-inset-bottom,0px))] z-30 lg:hidden">
        <EndDayButton floating />
      </div>
      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 border-t border-line bg-surface pb-[env(safe-area-inset-bottom,0px)] lg:hidden"
        aria-label="Game sections"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setMobileTab(t.id)}
            aria-current={mobileTab === t.id ? 'page' : undefined}
            className={cx('relative flex h-16 flex-col items-center justify-center gap-0.5 text-[10.5px] font-semibold', mobileTab === t.id ? 'text-accent' : 'text-muted')}
          >
            {mobileTab === t.id && <motion.span layoutId="mobile-tab" className="absolute inset-x-3 top-0 h-[3px] rounded-b-full bg-accent" />}
            <span className="text-[18px]" aria-hidden>
              {t.icon}
            </span>
            {t.label}
            {t.id === 'inbox' && unread > 0 && (
              <motion.span key={unread} initial={{ scale: 0.4 }} animate={{ scale: 1 }} className="absolute top-2 right-[22%] grid h-4 min-w-4 place-items-center rounded-full bg-bad px-1 text-[10px] text-white">
                {unread}
              </motion.span>
            )}
          </button>
        ))}
      </nav>

      <AnimatePresence>{modal && renderModal(modal)}</AnimatePresence>
      <Tutorial />
    </div>
  )
}
