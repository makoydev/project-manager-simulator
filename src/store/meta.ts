import { create } from 'zustand'
import type { LetterGrade } from '../game/scoring'
import type { ConceptId, ScenarioId } from '../game/types'
import { setSoundEnabled } from '../lib/sfx'
import { load, save } from '../lib/storage'

export type ThemePref = 'system' | 'light' | 'dark'

export interface Settings {
  sound: boolean
  theme: ThemePref
}

interface MetaData {
  concepts: ConceptId[]
  achievements: string[]
  completed: ScenarioId[]
  best: Partial<Record<ScenarioId, { total: number; grade: LetterGrade }>>
  arcadeBest: number
  tutorialDone: boolean
  runs: number
  settings: Settings
}

interface MetaStore extends MetaData {
  /** Record concepts met in play; returns the ones that are new across all runs. */
  discover: (ids: ConceptId[]) => ConceptId[]
  /** Unlock achievements; returns the ones that are new. */
  unlock: (ids: string[]) => string[]
  recordRun: (scenario: ScenarioId, total: number, grade: LetterGrade, launched: boolean) => void
  setArcadeBest: (score: number) => boolean
  setTutorialDone: () => void
  setSettings: (p: Partial<Settings>) => void
}

const KEY = 'shipitlah:meta:v1'

const DEFAULTS: MetaData = {
  concepts: [],
  achievements: [],
  completed: [],
  best: {},
  arcadeBest: 0,
  tutorialDone: false,
  runs: 0,
  settings: { sound: true, theme: 'system' },
}

function initial(): MetaData {
  const stored = load<Partial<MetaData>>(KEY)
  return { ...DEFAULTS, ...stored, settings: { ...DEFAULTS.settings, ...stored?.settings } }
}

const pick = (s: MetaStore): MetaData => ({
  concepts: s.concepts,
  achievements: s.achievements,
  completed: s.completed,
  best: s.best,
  arcadeBest: s.arcadeBest,
  tutorialDone: s.tutorialDone,
  runs: s.runs,
  settings: s.settings,
})

export const useMeta = create<MetaStore>((set, get) => ({
  ...initial(),
  discover: (ids) => {
    const known = new Set(get().concepts)
    const fresh = ids.filter((id) => !known.has(id))
    if (fresh.length) set({ concepts: [...get().concepts, ...fresh] })
    return fresh
  },
  unlock: (ids) => {
    const known = new Set(get().achievements)
    const fresh = [...new Set(ids)].filter((id) => !known.has(id))
    if (fresh.length) set({ achievements: [...get().achievements, ...fresh] })
    return fresh
  },
  recordRun: (scenario, total, grade, launched) => {
    const s = get()
    const prev = s.best[scenario]
    set({
      runs: s.runs + 1,
      completed: launched && !s.completed.includes(scenario) ? [...s.completed, scenario] : s.completed,
      best: !prev || total > prev.total ? { ...s.best, [scenario]: { total, grade } } : s.best,
    })
  },
  setArcadeBest: (score) => {
    if (score <= get().arcadeBest) return false
    set({ arcadeBest: score })
    return true
  },
  setTutorialDone: () => set({ tutorialDone: true }),
  setSettings: (p) => set({ settings: { ...get().settings, ...p } }),
}))

useMeta.subscribe((s) => save(KEY, pick(s)))

// Keep side effects (sound switch, theme attribute) in sync with settings.
// Only touch data-theme once the player has chosen a theme, so a host page's own attribute survives.
let themeOwned = false
function applySettings(settings: Settings) {
  setSoundEnabled(settings.sound)
  const root = document.documentElement
  if (settings.theme !== 'system') {
    root.dataset.theme = settings.theme
    themeOwned = true
  } else if (themeOwned) {
    delete root.dataset.theme
    themeOwned = false
  }
}
applySettings(useMeta.getState().settings)
useMeta.subscribe((s, prev) => {
  if (s.settings !== prev.settings) applySettings(s.settings)
})
