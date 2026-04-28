export const STATUSES = [
  { value: 'todo',        label: 'To Do',      color: 'bg-subtle text-muted-foreground' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-50 text-blue-700' },
  { value: 'in_review',   label: 'In Review',   color: 'bg-purple-50 text-purple-700' },
  { value: 'done',        label: 'Done',        color: 'bg-green-50 text-green-700' },
] as const

export const PRIORITIES = [
  { value: 'low',      label: 'Low',      color: 'text-gray-400',  dot: 'bg-gray-400' },
  { value: 'medium',   label: 'Medium',   color: 'text-blue-500',  dot: 'bg-blue-500' },
  { value: 'high',     label: 'High',     color: 'text-orange-500', dot: 'bg-orange-500' },
  { value: 'critical', label: 'Critical', color: 'text-red-600',   dot: 'bg-red-600' },
] as const

export const TYPES = [
  { value: 'task',  label: 'Task',  icon: '☑' },
  { value: 'bug',   label: 'Bug',   icon: '🐛' },
  { value: 'story', label: 'Story', icon: '📖' },
] as const

export const EPICS = [
  { value: 'writing',     label: 'Writing',     color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',     dot: 'bg-blue-500' },
  { value: 'reading',     label: 'Reading',     color: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',   dot: 'bg-green-500' },
  { value: 'listening',   label: 'Listening',   color: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400', dot: 'bg-yellow-500' },
  { value: 'speaking',    label: 'Speaking',    color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400', dot: 'bg-purple-500' },
  { value: 'cross-skill', label: 'Cross-Skill', color: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400', dot: 'bg-orange-500' },
] as const

export const KANBAN_COLUMNS = STATUSES.map((s) => s.value)

export type TicketStatus   = typeof STATUSES[number]['value']
export type TicketPriority = typeof PRIORITIES[number]['value']
export type TicketType     = typeof TYPES[number]['value']
export type EpicValue      = typeof EPICS[number]['value']
