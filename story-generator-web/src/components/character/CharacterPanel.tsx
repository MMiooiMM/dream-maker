import { useStoryStore } from '@/stores/storyStore'
import OptionCard from '@/components/ui/OptionCard'
import TraitAllocator from '@/components/ui/TraitAllocator'
import ResourceBar from '@/components/ui/ResourceBar'
import {
  AGE_RANGE_OPTIONS,
  ROLE_OPTIONS,
  ATTITUDE_OPTIONS,
  TRAUMA_OPTIONS,
  RELATIONSHIP_START_OPTIONS,
  THIRD_PARTY_OPTIONS,
  SUPPORTING_CHARACTER_TYPE_OPTIONS,
  PAIRING_TYPE_OPTIONS,
  ABO_SECOND_GENDER_OPTIONS,
  ABO_ALPHA_RANK_OPTIONS,
  ABO_OMEGA_SENSITIVITY_OPTIONS,
  ABO_BETA_VARIANT_OPTIONS,
} from '@/data/templates'
import resourcesData from '@shared/story-config/resources.json'
import type {
  Character,
  AgeRange,
  CharacterRole,
  InitialAttitude,
  CoreTrauma,
  TraitAllocation,
  RelationshipStart,
  IntensityLevel,
  ThirdPartyType,
  SupportingCharacter,
  SupportingCharacterType,
  PairingType,
  AboSecondGender,
  AboAlphaRank,
  AboOmegaSensitivity,
  AboBetaVariant,
} from '@/types'
import { cn } from '@/lib/utils'

// ============================================================
// Resource impact data helpers
// ============================================================

type ImpactEntry = { nameZh: string; color: string; description: string; impact: { low: string; mid: string; high: string } }
type ResourcesJson = typeof resourcesData

function getEmotionalInfo(key: keyof ResourcesJson['emotional']): ImpactEntry {
  return resourcesData.emotional[key] as ImpactEntry
}
function getSocialInfo(key: keyof ResourcesJson['social']): ImpactEntry {
  return resourcesData.social[key] as ImpactEntry
}
function getAbilityInfo(key: keyof ResourcesJson['ability']): ImpactEntry {
  return resourcesData.ability[key] as ImpactEntry
}
const infoInfo = resourcesData.information as ImpactEntry

