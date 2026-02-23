import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { calculateAllMetrics } from '@/features/rhythm/emotionEngine'
import type { Chapter } from '@/types'
import { useMemo } from 'react'

interface EmotionCurveProps {
  chapters: Chapter[]
}

export default function EmotionCurve({ chapters }: EmotionCurveProps) {
  const data = useMemo(() => {
    const metrics = calculateAllMetrics(chapters)
    return metrics.map((m, i) => ({
      chapter: `第${i + 1}章`,
      爽點: Math.round(m.pleasure * 10) / 10,
      虐點: Math.round(m.pain * 10) / 10,
      緊張度: Math.round(m.tension * 10) / 10,
    }))
  }, [chapters])

  const hasData = chapters.some(ch => ch.events.length > 0)

  if (!hasData) {
    return (
      <div className="border border-dashed border-border rounded-lg p-6 text-center text-sm text-muted-foreground">
        完成章節編排後，情緒曲線將在此顯示
      </div>
    )
  }

  return (
    <div className="border border-border rounded-lg p-4 space-y-2">
      <h3 className="text-sm font-semibold">📈 情緒曲線</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="chapter" tick={{ fontSize: 10 }} />
          <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
          <Tooltip contentStyle={{ fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="爽點" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="虐點" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="緊張度" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
