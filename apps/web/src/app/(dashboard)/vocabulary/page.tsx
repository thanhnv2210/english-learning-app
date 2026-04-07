import { getAllVocabularyWords } from '@/lib/db/vocabulary'
import { VocabularyList } from './vocabulary-list'

export default async function VocabularyPage() {
  const words = await getAllVocabularyWords()

  // Collect unique domain names across all words (preserving first-seen order)
  const domainSet = new Set<string>()
  for (const word of words) {
    for (const d of word.domains) domainSet.add(d)
  }
  const domains = Array.from(domainSet).sort()

  const generalCount = words.filter((w) => w.domains.length === 0).length

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Academic Word List</h1>
        <p className="mt-1 text-sm text-gray-500">
          {words.length} IELTS Band 6.5 words ·{' '}
          {words.length - generalCount} domain-tagged · {generalCount} general
        </p>
      </div>

      <VocabularyList words={words} domains={domains} />
    </div>
  )
}