function CharacterCard({
  character,
  label,
  genre,
  aboEnabled,
  onUpdate,
}: {
  character: Character
  label: string
  genre: string
  aboEnabled: boolean
  onUpdate: (data: Partial<Character>) => void
}) {
  const roles = ROLE_OPTIONS[genre] ?? ROLE_OPTIONS['wealthy']

  return (
    <div className="border border-border rounded-lg p-5 space-y-5 bg-card">
      <h3 className="font-bold text-lg">{label}</h3>

      {/* Name */}
      <div className="space-y-1">
        <label className="text-sm font-medium">姓名</label>
        <input
          type="text"
          value={character.name}
          onChange={e => onUpdate({ name: e.target.value })}
          placeholder={label === '男主' ? '例：沈霆' : '例：蘇暖'}
          className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm outline-none focus:border-primary"
        />
      </div>

      {/* Nickname */}
      <div className="space-y-1">
        <label className="text-sm font-medium">綽號 <span className="text-muted-foreground font-normal">（可選）</span></label>
        <input
          type="text"
          value={character.nickname ?? ''}
          onChange={e => onUpdate({ nickname: e.target.value || undefined })}
          placeholder="例：小暖、霆爺"
          className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm outline-none focus:border-primary"
        />
      </div>

      {/* ABO Second Gender (only shown when ABO is enabled) */}
      {aboEnabled && (
        <div className="space-y-2">
          <label className="text-sm font-medium">🧬 第二性別</label>
          <div className="flex gap-2">
            {ABO_SECOND_GENDER_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => onUpdate({
                  aboSecondGender: opt.value as AboSecondGender,
                  aboAlphaRank: undefined,
                  aboOmegaSensitivity: undefined,
                  aboBetaVariant: undefined,
                })}
                className={cn(
                  'flex-1 px-2 py-1.5 rounded-md text-xs border transition-all',
                  character.aboSecondGender === opt.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-muted-foreground border-transparent hover:border-border'
                )}
              >
                {opt.emoji} {opt.label}
              </button>
            ))}
          </div>

          {character.aboSecondGender === 'alpha' && (
            <div className="space-y-1.5">
              <span className="text-xs text-muted-foreground">Alpha 強弱</span>
              <div className="flex gap-2">
                {ABO_ALPHA_RANK_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate({ aboAlphaRank: opt.value as AboAlphaRank })}
                    className={cn(
                      'flex-1 px-2 py-1.5 rounded-md text-xs border transition-all',
                      character.aboAlphaRank === opt.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted text-muted-foreground border-transparent hover:border-border'
                    )}
                  >
                    {opt.emoji} {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {character.aboSecondGender === 'omega' && (
            <div className="space-y-1.5">
              <span className="text-xs text-muted-foreground">Omega 敏感度</span>
              <div className="flex gap-2">
                {ABO_OMEGA_SENSITIVITY_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate({ aboOmegaSensitivity: opt.value as AboOmegaSensitivity })}
                    className={cn(
                      'flex-1 px-2 py-1.5 rounded-md text-xs border transition-all',
                      character.aboOmegaSensitivity === opt.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted text-muted-foreground border-transparent hover:border-border'
                    )}
                  >
                    {opt.emoji} {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {character.aboSecondGender === 'beta' && (
            <div className="space-y-1.5">
              <span className="text-xs text-muted-foreground">Beta 變體</span>
              <div className="flex gap-2">
                {ABO_BETA_VARIANT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate({ aboBetaVariant: opt.value as AboBetaVariant })}
                    className={cn(
                      'flex-1 px-2 py-1.5 rounded-md text-xs border transition-all',
                      character.aboBetaVariant === opt.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted text-muted-foreground border-transparent hover:border-border'
                    )}
                  >
                    {opt.emoji} {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Age */}
      <div className="space-y-2">
        <label className="text-sm font-medium">年齡段</label>
        <div className="grid grid-cols-2 gap-2">
          {AGE_RANGE_OPTIONS.map(opt => (
            <OptionCard
              key={opt.value}
              selected={character.ageRange === opt.value}
              onClick={() => onUpdate({ ageRange: opt.value as AgeRange })}
              label={opt.label}
              className="py-2"
            />
          ))}
        </div>
      </div>

      {/* Role */}
      <div className="space-y-2">
        <label className="text-sm font-medium">身分</label>
        <div className="grid grid-cols-2 gap-2">
          {roles.map(opt => (
            <OptionCard
              key={opt.value}
              selected={character.role === opt.value}
              onClick={() => onUpdate({ role: opt.value as CharacterRole })}
              label={opt.label}
              className="py-2"
            />
          ))}
        </div>
      </div>

      {/* Initial Attitude */}
      <div className="space-y-2">
        <label className="text-sm font-medium">初始態度</label>
        <div className="grid grid-cols-3 gap-2">
          {ATTITUDE_OPTIONS.map(opt => (
            <OptionCard
              key={opt.value}
              selected={character.initialAttitude === opt.value}
              onClick={() => onUpdate({ initialAttitude: opt.value as InitialAttitude })}
              icon={opt.emoji}
              label={opt.label}
              className="py-2"
            />
          ))}
        </div>
      </div>

      {/* Core Trauma */}
      <div className="space-y-2">
        <label className="text-sm font-medium">核心創傷</label>
        <div className="grid grid-cols-2 gap-2">
          {TRAUMA_OPTIONS.map(opt => (
            <OptionCard
              key={opt.value}
              selected={character.coreTrauma === opt.value}
              onClick={() => onUpdate({ coreTrauma: opt.value as CoreTrauma })}
              icon={opt.emoji}
              label={opt.label}
              className="py-2"
            />
          ))}
        </div>
      </div>

      {/* Traits */}
      <TraitAllocator
        traits={character.traits}
        maxPoints={20}
        onChange={(traits: TraitAllocation) => onUpdate({ traits })}
      />

      {/* Resources */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">角色資源</h4>

        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">💕 情感資源</span>
          {(['love', 'trust', 'guilt', 'obsession'] as const).map(key => {
            const info = getEmotionalInfo(key)
            return (
              <ResourceBar
                key={key}
                label={info.nameZh}
                value={character.resources.emotional[key]}
                onChange={v => onUpdate({ resources: { ...character.resources, emotional: { ...character.resources.emotional, [key]: v } } })}
                color="#ec4899"
                description={info.description}
                impactLow={info.impact.low}
                impactMid={info.impact.mid}
                impactHigh={info.impact.high}
              />
            )
          })}
        </div>

        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">👑 社會資源</span>
          {(['wealth', 'power', 'fame', 'connections'] as const).map(key => {
            const info = getSocialInfo(key)
            return (
              <ResourceBar
                key={key}
                label={info.nameZh}
                value={character.resources.social[key]}
                onChange={v => onUpdate({ resources: { ...character.resources, social: { ...character.resources.social, [key]: v } } })}
                color="#f59e0b"
                description={info.description}
                impactLow={info.impact.low}
                impactMid={info.impact.mid}
                impactHigh={info.impact.high}
              />
            )
          })}
        </div>

        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">⚡ 能力資源</span>
          {(['professional', 'action', 'intelligence'] as const).map(key => {
            const info = getAbilityInfo(key)
            return (
              <ResourceBar
                key={key}
                label={info.nameZh}
                value={character.resources.ability[key]}
                onChange={v => onUpdate({ resources: { ...character.resources, ability: { ...character.resources.ability, [key]: v } } })}
                color="#06b6d4"
                description={info.description}
                impactLow={info.impact.low}
                impactMid={info.impact.mid}
                impactHigh={info.impact.high}
              />
            )
          })}
        </div>

        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">🔍 信息資源</span>
          <ResourceBar
            label={infoInfo.nameZh}
            value={character.resources.information}
            onChange={v => onUpdate({ resources: { ...character.resources, information: v } })}
            color="#6366f1"
            description={infoInfo.description}
            impactLow={infoInfo.impact.low}
            impactMid={infoInfo.impact.mid}
            impactHigh={infoInfo.impact.high}
          />
        </div>
      </div>
    </div>
  )
}

export default function CharacterPanel() {
  const story = useStoryStore(s => s.story)
  const updateMale = useStoryStore(s => s.updateMaleCharacter)
  const updateFemale = useStoryStore(s => s.updateFemaleCharacter)
  const updateRelationship = useStoryStore(s => s.updateRelationship)
  const addSupporting = useStoryStore(s => s.addSupportingCharacter)
  const updateSupporting = useStoryStore(s => s.updateSupportingCharacter)
  const removeSupporting = useStoryStore(s => s.removeSupportingCharacter)
  const setPairingType = useStoryStore(s => s.setPairingType)

  if (!story) return null

  const pairing = story.pairingType ?? 'male-female'
  const pairingLabels = PAIRING_TYPE_OPTIONS.find(p => p.value === pairing)?.labels ?? { a: '男主', b: '女主' }
  const aboEnabled = story.aboEnabled ?? false

  const addNewSupportingCharacter = () => {
    addSupporting({
      id: `sc-${Date.now()}`,
      name: '',
      type: 'other',
      description: '',
    })
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">👤 角色設定</h2>
        <p className="text-muted-foreground">設定男主、女主的基本資訊、性格與資源</p>
      </div>

      {/* Pairing type selector */}
      <div className="border border-border rounded-lg p-4 bg-card space-y-3">
        <h3 className="font-medium text-sm">💞 配對模式</h3>
        <div className="flex gap-2 flex-wrap">
          {PAIRING_TYPE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setPairingType(opt.value as PairingType)}
              className={cn(
                'px-4 py-2 rounded-full text-sm border transition-all',
                pairing === opt.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted text-muted-foreground border-transparent hover:border-border'
              )}
            >
              {opt.emoji} {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Male & Female side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CharacterCard
          character={story.characters.male}
          label={pairingLabels.a}
          genre={story.world.genre}
          aboEnabled={aboEnabled}
          onUpdate={updateMale}
        />
        <CharacterCard
          character={story.characters.female}
          label={pairingLabels.b}
          genre={story.world.genre}
          aboEnabled={aboEnabled}
          onUpdate={updateFemale}
        />
      </div>

      {/* Relationship */}
      <div className="border border-border rounded-lg p-5 space-y-5 bg-card">
        <h3 className="font-bold text-lg">💞 關係設定</h3>

        <div className="space-y-3">
          <label className="text-sm font-medium">關係起點</label>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {RELATIONSHIP_START_OPTIONS.map(opt => (
              <OptionCard
                key={opt.value}
                selected={story.relationship.start === opt.value}
                onClick={() => updateRelationship({ start: opt.value as RelationshipStart })}
                icon={(opt as { emoji?: string }).emoji}
                label={opt.label}
                className="py-2"
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">關係張力</label>
          <div className="grid grid-cols-3 gap-2">
            {(['low', 'medium', 'high'] as IntensityLevel[]).map(level => (
              <OptionCard
                key={level}
                selected={story.relationship.tension === level}
                onClick={() => updateRelationship({ tension: level })}
                label={{ low: '低', medium: '中', high: '高' }[level]}
                className="py-2"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Supporting Cast */}
      <div className="border border-border rounded-lg p-5 space-y-5 bg-card">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">🎭 配角設定</h3>
          <button
            onClick={addNewSupportingCharacter}
            className="px-3 py-1.5 rounded-md text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            + 新增配角
          </button>
        </div>

        {(story.supportingCast ?? []).length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            尚未新增配角。第三人、助力者、反派等可在此設定。
          </p>
        )}

        <div className="space-y-4">
          {(story.supportingCast ?? []).map((char: SupportingCharacter) => (
            <SupportingCharacterCard
              key={char.id}
              char={char}
              onUpdate={(data) => updateSupporting(char.id, data)}
              onRemove={() => removeSupporting(char.id)}
              aboEnabled={aboEnabled}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Auto-generate supporting character description
// ============================================================

function generateSupportingDescription(name: string, type: SupportingCharacterType, thirdPartyRole?: ThirdPartyType): string {
  if (!name) return ''
  const typeDescriptions: Record<SupportingCharacterType, string> = {
    'third-party': thirdPartyRole === 'white-moonlight'
      ? `${name}是主角心中遙不可及的白月光，舉手投足間散發著純粹與美好，令人不自覺地仰望，卻始終無法真正擁有。`
      : thirdPartyRole === 'green-tea'
      ? `${name}表面溫柔知性，實則工於心計，善用情緒與話術在主角之間製造誤會，是一個危險的第三者。`
      : thirdPartyRole === 'supporter'
      ? `${name}是主角的好友兼助攻，洞察力強，看穿感情迷霧，在關鍵時刻推動兩人朝正確方向走。`
      : `${name}野心勃勃，以第三者身份介入主角關係，製造衝突，是故事中的反派推手。`,
    'ally': `${name}是主角堅實的後盾，危機時挺身而出，提供資源或情報，是這段感情能走下去的重要支柱。`,
    'antagonist': `${name}與主角立場對立，利用資源與手腕阻礙主角前行，是推動衝突的核心反派之一。`,
    'family': `${name}是主角的家庭成員，對感情走向有深遠影響，既是羈絆也是壓力來源。`,
    'other': `${name}在故事中扮演輔助性角色，以獨特的視角見證主角的成長與感情歷程。`,
  }
  return typeDescriptions[type] ?? `${name}是故事中的重要配角。`
}

// ============================================================
// SupportingCharacterCard
// ============================================================

function SupportingCharacterCard({
  char,
  onUpdate,
  onRemove,
  aboEnabled,
}: {
  char: SupportingCharacter
  onUpdate: (data: Partial<SupportingCharacter>) => void
  onRemove: () => void
  aboEnabled: boolean
}) {
  const isThirdParty = char.type === 'third-party'

  return (
    <div className="border border-border rounded-lg p-4 space-y-4 bg-background">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Name */}
          <input
            type="text"
            value={char.name}
            onChange={e => onUpdate({ name: e.target.value })}
            placeholder="配角姓名"
            className="px-3 py-2 rounded-md border border-border bg-background text-sm outline-none focus:border-primary"
          />
          {/* Type */}
          <div className="flex gap-1.5 flex-wrap">
            {SUPPORTING_CHARACTER_TYPE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => onUpdate({ type: opt.value as SupportingCharacterType, thirdPartyTarget: undefined, thirdPartyRole: undefined })}
                className={cn(
                  'px-2.5 py-1 rounded-full text-xs border transition-all',
                  char.type === opt.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-muted-foreground border-transparent hover:border-border'
                )}
              >
                {opt.emoji} {opt.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={onRemove}
          className="text-muted-foreground/50 hover:text-destructive transition-colors text-lg leading-none mt-1"
        >
          ×
        </button>
      </div>

      {/* Third party extras */}
      {isThirdParty && (
        <div className="space-y-3 pl-3 border-l-2 border-primary/20">
          <div className="space-y-1.5">
            <span className="text-xs text-muted-foreground">關聯對象</span>
            <div className="flex gap-2">
              {([
                { value: 'male', label: '男主的第三人' },
                { value: 'female', label: '女主的第三人' },
              ] as const).map(opt => (
                <button
                  key={opt.value}
                  onClick={() => onUpdate({ thirdPartyTarget: opt.value })}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs border transition-all',
                    char.thirdPartyTarget === opt.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted text-muted-foreground border-transparent hover:border-border'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-xs text-muted-foreground">角色定位</span>
            <div className="flex gap-2 flex-wrap">
              {THIRD_PARTY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => onUpdate({ thirdPartyRole: opt.value as ThirdPartyType })}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs border transition-all',
                    char.thirdPartyRole === opt.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted text-muted-foreground border-transparent hover:border-border'
                  )}
                >
                  {opt.emoji} {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {aboEnabled && (
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">🧬 第二性別</span>
          <div className="flex gap-2">
            {ABO_SECOND_GENDER_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => onUpdate({
                  aboSecondGender: opt.value as AboSecondGender,
                  aboAlphaRank: undefined,
                  aboOmegaSensitivity: undefined,
                  aboBetaVariant: undefined,
                })}
                className={cn(
                  'flex-1 px-2 py-1.5 rounded-md text-xs border transition-all',
                  char.aboSecondGender === opt.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-muted-foreground border-transparent hover:border-border'
                )}
              >
                {opt.emoji} {opt.label}
              </button>
            ))}
          </div>

          {char.aboSecondGender === 'alpha' && (
            <div className="space-y-1.5">
              <span className="text-xs text-muted-foreground">Alpha 強弱</span>
              <div className="flex gap-2">
                {ABO_ALPHA_RANK_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate({ aboAlphaRank: opt.value as AboAlphaRank })}
                    className={cn(
                      'flex-1 px-2 py-1.5 rounded-md text-xs border transition-all',
                      char.aboAlphaRank === opt.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted text-muted-foreground border-transparent hover:border-border'
                    )}
                  >
                    {opt.emoji} {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {char.aboSecondGender === 'omega' && (
            <div className="space-y-1.5">
              <span className="text-xs text-muted-foreground">Omega 敏感度</span>
              <div className="flex gap-2">
                {ABO_OMEGA_SENSITIVITY_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate({ aboOmegaSensitivity: opt.value as AboOmegaSensitivity })}
                    className={cn(
                      'flex-1 px-2 py-1.5 rounded-md text-xs border transition-all',
                      char.aboOmegaSensitivity === opt.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted text-muted-foreground border-transparent hover:border-border'
                    )}
                  >
                    {opt.emoji} {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {char.aboSecondGender === 'beta' && (
            <div className="space-y-1.5">
              <span className="text-xs text-muted-foreground">Beta 變體</span>
              <div className="flex gap-2">
                {ABO_BETA_VARIANT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate({ aboBetaVariant: opt.value as AboBetaVariant })}
                    className={cn(
                      'flex-1 px-2 py-1.5 rounded-md text-xs border transition-all',
                      char.aboBetaVariant === opt.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted text-muted-foreground border-transparent hover:border-border'
                    )}
                  >
                    {opt.emoji} {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Description */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">描述</span>
          <button
            onClick={() => {
              const generated = generateSupportingDescription(char.name, char.type, char.thirdPartyRole)
              if (generated) onUpdate({ description: generated })
            }}
            className="text-xs text-primary hover:underline"
            title="根據姓名與定位自動生成描述"
          >
            ✨ 自動生成描述
          </button>
        </div>
        <textarea
          value={char.description}
          onChange={e => onUpdate({ description: e.target.value })}
          placeholder="配角描述（背景、與主角的關聯、在故事中的作用...）"
          rows={2}
          className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm outline-none focus:border-primary resize-none"
        />
      </div>
    </div>
  )
}
