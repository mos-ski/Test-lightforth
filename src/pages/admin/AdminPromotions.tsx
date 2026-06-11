import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search } from 'lucide-react'
import { useState } from 'react'

interface Coupon {
  id: string
  name: string
  discValue: string
  duration: 'Once' | 'Forever' | 'Repeating'
  validMonths: string
  code: string
  status: 'Active' | 'Inactive'
}

const COUPONS: Coupon[] = [
  { id: '1',  name: "HASSAN's funnel",   discValue: '40%',       duration: 'Once',    validMonths: '—', code: 'HASSAN40LF',     status: 'Active'   },
  { id: '2',  name: "Marc's funnel",      discValue: '40%',       duration: 'Forever', validMonths: '—', code: 'MARC40LF',       status: 'Active'   },
  { id: '3',  name: 'Valentine',          discValue: '50%',       duration: 'Once',    validMonths: '—', code: 'LIGHTFORTH50VAL', status: 'Inactive' },
  { id: '4',  name: 'Testfree',           discValue: '100%',      duration: 'Forever', validMonths: '—', code: 'FREE4LIGHT',     status: 'Inactive' },
  { id: '5',  name: "MOSKI's funnel",     discValue: '70%',       duration: 'Forever', validMonths: '—', code: 'MOSKEEE',        status: 'Inactive' },
  { id: '6',  name: 'Moski-Funnel',       discValue: '70%',       duration: 'Once',    validMonths: '—', code: 'MOSKIII',        status: 'Inactive' },
  { id: '7',  name: 'PAY-1$',            discValue: '78 (fixed)', duration: 'Once',    validMonths: '—', code: 'PAY1DOLLAR',     status: 'Inactive' },
  { id: '8',  name: 'Inactive Users',     discValue: '100%',      duration: 'Forever', validMonths: '—', code: 'HN7Ia0E',        status: 'Inactive' },
  { id: '9',  name: 'kat',               discValue: '100%',      duration: 'Once',    validMonths: '—', code: 'LVwJ3Q1',        status: 'Inactive' },
  { id: '10', name: 'VinceBug',           discValue: '100%',      duration: 'Forever', validMonths: '—', code: 'VinceBUGPOLICE25', status: 'Inactive' },
]

const total    = COUPONS.length
const active   = COUPONS.filter(c => c.status === 'Active').length
const inactive = COUPONS.filter(c => c.status === 'Inactive').length

function CouponTable({ coupons }: { coupons: Coupon[] }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 10

  const filtered = coupons.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div>
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="pl-9 h-8 text-sm"
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Coupon Name</TableHead>
            <TableHead>Disc. Value (%)</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Valid Months</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.map(c => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.name}</TableCell>
              <TableCell className="text-sm">{c.discValue}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{c.duration}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{c.validMonths}</TableCell>
              <TableCell>
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">{c.code}</code>
              </TableCell>
              <TableCell>
                <Badge variant={c.status === 'Active' ? 'default' : 'outline'} className="text-[10px]">
                  {c.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground">···</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border text-sm text-muted-foreground">
        <span>Rows per page: 10 · Page {page} of {totalPages}</span>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="h-7 text-xs" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              variant={page === i + 1 ? 'default' : 'outline'}
              size="sm"
              className="h-7 w-7 p-0 text-xs"
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button variant="outline" size="sm" className="h-7 text-xs" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      </div>
    </div>
  )
}

export default function AdminPromotions() {
  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="coupons">
            <div className="flex items-center justify-between border-b px-4 pt-1">
              <TabsList className="h-10 bg-transparent gap-0 p-0">
                {['Promotions', 'Coupons'].map(t => (
                  <TabsTrigger
                    key={t}
                    value={t.toLowerCase()}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-4 h-10 text-sm"
                  >
                    {t}
                  </TabsTrigger>
                ))}
              </TabsList>
              <Button size="sm" className="my-1">Create Coupon</Button>
            </div>

            <TabsContent value="promotions" className="mt-0">
              <div className="py-16 text-center text-sm text-muted-foreground">No promotions yet.</div>
            </TabsContent>

            <TabsContent value="coupons" className="mt-0">
              <div className="p-5">
                <h2 className="text-base font-semibold mb-4">Coupons</h2>
                <div className="flex gap-8">
                  <div><p className="text-2xl font-bold">{total}</p><p className="text-xs text-muted-foreground mt-0.5">Total Coupons</p></div>
                  <div><p className="text-2xl font-bold">{active}</p><p className="text-xs text-muted-foreground mt-0.5">Active Coupons</p></div>
                  <div><p className="text-2xl font-bold">{inactive}</p><p className="text-xs text-muted-foreground mt-0.5">Inactive Coupons</p></div>
                </div>
              </div>
              <CouponTable coupons={COUPONS} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
