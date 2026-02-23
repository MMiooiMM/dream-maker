import type {
  StoryTemplate,
  TemplateChapterBlueprint,
  ToneConfig,
  WorldConfig,
} from '@/types'

// ============================================================
// 追妻火葬場 Template — Chapter Blueprint
// ============================================================

const chasingWifeChapters: TemplateChapterBlueprint[] = [
  { index: 1,  position: 'setup',         suggestedBlockCategories: ['relationship', 'obstacle'],                minEvents: 3, maxEvents: 5 },
  { index: 2,  position: 'encounter',     suggestedBlockCategories: ['relationship', 'misunderstanding'],        minEvents: 3, maxEvents: 5 },
  { index: 3,  position: 'escalation',    suggestedBlockCategories: ['relationship', 'pain', 'misunderstanding'],minEvents: 3, maxEvents: 6 },
  { index: 4,  position: 'rift',          suggestedBlockCategories: ['pain', 'misunderstanding', 'obstacle'],    minEvents: 3, maxEvents: 6 },
  { index: 5,  position: 'separation',    suggestedBlockCategories: ['pain', 'obstacle', 'hook'],                minEvents: 3, maxEvents: 6 },
  { index: 6,  position: 'abyss',         suggestedBlockCategories: ['pain', 'truth', 'obstacle'],               minEvents: 3, maxEvents: 6 },
  { index: 7,  position: 'turning-point', suggestedBlockCategories: ['truth', 'pleasure', 'hook'],               minEvents: 3, maxEvents: 6 },
  { index: 8,  position: 'chasing',       suggestedBlockCategories: ['relationship', 'pleasure', 'pain'],        minEvents: 3, maxEvents: 6 },
  { index: 9,  position: 'chasing',       suggestedBlockCategories: ['pleasure', 'relationship', 'obstacle'],    minEvents: 3, maxEvents: 6 },
  { index: 10, position: 'truth-reveal',  suggestedBlockCategories: ['truth', 'pleasure', 'pain'],               minEvents: 3, maxEvents: 6 },
  { index: 11, position: 'climax',        suggestedBlockCategories: ['pleasure', 'hook', 'truth'],               minEvents: 3, maxEvents: 6 },
  { index: 12, position: 'resolution',    suggestedBlockCategories: ['relationship', 'pleasure'],                minEvents: 3, maxEvents: 5 },
]

const chasingWifeDefaultTone: ToneConfig = {
  painLevel: 7,
  pleasureLevel: 6,
  misunderstandingIntensity: 'high',
  reversalFrequency: 'medium',
  ending: 'HE',
  maleRedemption: 'full',
  femaleReturn: 'conditional',
}

const chasingWifeDefaultWorld: WorldConfig = {
  era: 'modern',
  genre: 'wealthy',
  realismLevel: 4,
  obstacleSources: ['family', 'misunderstanding', 'power'],
}

export const TEMPLATES: StoryTemplate[] = [
  {
    id: 'chasing-wife-crematorium',
    name: 'Chasing Wife Crematorium',
    nameZh: '追妻火葬場',
    description: '男主後知後覺，女主心寒離開，男主追悔莫及的經典虐戀套路。前期虐女主，中期反轉虐男主，後期追妻火葬場。',
    chapters: chasingWifeChapters,
    defaultTone: chasingWifeDefaultTone,
    defaultWorld: chasingWifeDefaultWorld,
    blockWeights: {
      pain: 1.3,
      pleasure: 1.0,
      misunderstanding: 1.2,
      relationship: 1.0,
      truth: 1.1,
      obstacle: 0.9,
      hook: 1.0,
    },
  },
]

export function getTemplateById(id: string): StoryTemplate | undefined {
  return TEMPLATES.find(t => t.id === id)
}

// ============================================================
// Chapter Position Labels
// ============================================================

export const CHAPTER_POSITION_LABELS: Record<string, string> = {
  'setup': '鋪墊',
  'encounter': '相遇',
  'escalation': '升溫',
  'rift': '裂痕',
  'separation': '分離',
  'abyss': '深淵',
  'turning-point': '轉折',
  'eruption': '爆發',
  'chasing': '追妻',
  'truth-reveal': '真相',
  'climax': '高潮',
  'resolution': '結局',
}

// ============================================================
// World Options
// ============================================================

export const ERA_OPTIONS = [
  { value: 'modern' as const, label: '現代', icon: '🏙️' },
  { value: 'ancient' as const, label: '古代', icon: '🏯' },
  { value: 'fantasy' as const, label: '架空', icon: '✨' },
]

