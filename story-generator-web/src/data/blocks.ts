import type { EventBlockDefinition, WorldGenre } from '@/types'
import rawBlocks from '@shared/story-config/blocks.json'

export const EVENT_BLOCKS: EventBlockDefinition[] = rawBlocks.blocks as EventBlockDefinition[]

export const BLOCK_CATEGORY_LABELS: Record<string, { label: string; color: string; icon: string }> = Object.fromEntries(
  Object.entries(rawBlocks.categoryLabels).map(([k, v]) => [
    k,
    { label: v.label, icon: v.icon, color: `bg-block-${k}` },
  ])
)

export const WORLD_GENRE_LABELS: Record<WorldGenre, string> = {
  wealthy: '豪門',
  campus: '校園',
  workplace: '職場',
  entertainment: '娛樂圈',
}

export function getBlockById(id: string): EventBlockDefinition | undefined {
  return EVENT_BLOCKS.find(b => b.id === id)
}

export function getBlocksByCategory(category: string): EventBlockDefinition[] {
  return EVENT_BLOCKS.filter(b => b.category === category)
}

export function isBlockAllowedInWorld(block: EventBlockDefinition, worldGenre: WorldGenre): boolean {
  return !block.worldGenres || block.worldGenres.includes(worldGenre)
}

export function getBlocksByWorldGenre(worldGenre: WorldGenre): EventBlockDefinition[] {
  return EVENT_BLOCKS.filter(b => isBlockAllowedInWorld(b, worldGenre))
}
