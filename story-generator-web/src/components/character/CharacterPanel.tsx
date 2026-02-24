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
  onUpdate,
}: {
  character: Character
  label: string
  genre: string
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

  if (!story) return null

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

      {/* Male & Female side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CharacterCard
          character={story.characters.male}
          label="男主"
          genre={story.world.genre}
          onUpdate={updateMale}
        />
        <CharacterCard
          character={story.characters.female}
          label="女主"
          genre={story.world.genre}
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
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// SupportingCharacterCard
// ============================================================

function SupportingCharacterCard({
  char,
  onUpdate,
  onRemove,
}: {
  char: SupportingCharacter
  onUpdate: (data: Partial<SupportingCharacter>) => void
  onRemove: () => void
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

      {/* Description */}
      <textarea
        value={char.description}
        onChange={e => onUpdate({ description: e.target.value })}
        placeholder="配角描述（背景、與主角的關聯、在故事中的作用...）"
        rows={2}
        className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm outline-none focus:border-primary resize-none"
      />
    </div>
  )
}
