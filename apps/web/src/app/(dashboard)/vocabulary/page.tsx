import { getAllVocabularyWords } from '@/lib/db/vocabulary'
import { getSkillFavorites } from '@/lib/db/user-skill-topics'
import { VocabularyList } from './vocabulary-list'
import { VocabSearch } from './vocab-search'

export default async function VocabularyPage() {
  const [words, favoriteDomains] = await Promise.all([
    getAllVocabularyWords(),
    getSkillFavorites('vocabulary'),
  ])

  // Collect unique domain names across all words (preserving first-seen order)
  const domainSet = new Set<string>()
  for (const word of words) {
    for (const d of word.domains) domainSet.add(d)
  }
  const domains = Array.from(domainSet).sort()

  const generalCount = words.filter((w) => w.domains.length === 0).length

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-8 xl:max-w-6xl 2xl:max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Academic Word List</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {words.length} IELTS Band 6.5 words ·{' '}
          {words.length - generalCount} domain-tagged · {generalCount} general
        </p>
      </div>

      <VocabSearch />

      <VocabularyList words={words} domains={domains} favoriteDomains={favoriteDomains} />
    </div>
  )
}
