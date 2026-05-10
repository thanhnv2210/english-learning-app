'use client'

type Props = {
  page: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function PaginationBar({ page, totalPages, totalItems, pageSize, onPageChange }: Props) {
  if (totalPages <= 1) return null

  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  // Up to 5 page buttons centred around current page
  const pages: number[] = []
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap pt-2 border-t border-border">
      <span className="text-xs text-faint">
        Showing {start}–{end} of {totalItems}
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-subtle disabled:opacity-30 transition-colors"
        >
          ← Prev
        </button>

        {pages[0] > 1 && (
          <>
            <button onClick={() => onPageChange(1)} className="rounded px-2.5 py-1 text-xs text-muted-foreground hover:bg-subtle transition-colors">1</button>
            {pages[0] > 2 && <span className="text-xs text-faint px-1">…</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              p === page ? 'bg-blue-500 text-white' : 'text-muted-foreground hover:bg-subtle'
            }`}
          >
            {p}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && <span className="text-xs text-faint px-1">…</span>}
            <button onClick={() => onPageChange(totalPages)} className="rounded px-2.5 py-1 text-xs text-muted-foreground hover:bg-subtle transition-colors">{totalPages}</button>
          </>
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-subtle disabled:opacity-30 transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
