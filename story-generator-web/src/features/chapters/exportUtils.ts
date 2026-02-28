import type { StoryConfig } from '@/types'
import { getBlockById, BLOCK_CATEGORY_LABELS } from '@/data/blocks'
import { CHAPTER_POSITION_LABELS } from '@/data/templates'

/** Generate human-readable 12-chapter outline */
export function generateOutline(config: StoryConfig): string {
  const lines: string[] = []
  const title = config.title || '未命名故事'

  lines.push(`# ${title}`)
  lines.push('')
  lines.push(`模板：${config.templateId}`)
  lines.push(`世界觀：${config.world.era} / ${config.world.genre}`)
  lines.push(`虐度：${config.tone.painLevel}/10 | 爽度：${config.tone.pleasureLevel}/10`)
  lines.push(`結局：${config.tone.ending}`)
  lines.push(`男主：${config.characters.male.name || '未命名'} | 女主：${config.characters.female.name || '未命名'}`)
  lines.push('')

  if ((config.scenes ?? []).length > 0) {
    lines.push('## 場景設定')
    lines.push('')
    for (const scene of config.scenes) {
      lines.push(`- **${scene.name || '未命名場景'}**｜世界觀契合：${scene.worldviewFit || '未填寫'}`)
      if (scene.summary) lines.push(`  - 內容：${scene.summary}`)
      if (scene.characterAssignments.length > 0) {
        const roles = scene.characterAssignments.map(item => `${item.characterId}：${item.position || '未設定'}`).join('；')
        lines.push(`  - 角色定位：${roles}`)
      }
      if (scene.interactiveObjects.length > 0) {
        const objects = scene.interactiveObjects.map(item => `${item.name || '未命名物件'}（${item.interaction || '互動未填'}）`).join('、')
        lines.push(`  - 互動物件：${objects}`)
      }
    }
    lines.push('')
  }

  lines.push('---')
  lines.push('')

  for (const chapter of config.chapters) {
    const posLabel = CHAPTER_POSITION_LABELS[chapter.position] ?? chapter.position
    lines.push(`## 第 ${chapter.index} 章 —— ${posLabel}`)
    lines.push('')

    if (chapter.events.length === 0) {
      lines.push('（尚無事件）')
    } else {
      for (const event of chapter.events) {
        const block = getBlockById(event.blockId)
        const catInfo = BLOCK_CATEGORY_LABELS[block?.category ?? '']
        const intensity = { low: '低', medium: '中', high: '高' }[event.params.intensity]
        lines.push(`- ${catInfo?.icon ?? '📄'} **${block?.nameZh ?? event.blockId}**（${catInfo?.label ?? ''} / 強度：${intensity}）`)
        if (event.params.hasForeshadowing) {
          lines.push(`  - 🔮 伏筆`)
        }
      }
    }

    lines.push('')
    lines.push(`> 爽: ${chapter.metrics.pleasure.toFixed(1)} | 虐: ${chapter.metrics.pain.toFixed(1)} | 緊張: ${chapter.metrics.tension.toFixed(1)}`)
    lines.push('')
  }

  return lines.join('\n')
}

/** Generate structured JSON export */
export function generateJSON(config: StoryConfig): string {
  const exportData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    story: config,
  }
  return JSON.stringify(exportData, null, 2)
}

/** Trigger file download */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
