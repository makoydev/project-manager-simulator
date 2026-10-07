/**
 * Live mode — an immersive workday on a virtual desktop.
 *
 * A meeting is a labelled script of beats that plays in (scaled) real time: people talk,
 * talk over each other, react, share screens, join and leave. At choice beats the player
 * speaks under a countdown; silence has consequences. Side apps (Slack, docs, dashboards,
 * calendar) hold information — reading key items sets `read:<id>` flags that unlock better
 * things to say later.
 */
import type { Grade, ScenarioId } from '../game/types'

export type PersonId = string

export interface LivePerson {
  id: PersonId
  name: string
  short: string
  title: string
  /** Single emoji used on the video tile. */
  avatar: string
  hue: number
  location: string
  /** Camera on shows a lit tile; off shows a dim tile with the avatar small. */
  camera: boolean
}

export type Mood = 'calm' | 'excited' | 'annoyed' | 'worried' | 'amused' | 'tired'

/** Flags all set (`flags`) and none set (`notFlags`). */
export interface Cond {
  flags?: string[]
  notFlags?: string[]
}

export interface LiveEffects {
  /** Relationship deltas per person (−15…15). */
  rel?: Record<PersonId, number>
  /** Exec trust in you (−15…15). */
  trust?: number
  /** Team morale (−15…15). */
  morale?: number
  /** How clear decisions and ownership are (−15…15). */
  clarity?: number
  flags?: string[]
}

export type Beat =
  /** Someone speaks. `overlap` = they cut in while the previous speaker is still talking. */
  | { t: 'say'; who: PersonId; text: string; mood?: Mood; overlap?: boolean }
  /** Stage direction shown in captions, e.g. "Daniel unmutes." */
  | { t: 'narrate'; text: string }
  /** A floating emoji reaction on someone's tile. */
  | { t: 'react'; who: PersonId; emoji: string }
  | { t: 'join'; who: PersonId }
  | { t: 'leave'; who: PersonId; text?: string }
  /** Screen share: a doc or dashboard fills the stage; `id: null` stops sharing. */
  | { t: 'share'; who: PersonId; app: 'doc' | 'dash'; id: string | null }
  /** Deliver a Slack message now (its `at` must be 'beat'). */
  | { t: 'slack'; id: string }
  /** A doc comment appears now (its `at` must be 'beat'). */
  | { t: 'comment'; id: string }
  | { t: 'pause'; ms: number }
  | { t: 'effects'; effects: LiveEffects }
  /** Your turn to speak. Silence for `timeout` seconds jumps to `timeoutGoto`. */
  | { t: 'choice'; id: string; prompt: string; timeout: number; options: LiveOption[]; timeoutGoto: string; timeoutInsight: string }
  | { t: 'goto'; to: string }
  /** Branch on flags. (Not `then`/`else`: an object with `then` is a thenable.) */
  | { t: 'if'; when: Cond; yes: string; no: string }
  /** Meeting over. `outcome` is shown on the meeting summary card. */
  | { t: 'end'; outcome: string }

export interface LiveOption {
  id: string
  /** What you say, in your own voice. ≤ 220 chars. */
  text: string
  grade: Grade
  /** Mentor's take, shown in the debrief. ≤ 300 chars. */
  insight: string
  /** All flags required to say this (usually read:<id> flags). Locked options show `lockedHint`. */
  needs?: string[]
  lockedHint?: string
  effects?: LiveEffects
  goto: string
}

export interface Meeting {
  id: string
  title: string
  /** 'HH:MM', 24h. */
  start: string
  minutes: number
  attendees: PersonId[]
  agenda: string[]
  /** Slack messages delivered when the desk time before this meeting begins. */
  deskBefore?: string[]
  /** Labelled sequences; execution starts at 'start'. Every sequence ends in goto, if, choice or end. */
  script: Record<string, Beat[]>
}

export interface SlackChannel {
  id: string
  /** '#proj-kaya' for channels, the person's short name for DMs. */
  name: string
  kind: 'channel' | 'dm'
  with?: PersonId
  topic?: string
}

export interface SlackReply {
  id: string
  text: string
  grade: Grade
  insight: string
  effects?: LiveEffects
  /** Their answer to your reply. */
  response?: string
}

export interface SlackMessage {
  id: string
  channel: string
  from: PersonId
  text: string
  /** 'morning': already there at 9:15. 'desk': delivered via a meeting's deskBefore. 'beat': delivered by a { t: 'slack' } beat. */
  at: 'morning' | 'desk' | 'beat'
  /** Reading it sets the flag `read:<id>`. */
  key?: boolean
  replies?: SlackReply[]
}

export interface DashPanel {
  id: string
  title: string
  unit: string
  /** Evenly spaced points, oldest first. */
  points: number[]
  /** Labels for the first and last point, e.g. ['14 days ago', 'today']. */
  span: [string, string]
  threshold?: { value: number; label: string }
  caption: string
  /** Seeing it sets `read:<id>`. */
  key?: boolean
}

export interface DocComment {
  id: string
  who: PersonId
  /** The doc text the comment is anchored to (shown highlighted). */
  quote: string
  text: string
  at: 'morning' | 'beat'
  key?: boolean
}

export interface LiveDoc {
  id: string
  title: string
  author: PersonId
  sections: { heading: string; body: string[] }[]
  comments: DocComment[]
}

export interface WrapOption {
  id: string
  text: string
  /** This option is the accurate record when the condition holds. */
  correctWhen?: Cond
  why: string
}

export interface WrapField {
  id: string
  label: string
  help: string
  options: WrapOption[]
}

export interface WrapUp {
  title: string
  intro: string
  /** The decision record fields. */
  fields: WrapField[]
  /** The end-of-day update you post. */
  post: { channel: string; prompt: string; options: { id: string; text: string; grade: Grade; insight: string; needs?: string[]; lockedHint?: string }[] }
}

export interface LiveEpisode {
  id: string
  title: string
  subtitle: string
  scenarioId: ScenarioId
  /** e.g. "Wednesday · Week 2 of Project Kaya". */
  dayLabel: string
  /** Shown on the lock screen before the day starts. */
  intro: string[]
  you: { name: string; title: string }
  people: LivePerson[]
  channels: SlackChannel[]
  messages: SlackMessage[]
  dashboards: DashPanel[]
  docs: LiveDoc[]
  calendar: { time: string; title: string; meetingId?: string }[]
  meetings: Meeting[]
  wrapUp: WrapUp
}
