import { create } from 'zustand'
import { endAchievements, liveAchievements, ACHIEVEMENT_BY_ID } from '../game/achievements'
import { performAction, type ActionId, type ActionTarget } from '../game/actions'
import type { Delta } from '../game/effects'
import { endDay, newGame, resolveChoice, SAVE_VERSION, type ChoiceResult, type DayReport, type NewGameOptions } from '../game/engine'
import { callGoNoGoEarly, decideLaunch, decideNoGo, resolveIncident } from '../game/launch'
import { retroDue, statusReportDue, submitRetro, submitStatusReport, type RetroOption } from '../game/report'
import { finalScore, type FinalScore } from '../game/scoring'
import type { ConceptId, GameState, LaunchMode, LaunchResult, Role, StatusReportInput, StatusReportResult } from '../game/types'
import { play } from '../lib/sfx'
import { load, remove, save } from '../lib/storage'
import { useMeta } from './meta'

export type Screen = 'title' | 'setup' | 'game' | 'ending' | 'guide' | 'arcade' | 'live'

export type Modal =
  | { kind: 'event'; uid: string; eventId: string; result?: ChoiceResult }
  | { kind: 'pickRole' }
  | { kind: 'pickWs'; action: 'contractor' | 'codeIt' }
  | { kind: 'confirmEndDay'; expiring: string[] }
  | { kind: 'statusReport'; result?: StatusReportResult; deltas?: Delta[] }
  | { kind: 'retro'; picked?: RetroOption; deltas?: Delta[] }
  | { kind: 'dayReport'; report: DayReport }
  | { kind: 'goNoGo' }
  | { kind: 'launch'; result: LaunchResult; deltas: Delta[] }
  | { kind: 'risk'; id: string }
  | { kind: 'person'; role: Role }
  | { kind: 'confirmQuit' }

export interface Toast {
  id: number
  icon: string
  title: string
  text?: string
  insight?: string
  deltas?: Delta[]
  tone: 'action' | 'achievement' | 'info'
}

export type GuideTab = 'concepts' | 'career' | 'achievements'

interface GameStore {
  screen: Screen
  game: GameState | null
  modal: Modal | null
  toasts: Toast[]
  score: FinalScore | null
  /** Achievements unlocked during the last finished run (for the review screen). */
  runAchievements: string[]
  guide: { tab: GuideTab; concept?: ConceptId }
  /** Where to return from the guide/arcade. */
  back: Screen

  go: (screen: Screen) => void
  openGuide: (tab?: GuideTab, concept?: ConceptId) => void
  startGame: (opts: NewGameOptions) => void
  continueGame: () => void
  /** The saved in-progress run, if any (safe against blocked storage). */
  savedGame: () => GameState | null
  openEvent: (uid: string) => void
  choose: (choiceId: string) => void
  setModal: (m: Modal | null) => void
  act: (id: ActionId, target?: ActionTarget) => void
  requestEndDay: () => void
  proceedEndDay: () => void
  submitReport: (input: StatusReportInput) => void
  submitRetro: (optionId: string) => void
  continueAfterDay: () => void
  callGoNoGo: () => void
  launch: (mode: LaunchMode) => void
  noGo: () => void
  incident: (choiceId: string) => void
  finish: () => void
  quit: () => void
  toast: (t: Omit<Toast, 'id'>) => void
  dismissToast: (id: number) => void
}

const SAVE_KEY = 'shipitlah:save:v1'
let toastSeq = 0

function loadSave(): GameState | null {
  const g = load<GameState>(SAVE_KEY)
  return g && g.version === SAVE_VERSION && g.phase !== 'ended' ? g : null
}

