import type { Chapter, EventBlockInstance, StoryConfig } from '@/types'
import { EVENT_BLOCKS, getBlockById } from '@/data/blocks'
import { getTemplateById } from '@/data/templates'

let instanceCounter = 0

function createEventInstance(blockId: string): EventBlockInstance {
  const block = getBlockById(blockId)
  return {
    instanceId: `inst-${Date.now()}-${++instanceCounter}`,
    blockId,
    params: {
      involvedCharacters: ['male', 'female'],
      intensity: block?.defaultIntensity ?? 'medium',
      publicLevel: 'private',
      effects: { ...block?.defaultEffects },
      hasForeshadowing: false,
    },
  }
}

/** Auto-generate 12-chapter layout based on story config */
export function autoLayoutChapters(config: StoryConfig): Chapter[] {
  const template = getTemplateById(config.templateId)
  if (!template) return config.chapters

  const chapters: Chapter[] = template.chapters.map(bp => ({
    index: bp.index,
    position: bp.position,
    events: [],
    metrics: { pleasure: 0, pain: 0, tension: 0, misunderstanding: 0 },
  }))

  const painWeight = config.tone.painLevel / 10
  const pleasureWeight = config.tone.pleasureLevel / 10
  const misWeight = config.tone.misunderstandingIntensity === 'high' ? 0.8 : config.tone.misunderstandingIntensity === 'medium' ? 0.5 : 0.2

  // Phase mapping: early=1-4, mid=5-8, late=9-12
  const getPhase = (idx: number): 'early' | 'mid' | 'late' =>
    idx <= 4 ? 'early' : idx <= 8 ? 'mid' : 'late'

  // For each chapter, select blocks based on template suggestions and tone
  for (const chapter of chapters) {
    const phase = getPhase(chapter.index)
    const bp = template.chapters[chapter.index - 1]
    const events: EventBlockInstance[] = []

    // Get candidate blocks for this phase
    const candidates = EVENT_BLOCKS.filter(b => b.suggestedPhase.includes(phase))

    // Select blocks matching suggested categories
    for (const suggestedCat of bp.suggestedBlockCategories) {
      const catBlocks = candidates.filter(b => b.category === suggestedCat)
      if (catBlocks.length === 0) continue

      // Weight by tone
      let shouldAdd = true
      if (suggestedCat === 'pain' && Math.random() > painWeight) shouldAdd = false
      if (suggestedCat === 'pleasure' && Math.random() > pleasureWeight) shouldAdd = false
      if (suggestedCat === 'misunderstanding' && Math.random() > misWeight) shouldAdd = false

      if (shouldAdd) {
        const picked = catBlocks[Math.floor(Math.random() * catBlocks.length)]
        if (!events.some(e => e.blockId === picked.id)) {
          events.push(createEventInstance(picked.id))
        }
      }
    }

    // Ensure minimum events
    while (events.length < bp.minEvents) {
      const remaining = candidates.filter(b => !events.some(e => e.blockId === b.id))
      if (remaining.length === 0) break
      const picked = remaining[Math.floor(Math.random() * remaining.length)]
      events.push(createEventInstance(picked.id))
    }

    // Ensure hook at chapter end (for non-final chapters)
    if (chapter.index < 12) {
      const hasHook = events.some(e => e.blockId.startsWith('hook-'))
      if (!hasHook) {
        const hookBlocks = EVENT_BLOCKS.filter(b => b.category === 'hook' && b.suggestedPhase.includes(phase))
        if (hookBlocks.length > 0) {
          const picked = hookBlocks[Math.floor(Math.random() * hookBlocks.length)]
          events.push(createEventInstance(picked.id))
        }
      }
    }

    // Trim to max
    chapter.events = events.slice(0, bp.maxEvents)
  }

  return chapters
}
