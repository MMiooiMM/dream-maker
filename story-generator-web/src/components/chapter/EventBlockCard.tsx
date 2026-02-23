import { cn } from '@/lib/utils'
import type { EventBlockDefinition } from '@/types'
import { BLOCK_CATEGORY_LABELS } from '@/data/blocks'
import { useDraggable } from '@dnd-kit/core'

interface EventBlockCardProps {
  block: EventBlockDefinition
  compact?: boolean
}

export default function EventBlockCard({ block, compact }: EventBlockCardProps) {
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
      className={cn(
        'border border-border rounded-lg cursor-grab active:cursor-grabbing transition-shadow select-none',
        'focus:outline-none focus:ring-2 focus:ring-ring',
        isDragging && 'opacity-50 shadow-lg scale-105',
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
        <div className="flex items-center gap-2 mt-2">
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
        </div>
      )}
    </div>
  )
}
