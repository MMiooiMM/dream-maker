import { useStoryStore } from '@/stores/storyStore'
import { generateOutline, generateJSON, downloadFile } from '@/features/chapters/exportUtils'
import { useState, useRef, useCallback } from 'react'
import html2canvas from 'html2canvas'
import EmotionCurve from '@/components/dashboard/EmotionCurve'
import { CHAPTER_POSITION_LABELS } from '@/data/templates'
import { BLOCK_CATEGORY_LABELS } from '@/data/blocks'

export default function ExportPanel() {
  const story = useStoryStore(s => s.story)
  const [preview, setPreview] = useState<string>('')
  const [previewMode, setPreviewMode] = useState<'outline' | 'json' | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const captureRef = useRef<HTMLDivElement>(null)

  const storyTitle = story?.title || 'story'


  const handlePreviewOutline = () => {
    if (!story) return
    setPreview(generateOutline(story))
    setPreviewMode('outline')
  }

  const handlePreviewJSON = () => {
    if (!story) return
    setPreview(generateJSON(story))
    setPreviewMode('json')
  }

  const handleDownloadOutline = () => {
    if (!story) return
    const content = generateOutline(story)
    const name = story.title || 'story'
    downloadFile(content, `${name}-outline.md`, 'text/markdown')
  }

  const handleDownloadJSON = () => {
    if (!story) return
    const content = generateJSON(story)
    const name = story.title || 'story'
    downloadFile(content, `${name}-config.json`, 'application/json')
  }

  const handleExportImage = useCallback(async () => {
    if (!captureRef.current || !story) return
    setIsCapturing(true)
    try {
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      })
      const link = document.createElement('a')
      link.download = `${storyTitle}-overview.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setIsCapturing(false)
    }
  }, [story, storyTitle])

  if (!story) return null

  return (
    <div className="px-4 py-6 sm:p-6 max-w-4xl mx-auto space-y-6 sm:space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">📤 匯出</h2>
        <p className="text-muted-foreground">匯出你的章節框架</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Outline export */}
        <div className="border border-border rounded-lg p-5 space-y-3" role="region" aria-label="匯出章節框架">
          <h3 className="font-semibold flex items-center gap-2">📝 章節框架</h3>
          <p className="text-sm text-muted-foreground">人類可讀的章節框架，包含每章事件、角色與情緒指標。</p>
          <div className="flex gap-2">
            <button onClick={handlePreviewOutline} className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring">
              預覽
            </button>
            <button onClick={handleDownloadOutline} className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring">
              下載 .md
            </button>
          </div>
        </div>

        {/* JSON export */}
        <div className="border border-border rounded-lg p-5 space-y-3" role="region" aria-label="匯出結構化JSON">
          <h3 className="font-semibold flex items-center gap-2">🔧 結構化 JSON</h3>
          <p className="text-sm text-muted-foreground">完整故事設定的 JSON 格式，可供 AI 生成器讀取。</p>
          <div className="flex gap-2">
            <button onClick={handlePreviewJSON} className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring">
              預覽
            </button>
            <button onClick={handleDownloadJSON} className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring">
              下載 .json
            </button>
          </div>
        </div>

        {/* Image export */}
        <div className="border border-border rounded-lg p-5 space-y-3" role="region" aria-label="匯出視覺化截圖">
          <h3 className="font-semibold flex items-center gap-2">🖼️ 視覺化截圖</h3>
          <p className="text-sm text-muted-foreground">章節地圖與情緒曲線的 PNG 截圖。</p>
          <div className="flex gap-2">
            <button
              onClick={handleExportImage}
              disabled={isCapturing}
              className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {isCapturing ? '截圖中...' : '下載 .png'}
            </button>
          </div>
        </div>
      </div>

      {/* Capturable area for image export */}
      <div ref={captureRef} className="space-y-4 bg-white p-6 rounded-lg border border-border">
        <h3 className="text-lg font-bold text-center">{story.title || '未命名故事'} — 章節總覽</h3>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {story.chapters.map(ch => {
            const posLabel = CHAPTER_POSITION_LABELS[ch.position] ?? ch.position
            const evCount = ch.events.length
            const catCounts = ch.events.reduce((acc, ev) => {
              const prefix = ev.blockId.split('-')[0]
              const categoryMap: Record<string, string> = { rel: 'relationship', mis: 'misunderstanding', ple: 'pleasure', pain: 'pain', truth: 'truth', obs: 'obstacle', hook: 'hook' }
              const cat = categoryMap[prefix] ?? 'relationship'
              acc[cat] = (acc[cat] ?? 0) + 1
              return acc
            }, {} as Record<string, number>)
            return (
              <div key={ch.index} className="border border-border rounded-md p-2 text-center text-xs">
                <div className="font-bold text-primary">第{ch.index}章</div>
                <div className="text-[10px] text-muted-foreground">{posLabel}</div>
                <div className="text-[10px] mt-1">{evCount} 事件</div>
                <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                  {Object.entries(catCounts).map(([cat, count]) => (
                    <span key={cat} className="text-[8px]">{BLOCK_CATEGORY_LABELS[cat]?.icon}{count}</span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        <EmotionCurve chapters={story.chapters} />
      </div>

      {/* Preview area */}
      {preview && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">
              預覽 — {previewMode === 'outline' ? '章節框架' : 'JSON'}
            </h3>
            <button onClick={() => { setPreview(''); setPreviewMode(null) }} className="text-xs text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded">
              關閉
            </button>
          </div>
          <pre className="p-4 bg-muted/30 border border-border rounded-lg text-xs overflow-auto max-h-[500px] whitespace-pre-wrap">
            {preview}
          </pre>
        </div>
      )}
    </div>
  )
}
