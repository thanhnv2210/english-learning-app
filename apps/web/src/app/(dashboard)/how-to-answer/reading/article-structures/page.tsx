import Link from 'next/link'
import { ARTICLE_STRUCTURES } from '@/lib/guides/article-structures'
import { ArticleStructureGuide } from './article-structure-guide'

export default function ArticleStructuresPage() {
  return (
    <div className="mx-auto max-w-2xl xl:max-w-3xl 2xl:max-w-6xl">
      <div className="mb-6">
        <Link href="/how-to-answer/reading" className="text-xs text-faint hover:text-muted-foreground">
          ← Reading — How to Answer
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-foreground">Academic Article Structures</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {ARTICLE_STRUCTURES.length} structures · Identify the pattern early — predict every paragraph before you read it.
        </p>
      </div>

      {/* Intro tip */}
      <div className="mb-6 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 px-5 py-4 flex gap-3">
        <span className="shrink-0 text-base leading-none mt-0.5">💡</span>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-400 mb-1">
            Why this matters for Matching Headings
          </p>
          <p className="text-sm leading-relaxed text-blue-900 dark:text-blue-300">
            Each structure has a fixed set of paragraph roles. Once you identify the structure from the
            introduction (using signal phrases), you can predict what each subsequent paragraph must be doing —
            and match headings to those roles rather than reading every sentence. This can save 3–5 minutes per passage.
          </p>
        </div>
      </div>

      <ArticleStructureGuide structures={ARTICLE_STRUCTURES} />
    </div>
  )
}
