import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ResourceBarProps {
  label: string
  value: number
  max?: number
  onChange: (value: number) => void
  color?: string
  className?: string
  description?: string
  impactLow?: string
  impactMid?: string
  impactHigh?: string
}

type ImpactTier = 'low' | 'mid' | 'high'

function getImpactTier(value: number): ImpactTier {
  if (value === 0) return 'low'
  if (value <= 2) return 'mid'
  return 'high'
}

export default function ResourceBar({
  label,
  value,
  max = 5,
  onChange,
  color = 'bg-primary',
  className,
  description,
  impactLow,
  impactMid,
  impactHigh,
}: ResourceBarProps) {
  const [open, setOpen] = useState(false)
  const hasInfo = !!(description || impactLow || impactMid || impactHigh)
  const tier = getImpactTier(value)
  const impactMap: Record<ImpactTier, string | undefined> = { low: impactLow, mid: impactMid, high: impactHigh }

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center gap-2">
        {/* 文字區塊 */}
        <div
          className={cn(
            'flex items-center gap-1 w-16 shrink-0 rounded-md px-2 py-1',
            hasInfo ? 'cursor-pointer select-none hover:bg-muted/80' : ''
          )}
          onClick={() => hasInfo && setOpen(o => !o)}
        >
          <span className={cn(
            'text-xs flex-1 truncate transition-colors',
            open ? 'text-primary' : 'text-muted-foreground'
          )}>{label}</span>
        </div>
        {/* 數值區塊 */}
        <div className="flex-1 flex items-center gap-1">
          {Array.from({ length: max }, (_, i) => (
            <button
              key={i}
              onClick={() => onChange(i + 1 === value ? i : i + 1)}
              className={cn('h-5 flex-1 rounded-sm transition-all cursor-pointer', i >= value && 'bg-muted hover:bg-muted/70')}
              style={i < value ? { backgroundColor: color } : undefined}
            />
          ))}
        </div>
        <span className="text-xs font-mono w-4 text-center text-muted-foreground">{value}</span>
      </div>
      {open && hasInfo && (
        <div className="p-3 rounded-md bg-muted/50 border border-border text-xs space-y-1.5">
          {description && <p className="text-foreground/80">{description}</p>}
          {(impactLow || impactMid || impactHigh) && (
            <div className="space-y-1 pt-1 border-t border-border/50">
              {(['low', 'mid', 'high'] as const).map(t => impactMap[t] && (
                <p
                  key={t}
                  className={cn('leading-relaxed', tier === t ? 'text-primary font-medium' : 'text-muted-foreground')}
                >
                  {impactMap[t]}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
