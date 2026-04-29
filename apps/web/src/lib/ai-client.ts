import { createOllama } from 'ollama-ai-provider'
import { createOpenAI } from '@ai-sdk/openai'
import { NextResponse } from 'next/server'

/**
 * Whether AI features are enabled.
 * Set NEXT_PUBLIC_OLLAMA_ENABLED=false to disable all AI generation and show the amber banner.
 * Default: true.
 */
export const OLLAMA_ENABLED = process.env.NEXT_PUBLIC_OLLAMA_ENABLED !== 'false'

// ── Provider selection ────────────────────────────────────────────────────────
// If OPENROUTER_API_KEY is set, use OpenRouter (OpenAI-compatible).
// Otherwise fall back to local Ollama.

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

const _openrouter = OPENROUTER_API_KEY
  ? createOpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: OPENROUTER_API_KEY,
    })
  : null

const _ollama = createOllama({
  baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/api',
})

/**
 * The model name to use for AI calls.
 * - OpenRouter: set OPENROUTER_MODEL (e.g. meta-llama/llama-3.1-8b-instruct:free)
 * - Ollama: set OLLAMA_MODEL (default: qwen2.5-coder:7b)
 */
export const OLLAMA_MODEL = OPENROUTER_API_KEY
  ? (process.env.OPENROUTER_MODEL ?? 'meta-llama/llama-3.1-8b-instruct:free')
  : (process.env.OLLAMA_MODEL ?? 'qwen2.5-coder:7b')

/**
 * Returns the configured model instance (OpenRouter or Ollama).
 * Callers should guard with OLLAMA_ENABLED or ollamaDisabledResponse().
 */
export function ollamaModel() {
  if (_openrouter) return _openrouter(OLLAMA_MODEL)
  return _ollama(OLLAMA_MODEL)
}

/**
 * When OLLAMA_DEBUG=true, logs the raw AI response text to the server console.
 * Useful for diagnosing parse errors or unexpected model output.
 */
export const OLLAMA_DEBUG = process.env.OLLAMA_DEBUG === 'true'

export function ollamaDebug(label: string, raw: string) {
  if (!OLLAMA_DEBUG) return
  const provider = _openrouter ? 'openrouter' : 'ollama'
  console.log(`[${provider}:debug][${label}] raw response (${raw.length} chars):\n${raw}\n`)
}

/**
 * Standard 503 response returned by API routes when AI is disabled.
 */
export function ollamaDisabledResponse() {
  return NextResponse.json(
    {
      error: 'AI features are currently unavailable.',
      code: 'OLLAMA_DISABLED',
    },
    { status: 503 }
  )
}
