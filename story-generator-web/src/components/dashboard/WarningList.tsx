import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

export default function WarningList() {
  const warnings = useUIStore(s => s.warnings)

  if (warnings.length === 0) return null

  return (
    <div className="mt-4 space-y-2">
      <h3 className="text-sm font-semibold">⚠️ 節奏提醒</h3>
      {warnings.map(w => (
        <div
          key={w.id}
          className={cn(
            'text-xs p-3 rounded-lg border',
            w.severity === 'error' && 'bg-red-50 border-red-200 text-red-700',
            w.severity === 'warning' && 'bg-amber-50 border-amber-200 text-amber-700',
            w.severity === 'info' && 'bg-blue-50 border-blue-200 text-blue-700'
          )}
        >
          {w.message}
        </div>
      ))}
    </div>
  )
}
