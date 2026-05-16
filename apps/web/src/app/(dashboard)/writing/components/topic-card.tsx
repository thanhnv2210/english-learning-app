export const TASK_TYPE_LABELS: Record<string, string> = {
  opinion: 'Opinion',
  discussion: 'Discussion',
  problem_solution: 'Problem & Solution',
  two_part: 'Two-Part Question',
}

export function TopicCard({ topic, taskType }: { topic: string; taskType: string }) {
  return (
    <div className="flex-1 rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
      <div className="mb-2 flex items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">Essay Topic</p>
        {taskType && (
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
            {TASK_TYPE_LABELS[taskType] ?? taskType}
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-foreground">{topic}</p>
    </div>
  )
}

export function PassRow({
  label,
  status,
  result,
}: {
  label: string
  status: 'waiting' | 'running' | 'done'
  result?: string
}) {
  const icon =
    status === 'done' ? '✓' : status === 'running' ? '…' : '○'
  const color =
    status === 'done'
      ? 'text-green-600'
      : status === 'running'
        ? 'text-blue-500 animate-pulse'
        : 'text-faint'

  return (
    <div className="flex items-center gap-3">
      <span className={`w-4 text-center text-sm font-bold ${color}`}>{icon}</span>
      <div className="flex flex-col">
        <span className={`text-sm font-medium ${status === 'waiting' ? 'text-faint' : 'text-muted-foreground'}`}>
          {label}
        </span>
        {result && <span className="text-xs text-faint">{result}</span>}
      </div>
    </div>
  )
}
