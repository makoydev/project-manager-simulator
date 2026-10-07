import { useCallback, useEffect, useRef, useState } from 'react'
import { choose, initLive, joinMeeting, leaveMeeting, markSeen, reply, setWrap, startDay, step, submitWrap, togglePin, type LiveEvent, type LiveState } from './engine'
import type { LiveEpisode } from './types'

const FIRST_BEAT_DELAY = 900

/** Process zero-wait beats (goto, if, effects) in one go, stopping at the first beat that takes time. */
function runUntilWait(s: LiveState, ep: LiveEpisode) {
  const events: LiveEvent[] = []
  let state = s
  let wait = 0
  for (let guard = 0; guard < 60; guard++) {
    const r = step(state, ep)
    state = r.state
    wait = r.wait
    events.push(...r.events)
    if (wait !== 0 || state.phase !== 'meeting' || state.pending) break
  }
  return { state, wait, events }
}

/**
 * Drives a live episode in real time. Beat timing is keyed to a beat counter, so unrelated
 * state changes (reading Slack, pinning a line) never restart the current line's timer.
 */
export function useLive(ep: LiveEpisode, onEvent: (e: LiveEvent) => void) {
  const [state, setState] = useState<LiveState>(() => initLive(ep))
  const [speed, setSpeed] = useState(1)
  const [paused, setPaused] = useState(false)
  const [relaxed, setRelaxed] = useState(false)
  const [beat, setBeat] = useState(0)
  const [delay, setDelay] = useState(FIRST_BEAT_DELAY)
  const [deadline, setDeadline] = useState<number | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)
  const stateRef = useRef(state)
  stateRef.current = state
  const onEventRef = useRef(onEvent)
  onEventRef.current = onEvent

  // The beat loop.
  useEffect(() => {
    if (state.phase !== 'meeting' || state.pending || paused) return
    const t = window.setTimeout(() => {
      const r = runUntilWait(stateRef.current, ep)
      setState(r.state)
      r.events.forEach((e) => onEventRef.current(e))
      setDelay(Number.isFinite(r.wait) ? r.wait : 0)
      setBeat((b) => b + 1)
    }, delay / speed)
    return () => window.clearTimeout(t)
    // Keyed on the beat counter, not on every state change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beat, paused, speed, state.phase, state.pending, delay, ep])

  // Choice countdown (real seconds; frozen while paused; off in relaxed mode).
  const pendingId = state.pending?.id ?? null
  useEffect(() => {
    if (!pendingId || relaxed) {
      setDeadline(null)
      setRemaining(null)
      return
    }
    setDeadline(Date.now() + (stateRef.current.pending?.timeout ?? 20) * 1000)
  }, [pendingId, relaxed])

  useEffect(() => {
    if (deadline === null) return
    if (paused) {
      const left = deadline - Date.now()
      setDeadline(null)
      setRemaining(left)
      return
    }
    const id = window.setInterval(() => {
      const left = deadline - Date.now()
      setRemaining(Math.max(0, left))
      if (left <= 0) {
        window.clearInterval(id)
        setDeadline(null)
        setRemaining(null)
        setState((s) => choose(s, ep, null))
        setDelay(700)
        setBeat((b) => b + 1)
      }
    }, 150)
    return () => window.clearInterval(id)
  }, [deadline, paused, ep])

  // Resume a paused countdown.
  useEffect(() => {
    if (!paused && deadline === null && remaining !== null && stateRef.current.pending && !relaxed) setDeadline(Date.now() + remaining)
  }, [paused, deadline, remaining, relaxed])

  const act = useCallback((fn: (s: LiveState) => LiveState) => setState((s) => fn(s)), [])

  return {
    state,
    speed,
    setSpeed,
    paused,
    setPaused,
    relaxed,
    setRelaxed,
    /** Seconds left on the current choice, or null when untimed. */
    secondsLeft: remaining === null ? null : remaining / 1000,
    startDay: () => act((s) => startDay(s, ep)),
    join: () => {
      act((s) => joinMeeting(s, ep))
      setDelay(FIRST_BEAT_DELAY)
      setBeat((b) => b + 1)
    },
    answer: (optionId: string) => {
      setDeadline(null)
      setRemaining(null)
      act((s) => choose(s, ep, optionId))
      setDelay(900)
      setBeat((b) => b + 1)
    },
    leave: () => act((s) => leaveMeeting(s, ep)),
    seen: (what: Parameters<typeof markSeen>[2]) => act((s) => markSeen(s, ep, what)),
    reply: (messageId: string, replyId: string) => act((s) => reply(s, ep, messageId, replyId)),
    pin: (captionId: number) => act((s) => togglePin(s, captionId)),
    setWrap: (field: string, optionId: string) => act((s) => setWrap(s, field, optionId)),
    submitWrap: () => act((s) => submitWrap(s)),
    restart: () => {
      setState(initLive(ep))
      setDelay(FIRST_BEAT_DELAY)
      setBeat(0)
      setPaused(false)
    },
  }
}

export type LiveApi = ReturnType<typeof useLive>
