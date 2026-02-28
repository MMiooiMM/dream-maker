// ============================================================
// Core Enums & Literal Types
// ============================================================

/** 故事模板類型 */
export type TemplateId =
  | 'chasing-wife-crematorium' // 追妻火葬場
  | 'contract-marriage'        // 契約婚姻
  | 'rebirth-revenge'          // 重生復仇
  | 'entertainment-circle'     // 娛樂圈

/** 時代設定 */
export type Era = 'modern' | 'ancient' | 'fantasy'

/** 世界觀類型 */
export type WorldGenre = 'wealthy' | 'campus' | 'workplace' | 'entertainment'

/** 阻力來源 */
export type ObstacleSource =
  | 'family'       // 家族
  | 'public'       // 輿論
  | 'power'        // 權勢
  | 'sect-rules'   // 宗門規矩
  | 'illness'      // 病症
  | 'misunderstanding' // 誤會
  | 'pheromone'    // 信息素（ABO）

/** 結局類型 */
export type EndingType = 'HE' | 'BE' | 'open'

/** 男主洗白程度 */
export type RedemptionLevel = 'full' | 'partial' | 'none'

/** 回頭意願（通用，適用男女主） */
export type ReturnWillingness = 'yes' | 'no' | 'conditional'

/** 女主回頭（向下相容別名） */
export type FemaleReturn = ReturnWillingness

/** 誰做錯事 */
export type WrongdoerRole = 'male' | 'female' | 'both' | 'none'

/** 強度等級 */
export type IntensityLevel = 'low' | 'medium' | 'high'

/** 年齡段 */
export type AgeRange = '18-22' | '23-28' | '29-35' | '36+'

/** 角色身分 */
export type CharacterRole =
  | 'ceo' | 'doctor' | 'lawyer' | 'celebrity'
  | 'designer' | 'teacher' | 'heir' | 'secretary'
  | 'chairman' | 'cfo' | 'coo' | 'cto' | 'cmo'
  | 'investor' | 'banker' | 'fund-manager' | 'private-doctor'
  | 'publicist' | 'assistant' | 'bodyguard' | 'housekeeper' | 'driver'
  | 'real-estate-tycoon' | 'art-collector' | 'philanthropist' | 'finance-analyst'
  | 'class-president' | 'student-council' | 'club-president' | 'top-student'
  | 'athlete' | 'coach' | 'school-doctor' | 'counselor' | 'ta' | 'professor'
  | 'researcher' | 'exchange-student' | 'journalist' | 'photographer' | 'musician'
  | 'actor' | 'intern' | 'part-time' | 'gamer'
  | 'engineer' | 'product-manager' | 'project-manager' | 'marketer' | 'hr'
  | 'accountant' | 'sales' | 'consultant' | 'analyst' | 'data-scientist'
  | 'qa' | 'devops' | 'customer-service' | 'operations' | 'pr' | 'logistics' | 'admin'
  | 'singer' | 'idol' | 'model' | 'producer' | 'screenwriter' | 'stylist' | 'makeup-artist'
  | 'choreographer' | 'composer' | 'editor' | 'cinematographer' | 'manager' | 'agent'
  | 'host' | 'variety-director' | 'stunt' | 'stage-designer' | 'music-producer' | 'voice-actor'
  | 'alpha' | 'beta' | 'omega' // ABO 第二性別角色

/** 初始態度 */
export type InitialAttitude = 'cold' | 'neglect' | 'possessive' | 'dependent' | 'hostile'

/** 核心創傷 */
export type CoreTrauma =
  | 'abandoned'      // 被拋棄
  | 'betrayed'       // 背叛
  | 'family-control' // 家庭控制
  | 'failure-shadow' // 失敗陰影
  | 'trust-issues'   // 信任問題
  | 'self-worth'     // 自我價值低落
  | 'childhood-abuse'        // 童年創傷
  | 'emotional-manipulation' // 情感操控
  | 'replacement'            // 替代品陰影
  | 'fear-of-loss'           // 失去恐懼
  | 'perfectionism'          // 完美主義陰影
  | 'isolation'              // 社會性孤立

/** ABO 第二性別 */
export type AboSecondGender = 'alpha' | 'beta' | 'omega'

/** ABO 信息素範圍 */
export type AboScentRange = 'close' | 'room' | 'long'

/** ABO 標記效力 */
export type AboMarkEffect = 'none' | 'bond' | 'legal'

/** ABO 標記可解除 */
export type AboMarkRemoval = 'removable' | 'medical' | 'permanent'

/** ABO 生育條件 */
export type AboFertilityRule = 'mark-required' | 'heat-only' | 'assisted'

