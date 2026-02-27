import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listStories, deleteStory, duplicateStory } from '@/lib/storage'
import type { StoryConfig } from '@/types'

export default function ProjectsPage() {
  const navigate = useNavigate()
  const [stories, setStories] = useState<StoryConfig[]>([])

  useEffect(() => {
    listStories().then(setStories)
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除此故事嗎？')) return
    await deleteStory(id)
    setStories(prev => prev.filter(s => s.id !== id))
  }

  const handleDuplicate = async (id: string) => {
    const newId = `story-${Date.now()}`
    const copy = await duplicateStory(id, newId)
    if (copy) setStories(prev => [copy, ...prev])
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">我的故事</h1>
            <p className="text-muted-foreground mt-1">管理你的故事設定</p>
          </div>
          <button
            onClick={() => navigate('/editor/new')}
            className="w-full sm:w-auto px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            + 建立新故事
          </button>
        </div>

        {stories.length === 0 ? (
          <div className="border border-dashed border-border rounded-lg p-6 sm:p-12 text-center">
            <p className="text-4xl mb-4">📝</p>
            <p className="text-muted-foreground mb-4">還沒有故事，點擊「建立新故事」開始吧！</p>
            <button
              onClick={() => navigate('/editor/new')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm"
            >
              開始創作
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {stories.map(story => (
              <div key={story.id} className="border border-border rounded-lg p-5 space-y-3 hover:border-primary/40 transition-colors">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold truncate">{story.title || '未命名故事'}</h3>
                  <span className="text-xs text-muted-foreground shrink-0 ml-2">
                    {story.chapters.filter(c => c.events.length > 0).length}/{story.chapterCount ?? story.chapters.length} 章
                  </span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>模板：{story.templateId}</p>
                  <p>男主：{story.characters.male.name || '—'} / 女主：{story.characters.female.name || '—'}</p>
                  <p>更新：{new Date(story.updatedAt).toLocaleString('zh-TW')}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/editor/${story.id}`)}
                    className="flex-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md"
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => handleDuplicate(story.id)}
                    className="px-3 py-1.5 text-xs border border-border rounded-md hover:bg-muted"
                  >
                    複製
                  </button>
                  <button
                    onClick={() => handleDelete(story.id)}
                    className="px-3 py-1.5 text-xs border border-destructive text-destructive rounded-md hover:bg-destructive/10"
                  >
                    刪除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
