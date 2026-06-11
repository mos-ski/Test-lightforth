import { useState } from 'react'
import { TrendingUp, TrendingDown, Download, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type Period = '12m' | '30d' | '7d' | '24h'

function ChangeBadge({ value }: { value: string }) {
  const isDown = value.startsWith('-')
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
      isDown ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
    }`}>
      {isDown ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
      {value}
    </span>
  )
}

function StatCard({ label, value, change }: { label: string; value: string; change: string }) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-1.5 text-2xl font-bold tracking-tight">{value}</p>
        <div className="mt-2 flex items-center gap-1.5">
          <ChangeBadge value={change} />
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
      </CardContent>
    </Card>
  )
}

const TRANSACTIONS = [
  { id: 'TXN-001', type: 'Subscription', amount: '$20.00',  description: 'Pro Plan – Monthly', date: 'Jun 10, 2026', status: 'Successful' },
  { id: 'TXN-002', type: 'Subscription', amount: '₦5,000',  description: 'Starter Plan – Monthly', date: 'Jun 9, 2026', status: 'Successful' },
  { id: 'TXN-003', type: 'Pay-as-you-go', amount: '$4.99',  description: 'Resume Download', date: 'Jun 9, 2026', status: 'Successful' },
  { id: 'TXN-004', type: 'Refund',        amount: '-$20.00', description: 'Pro Plan refund', date: 'Jun 8, 2026', status: 'Refunded'   },
  { id: 'TXN-005', type: 'Subscription',  amount: '$20.00',  description: 'Pro Plan – Monthly', date: 'Jun 8, 2026', status: 'Failed'    },
  { id: 'TXN-006', type: 'Subscription',  amount: '₦5,000',  description: 'Starter Plan – Monthly', date: 'Jun 7, 2026', status: 'Successful' },
]

const STATUS_VARIANT: Record<string, 'default' | 'destructive' | 'secondary' | 'outline'> = {
  Successful: 'default',
  Failed:     'destructive',
  Refunded:   'secondary',
  Pending:    'outline',
}

function TransactionTable({ rows }: { rows: typeof TRANSACTIONS }) {
  const [search, setSearch] = useState('')
  const filtered = rows.filter(r =>
    r.description.toLowerCase().includes(search.toLowerCase()) ||
    r.id.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div>
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-8 text-sm" />
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">Nothing to show yet</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-16">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(row => (
              <TableRow key={row.id}>
                <TableCell className="text-sm">{row.type}</TableCell>
                <TableCell className="font-medium tabular-nums">{row.amount}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{row.id}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{row.description}</TableCell>
                <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{row.date}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[row.status]} className="text-[10px]">{row.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-7 text-xs">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

export default function AdminRevenue() {
  const [period, setPeriod] = useState<Period>('30d')

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Revenue</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Check out latest updates</p>
        </div>
        <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5 mr-1.5" />Export</Button>
      </div>

      {/* Time filter */}
      <div className="flex items-center gap-1">
        {(['12m', '30d', '7d', '24h'] as Period[]).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              period === p
                ? 'bg-foreground text-background'
                : 'border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total Earned" value="$525,658.7" change="+3890%" />
        <StatCard label="Total Payout" value="$0"         change="+0%"    />
        <StatCard label="Total Sales"  value="168"        change="-2%"    />
        <StatCard label="Cancelled"    value="31"         change="+288%"  />
      </div>

      {/* Transactions */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Recent Transactions</h2>
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="revenue">
              <div className="border-b px-4 pt-1">
                <TabsList className="h-10 bg-transparent gap-0 p-0">
                  {['Revenue', 'Payout Requests'].map(t => (
                    <TabsTrigger
                      key={t}
                      value={t.toLowerCase().replace(' ', '-')}
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-4 h-10 text-sm"
                    >
                      {t}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              <TabsContent value="revenue" className="mt-0">
                <TransactionTable rows={TRANSACTIONS} />
              </TabsContent>
              <TabsContent value="payout-requests" className="mt-0">
                <div className="py-16 text-center text-sm text-muted-foreground">Nothing to show yet</div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