/** ABO Alpha 強弱分級 */
export type AboAlphaRank = 'strong' | 'mid' | 'weak'

/** ABO Omega 敏感度 */
export type AboOmegaSensitivity = 'high' | 'mid' | 'low'

/** ABO Beta 變體 */
export type AboBetaVariant = 'neutral' | 'low-sensitive' | 'exception'

/** 配對模式 */
export type PairingType = 'male-female' | 'male-male' | 'gender-swap'

/** 性格特質 */
export type TraitName = 'pride' | 'control' | 'empathy' | 'rationality' | 'impulse' | 'attachment'

/** 關係起點 */
export type RelationshipStart =
  | 'strangers'         // 陌生人（尚未認識）
  | 'acquaintance'      // 點頭之交
  | 'childhood-friends' // 青梅竹馬
  | 'arranged'          // 奉命成婚
  | 'married'           // 已婚
  | 'dating'            // 交往中
  | 'ambiguous'         // 曖昧
  | 'ex'                // 前任
  | 'enemy'             // 仇人

/** 第三人類型 */
export type ThirdPartyType = 'white-moonlight' | 'green-tea' | 'supporter' | 'villain'

/** 配角類型 */
export type SupportingCharacterType = 'third-party' | 'ally' | 'antagonist' | 'family' | 'other'

/** 配角設定 */
export interface SupportingCharacter {
  id: string
  name: string
  type: SupportingCharacterType
  /** 配角身分（職業/身份） */
  identity?: CharacterRole
  /** 與哪位主角有初始關係 */
  initialRelationTarget?: 'male' | 'female'
  /** 與主角的初始關係描述 */
  initialRelation?: string
  /** 第三人時：關聯的主角 */
  thirdPartyTarget?: 'male' | 'female'
  /** 第三人時：角色定位 */
  thirdPartyRole?: ThirdPartyType
  /** ABO 第二性別（可選） */
  aboSecondGender?: AboSecondGender
  /** ABO Alpha 強弱（可選） */
  aboAlphaRank?: AboAlphaRank
  /** ABO Omega 敏感度（可選） */
  aboOmegaSensitivity?: AboOmegaSensitivity
  /** ABO Beta 變體（可選） */
  aboBetaVariant?: AboBetaVariant
  description: string
}

/** 公開程度 */
export type PublicLevel = 'private' | 'semi-public' | 'public'

/** 事件區塊分類 */
export type BlockCategory =
  | 'relationship'       // 關係事件
  | 'misunderstanding'   // 誤會事件
  | 'pleasure'           // 爽點事件
  | 'pain'               // 虐點事件
  | 'truth'              // 真相事件
  | 'obstacle'           // 阻礙事件
  | 'hook'               // 章尾鉤子

/** 章節定位 */
export type ChapterPosition =
  | 'setup'          // 鋪墊
  | 'encounter'      // 相遇
  | 'escalation'     // 升溫
  | 'rift'           // 裂痕
  | 'separation'     // 分離
  | 'abyss'          // 深淵
  | 'turning-point'  // 轉折
  | 'eruption'       // 爆發
  | 'chasing'        // 追妻
  | 'truth-reveal'   // 真相
  | 'climax'         // 高潮
  | 'resolution'     // 結局

// ============================================================
// Core Data Structures
// ============================================================

/** 世界觀設定 */
export interface WorldConfig {
  era: Era
  genre: WorldGenre
  realismLevel: number          // 1-10, 寫實 ↔ 狗血
  obstacleSources: ObstacleSource[]
}

/** ABO 世界觀參數 */
export interface AboWorldConfig {
  scentRange: AboScentRange
  markEffect: AboMarkEffect
  markRemoval: AboMarkRemoval
  fertilityRule: AboFertilityRule
  malePregnancy: boolean
}

/** 故事基調 */
export interface ToneConfig {
  painLevel: number              // 虐度 1-10
  pleasureLevel: number          // 爽度 1-10
  misunderstandingIntensity: IntensityLevel
  reversalFrequency: IntensityLevel
  ending: EndingType
  wrongdoer: WrongdoerRole       // 誰做錯事
  maleRedemption: RedemptionLevel   // 男主洗白程度
  femaleRedemption: RedemptionLevel // 女主洗白程度
  maleReturn: ReturnWillingness     // 男主是否回頭
  femaleReturn: FemaleReturn        // 女主是否回頭
}

/** 性格特質分配 */
export type TraitAllocation = Record<TraitName, number>

/** 情感資源 */
export interface EmotionalResources {
  love: number       // 0-5
  trust: number      // 0-5
  guilt: number      // 0-5
  obsession: number  // 0-5
}

