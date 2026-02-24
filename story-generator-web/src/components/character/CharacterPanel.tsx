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
} from '@/types'
import { cn } from '@/lib/utils'
import { useState } from 'react'

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
        maxPoints={10}
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
  const [hasThirdParty, setHasThirdParty] = useState(!!story?.relationship.thirdParty)

  if (!story) return null

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

        {/* Third party toggle */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">第三人角色</label>
            <button
              onClick={() => {
                setHasThirdParty(!hasThirdParty)
                if (hasThirdParty) {
                  updateRelationship({ thirdParty: undefined })
                }
              }}
              className={cn(
                'px-3 py-1 rounded-full text-xs border transition-all',
                hasThirdParty ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              )}
            >
              {hasThirdParty ? '已啟用' : '未啟用（可選）'}
            </button>
          </div>

          {hasThirdParty && (
            <div className="space-y-3 pl-4 border-l-2 border-primary/20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {THIRD_PARTY_OPTIONS.map(opt => (
                  <OptionCard
                    key={opt.value}
                    selected={story.relationship.thirdParty?.type === opt.value}
                    onClick={() => updateRelationship({
                      thirdParty: {
                        type: opt.value as ThirdPartyType,
                        name: story.relationship.thirdParty?.name ?? '',
                      }
                    })}
                    icon={opt.emoji}
                    label={opt.label}
                    className="py-2"
                  />
                ))}
              </div>
              <input
                type="text"
                value={story.relationship.thirdParty?.name ?? ''}
                onChange={e => updateRelationship({
                  thirdParty: {
                    type: story.relationship.thirdParty?.type ?? 'white-moonlight',
                    name: e.target.value,
                  }
                })}
                placeholder="第三人姓名"
                className="w-full max-w-xs px-3 py-2 rounded-md border border-border bg-background text-sm outline-none focus:border-primary"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
