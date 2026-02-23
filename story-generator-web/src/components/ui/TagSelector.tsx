import { cn } from '@/lib/utils'

interface TagSelectorProps<T extends string> {
  label: string
  options: { value: T; label: string; icon?: string }[]
  selected: T[]
  onChange: (selected: T[]) => void
  className?: string
}

export default function TagSelector<T extends string>({
  label,
  options,
  selected,
  onChange,
  className,
}: TagSelectorProps<T>) {
  const toggle = (value: T) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-medium">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const isSelected = selected.includes(opt.value)
          return (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm border transition-all',
                isSelected
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted/30 text-muted-foreground border-border hover:border-primary/40'
              )}
            >
              {opt.icon && <span className="mr-1">{opt.icon}</span>}
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
