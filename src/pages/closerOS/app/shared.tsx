import { cn } from '@/lib/utils'

export const BG     = '#03140d'
export const CARD   = 'rgba(16,185,129,0.07)'
export const BORDER = 'rgba(16,185,129,0.18)'
export const GREEN  = '#10b981'

export function formatTime(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
}

export function CloserLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" fill="#065f46" />
      <path d="M16 8v16M12 12.5c0-1.5 1.8-2.5 4-2.5s4 1 4 2.5-1.8 2.5-4 2.5-4 1-4 2.5 1.8 2.5 4 2.5 4-1 4-2.5" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function CloserMacWindow({ children, transparency = 0 }: { children: React.ReactNode; transparency?: number }) {
  const bgAlpha = (100 - transparency) / 100
  const windowBg = `rgba(3, 20, 13, ${bgAlpha})`

  return (
    <div
      className="flex min-h-screen items-center justify-center p-6"
      style={{ background: 'linear-gradient(145deg, #010b07 0%, #04150e 50%, #01100a 100%)' }}
    >
      <div
        className="flex w-full max-w-[960px] flex-col overflow-hidden rounded-2xl shadow-2xl transition-all duration-150"
        style={{ background: windowBg, height: 700, backdropFilter: `blur(${Math.round(transparency / 10)}px)` }}
      >
        <div className="flex h-10 flex-shrink-0 items-center px-4" style={{ background: `rgba(0,0,0,${0.15 * bgAlpha + 0.05})` }}>
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full" style={{ background: '#ff5f57' }} />
            <div className="h-3 w-3 rounded-full" style={{ background: '#ffbd2e' }} />
          </div>
        </div>
        <div className="flex flex-1 min-h-0 flex-col overflow-hidden">{children}</div>
      </div>
    </div>
  )
}

export function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={cn('relative flex h-6 w-10 flex-shrink-0 items-center rounded-full px-0.5 transition-colors duration-200', on ? 'bg-emerald-500' : 'bg-white/20')}>
      <div className={cn('h-5 w-5 rounded-full bg-white shadow transition-transform duration-200', on ? 'translate-x-4' : 'translate-x-0')} />
    </button>
  )
}
