import type { Chapter, ChapterEmotionMetrics, RhythmWarning } from '@/types'
import { getBlockById } from '@/data/blocks'

/** Calculate emotion metrics for a single chapter */
export function calculateChapterMetrics(chapter: Chapter): ChapterEmotionMetrics {
  let pleasure = 0
  let pain = 0
  let tension = 0
  let misunderstanding = 0

  for (const event of chapter.events) {
    const block = getBlockById(event.blockId)
    if (!block) continue

    const intensityMultiplier =
      event.params.intensity === 'high' ? 1.5 :
      event.params.intensity === 'medium' ? 1.0 : 0.6

    switch (block.category) {
      case 'pleasure':
        pleasure += 2.5 * intensityMultiplier
        tension += 0.5 * intensityMultiplier
        break
      case 'pain':
        pain += 2.5 * intensityMultiplier
        tension += 1.0 * intensityMultiplier
        break
      case 'misunderstanding':
        misunderstanding += 2.0 * intensityMultiplier
        pain += 1.0 * intensityMultiplier
        tension += 1.0 * intensityMultiplier
        break
      case 'truth':
        pleasure += 1.0 * intensityMultiplier
        tension += 1.5 * intensityMultiplier
        misunderstanding -= 1.5 * intensityMultiplier
        break
      case 'obstacle':
        pain += 1.0 * intensityMultiplier
        tension += 2.0 * intensityMultiplier
        break
      case 'hook':
        tension += 2.5 * intensityMultiplier
        break
      case 'relationship':
        if (event.params.effects.loveDelta && event.params.effects.loveDelta > 0) {
          pleasure += 1.5 * intensityMultiplier
        } else if (event.params.effects.trustDelta && event.params.effects.trustDelta < 0) {
          pain += 1.5 * intensityMultiplier
        }
        break
    }
  }

  return {
    pleasure: Math.min(10, Math.max(0, pleasure)),
    pain: Math.min(10, Math.max(0, pain)),
    tension: Math.min(10, Math.max(0, tension)),
    misunderstanding: Math.min(10, Math.max(0, misunderstanding)),
  }
}

/** Calculate metrics for all chapters */
export function calculateAllMetrics(chapters: Chapter[]): ChapterEmotionMetrics[] {
  return chapters.map(calculateChapterMetrics)
}

/** Detect rhythm warnings */
export function detectWarnings(chapters: Chapter[]): RhythmWarning[] {
  const warnings: RhythmWarning[] = []
  const metrics = calculateAllMetrics(chapters)
  const total = chapters.length
  if (total === 0) return warnings

  // Check: 連續3章虐度高但無爽點
  for (let i = 0; i <= total - 3; i++) {
    if (
      metrics[i].pain > 4 && metrics[i + 1]?.pain > 4 && metrics[i + 2]?.pain > 4 &&
      metrics[i].pleasure < 2 && metrics[i + 1]?.pleasure < 2 && metrics[i + 2]?.pleasure < 2
    ) {
      warnings.push({
        id: `pain-overload-${i + 1}`,
        type: 'pain-overload',
        message: `第 ${i + 1}-${i + 3} 章虐度過高且無爽點，讀者可能棄文`,
        chapterIndex: i + 1,
        severity: 'warning',
      })
    }
  }

  // Check: 誤會太短 — 建立後1章就揭露
  for (let i = 0; i <= total - 2; i++) {
    const hasMisunderstanding = chapters[i].events.some(e => e.blockId.startsWith('mis-'))
    const hasTruthNext = chapters[i + 1]?.events.some(e => e.blockId.startsWith('truth-'))
    if (hasMisunderstanding && hasTruthNext) {
      warnings.push({
        id: `short-mis-${i + 1}`,
        type: 'short-misunderstanding',
        message: `第 ${i + 1} 章建立的誤會在第 ${i + 2} 章就揭露，太短了`,
        chapterIndex: i + 1,
        severity: 'info',
      })
    }
  }

  // Check: 男主洗白過早 — 前半段的懺悔/補償過密
  const earlyWindow = Math.max(3, Math.floor(total * 0.5))
  const earlyRedemptionCount = chapters.slice(0, earlyWindow).reduce((count, ch) => {
    return count + ch.events.filter(e =>
      e.blockId === 'ple-male-kneel' ||
      (e.blockId.startsWith('ple-') && e.params.involvedCharacters.includes('male'))
    ).length
  }, 0)
  const earlyThreshold = Math.max(3, Math.ceil(earlyWindow * 0.4))
  if (earlyRedemptionCount >= earlyThreshold) {
    warnings.push({
      id: 'early-redemption',
      type: 'early-redemption',
      message: `男主洗白過早：前 ${earlyWindow} 章已有 ${earlyRedemptionCount} 個男主爽點/懺悔區塊`,
      severity: 'warning',
    })
  }

  // Check: 倒數第 2 章缺少高潮區塊
  const climaxIndex = total >= 2 ? total - 1 : null
  if (climaxIndex) {
    const ch = chapters[climaxIndex - 1]
    const hasClimaxBlock = ch.events.some(e => {
      const b = getBlockById(e.blockId)
      return b && (b.category === 'pleasure' || b.category === 'hook') && e.params.intensity === 'high'
    })
    if (!hasClimaxBlock && ch.events.length > 0) {
      warnings.push({
        id: `missing-climax-${climaxIndex}`,
        type: 'missing-climax',
        message: `第 ${climaxIndex} 章缺少高強度爽點或鉤子區塊（高潮章）`,
        chapterIndex: climaxIndex,
        severity: 'warning',
      })
    }
  }

  return warnings
}

/** Calculate misunderstanding duration spans */
export function getMisunderstandingSpans(chapters: Chapter[]): { start: number; end: number }[] {
  const spans: { start: number; end: number }[] = []
  let misStart: number | null = null

  for (let i = 0; i < chapters.length; i++) {
    const hasMis = chapters[i].events.some(e => e.blockId.startsWith('mis-'))
    const hasTruth = chapters[i].events.some(e => e.blockId.startsWith('truth-'))

    if (hasMis && misStart === null) {
      misStart = i + 1
    }
    if (hasTruth && misStart !== null) {
      spans.push({ start: misStart, end: i + 1 })
      misStart = null
    }
  }

  if (misStart !== null) {
    spans.push({ start: misStart, end: chapters.length })
  }

  return spans
}
