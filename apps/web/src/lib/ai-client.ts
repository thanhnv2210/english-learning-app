import { createOllama } from 'ollama-ai-provider'
import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { NextResponse } from 'next/server'

/**
 * Whether AI features are enabled.
 * Set NEXT_PUBLIC_OLLAMA_ENABLED=false to disable all AI generation and show the amber banner.
 * Default: true.
 */
export const OLLAMA_ENABLED = process.env.NEXT_PUBLIC_OLLAMA_ENABLED !== 'false'

// ── Provider selection (priority: Anthropic → OpenRouter → Ollama) ────────────

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

const _anthropic = ANTHROPIC_API_KEY
  ? createAnthropic({ apiKey: ANTHROPIC_API_KEY })
  : null

const _openrouter = !_anthropic && OPENROUTER_API_KEY
  ? createOpenAI({ baseURL: 'https://openrouter.ai/api/v1', apiKey: OPENROUTER_API_KEY })
  : null

const _ollama = createOllama({
  baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/api',
})

// ── Model names ───────────────────────────────────────────────────────────────

/**
 * Fast model — used for most generation tasks (vocab, collocations, essay gen, etc.)
 * Anthropic default: claude-haiku-4-5-20251001
 */
export const OLLAMA_MODEL = _anthropic
  ? (process.env.ANTHROPIC_MODEL ?? 'claude-haiku-4-5-20251001')
  : _openrouter
    ? (process.env.OPENROUTER_MODEL ?? 'google/gemma-3-12b-it:free')
    : (process.env.OLLAMA_MODEL ?? 'qwen2.5-coder:7b')

/**
 * Scoring model — used for IELTS evaluation where quality matters most.
 * Anthropic default: claude-sonnet-4-6
 * Falls back to the fast model if not using Anthropic.
 */
const SCORING_MODEL = _anthropic
  ? (process.env.ANTHROPIC_SCORING_MODEL ?? 'claude-sonnet-4-6')
  : OLLAMA_MODEL

// ── Model factory functions ───────────────────────────────────────────────────

/**
 * Returns the fast model instance.
 * Use for: vocab search, collocations, essay generation, reading/listening gen, etc.
 */
export function ollamaModel() {
  if (_anthropic) return _anthropic(OLLAMA_MODEL)
  if (_openrouter) return _openrouter(OLLAMA_MODEL)
  return _ollama(OLLAMA_MODEL)
}

/**
 * Returns the scoring model instance (higher quality).
 * Use for: writing score, IELTS band evaluation, speaking assessment.
 */
export function aiScoringModel() {
  if (_anthropic) return _anthropic(SCORING_MODEL)
  if (_openrouter) return _openrouter(SCORING_MODEL)
  return _ollama(SCORING_MODEL)
}

// ── Debug & utils ─────────────────────────────────────────────────────────────

export const OLLAMA_DEBUG = process.env.OLLAMA_DEBUG === 'true'

export function ollamaDebug(label: string, raw: string) {
  if (!OLLAMA_DEBUG) return
  const provider = _anthropic ? 'anthropic' : _openrouter ? 'openrouter' : 'ollama'
  console.log(`[${provider}:debug][${label}] raw response (${raw.length} chars):\n${raw}\n`)
}

export function ollamaDisabledResponse() {
  return NextResponse.json(
    { error: 'AI features are currently unavailable.', code: 'OLLAMA_DISABLED' },
    { status: 503 }
  )
}
