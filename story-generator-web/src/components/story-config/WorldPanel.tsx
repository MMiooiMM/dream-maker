import { useStoryStore } from '@/stores/storyStore'
import OptionCard from '@/components/ui/OptionCard'
import SliderInput from '@/components/ui/SliderInput'
import TagSelector from '@/components/ui/TagSelector'
import { ERA_OPTIONS, GENRE_OPTIONS, OBSTACLE_OPTIONS } from '@/data/templates'
import type { Era, WorldGenre, ObstacleSource } from '@/types'

export default function WorldPanel() {
  const story = useStoryStore(s => s.story)
  const updateWorld = useStoryStore(s => s.updateWorld)

  if (!story) return null

  const { world } = story

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
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
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
        options={OBSTACLE_OPTIONS}
        selected={world.obstacleSources}
        onChange={(v) => updateWorld({ obstacleSources: v })}
      />
    </div>
  )
}
