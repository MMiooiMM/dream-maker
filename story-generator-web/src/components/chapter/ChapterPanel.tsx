import { useState, memo, useMemo } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { useStoryStore } from '@/stores/storyStore'
import { useUIStore } from '@/stores/uiStore'
import ChapterCard from './ChapterCard'
import BlockLibrary from './BlockLibrary'
import ChapterEditor from './ChapterEditor'
import EmotionCurve from '@/components/dashboard/EmotionCurve'
import WarningList from '@/components/dashboard/WarningList'
import { autoLayoutChapters } from '@/features/chapters/autoLayout'
import { calculateAllMetrics, detectWarnings } from '@/features/rhythm/emotionEngine'
import { BLOCK_CATEGORY_LABELS } from '@/data/blocks'
import type { EventBlockDefinition, EventBlockInstance } from '@/types'
import { useEffect } from 'react'

const CHAPTER_COUNT_PRESETS = [12, 16, 20, 24, 30]

let instanceCounter = 0

const MemoizedChapterCard = memo(ChapterCard)
const MemoizedEmotionCurve = memo(EmotionCurve)

export default function ChapterPanel() {
  const story = useStoryStore(s => s.story)
  const addEvent = useStoryStore(s => s.addEventToChapter)
  const setChapters = useStoryStore(s => s.setChapters)
  const resizeChapters = useStoryStore(s => s.resizeChapters)
  const updateMetrics = useStoryStore(s => s.updateChapterMetrics)
  const selectedIdx = useUIStore(s => s.selectedChapterIndex)
  const setSelected = useUIStore(s => s.setSelectedChapter)
  const setWarnings = useUIStore(s => s.setWarnings)

  const [activeDrag, setActiveDrag] = useState<EventBlockDefinition | null>(null)
  const [showLibrary, setShowLibrary] = useState(true)
  const [customCount, setCustomCount] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  // Stable key based only on events/positions — does NOT change when metrics are written back,
  // which prevents the useEffect below from triggering an infinite update loop.
  const chaptersKey = useMemo(
    () =>
      story?.chapters
        .map(c => `${c.index}:${c.position}:${JSON.stringify(c.events)}`)
        .join('|') ?? '',
    [story?.chapters]
  )

  // Recalculate metrics when chapters' events/positions change
  const metrics = useMemo(() => {
    if (!story) return []
    return calculateAllMetrics(story.chapters)
  }, [chaptersKey])

  // Update warnings and persist metrics to store
  useEffect(() => {
    if (!story) return
    const w = detectWarnings(story.chapters)
    setWarnings(w)
    metrics.forEach((m, i) => {
      updateMetrics(i + 1, m)
    })
  }, [chaptersKey])

  if (!story) return null

  const handleDragStart = (e: DragStartEvent) => {
    const block = (e.active.data.current as { block?: EventBlockDefinition })?.block
    if (block) setActiveDrag(block)
  }

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveDrag(null)
    const { active, over } = e
    if (!over) return

    const overId = over.id.toString()
    if (!overId.startsWith('chapter-')) return

    const chapterIndex = parseInt(overId.replace('chapter-', ''))
    const block = (active.data.current as { block?: EventBlockDefinition })?.block
    if (!block) return

    const instance: EventBlockInstance = {
      instanceId: `inst-${Date.now()}-${++instanceCounter}`,
      blockId: block.id,
      params: {
        involvedCharacters: ['male', 'female'],
        intensity: block.defaultIntensity,
        publicLevel: 'private',
        effects: { ...block.defaultEffects },
        hasForeshadowing: false,
      },
    }

    addEvent(chapterIndex, instance)
  }

  const handleAutoLayout = () => {
    if (!story) return
    const generated = autoLayoutChapters(story)
    setChapters(generated)
  }

  const handleChapterCountChange = (count: number) => {
    if (count < 1 || count > 60) return
    resizeChapters(count)
  }

  const chapterCount = story?.chapterCount ?? story?.chapters.length ?? 12

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-full flex-col lg:flex-row">
        {/* Left: Block Library (collapsible on small screens) */}
        <div
          className={cn(
            'border-r border-border flex-shrink-0 overflow-hidden flex flex-col transition-all duration-200',
            showLibrary ? 'w-full lg:w-64' : 'w-0'
          )}
        >
          {showLibrary && <BlockLibrary />}
        </div>

        {/* Center: Chapter Map + Dashboard */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 min-h-0">
          {/* Top action bar */}
          <div className="p-3 border-b border-border flex items-center gap-2 sm:gap-3 flex-wrap" role="toolbar" aria-label="章節工具列">
            <button
              onClick={() => setShowLibrary(!showLibrary)}
              className="px-2 py-1.5 text-xs border border-border rounded-md hover:bg-muted transition-colors md:hidden focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label={showLibrary ? '隱藏區塊庫' : '顯示區塊庫'}
            >
              {showLibrary ? '◀ 隱藏' : '▶ 區塊庫'}
            </button>
            <button
              onClick={() => setShowLibrary(!showLibrary)}
              className="px-2 py-1.5 text-xs border border-border rounded-md hover:bg-muted transition-colors hidden md:inline-flex focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label={showLibrary ? '隱藏區塊庫' : '顯示區塊庫'}
            >
              {showLibrary ? '◀' : '▶'}
            </button>
            <h2 className="font-bold text-sm">📖 章節配置 · {chapterCount} 章</h2>
            <button
              onClick={handleAutoLayout}
              className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring"
            >
              ⚡ 一鍵生成配置
            </button>
            {/* Chapter count selector */}
            <div className="flex items-center gap-1 lg:ml-auto flex-wrap">
              <span className="text-xs text-muted-foreground mr-1">章節數：</span>
              {CHAPTER_COUNT_PRESETS.map(n => (
                <button
                  key={n}
                  onClick={() => { setShowCustomInput(false); handleChapterCountChange(n) }}
                  className={cn(
                    'px-2 py-1 text-xs rounded-md border transition-all',
                    chapterCount === n
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted text-muted-foreground border-transparent hover:border-border'
                  )}
                >
                  {n}
                </button>
              ))}
              {showCustomInput ? (
                <input
                  autoFocus
                  type="number"
                  min={1}
                  max={60}
                  value={customCount}
                  onChange={e => setCustomCount(e.target.value)}
                  onBlur={() => {
                    const n = parseInt(customCount)
                    if (!isNaN(n)) handleChapterCountChange(n)
                    setShowCustomInput(false)
                    setCustomCount('')
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      const n = parseInt(customCount)
                      if (!isNaN(n)) handleChapterCountChange(n)
                      setShowCustomInput(false)
                      setCustomCount('')
                    }
                    if (e.key === 'Escape') { setShowCustomInput(false); setCustomCount('') }
                  }}
                  className="w-14 px-2 py-1 text-xs rounded-md border border-border bg-background outline-none focus:border-primary"
                />
              ) : (
                <button
                  onClick={() => setShowCustomInput(true)}
                  className="px-2 py-1 text-xs rounded-md border border-transparent bg-muted text-muted-foreground hover:border-border transition-all"
                >
                  自訂
                </button>
              )}
            </div>
          </div>

          {/* Chapter Map */}
          <div className="p-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 mb-6" role="list" aria-label={`${chapterCount}章節地圖`}>
              {story.chapters.map(ch => (
                <div key={ch.index} role="listitem">
                  <MemoizedChapterCard
                    chapter={ch}
                    isSelected={selectedIdx === ch.index}
                    onClick={() => setSelected(ch.index)}
                  />
                </div>
              ))}
            </div>

            {/* Emotion Curve */}
            <MemoizedEmotionCurve chapters={story.chapters} />

            {/* Warnings */}
            <WarningList />
          </div>
        </div>

        {/* Right: Chapter Editor (responsive) */}
        <div className={cn(
          'border-l border-border flex-shrink-0 overflow-hidden transition-all duration-200',
          selectedIdx ? 'w-full lg:w-80 md:w-72' : 'w-0'
        )}>
          {selectedIdx && <ChapterEditor />}
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeDrag && (
          <div className="p-3 border border-primary rounded-lg bg-card shadow-lg max-w-[200px] animate-pulse">
            <div className="flex items-center gap-2">
              <span>{BLOCK_CATEGORY_LABELS[activeDrag.category]?.icon}</span>
              <span className="text-sm font-medium">{activeDrag.nameZh}</span>
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
