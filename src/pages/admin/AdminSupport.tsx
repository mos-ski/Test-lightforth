import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type TicketStatus   = 'Open' | 'In Progress' | 'Resolved' | 'Closed'
type TicketPriority = 'High' | 'Medium' | 'Low'

interface Ticket {
  id: string
  user: string
  subject: string
  category: string
  priority: TicketPriority
  status: TicketStatus
  created: string
}

const STATUS_VARIANT: Record<TicketStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  'Open':        'default',
  'In Progress': 'secondary',
  'Resolved':    'outline',
  'Closed':      'outline',
}

const PRIORITY_VARIANT: Record<TicketPriority, 'destructive' | 'secondary' | 'outline'> = {
  High:   'destructive',
  Medium: 'secondary',
  Low:    'outline',
}

const TICKETS: Ticket[] = [
  { id: '#1042', user: 'sarah.m@email.com',  subject: 'Resume not saving after edit',        category: 'Bug',             priority: 'High',   status: 'In Progress', created: 'Jun 10' },
  { id: '#1041', user: 'james.o@email.com',  subject: 'Payment failed but was charged twice', category: 'Billing',         priority: 'High',   status: 'Open',        created: 'Jun 10' },
  { id: '#1040', user: 'priya.s@email.com',  subject: "Can't log in — forgot password",       category: 'Account Access',  priority: 'Medium', status: 'Resolved',    created: 'Jun 9'  },
  { id: '#1039', user: 'kevin.l@email.com',  subject: 'Interview Copilot not loading on iOS', category: 'Bug',             priority: 'Medium', status: 'Open',        created: 'Jun 9'  },
  { id: '#1038', user: 'aisha.b@email.com',  subject: 'Add LinkedIn profile import',          category: 'Feature Request', priority: 'Low',    status: 'Closed',      created: 'Jun 8'  },
  { id: '#1037', user: 'tom.w@email.com',    subject: 'Application submitted to wrong job',   category: 'Bug',             priority: 'High',   status: 'Resolved',    created: 'Jun 8'  },
  { id: '#1036', user: 'maya.r@email.com',   subject: 'Upgrade to Premium not reflecting',    category: 'Billing',         priority: 'Medium', status: 'In Progress', created: 'Jun 7'  },
  { id: '#1035', user: 'david.k@email.com',  subject: 'Resume template preview broken',       category: 'Bug',             priority: 'Low',    status: 'Resolved',    created: 'Jun 7'  },
]

const open = TICKETS.filter(t => t.status === 'Open' || t.status === 'In Progress').length

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-1.5 text-2xl font-bold tracking-tight">{value}</p>
        {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  )
}

export default function AdminSupport() {
  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Support</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">User support tickets and issue tracking</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Open Tickets"      value={String(open)} sub="requiring attention" />
        <StatCard label="Avg Response Time" value="3h 12m"       sub="-18m vs last week"  />
        <StatCard label="Resolved Today"    value="1"            sub="of 4 new today"     />
        <StatCard label="CSAT Score"        value="4.6 / 5"      sub="based on 142 ratings" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="w-24">Priority</TableHead>
                <TableHead className="w-28">Status</TableHead>
                <TableHead className="hidden sm:table-cell w-20">Created</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {TICKETS.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{t.id}</TableCell>
                  <TableCell className="text-xs">{t.user}</TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">{t.subject}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{t.category}</TableCell>
                  <TableCell>
                    <Badge variant={PRIORITY_VARIANT[t.priority]} className="text-[10px]">{t.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[t.status]} className="text-[10px]">{t.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{t.created}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
