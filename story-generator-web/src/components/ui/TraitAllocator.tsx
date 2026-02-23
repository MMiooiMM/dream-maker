import { cn } from '@/lib/utils'
import type { TraitName } from '@/types'
import { TRAIT_LABELS } from '@/data/templates'

interface TraitAllocatorProps {
  traits: Record<TraitName, number>
  maxPoints: number
  onChange: (traits: Record<TraitName, number>) => void
  className?: string
}

const TRAIT_NAMES: TraitName[] = ['pride', 'control', 'empathy', 'rationality', 'impulse', 'attachment']

export default function TraitAllocator({ traits, maxPoints, onChange, className }: TraitAllocatorProps) {
  const totalUsed = Object.values(traits).reduce((sum, v) => sum + v, 0)
  const remaining = maxPoints - totalUsed

  const adjust = (name: TraitName, delta: number) => {
    const newVal = traits[name] + delta
    if (newVal < 0 || newVal > 5) return
    if (delta > 0 && remaining <= 0) return
    onChange({ ...traits, [name]: newVal })
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">性格特質</span>
        <span className={cn(
          'text-sm font-bold',
          remaining === 0 ? 'text-primary' : remaining < 0 ? 'text-destructive' : 'text-muted-foreground'
        )}>
          剩餘 {remaining} 點
        </span>
      </div>
      {TRAIT_NAMES.map(name => (
        <div key={name} className="flex items-center gap-3">
          <span className="text-sm w-16 text-muted-foreground">{TRAIT_LABELS[name]}</span>
          <button
            onClick={() => adjust(name, -1)}
            disabled={traits[name] <= 0}
            className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-sm hover:bg-muted disabled:opacity-30"
          >
            −
          </button>
          <div className="flex-1 flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className={cn(
                  'h-3 flex-1 rounded-sm transition-colors',
                  i < traits[name] ? 'bg-primary' : 'bg-muted'
                )}
              />
            ))}
          </div>
          <span className="text-sm font-mono w-4 text-center">{traits[name]}</span>
          <button
            onClick={() => adjust(name, 1)}
            disabled={traits[name] >= 5 || remaining <= 0}
            className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-sm hover:bg-muted disabled:opacity-30"
          >
            +
          </button>
        </div>
      ))}
    </div>
  )
}
