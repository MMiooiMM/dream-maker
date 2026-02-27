import { create } from 'zustand'
import type { EditorTab, RhythmWarning } from '@/types'

export interface UIStore {
  // Current editor state
  activeTab: EditorTab
  selectedChapterIndex: number | null  // 1-based index
  blockLibraryFilter: string | null    // category filter
  blockLibrarySearch: string

  // Warnings
  warnings: RhythmWarning[]

  // Actions
  setActiveTab: (tab: EditorTab) => void
  setSelectedChapter: (index: number | null) => void
  setBlockLibraryFilter: (filter: string | null) => void
  setBlockLibrarySearch: (search: string) => void
  setWarnings: (warnings: RhythmWarning[]) => void
  clearWarnings: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  activeTab: 'template',
  selectedChapterIndex: null,
  blockLibraryFilter: null,
  blockLibrarySearch: '',
  warnings: [],

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedChapter: (index) => set({ selectedChapterIndex: index }),
  setBlockLibraryFilter: (filter) => set({ blockLibraryFilter: filter }),
  setBlockLibrarySearch: (search) => set({ blockLibrarySearch: search }),
  setWarnings: (warnings) => set({ warnings }),
  clearWarnings: () => set({ warnings: [] }),
}))
