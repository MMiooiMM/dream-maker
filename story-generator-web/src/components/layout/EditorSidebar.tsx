import { cn } from '@/lib/utils'
import type { EditorTab } from '@/types'
import { useUIStore } from '@/stores/uiStore'
import { useStoryStore } from '@/stores/storyStore'
import { useState } from 'react'

const TABS: { id: EditorTab; label: string; icon: string; shortLabel: string }[] = [
  { id: 'template', label: '模板', shortLabel: '模板', icon: '📋' },
  { id: 'world', label: '世界觀', shortLabel: '世界', icon: '🌍' },
  { id: 'characters', label: '角色', shortLabel: '角色', icon: '👤' },
  { id: 'tone', label: '基調', shortLabel: '基調', icon: '🎭' },
  { id: 'chapters', label: '章節配置', shortLabel: '章節', icon: '📖' },
  { id: 'scenes', label: '場景', shortLabel: '場景', icon: '🎬' },
  { id: 'export', label: '匯出', shortLabel: '匯出', icon: '📤' },
]

interface EditorSidebarProps {
  mobileOpen?: boolean
  onNavigate?: () => void
}

export default function EditorSidebar({ mobileOpen = false, onNavigate }: EditorSidebarProps) {
  const activeTab = useUIStore(s => s.activeTab)
  const setActiveTab = useUIStore(s => s.setActiveTab)
  const story = useStoryStore(s => s.story)
  const [collapsed, setCollapsed] = useState(false)

  return (
    <nav
      className={cn(
        'bg-card flex flex-col py-2 transition-all duration-200 shrink-0 border-b md:border-b-0 md:border-r border-border',
        mobileOpen ? 'max-h-[70vh] opacity-100' : 'max-h-0 opacity-0 pointer-events-none md:max-h-none md:opacity-100 md:pointer-events-auto',
        collapsed ? 'md:w-14' : 'md:w-56',
        'w-full md:w-auto overflow-hidden'
      )}
      role="navigation"
      aria-label="編輯器導覽"
    >
      <div className="px-2 py-2 mb-1 flex items-center justify-between">
        {!collapsed && (
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
            設定流程
          </h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label={collapsed ? '展開側邊欄' : '收合側邊欄'}
          title={collapsed ? '展開' : '收合'}
        >
          {collapsed ? '»' : '«'}
        </button>
      </div>
      {TABS.map((tab, index) => {
        const isActive = activeTab === tab.id
        const isDisabled = !story && tab.id !== 'template'
        return (
          <button
            key={tab.id}
            onClick={() => {
              if (isDisabled) return
              setActiveTab(tab.id)
              onNavigate?.()
            }}
            disabled={isDisabled}
            aria-current={isActive ? 'page' : undefined}
            aria-label={`步驟 ${index + 1}: ${tab.label}`}
            title={collapsed ? tab.label : undefined}
            className={cn(
              'flex items-center gap-3 py-3 text-left text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring',
              collapsed ? 'px-3 justify-center' : 'px-4',
              isActive
                ? 'bg-primary/10 text-primary border-r-2 border-primary font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
              isDisabled && 'opacity-40 cursor-not-allowed'
            )}
          >
            <span className="text-lg" aria-hidden="true">{tab.icon}</span>
            {!collapsed && <span className="flex-1">{tab.label}</span>}
            {!collapsed && <span className="text-xs text-muted-foreground">{index + 1}</span>}
          </button>
        )
      })}
    </nav>
  )
}
