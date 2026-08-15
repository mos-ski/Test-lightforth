import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Instrument Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'var(--lf-accent)',
          foreground: 'var(--lf-on-accent)',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        canvas: 'var(--lf-canvas)',
        surface: 'var(--lf-surface)',
        'surface-raised': 'var(--lf-surface-raised)',
        'surface-subtle': 'var(--lf-surface-subtle)',
        ink: 'var(--lf-ink)',
        'ink-muted': 'var(--lf-ink-muted)',
        'accent-hover': 'var(--lf-accent-hover)',
        'accent-subtle': 'var(--lf-accent-subtle)',
        'accent-text': 'var(--lf-accent-text)',
        'on-accent': 'var(--lf-on-accent)',
        focus: 'var(--lf-focus)',
        positive: 'var(--lf-positive)',
        'positive-surface': 'var(--lf-positive-surface)',
        warning: 'var(--lf-warning)',
        'warning-surface': 'var(--lf-warning-surface)',
        danger: 'var(--lf-danger)',
        'danger-hover': 'var(--lf-danger-hover)',
        'danger-surface': 'var(--lf-danger-surface)',
        'on-danger': 'var(--lf-on-danger)',
        overlay: 'var(--lf-overlay)',
        'brand-bar': 'var(--lf-brand-bar)',
        'brand-bar-text': 'var(--lf-brand-bar-text)',
        success: {
          DEFAULT: '#16A34A',
          foreground: '#FFFFFF',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        soft: 'var(--lf-radius-soft)',
        panel: 'var(--lf-radius-panel)',
        pill: 'var(--lf-radius-pill)',
      },
      boxShadow: {
        panel: 'var(--lf-shadow-panel)',
        control: 'var(--lf-shadow-control)',
      },
      zIndex: {
        shell: 'var(--lf-z-shell)',
        overlay: 'var(--lf-z-overlay)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
