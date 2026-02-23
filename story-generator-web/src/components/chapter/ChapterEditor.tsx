import { useStoryStore } from '@/stores/storyStore'
import { useUIStore } from '@/stores/uiStore'
import { getBlockById, BLOCK_CATEGORY_LABELS } from '@/data/blocks'
import { CHAPTER_POSITION_LABELS } from '@/data/templates'
import type { ChapterPosition, IntensityLevel, PublicLevel } from '@/types'
import { cn } from '@/lib/utils'

const POSITIONS: ChapterPosition[] = [
  'setup', 'encounter', 'escalation', 'rift', 'separation', 'abyss',
  'turning-point', 'eruption', 'chasing', 'truth-reveal', 'climax', 'resolution',
]

export default function ChapterEditor() {
  const story = useStoryStore(s => s.story)
  const selectedIdx = useUIStore(s => s.selectedChapterIndex)
  const removeEvent = useStoryStore(s => s.removeEventFromChapter)
  const updateEvent = useStoryStore(s => s.updateEventInChapter)
  const updatePos = useStoryStore(s => s.updateChapterPosition)

  if (!story || !selectedIdx) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        選擇一個章節開始編輯
      </div>
    )
  }

  const chapter = story.chapters[selectedIdx - 1]
  const posLabel = CHAPTER_POSITION_LABELS[chapter.position]

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">第 {chapter.index} 章 — {posLabel}</h3>
        <span className="text-xs text-muted-foreground">{chapter.events.length} 個事件</span>
      </div>

      {/* Position selector */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">章節定位</label>
        <div className="flex flex-wrap gap-1">
          {POSITIONS.map(pos => (
            <button
              key={pos}
              onClick={() => updatePos(chapter.index, pos)}
              className={cn(
                'text-[11px] px-2 py-1 rounded-md border transition-all',
                chapter.position === pos
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:border-primary/40'
              )}
            >
              {CHAPTER_POSITION_LABELS[pos]}
            </button>
          ))}
        </div>
      </div>

      {/* Events list */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">事件列表</label>
        {chapter.events.length === 0 && (
          <div className="text-center py-6 text-xs text-muted-foreground border border-dashed border-border rounded-lg">
            從左側拖曳事件區塊到此章節
          </div>
        )}
        {chapter.events.map((event, i) => {
          const blockDef = getBlockById(event.blockId)
          const catInfo = BLOCK_CATEGORY_LABELS[blockDef?.category ?? '']
          return (
            <div key={event.instanceId} className="border border-border rounded-lg p-3 space-y-2 bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">#{i + 1}</span>
                  <span>{catInfo?.icon}</span>
                  <span className="text-sm font-medium">{blockDef?.nameZh ?? event.blockId}</span>
                </div>
                <button
                  onClick={() => removeEvent(chapter.index, event.instanceId)}
                  className="text-xs text-destructive hover:text-destructive/80"
                >
                  ✕
                </button>
              </div>

              {/* Quick params */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-muted-foreground">強度</label>
                  <div className="flex gap-1">
                    {(['low', 'medium', 'high'] as IntensityLevel[]).map(level => (
                      <button
                        key={level}
                        onClick={() => updateEvent(chapter.index, event.instanceId, { intensity: level })}
                        className={cn(
                          'text-[10px] px-2 py-0.5 rounded border',
                          event.params.intensity === level
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-border text-muted-foreground'
                        )}
                      >
                        {{ low: '低', medium: '中', high: '高' }[level]}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-muted-foreground">公開程度</label>
                  <div className="flex gap-1">
                    {(['private', 'semi-public', 'public'] as PublicLevel[]).map(level => (
                      <button
                        key={level}
                        onClick={() => updateEvent(chapter.index, event.instanceId, { publicLevel: level })}
                        className={cn(
                          'text-[10px] px-2 py-0.5 rounded border',
                          event.params.publicLevel === level
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-border text-muted-foreground'
                        )}
                      >
                        {{ private: '私下', 'semi-public': '半公開', public: '公開' }[level]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Foreshadowing toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateEvent(chapter.index, event.instanceId, { hasForeshadowing: !event.params.hasForeshadowing })}
                  className={cn(
                    'text-[10px] px-2 py-0.5 rounded border',
                    event.params.hasForeshadowing
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'border-border text-muted-foreground'
                  )}
                >
                  {event.params.hasForeshadowing ? '🔮 有伏筆' : '伏筆'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
