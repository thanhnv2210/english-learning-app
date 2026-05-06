import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

console.log('[env]', {
  NEXT_PUBLIC_OLLAMA_ENABLED: process.env.NEXT_PUBLIC_OLLAMA_ENABLED,
  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL,
  OLLAMA_MODEL: process.env.OLLAMA_MODEL,
})

// Allow Server Actions from the Codespaces forwarded port URL.
// CODESPACE_NAME and GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN are injected
// automatically by GitHub Codespaces — not set in local dev, so this is a no-op locally.
const allowedOrigins: string[] = []
if (process.env.CODESPACE_NAME) {
  const domain = process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN ?? 'app.github.dev'
  // Allow both access methods in Codespaces:
  // - VS Code port forwarding → browser sees localhost:3000
  // - Direct Codespaces browser URL → origin is the *.app.github.dev domain
  allowedOrigins.push(
    'localhost:3000',
    `${process.env.CODESPACE_NAME}-3000.${domain}`
  )
}

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins,
    },
  },
}

export default withSentryConfig(nextConfig, {
  silent: true,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // Disable source map upload until SENTRY_ORG and SENTRY_PROJECT are correctly set
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN
      || process.env.SENTRY_ORG?.includes('slug')
      || process.env.SENTRY_PROJECT?.includes('slug'),
  },
})
