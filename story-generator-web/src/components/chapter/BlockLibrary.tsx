import { useState } from 'react'
import { EVENT_BLOCKS, BLOCK_CATEGORY_LABELS } from '@/data/blocks'
import EventBlockCard from './EventBlockCard'
import { cn } from '@/lib/utils'

const CATEGORIES = Object.keys(BLOCK_CATEGORY_LABELS)

interface BlockLibraryProps {
  onSelectBlock?: (blockId: string) => void
}

export default function BlockLibrary({ onSelectBlock }: BlockLibraryProps) {
  const [filter, setFilter] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = EVENT_BLOCKS.filter(b => {
    if (filter && b.category !== filter) return false
    if (search && !b.nameZh.includes(search) && !b.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border space-y-2">
        <h3 className="font-semibold text-sm">📦 事件區塊庫</h3>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="搜尋事件..."
          className="w-full px-2 py-1.5 text-xs rounded-md border border-border bg-background outline-none focus:border-primary"
        />
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setFilter(null)}
            className={cn(
              'text-[10px] px-2 py-1 rounded-full border transition-all',
              !filter ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'
            )}
          >
            全部
          </button>
          {CATEGORIES.map(cat => {
            const info = BLOCK_CATEGORY_LABELS[cat]
            return (
              <button
                key={cat}
                onClick={() => setFilter(filter === cat ? null : cat)}
                className={cn(
                  'text-[10px] px-2 py-1 rounded-full border transition-all',
                  filter === cat ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'
                )}
              >
                {info.icon} {info.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filtered.map(block => (
          <EventBlockCard
            key={block.id}
            block={block}
            onClick={onSelectBlock ? () => onSelectBlock(block.id) : undefined}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-xs text-muted-foreground py-8">
            沒有符合條件的區塊
          </div>
        )}
      </div>
    </div>
  )
}
