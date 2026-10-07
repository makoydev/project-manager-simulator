/**
 * Tiny synthesized sound effects (Web Audio, no files). Every sound is a few
 * oscillator notes with fast envelopes, kept quiet so it never gets annoying.
 */
export type Sfx = 'click' | 'ping' | 'good' | 'bad' | 'whoosh' | 'coin' | 'alarm' | 'launch' | 'unlock' | 'tick' | 'stamp' | 'send'

let ctx: AudioContext | null = null
let enabled = true
const VOLUME = 0.11

export function setSoundEnabled(on: boolean) {
  enabled = on
}

function audio(): AudioContext | null {
  if (!enabled) return null
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function note(ac: AudioContext, freq: number, start: number, dur: number, type: OscillatorType = 'sine', gain = 1, slideTo?: number) {
  const osc = ac.createOscillator()
  const g = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, start + dur)
  g.gain.setValueAtTime(0.0001, start)
  g.gain.exponentialRampToValueAtTime(VOLUME * gain, start + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
  osc.connect(g).connect(ac.destination)
  osc.start(start)
  osc.stop(start + dur + 0.02)
}

function noise(ac: AudioContext, start: number, dur: number, gain = 0.5, from = 800, to = 3000) {
  const len = Math.floor(ac.sampleRate * dur)
  const buf = ac.createBuffer(1, len, ac.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len)
  const src = ac.createBufferSource()
  src.buffer = buf
  const filter = ac.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(from, start)
  filter.frequency.exponentialRampToValueAtTime(to, start + dur)
  const g = ac.createGain()
  g.gain.setValueAtTime(VOLUME * gain, start)
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
  src.connect(filter).connect(g).connect(ac.destination)
  src.start(start)
}

export function play(sfx: Sfx) {
  const ac = audio()
  if (!ac) return
  const t = ac.currentTime + 0.005
  switch (sfx) {
    case 'click':
      note(ac, 520, t, 0.05, 'triangle', 0.6)
      break
    case 'tick':
      note(ac, 1400, t, 0.025, 'square', 0.15)
      break
    case 'ping':
      note(ac, 880, t, 0.12, 'sine', 0.8)
      note(ac, 1320, t + 0.07, 0.18, 'sine', 0.6)
      break
    case 'good':
      note(ac, 523, t, 0.12, 'triangle')
      note(ac, 659, t + 0.08, 0.12, 'triangle')
      note(ac, 784, t + 0.16, 0.22, 'triangle')
      break
    case 'bad':
      note(ac, 330, t, 0.16, 'sawtooth', 0.35, 220)
      note(ac, 247, t + 0.12, 0.25, 'sawtooth', 0.3, 165)
      break
    case 'whoosh':
      noise(ac, t, 0.35, 0.6, 400, 2400)
      break
    case 'send':
      noise(ac, t, 0.25, 0.4, 1200, 5000)
      note(ac, 700, t, 0.18, 'sine', 0.4, 1400)
      break
    case 'coin':
      note(ac, 988, t, 0.08, 'square', 0.35)
      note(ac, 1319, t + 0.07, 0.2, 'square', 0.35)
      break
    case 'unlock':
      ;[523, 659, 784, 1047].forEach((f, i) => note(ac, f, t + i * 0.07, 0.2, 'triangle', 0.7))
      break
    case 'stamp':
      noise(ac, t, 0.12, 1, 200, 120)
      note(ac, 110, t, 0.2, 'sine', 1.2, 60)
      break
    case 'alarm':
      for (let i = 0; i < 3; i++) {
        note(ac, 880, t + i * 0.32, 0.15, 'square', 0.35)
        note(ac, 660, t + i * 0.32 + 0.16, 0.15, 'square', 0.35)
      }
      break
    case 'launch':
      noise(ac, t, 1.2, 0.7, 200, 4000)
      note(ac, 220, t, 1.1, 'sawtooth', 0.25, 880)
      break
  }
}
