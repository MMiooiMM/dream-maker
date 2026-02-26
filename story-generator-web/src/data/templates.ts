import type {
  StoryTemplate,
  ToneConfig,
  ObstacleSource,
} from '@/types'
import rawTemplates from '@shared/story-config/templates.json'
import rawOptions from '@shared/story-config/options.json'
import rawPositions from '@shared/story-config/chapter-positions.json'

// ============================================================
// Templates
// ============================================================

export const TEMPLATES: StoryTemplate[] = rawTemplates.templates as StoryTemplate[]

export function getTemplateById(id: string): StoryTemplate | undefined {
  return TEMPLATES.find(t => t.id === id)
}

// ============================================================
// Chapter Position Labels
// ============================================================

export const CHAPTER_POSITION_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(rawPositions.positions).map(([k, v]) => [k, v.labelZh])
)

// ============================================================
// World Options
// ============================================================

export const ERA_OPTIONS = rawOptions.era as { value: 'modern' | 'ancient' | 'fantasy'; label: string; icon: string }[]

export const GENRE_OPTIONS = rawOptions.genre as { value: 'wealthy' | 'campus' | 'workplace' | 'entertainment' | 'cultivation'; label: string; icon: string }[]

export const OBSTACLE_OPTIONS = rawOptions.obstacleSources as { value: ObstacleSource; label: string; icon: string }[]

// ============================================================
// Character Options
// ============================================================

export const AGE_RANGE_OPTIONS = rawOptions.ageRange as { value: string; label: string }[]

export const ROLE_OPTIONS: Record<string, { value: string; label: string }[]> = rawOptions.roles

export const ATTITUDE_OPTIONS = rawOptions.initialAttitude as { value: string; label: string; emoji: string }[]

export const TRAUMA_OPTIONS = rawOptions.coreTrauma as { value: string; label: string; emoji: string }[]

export const TRAIT_LABELS: Record<string, string> = {
  pride: '自尊',
  control: '控制欲',
  empathy: '共情',
  rationality: '理性',
  impulse: '衝動',
  attachment: '依附',
}

export const RELATIONSHIP_START_OPTIONS = rawOptions.relationshipStart as { value: string; label: string; emoji: string }[]

export const THIRD_PARTY_OPTIONS = rawOptions.thirdParty as { value: string; label: string; emoji: string }[]

export const SUPPORTING_CHARACTER_TYPE_OPTIONS = rawOptions.supportingCharacterTypes as { value: string; label: string; emoji: string }[]

// ============================================================
// Re-export raw option arrays for Tone panel usage
// ============================================================

export const ENDING_OPTIONS = rawOptions.ending as { value: ToneConfig['ending']; label: string }[]
export const WRONGDOER_OPTIONS = rawOptions.wrongdoer as { value: ToneConfig['wrongdoer']; label: string; emoji: string }[]
export const MALE_REDEMPTION_OPTIONS = rawOptions.maleRedemption as { value: ToneConfig['maleRedemption']; label: string }[]
export const FEMALE_REDEMPTION_OPTIONS = rawOptions.femaleRedemption as { value: ToneConfig['femaleRedemption']; label: string }[]
export const MALE_RETURN_OPTIONS = rawOptions.maleReturn as { value: ToneConfig['maleReturn']; label: string }[]
export const FEMALE_RETURN_OPTIONS = rawOptions.femaleReturn as { value: ToneConfig['femaleReturn']; label: string }[]

export const PAIRING_TYPE_OPTIONS = rawOptions.pairingType as { value: string; label: string; emoji: string; labels: { a: string; b: string } }[]
export const ABO_SECOND_GENDER_OPTIONS = rawOptions.aboSecondGender as { value: string; label: string; emoji: string }[]
export const ABO_SCENT_RANGE_OPTIONS = rawOptions.aboScentRange as { value: string; label: string; icon: string; description?: string }[]
export const ABO_MARK_EFFECT_OPTIONS = rawOptions.aboMarkEffect as { value: string; label: string; icon: string; description?: string }[]
export const ABO_MARK_REMOVAL_OPTIONS = rawOptions.aboMarkRemoval as { value: string; label: string; icon: string; description?: string }[]
export const ABO_FERTILITY_RULE_OPTIONS = rawOptions.aboFertilityRule as { value: string; label: string; icon: string; description?: string }[]
export const ABO_ALPHA_RANK_OPTIONS = rawOptions.aboAlphaRank as { value: string; label: string; emoji: string }[]
export const ABO_OMEGA_SENSITIVITY_OPTIONS = rawOptions.aboOmegaSensitivity as { value: string; label: string; emoji: string }[]
export const ABO_BETA_VARIANT_OPTIONS = rawOptions.aboBetaVariant as { value: string; label: string; emoji: string }[]

// Kept for backward compatibility
export type { StoryTemplate, ToneConfig }

