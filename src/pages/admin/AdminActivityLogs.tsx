import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type LogStatus   = 'success' | 'failed' | 'pending'
type LogCategory = 'logins' | 'applications' | 'payments' | 'admin'

interface LogEntry {
  id: string
  time: string
  user: string
  action: string
  resource: string
  ip: string
  status: LogStatus
  category: LogCategory
}

const STATUS_VARIANT: Record<LogStatus, 'default' | 'destructive' | 'secondary'> = {
  success: 'default',
  failed:  'destructive',
  pending: 'secondary',
}

const LOGS: LogEntry[] = [
  { id: '1',  time: '09:41:02', user: 'sarah.m@email.com',   action: 'Login',                 resource: 'Auth',           ip: '104.28.14.2',  status: 'success', category: 'logins'       },
  { id: '2',  time: '09:40:18', user: 'james.o@email.com',   action: 'Application Submitted', resource: 'JPMorgan Chase', ip: '198.41.22.7',  status: 'success', category: 'applications' },
  { id: '3',  time: '09:38:55', user: 'priya.s@email.com',   action: 'Payment Processed',     resource: 'Premium Plan',   ip: '203.0.113.1',  status: 'success', category: 'payments'     },
  { id: '4',  time: '09:35:12', user: 'admin@lightforth.io', action: 'Feature Flag Updated',  resource: 'Auto-Apply',     ip: '10.0.0.1',     status: 'success', category: 'admin'        },
  { id: '5',  time: '09:33:47', user: 'kevin.l@email.com',   action: 'Login Failed',          resource: 'Auth',           ip: '185.76.43.9',  status: 'failed',  category: 'logins'       },
  { id: '6',  time: '09:31:20', user: 'aisha.b@email.com',   action: 'Application Submitted', resource: 'Goldman Sachs',  ip: '162.158.0.1',  status: 'success', category: 'applications' },
  { id: '7',  time: '09:28:04', user: 'tom.w@email.com',     action: 'Payment Failed',        resource: 'Premium Plan',   ip: '104.18.2.3',   status: 'failed',  category: 'payments'     },
  { id: '8',  time: '09:24:50', user: 'admin@lightforth.io', action: 'Coupon Created',        resource: 'STUDENT30',      ip: '10.0.0.1',     status: 'success', category: 'admin'        },
  { id: '9',  time: '09:22:11', user: 'maya.r@email.com',    action: 'Login',                 resource: 'Auth',           ip: '141.101.72.1', status: 'success', category: 'logins'       },
  { id: '10', time: '09:19:38', user: 'david.k@email.com',   action: 'Application Submitted', resource: 'Citibank',       ip: '172.68.5.2',   status: 'pending', category: 'applications' },
  { id: '11', time: '09:17:02', user: 'nina.c@email.com',    action: 'Payment Processed',     resource: 'Premium Plan',   ip: '162.158.88.1', status: 'success', category: 'payments'     },
  { id: '12', time: '09:14:45', user: 'admin@lightforth.io', action: 'Broadcast Sent',        resource: 'All Users',      ip: '10.0.0.1',     status: 'success', category: 'admin'        },
  { id: '13', time: '09:12:30', user: 'leon.f@email.com',    action: 'Login',                 resource: 'Auth',           ip: '198.41.18.4',  status: 'success', category: 'logins'       },
  { id: '14', time: '09:09:14', user: 'grace.n@email.com',   action: 'Application Submitted', resource: 'Barclays',       ip: '104.26.3.1',   status: 'failed',  category: 'applications' },
  { id: '15', time: '09:07:58', user: 'admin@lightforth.io', action: 'User Suspended',        resource: 'user#4821',      ip: '10.0.0.1',     status: 'success', category: 'admin'        },
]

function LogTable({ logs }: { logs: LogEntry[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-20">Time</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Action</TableHead>
          <TableHead className="hidden md:table-cell">Resource</TableHead>
          <TableHead className="hidden lg:table-cell">IP</TableHead>
          <TableHead className="w-24">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map(log => (
          <TableRow key={log.id}>
            <TableCell className="font-mono text-xs text-muted-foreground">{log.time}</TableCell>
            <TableCell className="text-xs">{log.user}</TableCell>
            <TableCell className="font-medium">{log.action}</TableCell>
            <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{log.resource}</TableCell>
            <TableCell className="hidden lg:table-cell font-mono text-xs text-muted-foreground">{log.ip}</TableCell>
            <TableCell>
              <Badge variant={STATUS_VARIANT[log.status]} className="capitalize text-[10px]">
                {log.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function AdminActivityLogs() {
  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Activity Logs</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">System-wide event log — last 24 hours</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="all">
            <div className="border-b px-4 pt-1">
              <TabsList className="h-10 bg-transparent gap-0 p-0">
                {(['all', 'logins', 'applications', 'payments', 'admin'] as const).map(tab => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary capitalize px-4 h-10"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <TabsContent value="all" className="mt-0">
              <LogTable logs={LOGS} />
            </TabsContent>
            {(['logins', 'applications', 'payments', 'admin'] as const).map(cat => (
              <TabsContent key={cat} value={cat} className="mt-0">
                <LogTable logs={LOGS.filter(l => l.category === cat)} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
