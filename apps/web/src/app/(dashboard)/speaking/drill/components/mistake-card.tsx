import { getPhenomenonColor, PHENOMENON_LABELS } from '@/lib/ielts/connected-speech/prompts'
import type { Mistake } from '../utils'

export function MistakeCard({ mistake, rank }: { mistake: Mistake; rank: number }) {
  const c = mistake.csTip ? getPhenomenonColor(mistake.csTip.phenomenon) : null
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-start gap-3">
        <span className="shrink-0 text-sm font-bold text-faint w-6 text-right">#{rank}</span>
        <div className="flex-1 space-y-1.5">
          {mistake.type === 'sub' ? (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold text-foreground">Wrong word:</span>
              <span className="font-mono rounded px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
                &ldquo;{mistake.original}&rdquo;
              </span>
              <span className="text-faint text-xs">— you said —</span>
              <span className="font-mono rounded px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                &ldquo;{mistake.spoken}&rdquo;
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold text-foreground">Skipped:</span>
              <span className="font-mono rounded px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 line-through">
                &ldquo;{mistake.original}&rdquo;
              </span>
            </div>
          )}
          <p className="text-xs text-faint">
            Context: &ldquo;<span className="italic">{mistake.context}</span>&rdquo;
          </p>
        </div>
      </div>

      {mistake.csTip && c && (
        <div className={`rounded-lg border p-3 ${c.bg} ${c.border} ml-9`}>
          <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${c.text}`}>
            Connected Speech: {PHENOMENON_LABELS[mistake.csTip.phenomenon]}
          </p>
          <p className="text-xs text-muted-foreground">
            <span className={`font-mono font-semibold ${c.text}`}>
              {mistake.csTip.original} → {mistake.csTip.transformed}
            </span>
            {' — '}{mistake.csTip.tip}
          </p>
        </div>
      )}
    </div>
  )
}
