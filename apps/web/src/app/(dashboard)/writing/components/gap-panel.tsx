export type GapCriterion = {
  criterion: string
  currentBand: number
  targetBand: number
  requiredChanges: string[]
}

export function GapPanel({
  gapResult,
  gapStream,
  isLoading,
  onRequest,
  targetBand,
}: {
  gapResult: GapCriterion[] | null
  gapStream: string
  isLoading: boolean
  onRequest: () => void
  targetBand: number
}) {
  if (!gapResult && !gapStream && !isLoading) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-dashed border-border bg-card p-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Gap Analysis</p>
          <p className="text-xs text-faint">Exactly what to change to reach Band {targetBand}</p>
        </div>
        <button
          onClick={onRequest}
          className="rounded-lg border border-blue-200 px-4 py-2 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50"
        >
          Show Gap Analysis
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-purple-200 bg-purple-50 p-5">
      <p className="mb-3 text-sm font-semibold text-purple-800">
        Gap Analysis — Path to Band {targetBand}
      </p>

      {isLoading && !gapStream && (
        <p className="animate-pulse text-sm text-purple-400">Analysing gaps…</p>
      )}

      {isLoading && gapStream && !gapResult && (
        <pre className="max-h-48 overflow-y-auto rounded-lg bg-card p-3 font-mono text-xs text-muted-foreground whitespace-pre-wrap">
          {gapStream}
        </pre>
      )}

      {gapResult !== null && (
        <>
          {gapResult.length === 0 ? (
            <p className="text-sm text-green-700">All criteria meet Band {targetBand}.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {gapResult.map(({ criterion, currentBand, targetBand: tb, requiredChanges }) => (
                <div key={criterion}>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-xs font-semibold text-purple-700">{criterion}</span>
                    <span className="text-xs text-faint">
                      {currentBand} → {tb}
                    </span>
                  </div>
                  <ul className="flex flex-col gap-1">
                    {requiredChanges.map((change, i) => (
                      <li key={i} className="text-xs leading-relaxed text-muted-foreground">· {change}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
