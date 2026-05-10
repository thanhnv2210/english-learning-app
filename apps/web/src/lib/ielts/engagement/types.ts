// Client-safe types and constants for admin engagement tracking.
// No DB imports — safe to use in 'use client' components.

export type CostTier = 'free' | 'low' | 'high'

export type ActivityType =
  | 'speaking_exam'
  | 'writing_exam'
  | 'drill'
  | 'practice'
  | 'wrong_decision'
  | 'reading_gen'
  | 'listening_gen'
  | 'vocab_saved'
  | 'colloc_saved'
  | 'word_pair'

export const ACTIVITY_META: Record<ActivityType, { label: string; costTier: CostTier }> = {
  speaking_exam:  { label: 'Speaking exam',       costTier: 'high' },
  writing_exam:   { label: 'Writing exam',        costTier: 'high' },
  drill:          { label: 'Read-aloud drill',    costTier: 'low'  },
  practice:       { label: 'Practice game',       costTier: 'free' },
  wrong_decision: { label: 'Wrong decision log',  costTier: 'high' },
  reading_gen:    { label: 'Reading generated',   costTier: 'low'  },
  listening_gen:  { label: 'Listening generated', costTier: 'low'  },
  vocab_saved:    { label: 'Vocab saved',         costTier: 'low'  },
  colloc_saved:   { label: 'Collocation saved',   costTier: 'low'  },
  word_pair:      { label: 'Word pair added',     costTier: 'low'  },
}

export type ActivityEvent = {
  userId: number
  actionType: ActivityType
  date: Date
}
