import type { ConceptId } from '../game/types'

/** A Field Guide entry. Unlocked in-game when the player meets the concept. */
export interface ConceptEntry {
  id: ConceptId
  title: string
  category: 'The Role' | 'Planning' | 'Execution' | 'Risk' | 'People' | 'Communication' | 'Launch' | 'Singapore'
  /** Single emoji. */
  icon: string
  /** One-line definition. ≤ 140 chars. */
  tldr: string
  /** 2–4 short paragraphs explaining the concept in a tech-company context. */
  body: string[]
  /** 3–5 concrete practices / how a TPM actually does this day to day. */
  inPractice: string[]
  /** The mistake ex–tech leads typically make here. */
  tlTrap?: string
  /** How the PMP / PMBOK version maps (and where tech companies differ). */
  pmpBridge?: string
  /** Singapore-specific context (regulation, market, culture). Keep factual. */
  sgContext?: string
  /** A realistic interview question and an outline of a strong answer. */
  interview?: { q: string; a: string }
}

export type CareerBlock =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'steps'; items: { title: string; text: string }[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'callout'; tone: 'tip' | 'warn' | 'info'; title?: string; text: string }

/** Always-unlocked career transition material. */
export interface CareerSection {
  id: string
  title: string
  icon: string
  /** One-line teaser shown on the section card. */
  blurb: string
  blocks: CareerBlock[]
}

export type InterviewCategory = 'Behavioral' | 'Program Sense' | 'Technical Depth' | 'Stakeholders' | 'Execution' | 'Singapore' | 'AI Delivery'

/** Mock-interview arcade question: pick the strongest answer. */
export interface InterviewQuestion {
  id: string
  category: InterviewCategory
  /** The interviewer's question / scenario. ≤ 260 chars. */
  prompt: string
  /** Exactly 4 candidate answers, each ≤ 160 chars. */
  options: [string, string, string, string]
  /** Index of the strongest answer. */
  answer: 0 | 1 | 2 | 3
  /** Why it's strongest and what's wrong with the others. ≤ 360 chars. */
  explanation: string
  /** What interviewers are probing for. ≤ 160 chars. */
  lookFor: string
}
