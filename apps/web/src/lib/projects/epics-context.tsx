'use client'

import { createContext, useContext, useState } from 'react'
import { EPICS } from './constants'

export type EpicOption = {
  value: string
  label: string
  color: string
  dot: string
  dbId?: number   // set on user-created epics; absent on system epics
}

type EpicsContextType = {
  allEpics: EpicOption[]
  addEpic: (epic: EpicOption) => void
  removeEpic: (value: string) => void
}

const EpicsContext = createContext<EpicsContextType>({
  allEpics: [...EPICS],
  addEpic: () => {},
  removeEpic: () => {},
})

export function EpicsProvider({
  initialCustom,
  children,
}: {
  initialCustom: EpicOption[]
  children: React.ReactNode
}) {
  const [customEpics, setCustomEpics] = useState<EpicOption[]>(initialCustom)

  const allEpics: EpicOption[] = [...EPICS, ...customEpics]

  function addEpic(epic: EpicOption) {
    setCustomEpics((prev) => [...prev, epic])
  }

  function removeEpic(value: string) {
    setCustomEpics((prev) => prev.filter((e) => e.value !== value))
  }

  return (
    <EpicsContext.Provider value={{ allEpics, addEpic, removeEpic }}>
      {children}
    </EpicsContext.Provider>
  )
}

export function useEpics() {
  return useContext(EpicsContext)
}
