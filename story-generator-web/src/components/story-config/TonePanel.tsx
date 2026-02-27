import { useStoryStore } from '@/stores/storyStore'
import SliderInput from '@/components/ui/SliderInput'
import OptionCard from '@/components/ui/OptionCard'
import type { IntensityLevel, EndingType, RedemptionLevel, ReturnWillingness, WrongdoerRole } from '@/types'
import {
  WRONGDOER_OPTIONS,
  MALE_REDEMPTION_OPTIONS,
  FEMALE_REDEMPTION_OPTIONS,
  MALE_RETURN_OPTIONS,
  FEMALE_RETURN_OPTIONS,
  PAIRING_TYPE_OPTIONS,
  ABO_SECOND_GENDER_OPTIONS,
} from '@/data/templates'

// Returns true if the wrongdoer setting is relevant to this side
function isRelevant(wrongdoer: WrongdoerRole, side: 'male' | 'female'): boolean {
  return wrongdoer === side || wrongdoer === 'both'
}

function isReturnFocus(wrongdoer: WrongdoerRole, side: 'male' | 'female'): boolean {
  if (wrongdoer === 'male') return side === 'female'
  if (wrongdoer === 'female') return side === 'male'
  return wrongdoer === 'both'
}

function canConfigureReturn(wrongdoer: WrongdoerRole, side: 'male' | 'female'): boolean {
  if (wrongdoer === 'male') return side === 'female'
  if (wrongdoer === 'female') return side === 'male'
  return true
}

export default function TonePanel() {
  const story = useStoryStore(s => s.story)
  const updateTone = useStoryStore(s => s.updateTone)
  const randomizeEnding = useStoryStore(s => s.randomizeEnding)

  if (!story) return null

  const { tone } = story
  const pairing = story.pairingType ?? 'male-female'
  const pairingLabels = PAIRING_TYPE_OPTIONS.find(p => p.value === pairing)?.labels ?? { a: '男主', b: '女主' }

  const aboSuffix = (side: 'male' | 'female') => {
    if (!story.aboEnabled) return ''
    const secondGender = side === 'male' ? story.characters.male.aboSecondGender : story.characters.female.aboSecondGender
    if (!secondGender) return '（未設定第二性別）'
    const label = ABO_SECOND_GENDER_OPTIONS.find(opt => opt.value === secondGender)?.label ?? secondGender
    return `（${label}）`
  }

  const sideDisplay = {
    male: `${pairingLabels.a}${aboSuffix('male')}`,
    female: `${pairingLabels.b}${aboSuffix('female')}`,
  } as const

  const wrongdoerOptions = WRONGDOER_OPTIONS.map(opt => {
    if (opt.value === 'male') return { ...opt, label: `${sideDisplay.male}做錯` }
    if (opt.value === 'female') return { ...opt, label: `${sideDisplay.female}做錯` }
    return opt
  })

  return (
    <div className="px-4 py-6 sm:p-6 max-w-4xl mx-auto space-y-6 sm:space-y-8">
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
        <div className="flex items-center gap-3">
          <h3 className="font-medium">結局</h3>
          <button
            onClick={randomizeEnding}
            className="px-3 py-1 text-xs rounded-full bg-muted hover:bg-muted/80 border border-border transition-colors"
            title="根據虐爽比例隨機生成結局組合"
          >
            🎲 隨機
          </button>
        </div>
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

      {/* Wrongdoer */}
      <div className="space-y-3">
        <h3 className="font-medium">誰做錯事</h3>
        <p className="text-xs text-muted-foreground">決定故事中的過錯方，影響洗白與回頭的焦點</p>
        <div className="grid grid-cols-4 gap-3">
          {wrongdoerOptions.map(opt => (
            <OptionCard
              key={opt.value}
              selected={tone.wrongdoer === opt.value}
              onClick={() => updateTone({ wrongdoer: opt.value as WrongdoerRole })}
              icon={opt.emoji}
              label={opt.label}
            />
          ))}
        </div>
      </div>

      {/* Redemption — dual column */}
      <div className="space-y-3">
        <h3 className="font-medium">洗白程度</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Male redemption */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">👨 {sideDisplay.male}</span>
              {isRelevant(tone.wrongdoer, 'male') && (
                <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">✦ 主要焦點</span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {MALE_REDEMPTION_OPTIONS.map(opt => (
                <OptionCard
                  key={opt.value}
                  selected={tone.maleRedemption === opt.value}
                  onClick={() => updateTone({ maleRedemption: opt.value as RedemptionLevel })}
                  label={opt.label}
                />
              ))}
            </div>
          </div>
          {/* Female redemption */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">👩 {sideDisplay.female}</span>
              {isRelevant(tone.wrongdoer, 'female') && (
                <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">✦ 主要焦點</span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {FEMALE_REDEMPTION_OPTIONS.map(opt => (
                <OptionCard
                  key={opt.value}
                  selected={tone.femaleRedemption === opt.value}
                  onClick={() => updateTone({ femaleRedemption: opt.value as RedemptionLevel })}
                  label={opt.label}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Return willingness — dual column */}
      <div className="space-y-3">
        <h3 className="font-medium">是否回頭</h3>
        <p className="text-xs text-muted-foreground">若單方做錯，回頭焦點會切換為另一方（被辜負者）是否願意回頭。</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Male return */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">👨 {sideDisplay.male}</span>
              {isReturnFocus(tone.wrongdoer, 'male') && (
                <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">✦ 回頭焦點</span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {MALE_RETURN_OPTIONS.map(opt => (
                <OptionCard
                  key={opt.value}
                  selected={tone.maleReturn === opt.value}
                  onClick={() => updateTone({ maleReturn: opt.value as ReturnWillingness })}
                  label={opt.label}
                  disabled={!canConfigureReturn(tone.wrongdoer, 'male')}
                />
              ))}
            </div>
          </div>
          {/* Female return */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">👩 {sideDisplay.female}</span>
              {isReturnFocus(tone.wrongdoer, 'female') && (
                <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">✦ 回頭焦點</span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {FEMALE_RETURN_OPTIONS.map(opt => (
                <OptionCard
                  key={opt.value}
                  selected={tone.femaleReturn === opt.value}
                  onClick={() => updateTone({ femaleReturn: opt.value as ReturnWillingness })}
                  label={opt.label}
                  disabled={!canConfigureReturn(tone.wrongdoer, 'female')}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
