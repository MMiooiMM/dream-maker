import { create } from 'zustand'
import type {
  StoryConfig,
  WorldConfig,
  ToneConfig,
  Character,
  RelationshipConfig,
  SupportingCharacter,
  Chapter,
  EventBlockInstance,
  ChapterEmotionMetrics,
  ChapterPosition,
  TemplateId,
  PairingType,
  AboSecondGender,
  AboWorldConfig,
} from '@/types'
import { getTemplateById } from '@/data/templates'
import { getBlockById } from '@/data/blocks'

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

const DEFAULT_ABO_WORLD: AboWorldConfig = {
  scentRange: 'room',
  markEffect: 'bond',
  markRemoval: 'medical',
  fertilityRule: 'mark-required',
  malePregnancy: false,
}

// ============================================================
// Helper: create empty chapters
// ============================================================

function createEmptyChapters(count: number, templateId?: TemplateId): Chapter[] {
  const template = templateId ? getTemplateById(templateId) : undefined
  return Array.from({ length: count }, (_, i) => ({
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
  randomizeEnding: () => void

  // Actions — Characters
  updateMaleCharacter: (data: Partial<Character>) => void
  updateFemaleCharacter: (data: Partial<Character>) => void
  updateRelationship: (data: Partial<RelationshipConfig>) => void
  setPairingType: (type: PairingType) => void
  setAboEnabled: (enabled: boolean) => void
  updateAboWorld: (data: Partial<AboWorldConfig>) => void
  updateMaleAbo: (aboSecondGender: AboSecondGender) => void
  updateFemaleAbo: (aboSecondGender: AboSecondGender) => void

  // Actions — Supporting Cast
  addSupportingCharacter: (char: SupportingCharacter) => void
  updateSupportingCharacter: (id: string, data: Partial<SupportingCharacter>) => void
  removeSupportingCharacter: (id: string) => void

  // Actions — Chapters
  updateChapterPosition: (chapterIndex: number, position: ChapterPosition) => void
  addEventToChapter: (chapterIndex: number, event: EventBlockInstance) => void
  removeEventFromChapter: (chapterIndex: number, eventInstanceId: string) => void
  reorderChapterEvents: (chapterIndex: number, events: EventBlockInstance[]) => void
  updateEventInChapter: (chapterIndex: number, eventInstanceId: string, updates: Partial<EventBlockInstance['params']>) => void
  updateChapterMetrics: (chapterIndex: number, metrics: ChapterEmotionMetrics) => void
  setChapters: (chapters: Chapter[]) => void
  resizeChapters: (count: number) => void

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

    const defaultChapterCount = 12
    const now = new Date().toISOString()
    const story: StoryConfig = {
      id: generateStoryId(),
      title: '',
      templateId,
      world: { ...template.defaultWorld },
      tone: { ...template.defaultTone },
      pairingType: 'male-female',
      aboEnabled: false,
      abo: { ...DEFAULT_ABO_WORLD },
      characters: {
        male: createDefaultCharacter('male'),
        female: createDefaultCharacter('female'),
      },
      relationship: {
        start: 'strangers',
        tension: 'high',
      },
      supportingCast: [],
      chapters: createEmptyChapters(defaultChapterCount, templateId),
      chapterCount: defaultChapterCount,
      createdAt: now,
      updatedAt: now,
    }
    set({ story, isDirty: true })
  },

  loadStory: (story) => {
    const abo = { ...DEFAULT_ABO_WORLD, ...(story.abo ?? {}) }
    const obstacleSources = story.aboEnabled
      ? story.world.obstacleSources
      : story.world.obstacleSources.filter(s => s !== 'pheromone')
    set({
      story: {
        ...story,
        abo,
        world: { ...story.world, obstacleSources },
      },
      isDirty: false,
    })
  },
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

  randomizeEnding: () =>
    set((state) => {
      if (!state.story) return state
      const { painLevel, pleasureLevel } = state.story.tone
      // Weight endings based on pain/pleasure ratio
      const pool: Array<{ ending: 'HE' | 'BE' | 'open'; weight: number }> = [
        { ending: 'HE',   weight: pleasureLevel * 1.5 },
        { ending: 'BE',   weight: painLevel },
        { ending: 'open', weight: 5 },
      ]
      const total = pool.reduce((s, x) => s + x.weight, 0)
      let rand = Math.random() * total
      let chosen: 'HE' | 'BE' | 'open' = 'HE'
      for (const p of pool) {
        rand -= p.weight
        if (rand <= 0) { chosen = p.ending; break }
      }
      const redemptionMap: Record<string, 'full' | 'partial' | 'none'> = {
        HE: 'full', BE: 'none', open: 'partial'
      }
      const returnMap: Record<string, 'yes' | 'conditional' | 'no'> = {
        HE: 'yes', BE: 'no', open: 'conditional'
      }
      return {
        story: {
          ...state.story,
          tone: {
            ...state.story.tone,
            ending: chosen,
            maleRedemption: redemptionMap[chosen],
            femaleRedemption: chosen === 'HE' ? 'full' : 'none',
            maleReturn: returnMap[chosen],
            femaleReturn: returnMap[chosen],
          },
        },
        isDirty: true,
      }
    }),

  setPairingType: (type) =>
    set((state) => {
      if (!state.story) return state
      return { story: { ...state.story, pairingType: type }, isDirty: true }
    }),

  setAboEnabled: (enabled) =>
    set((state) => {
      if (!state.story) return state
      const obstacleSources = enabled
        ? state.story.world.obstacleSources
        : state.story.world.obstacleSources.filter(s => s !== 'pheromone')
      return {
        story: {
          ...state.story,
          aboEnabled: enabled,
          world: { ...state.story.world, obstacleSources },
        },
        isDirty: true,
      }
    }),

  updateAboWorld: (aboUpdate) =>
    set((state) => {
      if (!state.story) return state
      return {
        story: {
          ...state.story,
          abo: { ...(state.story.abo ?? DEFAULT_ABO_WORLD), ...aboUpdate },
        },
        isDirty: true,
      }
    }),

  updateMaleAbo: (aboSecondGender) =>
    set((state) => {
      if (!state.story) return state
      return {
        story: {
          ...state.story,
          characters: {
            ...state.story.characters,
            male: {
              ...state.story.characters.male,
              aboSecondGender,
              aboAlphaRank: undefined,
              aboOmegaSensitivity: undefined,
              aboBetaVariant: undefined,
            },
          },
        },
        isDirty: true,
      }
    }),

  updateFemaleAbo: (aboSecondGender) =>
    set((state) => {
      if (!state.story) return state
      return {
        story: {
          ...state.story,
          characters: {
            ...state.story.characters,
            female: {
              ...state.story.characters.female,
              aboSecondGender,
              aboAlphaRank: undefined,
              aboOmegaSensitivity: undefined,
              aboBetaVariant: undefined,
            },
          },
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

  addSupportingCharacter: (char) =>
    set((state) => {
      if (!state.story) return state
      return {
        story: { ...state.story, supportingCast: [...(state.story.supportingCast ?? []), char] },
        isDirty: true,
      }
    }),

  updateSupportingCharacter: (id, data) =>
    set((state) => {
      if (!state.story) return state
      return {
        story: {
          ...state.story,
          supportingCast: (state.story.supportingCast ?? []).map(c => c.id === id ? { ...c, ...data } : c),
        },
        isDirty: true,
      }
    }),

  removeSupportingCharacter: (id) =>
    set((state) => {
      if (!state.story) return state
      return {
        story: { ...state.story, supportingCast: (state.story.supportingCast ?? []).filter(c => c.id !== id) },
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
      if (idx < 0 || idx >= chapters.length) return state

      const block = getBlockById(event.blockId)
      if (!block) return state

      if (block.worldGenres && !block.worldGenres.includes(state.story.world.genre)) {
        return state
      }

      if (block.maxUsagesPerStory) {
        const usedCount = chapters.reduce((sum, ch) => sum + ch.events.filter(e => e.blockId === event.blockId).length, 0)
        if (usedCount >= block.maxUsagesPerStory) return state
      }

      if (block.prerequisites && block.prerequisites.length > 0) {
        const previousEvents = chapters
          .slice(0, idx)
          .flatMap(ch => ch.events)
          .map(e => e.blockId)
        const satisfies = block.prerequisites.every(req => previousEvents.includes(req))
        if (!satisfies) return state
      }

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
      return { story: { ...state.story, chapters, chapterCount: chapters.length }, isDirty: true }
    }),

  resizeChapters: (count) =>
    set((state) => {
      if (!state.story) return state
      const current = state.story.chapters
      let chapters: Chapter[]
      if (count <= current.length) {
        // Shrink — keep existing events
        chapters = current.slice(0, count)
      } else {
        // Grow — append empty chapters
        const extra = Array.from({ length: count - current.length }, (_, i) => ({
          index: current.length + i + 1,
          position: 'setup' as ChapterPosition,
          events: [] as EventBlockInstance[],
          metrics: { pleasure: 0, pain: 0, tension: 0, misunderstanding: 0 } as ChapterEmotionMetrics,
        }))
        chapters = [...current, ...extra]
      }
      return { story: { ...state.story, chapters, chapterCount: count }, isDirty: true }
    }),

  updateTitle: (title) =>
    set((state) => {
      if (!state.story) return state
      return { story: { ...state.story, title }, isDirty: true }
    }),

  markSaved: () => set({ isDirty: false }),
}))
