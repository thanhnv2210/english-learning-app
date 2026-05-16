type SelectionChip = { label: string; onRemove: () => void }

export function SelectionPanel({
  title,
  selectedChips,
  onClearAll,
  search,
  onSearch,
  placeholder,
  children,
}: {
  title: string
  selectedChips: SelectionChip[]
  onClearAll: () => void
  search: string
  onSearch: (v: string) => void
  placeholder: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between min-h-5">
        <p className="text-xs font-semibold text-foreground">{title}</p>
        {selectedChips.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-faint hover:text-red-500 transition-colors"
          >
            Clear all ({selectedChips.length})
          </button>
        )}
      </div>

      {selectedChips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 rounded-lg bg-muted p-2 border border-border">
          {selectedChips.map(({ label, onRemove }) => (
            <span
              key={label}
              className="flex items-center gap-1 rounded-full bg-card border border-blue-200 dark:border-blue-800 px-2 py-0.5 text-xs text-blue-700 dark:text-blue-300 shadow-sm"
            >
              {label}
              <button
                onClick={onRemove}
                className="ml-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 transition-colors leading-none"
                aria-label={`Remove ${label}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder={selectedChips.length > 0 ? `Search to add more…` : placeholder}
        className="rounded-lg border border-border bg-input text-foreground px-3 py-1.5 text-xs outline-none focus:border-blue-400"
      />

      <div className="max-h-44 overflow-y-auto flex flex-col gap-0.5">
        {children}
      </div>
    </div>
  )
}

export function SelectionRow({
  label,
  sublabel,
  selected,
  onToggle,
}: {
  label: string
  sublabel: string
  selected: boolean
  onToggle: () => void
}) {
  return (
    <label className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 cursor-pointer transition-colors ${
      selected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-muted'
    }`}>
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggle}
        className="h-3.5 w-3.5 rounded border-border accent-blue-600"
      />
      <span className={`text-xs font-medium ${selected ? 'text-blue-700 dark:text-blue-300' : 'text-foreground'}`}>
        {label}
      </span>
      <span className="ml-auto text-xs text-faint shrink-0">{sublabel}</span>
    </label>
  )
}
