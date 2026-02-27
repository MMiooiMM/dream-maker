import { useStoryStore } from '@/stores/storyStore'
import OptionCard from '@/components/ui/OptionCard'
import SliderInput from '@/components/ui/SliderInput'
import TagSelector from '@/components/ui/TagSelector'
import {
  ERA_OPTIONS,
  GENRE_OPTIONS,
  OBSTACLE_OPTIONS,
  ABO_SCENT_RANGE_OPTIONS,
  ABO_MARK_EFFECT_OPTIONS,
  ABO_MARK_REMOVAL_OPTIONS,
  ABO_FERTILITY_RULE_OPTIONS,
} from '@/data/templates'
import type {
  Era,
  WorldGenre,
  ObstacleSource,
  AboScentRange,
  AboMarkEffect,
  AboMarkRemoval,
  AboFertilityRule,
} from '@/types'
import { cn } from '@/lib/utils'

export default function WorldPanel() {
  const story = useStoryStore(s => s.story)
  const updateWorld = useStoryStore(s => s.updateWorld)
  const setAboEnabled = useStoryStore(s => s.setAboEnabled)
  const updateAboWorld = useStoryStore(s => s.updateAboWorld)

  if (!story) return null

  const { world, aboEnabled, abo } = story
  const obstacleOptions = aboEnabled
    ? OBSTACLE_OPTIONS
    : OBSTACLE_OPTIONS.filter(opt => opt.value !== 'pheromone')

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">🌍 世界觀設定</h2>
        <p className="text-muted-foreground">選擇故事發生的時代與背景</p>
      </div>

      {/* Era Selection */}
      <div className="space-y-3">
        <h3 className="font-medium">時代</h3>
        <div className="grid grid-cols-3 gap-3">
          {ERA_OPTIONS.map(opt => (
            <OptionCard
              key={opt.value}
              selected={world.era === opt.value}
              onClick={() => updateWorld({ era: opt.value as Era })}
              icon={opt.icon}
              label={opt.label}
            />
          ))}
        </div>
      </div>

      {/* Genre Selection */}
      <div className="space-y-3">
        <h3 className="font-medium">類型</h3>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {GENRE_OPTIONS.map(opt => (
            <OptionCard
              key={opt.value}
              selected={world.genre === opt.value}
              onClick={() => updateWorld({ genre: opt.value as WorldGenre })}
              icon={opt.icon}
              label={opt.label}
            />
          ))}
        </div>
      </div>

      {/* Realism Slider */}
      <SliderInput
        label="規則強度"
        value={world.realismLevel}
        min={1}
        max={10}
        onChange={(v) => updateWorld({ realismLevel: v })}
        leftLabel="寫實"
        rightLabel="狗血"
      />

      {/* Obstacle Sources */}
      <TagSelector<ObstacleSource>
        label="阻力來源（可多選）"
        options={obstacleOptions}
        selected={world.obstacleSources}
        onChange={(v) => updateWorld({ obstacleSources: v })}
      />

      {/* ABO World */}
      <div className="border border-border rounded-lg p-5 space-y-4 bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">🧬 ABO 世界觀</h3>
            <p className="text-xs text-muted-foreground">信息素、標記與分級規則的全局設定</p>
          </div>
          <button
            role="switch"
            aria-checked={aboEnabled}
            onClick={() => setAboEnabled(!aboEnabled)}
            className={cn(
              'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
              aboEnabled ? 'bg-primary' : 'bg-muted-foreground/30'
            )}
          >
            <span
              className={cn(
                'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200',
                aboEnabled ? 'translate-x-4' : 'translate-x-0'
              )}
            />
          </button>
        </div>

        {aboEnabled && (
          <div className="rounded-lg border border-border bg-background overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-rose-50 via-amber-50 to-sky-50">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">ABO 世界觀已啟用</p>
                  <p className="text-sm font-medium">信息素、標記與分級規則將影響角色互動與衝突來源</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  完整規則：<span className="font-mono">docs/abo-world.md</span>
                </div>
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">核心機制</h4>
                <div className="flex flex-wrap gap-2">
                  {['信息素', '發情/易感期', '求偶期', '築巢', '結合與標記'].map(tag => (
                    <span key={tag} className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  本能反應可被抑制或放大，關係張力通常來自相性、壓制力與同意邊界。
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">分級規則</h4>
                <div className="space-y-2">
                  <div className="rounded-md border border-border bg-background p-2">
                    <div className="text-xs font-semibold">Alpha 強弱</div>
                    <p className="text-xs text-muted-foreground">
                      強A / 中A / 弱A，以信息素壓制力、社會支配力、自我控制力三軸定義。
                    </p>
                  </div>
                  <div className="rounded-md border border-border bg-background p-2">
                    <div className="text-xs font-semibold">Omega 分級</div>
                    <p className="text-xs text-muted-foreground">
                      高敏感 / 中等 / 低敏感，影響反應強度與身份錯位劇情空間。
                    </p>
                  </div>
                  <div className="rounded-md border border-border bg-background p-2">
                    <div className="text-xs font-semibold">Beta 定位</div>
                    <p className="text-xs text-muted-foreground">
                      多為社會秩序的中立群體，也可設定對特定對象出現例外反應。
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">可調參數與提醒</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>• 標記是否具有法律效力、是否可解除</div>
                  <div>• 生育條件（是否需標記、是否可醫療介入）</div>
                  <div>• 信息素感知範圍（近距離或遠距影響）</div>
                  <div>• 分級是否影響職場與社會地位</div>
                </div>
                <div className="mt-2 rounded-md border border-border bg-background p-2">
                  <div className="text-xs font-semibold">創作提醒</div>
                  <p className="text-xs text-muted-foreground">
                    建議明確處理同意與權力不對等，讓衝突更有說服力。
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-border bg-background p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">⚙️ ABO 世界觀參數</h4>
                <span className="text-xs text-muted-foreground">全局設定</span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground">信息素範圍</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {ABO_SCENT_RANGE_OPTIONS.map(opt => (
                    <OptionCard
                      key={opt.value}
                      selected={abo.scentRange === opt.value}
                      onClick={() => updateAboWorld({ scentRange: opt.value as AboScentRange })}
                      icon={opt.icon}
                      label={opt.label}
                      description={opt.description}
                      className="py-3"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground">標記效力</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {ABO_MARK_EFFECT_OPTIONS.map(opt => (
                    <OptionCard
                      key={opt.value}
                      selected={abo.markEffect === opt.value}
                      onClick={() => updateAboWorld({ markEffect: opt.value as AboMarkEffect })}
                      icon={opt.icon}
                      label={opt.label}
                      description={opt.description}
                      className="py-3"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground">標記可解除</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {ABO_MARK_REMOVAL_OPTIONS.map(opt => (
                    <OptionCard
                      key={opt.value}
                      selected={abo.markRemoval === opt.value}
                      onClick={() => updateAboWorld({ markRemoval: opt.value as AboMarkRemoval })}
                      icon={opt.icon}
                      label={opt.label}
                      description={opt.description}
                      className="py-3"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground">生育條件</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {ABO_FERTILITY_RULE_OPTIONS.map(opt => (
                    <OptionCard
                      key={opt.value}
                      selected={abo.fertilityRule === opt.value}
                      onClick={() => updateAboWorld({ fertilityRule: opt.value as AboFertilityRule })}
                      icon={opt.icon}
                      label={opt.label}
                      description={opt.description}
                      className="py-3"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  role="switch"
                  aria-checked={abo.malePregnancy}
                  onClick={() => updateAboWorld({ malePregnancy: !abo.malePregnancy })}
                  className={cn(
                    'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
                    abo.malePregnancy ? 'bg-primary' : 'bg-muted-foreground/30'
                  )}
                >
                  <span
                    className={cn(
                      'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200',
                      abo.malePregnancy ? 'translate-x-4' : 'translate-x-0'
                    )}
                  />
                </button>
                <div className="text-sm">
                  <span className="font-medium">男孕設定</span>
                  <span className="text-xs text-muted-foreground">（允許 Alpha/Omega 男孕）</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
