import { VERB_GROUPS } from '@/lib/ielts/irregular-verb-groups'
import type { VerbGroup } from '@/lib/ielts/irregular-verb-groups'

export default function IrregularVerbsPage() {
  const totalVerbs = VERB_GROUPS.reduce((sum, g) => sum + g.verbs.length, 0)

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-8">

      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Grammar Reference
          </span>
          <span className="text-xs text-faint">{totalVerbs} verbs · {VERB_GROUPS.length} groups</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Irregular Verbs</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Irregular verbs do not follow the standard <span className="font-mono text-xs bg-subtle px-1 py-0.5 rounded">+ed</span> rule.
          Instead of memorising each one individually, recognising the underlying <strong>sound patterns</strong> lets you learn whole families at once.

          Each group below shares a common change in vowel or ending.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {VERB_GROUPS.map((g) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-opacity hover:opacity-80 ${g.color.badge}`}
            >
              {g.name}
            </a>
          ))}
        </div>
      </div>

      {/* Groups */}
      {VERB_GROUPS.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}

    </div>
  )
}

function GroupCard({ group }: { group: VerbGroup }) {
  return (
    <section id={group.id} className={`rounded-xl border overflow-hidden ${group.color.border}`}>

      {/* Group header */}
      <div className={`px-5 py-4 flex flex-col gap-1 ${group.color.header}`}>
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${group.color.badge}`}>
            {group.name}
          </span>
          <code className="text-xs font-mono text-muted-foreground">{group.pattern}</code>
          <span className="text-xs text-faint ml-auto">{group.verbs.length} verbs</span>
        </div>
        <p className="text-sm text-foreground mt-1">{group.description}</p>
        <p className="text-xs text-muted-foreground italic">
          💡 {group.tip}
        </p>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-3 border-b border-t border-border bg-subtle px-5 py-2">
        {['Base', 'Past Simple', 'Past Participle'].map((h) => (
          <span key={h} className="text-[10px] font-bold uppercase tracking-widest text-faint">{h}</span>
        ))}
      </div>

      {/* Verb rows */}
      <div className="divide-y divide-border">
        {group.verbs.map((v) => (
          <div key={v.base} className="grid grid-cols-3 px-5 py-2.5 hover:bg-subtle transition-colors">
            <span className="text-sm font-semibold text-foreground">{v.base}</span>
            <VerbCell word={v.past} base={v.base} colorClass={group.color.cell} />
            <div className="flex items-center gap-2">
              <VerbCell word={v.pp} base={v.base} colorClass={group.color.cell} />
              {v.note && (
                <span className="text-[10px] text-faint italic hidden sm:inline">{v.note}</span>
              )}
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}

function VerbCell({ word, base, colorClass }: { word: string; base: string; colorClass: string }) {
  const changed = word !== base
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-sm font-semibold w-fit ${
        changed ? colorClass + ' text-foreground' : 'text-muted-foreground'
      }`}
    >
      {word}
    </span>
  )
}
