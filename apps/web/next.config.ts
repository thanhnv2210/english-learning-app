import type { NextConfig } from 'next'

console.log('[env]', {
  NEXT_PUBLIC_OLLAMA_ENABLED: process.env.NEXT_PUBLIC_OLLAMA_ENABLED,
  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL,
  OLLAMA_MODEL: process.env.OLLAMA_MODEL,
})

const nextConfig: NextConfig = {}

export default nextConfig
