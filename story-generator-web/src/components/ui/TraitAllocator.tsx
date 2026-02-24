import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { TraitName } from '@/types'
import { TRAIT_LABELS } from '@/data/templates'
import traitsData from '@shared/story-config/traits.json'

interface TraitAllocatorProps {
  traits: Record<TraitName, number>
  maxPoints: number
  onChange: (traits: Record<TraitName, number>) => void
  className?: string
}

const TRAIT_NAMES: TraitName[] = ['pride', 'control', 'empathy', 'rationality', 'impulse', 'attachment']

type ImpactTier = { low: string; mid: string; high: string }
type TraitInfo = { nameZh: string; description: string; impact: ImpactTier }
const TRAITS_INFO = traitsData.traits as Record<string, TraitInfo>

function getImpactTier(value: number): keyof ImpactTier {
  if (value === 0) return 'low'
  if (value <= 2) return 'mid'
  return 'high'
}

export default function TraitAllocator({ traits, maxPoints, onChange, className }: TraitAllocatorProps) {
  const totalUsed = Object.values(traits).reduce((sum, v) => sum + v, 0)
  const remaining = maxPoints - totalUsed
  const [openTrait, setOpenTrait] = useState<TraitName | null>(null)

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
      {TRAIT_NAMES.map(name => {
        const info = TRAITS_INFO[name]
        const isOpen = openTrait === name
        return (
          <div key={name}>
            <div className="flex items-center gap-3">
              <div
                  className={cn(
                    'flex items-center gap-1 w-16 shrink-0 rounded-md px-2 py-1',
                    info ? 'cursor-pointer select-none hover:bg-muted/80' : ''
                  )}
                  onClick={() => info && setOpenTrait(isOpen ? null : name)}
                >
                  <span className={cn(
                    'text-sm flex-1 truncate transition-colors',
                    isOpen ? 'text-primary' : 'text-muted-foreground'
                  )}>{TRAIT_LABELS[name]}</span>
                </div>
              <div className="flex-1 flex items-center gap-1.5 bg-muted/40 rounded-md px-2 py-1">
                <button
                  onClick={() => adjust(name, -1)}
                  disabled={traits[name] <= 0}
                  className="w-5 h-5 rounded flex items-center justify-center text-xs hover:bg-muted disabled:opacity-30 shrink-0"
                >
                  −
                </button>
                <div className="flex-1 flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'h-3 flex-1 rounded-sm transition-colors',
                        i < traits[name] ? 'bg-primary' : 'bg-background'
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-mono w-4 text-center">{traits[name]}</span>
                <button
                  onClick={() => adjust(name, 1)}
                  disabled={traits[name] >= 5 || remaining <= 0}
                  className="w-5 h-5 rounded flex items-center justify-center text-xs hover:bg-muted disabled:opacity-30 shrink-0"
                >
                  +
                </button>
              </div>
            </div>
            {isOpen && info && (
              <div className="mt-1.5 p-3 rounded-md bg-muted/50 border border-border text-xs space-y-1.5">
                <p className="text-foreground/80">{info.description}</p>
                <div className="space-y-1 pt-1 border-t border-border/50">
                  {(['low', 'mid', 'high'] as const).map(tier => (
                    <p
                      key={tier}
                      className={cn(
                        'leading-relaxed',
                        getImpactTier(traits[name]) === tier
                          ? 'text-primary font-medium'
                          : 'text-muted-foreground'
                      )}
                    >
                      {info.impact[tier]}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
