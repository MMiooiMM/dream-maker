import { useStoryStore } from '@/stores/storyStore'
import { saveStory } from '@/lib/storage'

interface EditorTopBarProps {
  onBack: () => void
}

export default function EditorTopBar({ onBack }: EditorTopBarProps) {
  const story = useStoryStore(s => s.story)
  const isDirty = useStoryStore(s => s.isDirty)
  const markSaved = useStoryStore(s => s.markSaved)
  const updateTitle = useStoryStore(s => s.updateTitle)

  const handleSave = async () => {
    if (!story) return
    await saveStory(story)
    markSaved()
  }

  return (
    <header className="h-14 border-b border-border flex items-center px-4 gap-4 bg-card">
      <button
        onClick={onBack}
        className="text-muted-foreground hover:text-foreground transition-colors text-sm"
      >
        ← 返回
      </button>

      <div className="h-6 w-px bg-border" />

      {story ? (
        <input
          type="text"
          value={story.title}
          onChange={e => updateTitle(e.target.value)}
          placeholder="故事標題（可選）"
          className="bg-transparent border-none outline-none text-sm font-medium flex-1 placeholder:text-muted-foreground"
        />
      ) : (
        <span className="text-sm text-muted-foreground flex-1">選擇模板開始</span>
      )}

      <div className="flex items-center gap-2">
        {isDirty && (
          <span className="text-xs text-amber-500">● 未儲存</span>
        )}
        <button
          onClick={handleSave}
          disabled={!story}
          className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          💾 儲存
        </button>
      </div>
    </header>
  )
}
