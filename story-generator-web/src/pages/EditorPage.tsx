import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useCallback, useRef, useState } from 'react'
import { useUIStore } from '@/stores/uiStore'
import { useStoryStore } from '@/stores/storyStore'
import { saveStory, loadStory, addRecentStory } from '@/lib/storage'
import EditorTopBar from '@/components/layout/EditorTopBar'
import EditorSidebar from '@/components/layout/EditorSidebar'
import TemplatePanel from '@/components/story-config/TemplatePanel'
import WorldPanel from '@/components/story-config/WorldPanel'
import TonePanel from '@/components/story-config/TonePanel'
import CharacterPanel from '@/components/character/CharacterPanel'
import ChapterPanel from '@/components/chapter/ChapterPanel'
import ExportPanel from '@/components/story-config/ExportPanel'
import ScenePanel from '@/components/story-config/ScenePanel'

export default function EditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const activeTab = useUIStore(s => s.activeTab)
  const story = useStoryStore(s => s.story)
  const isDirty = useStoryStore(s => s.isDirty)
  const loadStoryToStore = useStoryStore(s => s.loadStory)
  const markSaved = useStoryStore(s => s.markSaved)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Load existing story
  useEffect(() => {
    if (id && id !== 'new') {
      loadStory(id).then(s => {
        if (s) {
          loadStoryToStore(s)
          addRecentStory(s.id)
        }
      })
    }
  }, [id, loadStoryToStore])

  // Auto-save (debounced 2s)
  const autoSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(async () => {
      const current = useStoryStore.getState().story
      if (current && useStoryStore.getState().isDirty) {
        await saveStory(current)
        markSaved()
      }
    }, 2000)
  }, [markSaved])

  useEffect(() => {
    if (isDirty && story) autoSave()
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current) }
  }, [isDirty, story, autoSave])

  const renderPanel = () => {
    switch (activeTab) {
      case 'template': return <TemplatePanel />
      case 'world': return <WorldPanel />
      case 'tone': return <TonePanel />
      case 'characters': return <CharacterPanel />
      case 'chapters': return <ChapterPanel />
      case 'scenes': return <ScenePanel />
      case 'export': return <ExportPanel />
      default: return <TemplatePanel />
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <EditorTopBar onBack={() => navigate('/projects')} />
      <div className="md:hidden border-b border-border bg-card px-3 py-2">
        <button
          onClick={() => setMobileMenuOpen(v => !v)}
          className="w-full px-3 py-2 text-sm border border-border rounded-md"
        >
          {mobileMenuOpen ? '收合設定選單' : '展開設定選單'}
        </button>
      </div>
      <div className="flex-1 flex overflow-hidden flex-col md:flex-row">
        <EditorSidebar mobileOpen={mobileMenuOpen} onNavigate={() => setMobileMenuOpen(false)} />
        <main className="flex-1 overflow-auto min-h-0">
          {renderPanel()}
        </main>
      </div>
    </div>
  )
}
