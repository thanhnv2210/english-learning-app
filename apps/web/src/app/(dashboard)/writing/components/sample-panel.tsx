import type { SampleResponse } from '@/app/api/writing/sample/route'

export function SamplePanel({
  mode,
  isLoading,
  stream,
  result,
  showEssay,
  onRequest,
  onToggleEssay,
}: {
  mode: 'reference' | 'full'
  isLoading: boolean
  stream: string
  result: SampleResponse | null
  showEssay: boolean
  onRequest: () => void
  onToggleEssay: () => void
}) {
  if (!result && !stream && !isLoading) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-dashed border-border bg-card p-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {mode === 'reference' ? 'Ideas & Collocations' : 'Model Answer'}
          </p>
          <p className="text-xs text-faint">
            {mode === 'reference'
              ? 'See key arguments and reusable phrases for this topic'
              : 'Study a model essay, main ideas, and reusable collocations'}
          </p>
        </div>
        <button
          onClick={onRequest}
          className="rounded-lg border border-green-200 px-4 py-2 text-xs font-semibold text-green-700 transition-colors hover:bg-green-50"
        >
          Generate
        </button>
      </div>
    )
  }

  if (isLoading && !result) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-green-600">
          {mode === 'reference' ? 'Ideas & Collocations' : 'Model Answer'}
        </p>
        {stream ? (
          <pre className="max-h-48 overflow-y-auto rounded-lg bg-card p-3 font-mono text-xs text-muted-foreground whitespace-pre-wrap">
            {stream}
          </pre>
        ) : (
          <p className="animate-pulse text-sm text-green-400">Generating…</p>
        )}
      </div>
    )
  }

  if (!result) return null

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-green-200 bg-green-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
        {mode === 'reference' ? 'Ideas & Collocations' : 'Model Answer'}
      </p>

      <div>
        <p className="mb-2 text-xs font-semibold text-muted-foreground">Main Ideas</p>
        <ol className="flex flex-col gap-1.5 pl-1">
          {result.mainIdeas.map((idea, i) => (
            <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
              <span className="mt-0.5 shrink-0 text-xs font-bold text-green-500">{i + 1}.</span>
              {idea}
            </li>
          ))}
        </ol>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-muted-foreground">Reusable Collocations</p>
        <div className="flex flex-col gap-2">
          {result.collocations.map(({ phrase, usage }, i) => (
            <div key={i} className="rounded-lg border border-green-100 bg-card px-3 py-2">
              <p className="text-xs font-semibold text-green-700">{phrase}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground italic">&quot;{usage}&quot;</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <button
          onClick={onToggleEssay}
          className="mb-2 text-xs font-semibold text-green-700 hover:underline"
        >
          {showEssay ? 'Hide model essay ▲' : 'Reveal model essay ▼'}
        </button>
        {showEssay && (
          <p className="whitespace-pre-wrap rounded-lg border border-green-100 bg-card px-4 py-3 text-sm leading-relaxed text-foreground">
            {result.essay}
          </p>
        )}
      </div>
    </div>
  )
}
