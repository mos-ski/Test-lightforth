import { Link } from 'react-router-dom'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  Icon: LucideIcon
  title: string
  description: string
  to: string
  active?: boolean
  badge?: string
}

export default function ActionCard({ Icon, title, description, to, active, badge }: Props) {
  return (
    <Link
      to={to}
      className={cn(
        'flex flex-col rounded-xl border p-4 transition-all hover:shadow-sm',
        active
          ? 'border-primary/40 bg-primary/5'
          : 'border-border bg-white hover:border-primary/20 hover:bg-primary/5',
      )}
    >
      <Icon
        className={cn('mb-3 h-5 w-5', active ? 'text-primary' : 'text-muted-foreground')}
      />
      <p
        className={cn(
          'mb-1.5 flex items-center gap-1 text-sm font-medium',
          active ? 'text-primary' : 'text-foreground',
        )}
      >
        {title}
        <ArrowRight className="h-3.5 w-3.5" />
        {badge && (
          <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">
            {badge}
          </span>
        )}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
    </Link>
  )
}
