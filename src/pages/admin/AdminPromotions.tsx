import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus } from 'lucide-react'

type PromoStatus = 'Active' | 'Expired' | 'Paused'
type PromoType = '% Discount' | 'Fixed NGN' | 'Free Month'

interface Promo {
  code: string
  type: PromoType
  value: string
  used: number
  limit: number
  expiry: string
  status: PromoStatus
}

const STATUS_VARIANT: Record<PromoStatus, 'default' | 'secondary' | 'outline'> = {
  Active:  'default',
  Expired: 'outline',
  Paused:  'secondary',
}

const PROMOS: Promo[] = [
  { code: 'LAUNCH50',  type: '% Discount', value: '50% off',      used: 312, limit: 500,  expiry: 'Jul 1, 2026',  status: 'Active'  },
  { code: 'STUDENT30', type: '% Discount', value: '30% off',      used: 841, limit: 1000, expiry: 'Dec 31, 2026', status: 'Active'  },
  { code: 'REFER20',   type: '% Discount', value: '20% off',      used: 204, limit: 0,    expiry: 'No expiry',    status: 'Active'  },
  { code: 'EARLYBIRD', type: 'Fixed NGN',  value: '₦5,000 off',   used: 500, limit: 500,  expiry: 'Mar 1, 2026',  status: 'Expired' },
  { code: 'PARTNER15', type: '% Discount', value: '15% off',      used: 78,  limit: 200,  expiry: 'Sep 30, 2026', status: 'Paused'  },
  { code: 'FREEMONTH', type: 'Free Month', value: '1 month free', used: 45,  limit: 100,  expiry: 'Jun 30, 2026', status: 'Active'  },
]

const activePromos = PROMOS.filter(p => p.status === 'Active')
const totalRedemptions = PROMOS.reduce((s, p) => s + p.used, 0)

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

export default function AdminPromotions() {
  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Promotions & Coupons</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Manage discount codes and track redemptions</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1.5" />
          New Coupon
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Active Coupons"     value={String(activePromos.length)} sub={`of ${PROMOS.length} total`} />
        <StatCard label="Total Redemptions"  value={totalRedemptions.toLocaleString()} sub="all time" />
        <StatCard label="Revenue Protected"  value="₦4.2M" sub="est. revenue retained" />
        <StatCard label="Avg Discount"       value="28%" sub="across active codes" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Used / Limit</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {PROMOS.map(p => (
                <TableRow key={p.code}>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono font-semibold">
                      {p.code}
                    </code>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.type}</TableCell>
                  <TableCell className="font-medium">{p.value}</TableCell>
                  <TableCell className="tabular-nums">
                    {p.used.toLocaleString()} / {p.limit === 0 ? '∞' : p.limit.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.expiry}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[p.status]}>{p.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-xs h-7">Edit</Button>
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