export const useGame = create<GameStore>((set, get) => {
  /** Commit a new game state: persist, record concepts, unlock live achievements. */
  const commit = (game: GameState, extra: Partial<GameStore> = {}) => {
    set({ game, ...extra })
    if (game.phase !== 'ended') save(SAVE_KEY, game)
    const meta = useMeta.getState()
    meta.discover(game.conceptsSeen)
    announce(meta.unlock(liveAchievements(game)))
  }

  const announce = (ids: string[]) => {
    for (const id of ids) {
      const a = ACHIEVEMENT_BY_ID[id]
      if (!a) continue
      play('unlock')
      get().toast({ icon: a.icon, title: `Achievement: ${a.name}`, text: a.description, tone: 'achievement' })
    }
  }

  return {
    screen: 'title',
    game: null,
    modal: null,
    toasts: [],
    score: null,
    runAchievements: [],
    guide: { tab: 'concepts' },
    back: 'title',

    go: (screen) => set({ screen, back: get().screen === 'guide' || get().screen === 'arcade' || get().screen === 'live' ? get().back : get().screen }),
    openGuide: (tab = 'concepts', concept) =>
      set({ screen: 'guide', guide: { tab, concept }, back: get().screen === 'guide' ? get().back : get().screen, modal: null }),

    savedGame: () => loadSave(),
    startGame: (opts) => {
      const game = newGame(opts)
      set({ screen: 'game', modal: null, toasts: [], score: null })
      commit(game)
    },
    continueGame: () => {
      const game = loadSave()
      if (!game) return
      set({ screen: 'game', modal: game.phase === 'goNoGo' ? { kind: 'goNoGo' } : null, score: null })
      commit(game)
    },

    openEvent: (uid) => {
      const item = get().game?.inbox.find((i) => i.uid === uid)
      if (!item) return
      play('whoosh')
      set({ modal: { kind: 'event', uid, eventId: item.eventId } })
    },
    choose: (choiceId) => {
      const { game, modal } = get()
      if (!game || modal?.kind !== 'event' || modal.result) return
      const { state, result } = resolveChoice(game, modal.uid, choiceId)
      commit(state, { modal: { ...modal, result } })
    },
    setModal: (modal) => set({ modal }),

    act: (id, target) => {
      const { game } = get()
      if (!game) return
      const { state, result } = performAction(game, id, target)
      commit(state, { modal: null })
      play(result.deltas.some((d) => d.label.startsWith('Risk spotted')) ? 'ping' : 'coin')
      get().toast({ icon: result.icon, title: result.title, text: result.text, insight: result.insight, deltas: result.deltas, tone: 'action' })
    },

    requestEndDay: () => {
      const { game } = get()
      if (!game || game.phase !== 'day') return
      const expiring = game.inbox.filter((i) => i.expiresDay <= game.day).map((i) => i.eventId)
      if (expiring.length && get().modal?.kind !== 'confirmEndDay') {
        set({ modal: { kind: 'confirmEndDay', expiring } })
        return
      }
      get().proceedEndDay()
    },
    proceedEndDay: () => {
      const { game } = get()
      if (!game) return
      if (statusReportDue(game)) return set({ modal: { kind: 'statusReport' } })
      if (retroDue(game)) return set({ modal: { kind: 'retro' } })
      const { state, report } = endDay(game)
      play('whoosh')
      commit(state, { modal: { kind: 'dayReport', report } })
    },
    submitReport: (input) => {
      const { game } = get()
      if (!game) return
      const { state, result, deltas } = submitStatusReport(game, input)
      play('send')
      commit(state, { modal: { kind: 'statusReport', result, deltas } })
    },
    submitRetro: (optionId) => {
      const { game } = get()
      if (!game) return
      const { state, deltas, option } = submitRetro(game, optionId)
      play(option.grade === 'poor' ? 'bad' : 'good')
      commit(state, { modal: { kind: 'retro', picked: option, deltas } })
    },
    continueAfterDay: () => {
      const { game } = get()
      if (!game) return
      if (game.phase === 'ended') return get().finish()
      if (game.phase === 'goNoGo') return set({ modal: { kind: 'goNoGo' } })
      play('ping')
      set({ modal: null })
    },

    callGoNoGo: () => {
      const { game } = get()
      if (!game) return
      commit(callGoNoGoEarly(game), { modal: { kind: 'goNoGo' } })
    },
    launch: (mode) => {
      const { game } = get()
      if (!game) return
      const { state, result, deltas } = decideLaunch(game, mode)
      play('launch')
      commit(state, { modal: { kind: 'launch', result, deltas } })
    },
    noGo: () => {
      const { game } = get()
      if (!game) return
      const { state, deltas } = decideNoGo(game)
      play('stamp')
      commit(state, { modal: null })
      get().toast({
        icon: '✋',
        title: `No-Go called. New launch: Day ${state.targetDay}`,
        text: 'You bought time. Spend it on the gaps the room called out.',
        deltas,
        tone: 'info',
      })
    },
    incident: (choiceId) => {
      const { game, modal } = get()
      if (!game || modal?.kind !== 'launch') return
      const { state, deltas } = resolveIncident(game, choiceId)
      play(choiceId === 'commander' ? 'good' : 'bad')
      commit(state, { modal: { ...modal, result: state.launch!, deltas: [...modal.deltas, ...deltas] } })
    },

    finish: () => {
      const { game } = get()
      if (!game) return
      const score = finalScore(game)
      const meta = useMeta.getState()
      meta.recordRun(game.scenarioId, score.total, score.grade, game.ending === 'launched')
      const completed = useMeta.getState().completed
      const earned = endAchievements(game, score, completed)
      const fresh = meta.unlock(earned)
      remove(SAVE_KEY)
      set({ screen: 'ending', modal: null, score, runAchievements: [...new Set(earned)] })
      if (fresh.length) setTimeout(() => play('unlock'), 1800)
    },
    quit: () => {
      remove(SAVE_KEY)
      set({ screen: 'title', game: null, modal: null, toasts: [] })
    },

    toast: (t) => set({ toasts: [...get().toasts.slice(-3), { ...t, id: ++toastSeq }] }),
    dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
  }
})
