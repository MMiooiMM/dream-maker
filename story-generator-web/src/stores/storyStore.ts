import { create } from 'zustand'
import type {
  StoryConfig,
  WorldConfig,
  ToneConfig,
  Character,
  RelationshipConfig,
  Chapter,
  EventBlockInstance,
  ChapterEmotionMetrics,
  ChapterPosition,
  TemplateId,
} from '@/types'
import { getTemplateById } from '@/data/templates'

// ============================================================
// Helper: create default character
// ============================================================

function createDefaultCharacter(id: string): Character {
  return {
    id,
    name: '',
    ageRange: '23-28',
    role: 'ceo',
    initialAttitude: 'cold',
    coreTrauma: 'abandoned',
    traits: { pride: 2, control: 2, empathy: 1, rationality: 2, impulse: 1, attachment: 2 },
    resources: {
      emotional: { love: 2, trust: 2, guilt: 0, obsession: 1 },
      social: { wealth: 3, power: 3, fame: 2, connections: 3 },
      ability: { professional: 3, action: 2, intelligence: 3 },
      information: 2,
    },
  }
}

// ============================================================
// Helper: create empty 12 chapters
// ============================================================

function createEmptyChapters(templateId?: TemplateId): Chapter[] {
  const template = templateId ? getTemplateById(templateId) : undefined
  return Array.from({ length: 12 }, (_, i) => ({
    index: i + 1,
    position: (template?.chapters[i]?.position ?? 'setup') as ChapterPosition,
    events: [] as EventBlockInstance[],
    metrics: { pleasure: 0, pain: 0, tension: 0, misunderstanding: 0 } as ChapterEmotionMetrics,
  }))
}

// ============================================================
// Store
// ============================================================

export interface StoryStore {
  // State
  story: StoryConfig | null
  isDirty: boolean

  // Actions — Story lifecycle
  createNewStory: (templateId: TemplateId) => void
  loadStory: (story: StoryConfig) => void
  resetStory: () => void

  // Actions — World
  updateWorld: (world: Partial<WorldConfig>) => void

  // Actions — Tone
  updateTone: (tone: Partial<ToneConfig>) => void

  // Actions — Characters
  updateMaleCharacter: (data: Partial<Character>) => void
  updateFemaleCharacter: (data: Partial<Character>) => void
  updateRelationship: (data: Partial<RelationshipConfig>) => void

  // Actions — Chapters
  updateChapterPosition: (chapterIndex: number, position: ChapterPosition) => void
  addEventToChapter: (chapterIndex: number, event: EventBlockInstance) => void
  removeEventFromChapter: (chapterIndex: number, eventInstanceId: string) => void
  reorderChapterEvents: (chapterIndex: number, events: EventBlockInstance[]) => void
  updateEventInChapter: (chapterIndex: number, eventInstanceId: string, updates: Partial<EventBlockInstance['params']>) => void
  updateChapterMetrics: (chapterIndex: number, metrics: ChapterEmotionMetrics) => void
  setChapters: (chapters: Chapter[]) => void

  // Meta
  updateTitle: (title: string) => void
  markSaved: () => void
}

let storyIdCounter = 0
function generateStoryId(): string {
  return `story-${Date.now()}-${++storyIdCounter}`
}

