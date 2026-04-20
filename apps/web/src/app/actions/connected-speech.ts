'use server'

import {
  saveAnalysis,
  getRecentAnalyses,
  getTopByPhenomenon,
  getAnalysisById,
  type SavedAnalysis,
} from '@/lib/db/connected-speech'
import type { ConnectedSpeechInstance } from '@/lib/ielts/connected-speech/prompts'

export async function saveAnalysisAction(data: {
  originalText: string
  transformedText: string
  instances: ConnectedSpeechInstance[]
}): Promise<number> {
  return saveAnalysis(data)
}

export async function listRecentAnalyses(): Promise<SavedAnalysis[]> {
  return getRecentAnalyses(20)
}

export async function listByPhenomenon(phenomenon: string): Promise<SavedAnalysis[]> {
  return getTopByPhenomenon(phenomenon, 10)
}

export async function getAnalysis(id: number): Promise<SavedAnalysis | null> {
  return getAnalysisById(id)
}
