import { cn } from '@/lib/utils'

interface SliderInputProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  leftLabel?: string
  rightLabel?: string
  className?: string
  showValue?: boolean
}

export default function SliderInput({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  leftLabel,
  rightLabel,
  className,
  showValue = true,
}: SliderInputProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        {showValue && (
          <span className="text-sm text-primary font-bold">{value}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {leftLabel && (
          <span className="text-xs text-muted-foreground whitespace-nowrap">{leftLabel}</span>
        )}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
        />
        {rightLabel && (
          <span className="text-xs text-muted-foreground whitespace-nowrap">{rightLabel}</span>
        )}
      </div>
    </div>
  )
}
