import { useStoryStore } from '@/stores/storyStore'
import SliderInput from '@/components/ui/SliderInput'
import OptionCard from '@/components/ui/OptionCard'
import type { IntensityLevel, EndingType, RedemptionLevel, FemaleReturn } from '@/types'

export default function TonePanel() {
  const story = useStoryStore(s => s.story)
  const updateTone = useStoryStore(s => s.updateTone)

  if (!story) return null

  const { tone } = story

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">🎭 故事基調</h2>
        <p className="text-muted-foreground">調整虐爽比例與核心設定</p>
      </div>

      {/* Pain / Pleasure sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SliderInput
          label="💔 虐度"
          value={tone.painLevel}
          min={1}
          max={10}
          onChange={(v) => updateTone({ painLevel: v })}
          leftLabel="微虐"
          rightLabel="極虐"
        />
        <SliderInput
          label="🔥 爽度"
          value={tone.pleasureLevel}
          min={1}
          max={10}
          onChange={(v) => updateTone({ pleasureLevel: v })}
          leftLabel="慢爽"
          rightLabel="爆爽"
        />
      </div>

      {/* Misunderstanding Intensity */}
      <div className="space-y-3">
        <h3 className="font-medium">誤會強度</h3>
        <div className="grid grid-cols-3 gap-3">
          {(['low', 'medium', 'high'] as IntensityLevel[]).map(level => (
            <OptionCard
              key={level}
              selected={tone.misunderstandingIntensity === level}
              onClick={() => updateTone({ misunderstandingIntensity: level })}
              label={{ low: '低', medium: '中', high: '高' }[level]}
            />
          ))}
        </div>
      </div>

      {/* Reversal Frequency */}
      <div className="space-y-3">
        <h3 className="font-medium">反轉頻率</h3>
        <div className="grid grid-cols-3 gap-3">
          {(['low', 'medium', 'high'] as IntensityLevel[]).map(level => (
            <OptionCard
              key={level}
              selected={tone.reversalFrequency === level}
              onClick={() => updateTone({ reversalFrequency: level })}
              label={{ low: '少', medium: '中', high: '多' }[level]}
            />
          ))}
        </div>
      </div>

      {/* Ending */}
      <div className="space-y-3">
        <h3 className="font-medium">結局</h3>
        <div className="grid grid-cols-3 gap-3">
          {([
            { value: 'HE', label: 'HE 😊', desc: '幸福結局' },
            { value: 'BE', label: 'BE 💀', desc: '悲傷結局' },
            { value: 'open', label: '開放 🤔', desc: '留給讀者想像' },
          ] as const).map(opt => (
            <OptionCard
              key={opt.value}
              selected={tone.ending === opt.value}
              onClick={() => updateTone({ ending: opt.value as EndingType })}
              label={opt.label}
              description={opt.desc}
            />
          ))}
        </div>
      </div>

      {/* Male Redemption */}
      <div className="space-y-3">
        <h3 className="font-medium">男主洗白程度</h3>
        <div className="grid grid-cols-3 gap-3">
          {([
            { value: 'full', label: '完全洗白' },
            { value: 'partial', label: '部分洗白' },
            { value: 'none', label: '不洗白' },
          ] as const).map(opt => (
            <OptionCard
              key={opt.value}
              selected={tone.maleRedemption === opt.value}
              onClick={() => updateTone({ maleRedemption: opt.value as RedemptionLevel })}
              label={opt.label}
            />
          ))}
        </div>
      </div>

      {/* Female Return */}
      <div className="space-y-3">
        <h3 className="font-medium">女主是否回頭</h3>
        <div className="grid grid-cols-3 gap-3">
          {([
            { value: 'yes', label: '是' },
            { value: 'no', label: '否' },
            { value: 'conditional', label: '看條件' },
          ] as const).map(opt => (
            <OptionCard
              key={opt.value}
              selected={tone.femaleReturn === opt.value}
              onClick={() => updateTone({ femaleReturn: opt.value as FemaleReturn })}
              label={opt.label}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
