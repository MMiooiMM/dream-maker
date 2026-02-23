import { cn } from '@/lib/utils'

interface ResourceBarProps {
  label: string
  value: number
  max?: number
  onChange: (value: number) => void
  color?: string
  className?: string
}

export default function ResourceBar({
  label,
  value,
  max = 5,
  onChange,
  color = 'bg-primary',
  className,
}: ResourceBarProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-xs w-12 text-muted-foreground truncate">{label}</span>
      <div className="flex-1 flex gap-1">
        {Array.from({ length: max }, (_, i) => (
          <button
            key={i}
            onClick={() => onChange(i + 1 === value ? i : i + 1)}
            className={cn(
              'h-5 flex-1 rounded-sm transition-all cursor-pointer',
              i < value ? color : 'bg-muted hover:bg-muted/70'
            )}
          />
        ))}
      </div>
      <span className="text-xs font-mono w-4 text-center text-muted-foreground">{value}</span>
    </div>
  )
}
