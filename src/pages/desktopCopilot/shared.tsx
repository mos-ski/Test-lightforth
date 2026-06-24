import { cn } from '@/lib/utils'

export const BG       = '#0c1d48'
export const CARD     = 'rgba(255,255,255,0.07)'
export const BORDER   = 'rgba(255,255,255,0.12)'
export const INPUT_BG = 'rgba(255,255,255,0.08)'
export const INPUT_BD = 'rgba(255,255,255,0.15)'
export const BLUE     = '#1a7aff'

export function formatTime(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
}

export function LightningLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M19 3L7 18H16L13 29L25 14H16L19 3Z" fill="#60a5fa" />
      <path d="M19 3L16 14H25L19 3Z" fill="#1a7aff" />
    </svg>
  )
}

export function MacWindow({ children, blendBar, transparency = 0 }: { children: React.ReactNode; blendBar?: boolean; transparency?: number }) {
  const bgAlpha = (100 - transparency) / 100
  const windowBg = `rgba(12, 29, 72, ${bgAlpha})`

  return (
    <div
      className="flex min-h-screen items-center justify-center p-6"
      style={{ background: 'linear-gradient(145deg, #060e22 0%, #0a1628 50%, #050c1e 100%)' }}
    >
      <div
        className="flex w-full max-w-[960px] flex-col overflow-hidden rounded-2xl shadow-2xl transition-all duration-150"
        style={{ background: windowBg, height: 700, backdropFilter: `blur(${Math.round(transparency / 10)}px)` }}
      >
        <div
          className="flex h-10 flex-shrink-0 items-center px-4"
          style={{ background: blendBar ? windowBg : `rgba(0,0,0,${0.15 * bgAlpha + 0.05})` }}
        >
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full" style={{ background: '#ff5f57' }} />
            <div className="h-3 w-3 rounded-full" style={{ background: '#ffbd2e' }} />
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}

export function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={cn('relative flex h-6 w-10 flex-shrink-0 items-center rounded-full px-0.5 transition-colors duration-200', on ? 'bg-green-500' : 'bg-white/20')}>
      <div className={cn('h-5 w-5 rounded-full bg-white shadow transition-transform duration-200', on ? 'translate-x-4' : 'translate-x-0')} />
    </button>
  )
}
