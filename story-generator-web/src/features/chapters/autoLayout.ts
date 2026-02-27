import type { Chapter, EventBlockInstance, StoryConfig } from '@/types'
import { EVENT_BLOCKS, getBlockById, isBlockAllowedInWorld } from '@/data/blocks'
import { getTemplateById } from '@/data/templates'
import { detectWarnings } from '@/features/rhythm/emotionEngine'

let instanceCounter = 0

function createEventInstance(
  blockId: string,
  overrides?: Partial<EventBlockInstance['params']>
): EventBlockInstance {
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
      ...(overrides ?? {}),
    },
  }
}

const PREFERRED_PLEASURE_IDS = [
  'ple-public-recognition',
  'ple-counterattack',
  'ple-face-slap',
  'ple-villain-fall',
]

const PREFERRED_HOOK_IDS = [
  'hook-bombshell',
  'hook-reversal',
  'hook-major-decision',
  'hook-suspense',
]

function pickBlockIdByCategory(category: string, preferred: string[]): string | null {
  for (const id of preferred) {
    const block = getBlockById(id)
    if (block && block.category === category) return id
  }
  return EVENT_BLOCKS.find(b => b.category === category)?.id ?? null
}

function pickBlockIdForChapter(
  chapter: Chapter,
  category: string,
  preferred: string[]
): string | null {
  const used = new Set(chapter.events.map(e => e.blockId))
  for (const id of preferred) {
    const block = getBlockById(id)
    if (block && block.category === category && !used.has(id)) return id
  }
  const fallback = EVENT_BLOCKS.find(b => b.category === category && !used.has(b.id))?.id
  return fallback ?? pickBlockIdByCategory(category, preferred)
}

function getCategory(blockId: string): string | null {
  return getBlockById(blockId)?.category ?? null
}


function canUseBlockInChapter(chapters: Chapter[], chapterIndex: number, blockId: string, worldGenre: StoryConfig['world']['genre']): boolean {
  const block = getBlockById(blockId)
  if (!block) return false
  if (!isBlockAllowedInWorld(block, worldGenre)) return false

  if (block.maxUsagesPerStory) {
    const usedCount = chapters.reduce((sum, ch) => sum + ch.events.filter(e => e.blockId === blockId).length, 0)
    if (usedCount >= block.maxUsagesPerStory) return false
  }

  if (block.prerequisites && block.prerequisites.length > 0) {
    const previousEvents = chapters
      .slice(0, chapterIndex)
      .flatMap(ch => ch.events)
      .map(e => e.blockId)
    const satisfies = block.prerequisites.every(req => previousEvents.includes(req))
    if (!satisfies) return false
  }

  return true
}

function ensureEvent(
  chapter: Chapter,
  blockId: string,
  overrides?: Partial<EventBlockInstance['params']>,
  allowDuplicate = false
) {
  if (!allowDuplicate && chapter.events.some(e => e.blockId === blockId)) return
  chapter.events.push(createEventInstance(blockId, overrides))
}

function removeFirstByCategory(chapter: Chapter, category: string): boolean {
  const idx = chapter.events.findIndex(e => getCategory(e.blockId) === category)
  if (idx < 0) return false
  chapter.events.splice(idx, 1)
  return true
}

function moveFirstByCategory(from: Chapter, to: Chapter, category: string): boolean {
  const idx = from.events.findIndex(e => getCategory(e.blockId) === category)
  if (idx < 0) return false
  const [ev] = from.events.splice(idx, 1)
  to.events.push(ev)
  return true
}

function enforceRhythmNoWarnings(chapters: Chapter[]) {
  const pleasureId = pickBlockIdByCategory('pleasure', PREFERRED_PLEASURE_IDS)
  const hookId = pickBlockIdByCategory('hook', PREFERRED_HOOK_IDS)

  const maxIterations = 6
  for (let i = 0; i < maxIterations; i++) {
    const warnings = detectWarnings(chapters)
    if (warnings.length === 0) return

    for (const w of warnings) {
      if (w.type === 'pain-overload') {
        const start = Math.max(1, w.chapterIndex ?? 1)
        const midIdx = Math.min(start + 1, chapters.length)
        const mid = chapters[midIdx - 1]
        const hasPleasureBoost = mid.events.some(e =>
          getCategory(e.blockId) === 'pleasure' &&
          (e.params.intensity === 'medium' || e.params.intensity === 'high')
        )
        if (!hasPleasureBoost) {
          const pick = pickBlockIdForChapter(mid, 'pleasure', PREFERRED_PLEASURE_IDS) ?? pleasureId
          if (pick) {
            ensureEvent(mid, pick, {
              intensity: 'medium',
              involvedCharacters: ['female'],
            }, true)
          }
        }
      }

      if (w.type === 'short-misunderstanding') {
        const start = Math.max(1, w.chapterIndex ?? 1)
        const misChapter = chapters[start - 1]
        const truthChapter = chapters[start]
        const nextChapter = chapters[start + 1]
        if (truthChapter && nextChapter) {
          if (!moveFirstByCategory(truthChapter, nextChapter, 'truth')) {
            removeFirstByCategory(misChapter, 'misunderstanding')
          }
        } else {
          removeFirstByCategory(misChapter, 'misunderstanding')
        }
      }

      if (w.type === 'early-redemption') {
        const total = chapters.length
        const earlyWindow = Math.max(3, Math.floor(total * 0.5))
        const threshold = Math.max(3, Math.ceil(earlyWindow * 0.4))
        let count = 0
        for (const ch of chapters.slice(0, earlyWindow)) {
          count += ch.events.filter(e =>
            e.blockId === 'ple-male-kneel' ||
            (e.blockId.startsWith('ple-') && e.params.involvedCharacters.includes('male'))
          ).length
        }
        if (count >= threshold) {
          for (const ch of chapters.slice(0, earlyWindow)) {
            for (const ev of ch.events) {
              const isPle = ev.blockId.startsWith('ple-')
              if (isPle && ev.params.involvedCharacters.includes('male')) {
                ev.params.involvedCharacters = ev.params.involvedCharacters.filter(c => c !== 'male')
                if (ev.params.involvedCharacters.length === 0) {
                  ev.params.involvedCharacters = ['female']
                }
                count -= 1
                if (count < threshold) break
              }
            }
            if (count < threshold) break
          }
        }
      }

      if (w.type === 'missing-climax') {
        const climaxIdx = w.chapterIndex ?? (chapters.length - 1)
        if (climaxIdx > 0) {
          const ch = chapters[climaxIdx - 1]
          const hookEv = ch.events.find(e => getCategory(e.blockId) === 'hook')
          const pleEv = ch.events.find(e => getCategory(e.blockId) === 'pleasure')
          if (hookEv) {
            hookEv.params.intensity = 'high'
          } else if (pleEv) {
            pleEv.params.intensity = 'high'
          } else if (hookId) {
            ensureEvent(ch, hookId, { intensity: 'high' }, true)
          }
        }
      }
    }
  }
}

