import type { AuditResult } from '@/app/api/writing/audit/route'

export function AuditPanel({ audit }: { audit: AuditResult }) {
  const checks = [
    { label: 'Word count', value: `${audit.wordCount}`, ok: audit.wordCount >= 250 },
    { label: 'Paragraphs', value: `${audit.paragraphCount}`, ok: audit.paragraphCount >= 4 },
    { label: 'Introduction', value: audit.hasIntroduction ? 'Present' : 'Missing', ok: audit.hasIntroduction },
    { label: 'Conclusion', value: audit.hasConclusion ? 'Present' : 'Missing', ok: audit.hasConclusion },
    { label: 'Task fulfilled', value: audit.taskFulfilled ? 'Yes' : 'Partial', ok: audit.taskFulfilled },
  ]
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="mb-3 text-sm font-semibold text-foreground">Structural Audit</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {checks.map(({ label, value, ok }) => (
          <div key={label} className="flex flex-col rounded-lg bg-muted px-3 py-2">
            <span className="text-xs text-faint">{label}</span>
            <span className={`text-sm font-semibold ${ok ? 'text-green-600' : 'text-amber-600'}`}>{value}</span>
          </div>
        ))}
      </div>
      {audit.notes.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1">
          {audit.notes.map((n, i) => (
            <li key={i} className="text-xs text-muted-foreground">· {n}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
