import { TEMPLATES } from '@/data/templates'
import { useStoryStore } from '@/stores/storyStore'
import { useUIStore } from '@/stores/uiStore'
import OptionCard from '@/components/ui/OptionCard'
import type { TemplateId } from '@/types'

export default function TemplatePanel() {
  const story = useStoryStore(s => s.story)
  const createNewStory = useStoryStore(s => s.createNewStory)
  const setActiveTab = useUIStore(s => s.setActiveTab)

  const handleSelect = (id: TemplateId) => {
    createNewStory(id)
    setActiveTab('world')
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">選擇故事模板</h2>
        <p className="text-muted-foreground">每個模板都有預設的節奏、事件和角色配置</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATES.map(template => (
          <OptionCard
            key={template.id}
            selected={story?.templateId === template.id}
            onClick={() => handleSelect(template.id)}
            icon="🔥"
            label={template.nameZh}
            description={template.description}
            className="min-h-[120px]"
          />
        ))}
        {/* Placeholder for future templates */}
        {['契約婚姻', '重生復仇', '娛樂圈虐戀', '修仙虐戀'].map(name => (
          <OptionCard
            key={name}
            selected={false}
            onClick={() => {}}
            disabled
            icon="🔒"
            label={name}
            description="即將推出"
            className="min-h-[120px]"
          />
        ))}
      </div>
    </div>
  )
}
