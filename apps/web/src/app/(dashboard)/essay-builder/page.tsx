import { getAllVocabularyWords } from '@/lib/db/vocabulary'
import { getAllCollocations } from '@/lib/db/collocations'
import { getAllDomains } from '@/lib/db/domains'
import { getAllEssayBuilderRecords } from '@/lib/db/essay-builder'
import { getDefaultUser } from '@/lib/db/user'
import { parseTargetBand } from '@/lib/db/user'
import { EssayBuilderView } from './essay-builder-view'

export default async function EssayBuilderPage() {
  const [user, words, collocations, domains, history] = await Promise.all([
    getDefaultUser(),
    getAllVocabularyWords(),
    getAllCollocations(),
    getAllDomains(),
    getAllEssayBuilderRecords(),
  ])

  const targetBand = parseTargetBand(user.targetProfile)

  return (
    <div className="mx-auto max-w-6xl flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Essay Builder</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Select vocabulary and collocations, pick a domain and skill, then generate a practice piece.
        </p>
      </div>

      <EssayBuilderView
        words={words}
        collocations={collocations}
        domains={domains.map((d) => d.name)}
        history={history}
        targetBand={targetBand}
      />
    </div>
  )
}