export const GENRE_OPTIONS = [
  { value: 'wealthy' as const, label: '豪門', icon: '💎' },
  { value: 'campus' as const, label: '校園', icon: '🎓' },
  { value: 'workplace' as const, label: '職場', icon: '💼' },
  { value: 'entertainment' as const, label: '娛樂圈', icon: '🎬' },
  { value: 'cultivation' as const, label: '修仙', icon: '⚔️' },
]

export const OBSTACLE_OPTIONS = [
  { value: 'family' as const, label: '家族', icon: '👨‍👩‍👦' },
  { value: 'public' as const, label: '輿論', icon: '📰' },
  { value: 'power' as const, label: '權勢', icon: '👑' },
  { value: 'sect-rules' as const, label: '宗門規矩', icon: '📜' },
  { value: 'illness' as const, label: '病症', icon: '🏥' },
  { value: 'misunderstanding' as const, label: '誤會', icon: '💔' },
]

// ============================================================
// Character Options
// ============================================================

export const AGE_RANGE_OPTIONS = [
  { value: '18-22' as const, label: '18-22歲' },
  { value: '23-28' as const, label: '23-28歲' },
  { value: '29-35' as const, label: '29-35歲' },
  { value: '36+' as const, label: '36歲以上' },
]

export const ROLE_OPTIONS: Record<string, { value: string; label: string }[]> = {
  wealthy: [
    { value: 'ceo', label: '總裁' },
    { value: 'heir', label: '繼承人' },
    { value: 'doctor', label: '醫生' },
    { value: 'lawyer', label: '律師' },
    { value: 'designer', label: '設計師' },
    { value: 'secretary', label: '秘書' },
  ],
  campus: [
    { value: 'heir', label: '校園風雲人物' },
    { value: 'teacher', label: '老師' },
    { value: 'designer', label: '藝術生' },
  ],
  workplace: [
    { value: 'ceo', label: '總裁' },
    { value: 'lawyer', label: '律師' },
    { value: 'doctor', label: '醫生' },
    { value: 'secretary', label: '職員' },
  ],
  entertainment: [
    { value: 'celebrity', label: '明星' },
    { value: 'ceo', label: '經紀人' },
    { value: 'designer', label: '導演' },
  ],
  cultivation: [
    { value: 'sect-heir', label: '宗門少主' },
    { value: 'soldier', label: '劍修' },
    { value: 'doctor', label: '丹師' },
  ],
}

export const ATTITUDE_OPTIONS = [
  { value: 'cold' as const, label: '冷淡', emoji: '🧊' },
  { value: 'neglect' as const, label: '忽視', emoji: '😶' },
  { value: 'possessive' as const, label: '占有', emoji: '🔒' },
  { value: 'dependent' as const, label: '依賴', emoji: '🤲' },
  { value: 'hostile' as const, label: '敵視', emoji: '⚡' },
]

export const TRAUMA_OPTIONS = [
  { value: 'abandoned' as const, label: '被拋棄', emoji: '💨' },
  { value: 'betrayed' as const, label: '背叛', emoji: '🗡️' },
  { value: 'family-control' as const, label: '家庭控制', emoji: '🔗' },
  { value: 'failure-shadow' as const, label: '失敗陰影', emoji: '🌑' },
  { value: 'trust-issues' as const, label: '信任問題', emoji: '🛡️' },
  { value: 'self-worth' as const, label: '自我價值低落', emoji: '💧' },
]

export const TRAIT_LABELS: Record<string, string> = {
  pride: '自尊',
  control: '控制欲',
  empathy: '共情',
  rationality: '理性',
  impulse: '衝動',
  attachment: '依附',
}

export const RELATIONSHIP_START_OPTIONS = [
  { value: 'married' as const, label: '已婚' },
  { value: 'dating' as const, label: '交往中' },
  { value: 'ambiguous' as const, label: '曖昧' },
  { value: 'ex' as const, label: '前任' },
  { value: 'enemy' as const, label: '仇人' },
]

export const THIRD_PARTY_OPTIONS = [
  { value: 'white-moonlight' as const, label: '白月光', emoji: '🌙' },
  { value: 'green-tea' as const, label: '綠茶', emoji: '🍵' },
  { value: 'supporter' as const, label: '助攻', emoji: '🤝' },
  { value: 'villain' as const, label: '反派', emoji: '😈' },
]
