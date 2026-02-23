import { cn } from '@/lib/utils'

interface OptionCardProps {
  selected: boolean
  onClick: () => void
  icon?: string
  label: string
  description?: string
  disabled?: boolean
  className?: string
}

export default function OptionCard({
  selected,
  onClick,
  icon,
  label,
  description,
  disabled,
  className,
}: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all text-center',
        selected
          ? 'border-primary bg-primary/5 shadow-sm'
          : 'border-border hover:border-primary/40 hover:bg-muted/30',
        disabled && 'opacity-40 cursor-not-allowed',
        className
      )}
    >
      {icon && <span className="text-2xl">{icon}</span>}
      <span className="font-medium text-sm">{label}</span>
      {description && (
        <span className="text-xs text-muted-foreground line-clamp-2">{description}</span>
      )}
    </button>
  )
}
