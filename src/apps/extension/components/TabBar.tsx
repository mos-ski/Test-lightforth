export type ExtensionTab = 'boards' | 'applications'

interface TabBarProps {
  credits: number
  activeTab: ExtensionTab
  onTabChange: (tab: ExtensionTab) => void
}

export function TabBar({ credits, activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="border-b border-ext-border">
      <div className="flex items-center justify-between px-5 pb-3">
        <span className="flex items-center gap-1.5 text-sm font-bold text-ink">
          <BoltIcon />
          Lightforth Auto Apply
        </span>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-ext-row px-2.5 py-1 text-xs font-semibold text-ink">
            <BoltIcon small />
            {credits} credits
          </span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink/10 text-[10px] font-bold text-ink">
            AA
          </span>
        </div>
      </div>
      <div className="flex gap-5 px-5">
        <TabButton label="Boards" active={activeTab === 'boards'} onClick={() => onTabChange('boards')} />
        <TabButton
          label="Applications"
          active={activeTab === 'applications'}
          onClick={() => onTabChange('applications')}
        />
      </div>
    </div>
  )
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative pb-2.5 text-sm font-semibold transition-colors ${
        active ? 'text-brand' : 'text-ext-muted hover:text-ink'
      }`}
    >
      {label}
      {active && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand" />}
    </button>
  )
}

function BoltIcon({ small }: { small?: boolean }) {
  const size = small ? 10 : 14
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M7.5 1L2 8h4l-0.5 5L12 6H8l-0.5-5Z" fill="currentColor" className="text-brand" />
    </svg>
  )
}