export const useStoryStore = create<StoryStore>((set) => ({
  story: null,
  isDirty: false,

  createNewStory: (templateId) => {
    const template = getTemplateById(templateId)
    if (!template) return

    const now = new Date().toISOString()
    const story: StoryConfig = {
      id: generateStoryId(),
      title: '',
      templateId,
      world: { ...template.defaultWorld },
      tone: { ...template.defaultTone },
      characters: {
        male: createDefaultCharacter('male'),
        female: createDefaultCharacter('female'),
      },
      relationship: {
        start: 'married',
        tension: 'high',
      },
      chapters: createEmptyChapters(templateId),
      createdAt: now,
      updatedAt: now,
    }
    set({ story, isDirty: true })
  },

  loadStory: (story) => set({ story, isDirty: false }),
  resetStory: () => set({ story: null, isDirty: false }),

  updateWorld: (worldUpdate) =>
    set((state) => {
      if (!state.story) return state
      return {
        story: {
          ...state.story,
          world: { ...state.story.world, ...worldUpdate },
        },
        isDirty: true,
      }
    }),

  updateTone: (toneUpdate) =>
    set((state) => {
      if (!state.story) return state
      return {
        story: {
          ...state.story,
          tone: { ...state.story.tone, ...toneUpdate },
        },
        isDirty: true,
      }
    }),

  updateMaleCharacter: (data) =>
    set((state) => {
      if (!state.story) return state
      return {
        story: {
          ...state.story,
          characters: {
            ...state.story.characters,
            male: { ...state.story.characters.male, ...data },
          },
        },
        isDirty: true,
      }
    }),

  updateFemaleCharacter: (data) =>
    set((state) => {
      if (!state.story) return state
      return {
        story: {
          ...state.story,
          characters: {
            ...state.story.characters,
            female: { ...state.story.characters.female, ...data },
          },
        },
        isDirty: true,
      }
    }),

  updateRelationship: (data) =>
    set((state) => {
      if (!state.story) return state
      return {
        story: {
          ...state.story,
          relationship: { ...state.story.relationship, ...data },
        },
        isDirty: true,
      }
    }),

  updateChapterPosition: (chapterIndex, position) =>
    set((state) => {
      if (!state.story) return state
      const chapters = [...state.story.chapters]
      const idx = chapterIndex - 1
      chapters[idx] = { ...chapters[idx], position }
      return { story: { ...state.story, chapters }, isDirty: true }
    }),

  addEventToChapter: (chapterIndex, event) =>
    set((state) => {
      if (!state.story) return state
      const chapters = [...state.story.chapters]
      const idx = chapterIndex - 1
      chapters[idx] = {
        ...chapters[idx],
        events: [...chapters[idx].events, event],
      }
      return { story: { ...state.story, chapters }, isDirty: true }
    }),

  removeEventFromChapter: (chapterIndex, eventInstanceId) =>
    set((state) => {
      if (!state.story) return state
      const chapters = [...state.story.chapters]
      const idx = chapterIndex - 1
      chapters[idx] = {
        ...chapters[idx],
        events: chapters[idx].events.filter(e => e.instanceId !== eventInstanceId),
      }
      return { story: { ...state.story, chapters }, isDirty: true }
    }),

  reorderChapterEvents: (chapterIndex, events) =>
    set((state) => {
      if (!state.story) return state
      const chapters = [...state.story.chapters]
      const idx = chapterIndex - 1
      chapters[idx] = { ...chapters[idx], events }
      return { story: { ...state.story, chapters }, isDirty: true }
    }),

  updateEventInChapter: (chapterIndex, eventInstanceId, updates) =>
    set((state) => {
      if (!state.story) return state
      const chapters = [...state.story.chapters]
      const idx = chapterIndex - 1
      chapters[idx] = {
        ...chapters[idx],
        events: chapters[idx].events.map(e =>
          e.instanceId === eventInstanceId
            ? { ...e, params: { ...e.params, ...updates } }
            : e
        ),
      }
      return { story: { ...state.story, chapters }, isDirty: true }
    }),

  updateChapterMetrics: (chapterIndex, metrics) =>
    set((state) => {
      if (!state.story) return state
      const chapters = [...state.story.chapters]
      const idx = chapterIndex - 1
      chapters[idx] = { ...chapters[idx], metrics }
      return { story: { ...state.story, chapters }, isDirty: true }
    }),

  setChapters: (chapters) =>
    set((state) => {
      if (!state.story) return state
      return { story: { ...state.story, chapters }, isDirty: true }
    }),

  updateTitle: (title) =>
    set((state) => {
      if (!state.story) return state
      return { story: { ...state.story, title }, isDirty: true }
    }),

  markSaved: () => set({ isDirty: false }),
}))
