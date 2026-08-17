import { forwardRef, useCallback, useEffect, useState } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'

import { cn } from './cn'

type Theme = 'light' | 'dark' | 'system'

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  const stored = localStorage.getItem('lf-theme') as Theme | null
  return stored === 'light' || stored === 'dark' ? stored : 'system'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'system') {
    root.removeAttribute('data-theme')
  } else {
    root.setAttribute('data-theme', theme)
  }
}

export type ThemeSwitchProps = {
  readonly className?: string
  readonly size?: 'sm' | 'md'
}

export const ThemeSwitch = forwardRef<HTMLButtonElement, ThemeSwitchProps>(
  function ThemeSwitch({ className, size = 'md' }, ref) {
    const [theme, setTheme] = useState<Theme>(getStoredTheme)

    useEffect(() => {
      applyTheme(theme)
      localStorage.setItem('lf-theme', theme)
    }, [theme])

    const cycle = useCallback(() => {
      setTheme((prev) => {
        if (prev === 'light') return 'dark'
        if (prev === 'dark') return 'system'
        return 'light'
      })
    }, [])

    const icons: Record<Theme, React.ReactNode> = {
      light: <Sun aria-hidden="true" className={cn(size === 'sm' ? 'size-3.5' : 'size-4')} />,
      dark: <Moon aria-hidden="true" className={cn(size === 'sm' ? 'size-3.5' : 'size-4')} />,
      system: <Monitor aria-hidden="true" className={cn(size === 'sm' ? 'size-3.5' : 'size-4')} />,
    }

    const labels: Record<Theme, string> = {
      light: 'Light mode',
      dark: 'Dark mode',
      system: 'System theme',
    }

    return (
      <button
        ref={ref}
        type="button"
        data-slot="theme-switch"
        data-theme={theme}
        aria-label={labels[theme]}
        onClick={cycle}
        className={cn(
          'inline-flex items-center justify-center rounded-lg text-ink-muted transition-colors duration-normal ease-default hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
          size === 'sm' && 'size-8',
          size === 'md' && 'size-10',
          className,
        )}
      >
        {icons[theme]}
      </button>
    )
  },
)
