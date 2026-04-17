'use client'

export function OllamaDisabledBanner() {
  return (
    <div className="flex items-start gap-3 border-b border-amber-200 bg-amber-50 px-6 py-3">
      <span className="mt-0.5 shrink-0 text-sm">⚠️</span>
      <div className="text-sm text-amber-800">
        <span className="font-semibold">AI features are disabled.</span> To enable, run Ollama
        locally, expose via{' '}
        <code className="rounded bg-amber-100 px-1 font-mono text-xs">ngrok http 11434</code>, then
        set{' '}
        <code className="rounded bg-amber-100 px-1 font-mono text-xs">OLLAMA_BASE_URL</code> and{' '}
        <code className="rounded bg-amber-100 px-1 font-mono text-xs">
          NEXT_PUBLIC_OLLAMA_ENABLED=true
        </code>{' '}
        in your{' '}
        <code className="rounded bg-amber-100 px-1 font-mono text-xs">.env.local</code>.
      </div>
    </div>
  )
}
