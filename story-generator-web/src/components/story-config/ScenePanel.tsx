import { useMemo } from 'react'
import { useStoryStore } from '@/stores/storyStore'
import { SCENE_OPTIONS_BY_GENRE, type SceneOption } from '@/data/templates'
import type { SceneCharacterAssignment, SceneConfig } from '@/types'

const ERA_LABELS = {
  modern: '現代',
  ancient: '古代',
  fantasy: '幻想',
} as const

function normalizeCharacterId(id: string): 'male' | 'female' | null {
  if (id === 'male' || id === 'female') return id
  return null
}

function createSceneFromOption(option: SceneOption, worldviewLabel: string): SceneConfig {
  return {
    id: `scene-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: option.name,
    worldviewFit: option.key,
    summary: `${worldviewLabel}｜${option.summary}`,
    characterAssignments: [],
    interactiveObjects: [],
  }
}

export default function ScenePanel() {
  const story = useStoryStore(s => s.story)
  const updateScene = useStoryStore(s => s.updateScene)
  const removeScene = useStoryStore(s => s.removeScene)
  const setScenes = useStoryStore(s => s.setScenes)

  if (!story) return null

  const sceneOptions = SCENE_OPTIONS_BY_GENRE[story.world.genre]
  const worldviewLabel = `${ERA_LABELS[story.world.era]}・${story.world.genre}`

  const characters = [
    { id: 'male', name: story.characters.male.name || '男主' },
    { id: 'female', name: story.characters.female.name || '女主' },
    ...(story.supportingCast ?? []).map(c => ({ id: c.id, name: c.name || '未命名配角' })),
  ]

  const optionMap = useMemo(
    () => Object.fromEntries(sceneOptions.map(option => [option.key, option])),
    [sceneOptions]
  )

  const generateFiveScenes = () => {
    const options = [...sceneOptions]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
    setScenes(options.map(option => createSceneFromOption(option, worldviewLabel)))
  }

  const updateAssignment = (sceneId: string, characterId: string, position: string) => {
    const scene = story.scenes.find(item => item.id === sceneId)
    if (!scene) return

    const existing = scene.characterAssignments.find(item => item.characterId === characterId)
    const nextAssignments: SceneCharacterAssignment[] = existing
      ? scene.characterAssignments.map(item => item.characterId === characterId ? { ...item, position } : item)
      : [...scene.characterAssignments, { characterId, position }]

    updateScene(sceneId, { characterAssignments: nextAssignments })
  }

  const updateSceneOption = (sceneId: string, sceneOptionKey: string) => {
    const option = optionMap[sceneOptionKey]
    if (!option) return

    updateScene(sceneId, {
      worldviewFit: option.key,
      summary: `${worldviewLabel}｜${option.summary}`,
      name: option.name,
    })
  }

  return (
    <div className="px-4 py-6 sm:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">🎬 場景設定</h2>
          <p className="text-sm text-muted-foreground">場景選項會依世界觀提供；你只要命名場景並設定角色身份。</p>
        </div>
        <button
          onClick={generateFiveScenes}
          className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm"
        >
          ⚡ 一鍵生成 5 個場景
        </button>
      </div>

      {story.scenes.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground bg-card">
          尚未建立場景，點擊「一鍵生成 5 個場景」開始。
        </div>
      )}

      {story.scenes.map((scene, idx) => {
        const selectedOption = optionMap[scene.worldviewFit] ?? sceneOptions[0]
        return (
          <section key={scene.id} className="rounded-lg border border-border p-5 bg-card space-y-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold">場景 {idx + 1}</h3>
              <button onClick={() => removeScene(scene.id)} className="text-xs text-destructive">刪除此場景</button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <label className="space-y-1 text-sm">
                <span className="font-medium">場景選項（依世界觀）</span>
                <select
                  value={selectedOption.key}
                  onChange={(e) => updateSceneOption(scene.id, e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background"
                >
                  {sceneOptions.map(option => (
                    <option key={option.key} value={option.key}>{option.name}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-medium">場景名稱</span>
                <input
                  value={scene.name}
                  onChange={(e) => updateScene(scene.id, { name: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background"
                  placeholder="例：雨夜董事會對峙"
                />
              </label>
            </div>

            <div className="rounded-md border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
              <p>世界觀描述：{scene.summary}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">角色在場景中的身份</h4>
              <div className="grid md:grid-cols-2 gap-2">
                {characters.map(char => {
                  const id = normalizeCharacterId(char.id)
                  const position = scene.characterAssignments.find(item => item.characterId === char.id)?.position ?? ''
                  return (
                    <label key={char.id} className="space-y-1 text-sm">
                      <span className="text-muted-foreground">{id === 'male' || id === 'female' ? char.name : `配角：${char.name}`}</span>
                      <input
                        value={position}
                        onChange={(e) => updateAssignment(scene.id, char.id, e.target.value)}
                        className="w-full px-3 py-2 rounded-md border border-border bg-background"
                        placeholder="例：會議主導者 / 線索持有者 / 潛伏觀察者"
                      />
                    </label>
                  )
                })}
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
