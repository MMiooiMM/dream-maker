import { cn } from '@/lib/utils'
import type { EventBlockDefinition } from '@/types'
import { BLOCK_CATEGORY_LABELS, WORLD_GENRE_LABELS } from '@/data/blocks'
import { useDraggable } from '@dnd-kit/core'

interface EventBlockCardProps {
  block: EventBlockDefinition
  compact?: boolean
  onClick?: () => void
}

export default function EventBlockCard({ block, compact, onClick }: EventBlockCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `block-${block.id}`,
    data: { block },
  })

  const catInfo = BLOCK_CATEGORY_LABELS[block.category]
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, transition: 'none' }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      role="option"
      aria-label={`${block.nameZh} — ${catInfo?.label ?? block.category}`}
      onClick={onClick}
      className={cn(
        'border border-border rounded-lg cursor-grab active:cursor-grabbing transition-shadow select-none',
        'focus:outline-none focus:ring-2 focus:ring-ring',
        isDragging && 'opacity-50 shadow-lg scale-105',
        onClick && 'cursor-pointer',
        compact ? 'p-2' : 'p-3'
      )}
    >
      <div className="flex items-start gap-2">
        <span className="text-lg" aria-hidden="true">{catInfo?.icon ?? '📄'}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{block.nameZh}</div>
          {!compact && (
            <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
              {block.description}
            </div>
          )}
        </div>
      </div>
      {!compact && (
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className={cn(
            'text-[10px] px-1.5 py-0.5 rounded-full',
            'bg-muted text-muted-foreground'
          )}>
            {catInfo?.label}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {block.defaultIntensity === 'high' ? '🔴' : block.defaultIntensity === 'medium' ? '🟡' : '🟢'}
            {' '}{block.defaultIntensity === 'high' ? '高' : block.defaultIntensity === 'medium' ? '中' : '低'}
          </span>
          {block.maxUsagesPerStory === 1 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">全書限一次</span>
          )}
          {block.worldGenres && block.worldGenres.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-700">
              {block.worldGenres.map(g => WORLD_GENRE_LABELS[g]).join(' / ')}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
