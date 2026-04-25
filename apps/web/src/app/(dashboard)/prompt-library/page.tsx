import { getDefaultUser, parseTargetBand } from '@/lib/db/user'
import { getPromptLibrary } from '@/lib/prompt-library'
import { PromptLibraryView } from './prompt-library-view'

export default async function PromptLibraryPage() {
  const user = await getDefaultUser()
  const targetBand = parseTargetBand(user.targetProfile)
  const sections = getPromptLibrary(targetBand, user.targetProfile)

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">AI Prompt Library</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Ready-to-use practice prompts for ChatGPT, Gemini, or Claude.
        Replace <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-1 py-0.5 rounded">[BRACKETED]</span> placeholders before copying.
      </p>
      <PromptLibraryView sections={sections} />
    </div>
  )
}