/** 社會資源 */
export interface SocialResources {
  wealth: number     // 0-5
  power: number      // 0-5
  fame: number       // 0-5
  connections: number // 0-5
}

/** 能力資源 */
export interface AbilityResources {
  professional: number // 0-5
  action: number       // 0-5
  intelligence: number // 0-5
}

/** 角色資源 */
export interface CharacterResources {
  emotional: EmotionalResources
  social: SocialResources
  ability: AbilityResources
  information: number  // 0-5, 掌握真相程度
}

/** 角色設定 */
export interface Character {
  id: string
  name: string
  nickname?: string             // 綽號（可選）
  ageRange: AgeRange
  role: CharacterRole
  initialAttitude: InitialAttitude
  coreTrauma: CoreTrauma
  aboSecondGender?: AboSecondGender  // ABO 世界觀第二性別
  aboAlphaRank?: AboAlphaRank        // Alpha 強弱
  aboOmegaSensitivity?: AboOmegaSensitivity // Omega 敏感度
  aboBetaVariant?: AboBetaVariant    // Beta 變體
  traits: TraitAllocation
  resources: CharacterResources
}

/** 角色關係 */
export interface RelationshipConfig {
  start: RelationshipStart
  tension: IntensityLevel
}

/** 事件區塊效果 */
export interface BlockEffects {
  trustDelta?: number
  guiltDelta?: number
  fameDelta?: number
  obsessionDelta?: number
  loveDelta?: number
  powerDelta?: number
}

/** 事件區塊定義（靜態庫中的定義） */
export interface EventBlockDefinition {
  id: string
  name: string
  nameZh: string
  category: BlockCategory
  description: string
  /** 適用世界類型（省略代表通用） */
  worldGenres?: WorldGenre[]
  defaultIntensity: IntensityLevel
  defaultEffects: BlockEffects
  /** 建議放置的章節位置 (early=1-4, mid=5-8, late=9-12) */
  suggestedPhase: ('early' | 'mid' | 'late')[]
  /** 前置條件：需要前面章節有哪些區塊才能放入 */
  prerequisites?: string[]
  /** 單個故事可使用上限（省略代表無限制） */
  maxUsagesPerStory?: number
}

/** 事件區塊實例（放入章節後的實例） */
export interface EventBlockInstance {
  instanceId: string
  blockId: string
  params: {
    involvedCharacters: ('male' | 'female' | 'third-party')[]
    intensity: IntensityLevel
    publicLevel: PublicLevel
    effects: BlockEffects
    hasForeshadowing: boolean
  }
}

/** 章節情緒指標 */
export interface ChapterEmotionMetrics {
  pleasure: number    // 0-10
  pain: number        // 0-10
  tension: number     // 0-10
  misunderstanding: number  // 0-10
}

/** 章節定義 */
export interface Chapter {
  index: number  // 1-12
  position: ChapterPosition
  events: EventBlockInstance[]
  metrics: ChapterEmotionMetrics
}

/** 模板預設章節定位 */
export interface TemplateChapterBlueprint {
  index: number
  position: ChapterPosition
  suggestedBlockCategories: BlockCategory[]
  minEvents: number
  maxEvents: number
}

/** 故事模板定義 */
export interface StoryTemplate {
  id: TemplateId
  name: string
  nameZh: string
  description: string
  chapters: TemplateChapterBlueprint[]
  defaultTone: ToneConfig
  defaultWorld: WorldConfig
  blockWeights: Partial<Record<BlockCategory, number>>
}

/** 故事設定（完整） */
export interface StoryConfig {
  id: string
  title: string
  templateId: TemplateId
  world: WorldConfig
  tone: ToneConfig
  pairingType: PairingType       // 配對模式
  aboEnabled: boolean            // 是否啟用 ABO 世界觀設定
  abo: AboWorldConfig            // ABO 世界觀參數
  characters: {
    male: Character
    female: Character
  }
  relationship: RelationshipConfig
  supportingCast: SupportingCharacter[]
  chapters: Chapter[]
  chapterCount: number           // 目標章節總數（至少 12，可到 30+）
  createdAt: string
  updatedAt: string
}

// ============================================================
// UI State Types
// ============================================================

/** 編輯器頁面 */
export type EditorTab = 'template' | 'world' | 'characters' | 'tone' | 'chapters' | 'export'

/** 節奏警告 */
export interface RhythmWarning {
  id: string
  type: 'pain-overload' | 'short-misunderstanding' | 'early-redemption' | 'missing-climax' | 'custom'
  message: string
  chapterIndex?: number
  severity: 'info' | 'warning' | 'error'
}

/** 匯出格式 */
export type ExportFormat = 'outline' | 'json' | 'image'
