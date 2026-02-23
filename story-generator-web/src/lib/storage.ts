import Dexie, { type EntityTable } from 'dexie'
import type { StoryConfig } from '@/types'

/** IndexedDB database for story configurations */
const db = new Dexie('StoryGeneratorDB') as Dexie & {
  stories: EntityTable<StoryConfig, 'id'>
}

db.version(1).stores({
  stories: 'id, title, templateId, createdAt, updatedAt',
})

export { db }

// ============================================================
// CRUD operations
// ============================================================

export async function saveStory(story: StoryConfig): Promise<void> {
  story.updatedAt = new Date().toISOString()
  await db.stories.put(story)
}

export async function loadStory(id: string): Promise<StoryConfig | undefined> {
  return await db.stories.get(id)
}

export async function listStories(): Promise<StoryConfig[]> {
  return await db.stories.orderBy('updatedAt').reverse().toArray()
}

export async function deleteStory(id: string): Promise<void> {
  await db.stories.delete(id)
}

export async function duplicateStory(id: string, newId: string): Promise<StoryConfig | undefined> {
  const original = await db.stories.get(id)
  if (!original) return undefined
  const copy: StoryConfig = {
    ...original,
    id: newId,
    title: `${original.title} (副本)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  await db.stories.put(copy)
  return copy
}

// ============================================================
// LocalStorage preferences
// ============================================================

const PREFS_KEY = 'story-generator-prefs'

export interface UserPreferences {
  lastOpenedStoryId?: string
  recentStoryIds: string[]
  sidebarCollapsed: boolean
}

const defaultPrefs: UserPreferences = {
  recentStoryIds: [],
  sidebarCollapsed: false,
}

export function loadPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if (!raw) return { ...defaultPrefs }
    return { ...defaultPrefs, ...JSON.parse(raw) }
  } catch {
    return { ...defaultPrefs }
  }
}

export function savePreferences(prefs: Partial<UserPreferences>): void {
  const current = loadPreferences()
  const merged = { ...current, ...prefs }
  localStorage.setItem(PREFS_KEY, JSON.stringify(merged))
}

export function addRecentStory(storyId: string): void {
  const prefs = loadPreferences()
  const recent = [storyId, ...prefs.recentStoryIds.filter(id => id !== storyId)].slice(0, 10)
  savePreferences({ recentStoryIds: recent, lastOpenedStoryId: storyId })
}
