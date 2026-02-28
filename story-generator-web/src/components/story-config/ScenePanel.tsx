import { useStoryStore } from '@/stores/storyStore'
import type { SceneCharacterAssignment, SceneInteractiveObject } from '@/types'

function normalizeCharacterId(id: string): 'male' | 'female' | null {
  if (id === 'male' || id === 'female') return id
  return null
}

export default function ScenePanel() {
  const story = useStoryStore(s => s.story)
  const addScene = useStoryStore(s => s.addScene)
  const updateScene = useStoryStore(s => s.updateScene)
  const removeScene = useStoryStore(s => s.removeScene)

  if (!story) return null

  const characters = [
    { id: 'male', name: story.characters.male.name || '男主' },
    { id: 'female', name: story.characters.female.name || '女主' },
    ...(story.supportingCast ?? []).map(c => ({ id: c.id, name: c.name || '未命名配角' })),
  ]

  const updateAssignment = (sceneId: string, characterId: string, position: string) => {
    const scene = story.scenes.find(item => item.id === sceneId)
    if (!scene) return

    const existing = scene.characterAssignments.find(item => item.characterId === characterId)
    const nextAssignments: SceneCharacterAssignment[] = existing
      ? scene.characterAssignments.map(item => item.characterId === characterId ? { ...item, position } : item)
      : [...scene.characterAssignments, { characterId, position }]

    updateScene(sceneId, { characterAssignments: nextAssignments })
  }

  const addObject = (sceneId: string) => {
    const scene = story.scenes.find(item => item.id === sceneId)
    if (!scene) return

    const obj: SceneInteractiveObject = {
      id: `obj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: '',
      interaction: '',
    }

    updateScene(sceneId, { interactiveObjects: [...scene.interactiveObjects, obj] })
  }

  const updateObject = (sceneId: string, objectId: string, data: Partial<SceneInteractiveObject>) => {
    const scene = story.scenes.find(item => item.id === sceneId)
    if (!scene) return

    updateScene(sceneId, {
      interactiveObjects: scene.interactiveObjects.map(item => item.id === objectId ? { ...item, ...data } : item),
    })
  }

  const removeObject = (sceneId: string, objectId: string) => {
    const scene = story.scenes.find(item => item.id === sceneId)
    if (!scene) return

    updateScene(sceneId, {
      interactiveObjects: scene.interactiveObjects.filter(item => item.id !== objectId),
    })
  }

  return (
    <div className="px-4 py-6 sm:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">🎬 場景設定</h2>
          <p className="text-sm text-muted-foreground">定義符合世界觀的場景、角色定位與互動物件。</p>
        </div>
        <button
          onClick={() => addScene()}
          className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm"
        >
          ＋ 新增場景
        </button>
      </div>

      {story.scenes.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground bg-card">
          尚未建立場景，點擊「新增場景」開始。
        </div>
      )}

      {story.scenes.map((scene, idx) => (
        <section key={scene.id} className="rounded-lg border border-border p-5 bg-card space-y-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold">場景 {idx + 1}</h3>
            <button onClick={() => removeScene(scene.id)} className="text-xs text-destructive">刪除此場景</button>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <label className="space-y-1 text-sm">
              <span className="font-medium">場景名稱</span>
              <input
                value={scene.name}
                onChange={(e) => updateScene(scene.id, { name: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-border bg-background"
                placeholder="例：霧都議事廳"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium">世界觀契合描述</span>
              <input
                value={scene.worldviewFit}
                onChange={(e) => updateScene(scene.id, { worldviewFit: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-border bg-background"
                placeholder="例：蒸氣科技 + 貴族議會體系"
              />
            </label>
          </div>

          <label className="space-y-1 text-sm block">
            <span className="font-medium">場景內容</span>
            <textarea
              value={scene.summary}
              onChange={(e) => updateScene(scene.id, { summary: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-md border border-border bg-background"
              placeholder="描述場景氛圍、規則與可觸發衝突。"
            />
          </label>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold">角色在場景中的定位</h4>
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
                      placeholder="例：情報交換主導者 / 宴會主持 / 伏擊者"
                    />
                  </label>
                )
              })}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">可互動物件</h4>
              <button onClick={() => addObject(scene.id)} className="text-xs text-primary">＋ 新增物件</button>
            </div>
            {scene.interactiveObjects.length === 0 ? (
              <p className="text-xs text-muted-foreground">尚未新增互動物件。</p>
            ) : (
              <div className="space-y-2">
                {scene.interactiveObjects.map(obj => (
                  <div key={obj.id} className="grid md:grid-cols-[1fr_2fr_auto] gap-2">
                    <input
                      value={obj.name}
                      onChange={(e) => updateObject(scene.id, obj.id, { name: e.target.value })}
                      className="px-3 py-2 rounded-md border border-border bg-background text-sm"
                      placeholder="物件名稱（例：蒸汽密鑰）"
                    />
                    <input
                      value={obj.interaction}
                      onChange={(e) => updateObject(scene.id, obj.id, { interaction: e.target.value })}
                      className="px-3 py-2 rounded-md border border-border bg-background text-sm"
                      placeholder="互動方式（例：轉動密鑰開啟暗門）"
                    />
                    <button onClick={() => removeObject(scene.id, obj.id)} className="text-xs text-destructive">刪除</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  )
}
