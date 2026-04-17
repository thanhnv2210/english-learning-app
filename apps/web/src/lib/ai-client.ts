import { createOllama } from 'ollama-ai-provider'
import { NextResponse } from 'next/server'

/**
 * Whether Ollama AI features are enabled.
 * Set NEXT_PUBLIC_OLLAMA_ENABLED=false to disable all AI generation
 * (e.g. when running in GitHub Codespaces without a local Ollama instance).
 * Default: true.
 */
export const OLLAMA_ENABLED = process.env.NEXT_PUBLIC_OLLAMA_ENABLED !== 'false'

const _client = createOllama({
  baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/api',
})

/**
 * The model name to use for all Ollama calls.
 * Configured via OLLAMA_MODEL env var.
 */
export const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'qwen2.5-coder:7b'

/**
 * Returns the configured Ollama model instance.
 * Throws if OLLAMA_ENABLED is false — callers should check OLLAMA_ENABLED
 * or use ollamaDisabledResponse() to guard route handlers.
 */
export function ollamaModel() {
  return _client(OLLAMA_MODEL)
}

/**
 * Standard 503 response returned by API routes when Ollama is disabled.
 */
export function ollamaDisabledResponse() {
  return NextResponse.json(
    {
      error:
        'AI features are currently unavailable. Set OLLAMA_BASE_URL to your Ollama instance (e.g. an ngrok URL) and set NEXT_PUBLIC_OLLAMA_ENABLED=true in your .env.local.',
      code: 'OLLAMA_DISABLED',
    },
    { status: 503 }
  )
}
