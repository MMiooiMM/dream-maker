import { cn } from '@/lib/utils'
import type { Chapter } from '@/types'
import { CHAPTER_POSITION_LABELS } from '@/data/templates'
import { BLOCK_CATEGORY_LABELS } from '@/data/blocks'
import { useDroppable } from '@dnd-kit/core'

interface ChapterCardProps {
  chapter: Chapter
  isSelected: boolean
  onClick: () => void
}

export default function ChapterCard({ chapter, isSelected, onClick }: ChapterCardProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `chapter-${chapter.index}`,
  })

  const posLabel = CHAPTER_POSITION_LABELS[chapter.position] ?? chapter.position
  const eventCount = chapter.events.length

  const categoryCounts = chapter.events.reduce((acc, ev) => {
    const parts = ev.blockId.split('-')
    const prefix = parts[0]
    const categoryMap: Record<string, string> = {
      rel: 'relationship', mis: 'misunderstanding', ple: 'pleasure',
      pain: 'pain', truth: 'truth', obs: 'obstacle', hook: 'hook',
    }
    const cat = categoryMap[prefix] ?? 'relationship'
    acc[cat] = (acc[cat] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`第 ${chapter.index} 章 — ${posLabel}，${eventCount} 個事件`}
      aria-pressed={isSelected}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } }}
      className={cn(
        'relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 min-h-[100px]',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
        isSelected
          ? 'border-primary bg-primary/5 shadow-md'
          : 'border-border hover:border-primary/40',
        isOver && 'border-primary bg-primary/10 scale-[1.02]'
      )}
    >
      {/* Chapter number badge */}
      <div className="absolute -top-2.5 -left-2.5 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold" aria-hidden="true">
        {chapter.index}
      </div>

      <div className="text-sm font-semibold mb-1">{posLabel}</div>

      <div className="text-xs text-muted-foreground mb-2">
        {eventCount > 0 ? `${eventCount} 個事件` : '拖曳事件到這裡'}
      </div>

      {eventCount > 0 && (
        <div className="flex flex-wrap gap-1">
          {Object.entries(categoryCounts).map(([cat, count]) => {
            const info = BLOCK_CATEGORY_LABELS[cat]
            return (
              <span
                key={cat}
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground"
                title={`${info?.label ?? cat}: ${count}`}
              >
                {info?.icon} {count}
              </span>
            )
          })}
        </div>
      )}

      {eventCount > 0 && (
        <div className="flex gap-2 mt-2 text-[10px]">
          <span className="text-pleasure">爽 {chapter.metrics.pleasure.toFixed(0)}</span>
          <span className="text-pain">虐 {chapter.metrics.pain.toFixed(0)}</span>
          <span className="text-tension">緊張 {chapter.metrics.tension.toFixed(0)}</span>
        </div>
      )}
    </div>
  )
}