/** Auto-generate chapter layout based on story config */
export function autoLayoutChapters(config: StoryConfig): Chapter[] {
  const template = getTemplateById(config.templateId)
  if (!template) return config.chapters

  const targetCount = Math.max(1, config.chapterCount ?? config.chapters.length ?? template.chapters.length)
  const templateLen = template.chapters.length

  const mapIndex = (idx: number) => {
    if (targetCount === 1 || templateLen === 1) return 1
    const ratio = (idx - 1) / (targetCount - 1)
    return Math.round(ratio * (templateLen - 1)) + 1
  }

  const chapters: Chapter[] = Array.from({ length: targetCount }, (_, i) => {
    const index = i + 1
    const bp = template.chapters[mapIndex(index) - 1]
    return {
      index,
      position: bp?.position ?? 'setup',
      events: [],
      metrics: { pleasure: 0, pain: 0, tension: 0, misunderstanding: 0 },
    }
  })

  const painWeight = config.tone.painLevel / 10
  const pleasureWeight = config.tone.pleasureLevel / 10
  const misWeight = config.tone.misunderstandingIntensity === 'high' ? 0.8 : config.tone.misunderstandingIntensity === 'medium' ? 0.5 : 0.2

  // Phase mapping: early/mid/late based on chapter count
  const earlyEnd = Math.max(2, Math.round(targetCount * 0.33))
  const midEnd = Math.max(earlyEnd + 1, Math.round(targetCount * 0.66))
  const getPhase = (idx: number): 'early' | 'mid' | 'late' =>
    idx <= earlyEnd ? 'early' : idx <= midEnd ? 'mid' : 'late'

  // For each chapter, select blocks based on template suggestions and tone
  for (const chapter of chapters) {
    const phase = getPhase(chapter.index)
    const bp = template.chapters[mapIndex(chapter.index) - 1]
    const events: EventBlockInstance[] = []

    // Get candidate blocks for this phase
    const candidates = EVENT_BLOCKS.filter(b => b.suggestedPhase.includes(phase) && isBlockAllowedInWorld(b, config.world.genre))

    // Select blocks matching suggested categories
    const suggestedCats = bp?.suggestedBlockCategories ?? []
    for (const suggestedCat of suggestedCats) {
      const catBlocks = candidates.filter(b => b.category === suggestedCat)
      if (catBlocks.length === 0) continue

      // Weight by tone
      let shouldAdd = true
      if (suggestedCat === 'pain' && Math.random() > painWeight) shouldAdd = false
      if (suggestedCat === 'pleasure' && Math.random() > pleasureWeight) shouldAdd = false
      if (suggestedCat === 'misunderstanding' && Math.random() > misWeight) shouldAdd = false

      if (shouldAdd) {
        const picked = catBlocks[Math.floor(Math.random() * catBlocks.length)]
        if (!events.some(e => e.blockId === picked.id) && canUseBlockInChapter(chapters, chapter.index - 1, picked.id, config.world.genre)) {
          events.push(createEventInstance(picked.id))
        }
      }
    }

    // Ensure minimum events
    const minEvents = bp?.minEvents ?? 3
    const maxEvents = bp?.maxEvents ?? 5
    while (events.length < minEvents) {
      const remaining = candidates.filter(b => !events.some(e => e.blockId === b.id) && canUseBlockInChapter(chapters, chapter.index - 1, b.id, config.world.genre))
      if (remaining.length === 0) break
      const picked = remaining[Math.floor(Math.random() * remaining.length)]
      events.push(createEventInstance(picked.id))
    }

    // Ensure hook at chapter end (for non-final chapters)
    if (chapter.index < targetCount) {
      const hasHook = events.some(e => e.blockId.startsWith('hook-'))
      if (!hasHook) {
        const hookBlocks = EVENT_BLOCKS.filter(b => b.category === 'hook' && b.suggestedPhase.includes(phase) && isBlockAllowedInWorld(b, config.world.genre) && canUseBlockInChapter(chapters, chapter.index - 1, b.id, config.world.genre))
        if (hookBlocks.length > 0) {
          const picked = hookBlocks[Math.floor(Math.random() * hookBlocks.length)]
          events.push(createEventInstance(picked.id))
        }
      }
    }

    // Trim to max
    chapter.events = events.slice(0, maxEvents)
  }

  enforceRhythmNoWarnings(chapters)
  return chapters
}
