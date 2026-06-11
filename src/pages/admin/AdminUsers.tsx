import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TrendingUp, TrendingDown, Search, Download, UserPlus } from 'lucide-react'

type Period = '12m' | '30d' | '7d' | '24h'

interface User {
  id: string
  name: string
  email: string
  date: string
  status: 'Active' | 'Suspended' | 'Archived'
  type: 'user' | 'business' | 'corporate' | 'lead'
  plan: 'Free' | 'Starter' | 'Pro'
}

const USERS: User[] = [
  { id: '1',  name: 'Timothy Ogundipe',   email: 'timothy.ogundipe@gmail.com',  date: '6/10/2026, 7:38 PM',  status: 'Active',    type: 'user',     plan: 'Free'    },
  { id: '2',  name: 'Kevin Jefferson',    email: 'kevjefferson01@gmail.com',     date: '6/10/2026, 7:02 PM',  status: 'Active',    type: 'user',     plan: 'Free'    },
  { id: '3',  name: 'Hannah Mbu',         email: 'ebaimbuh@yahoo.com',           date: '6/10/2026, 1:39 PM',  status: 'Active',    type: 'user',     plan: 'Starter' },
  { id: '4',  name: 'Zulukainani Lawal',  email: 'lawalzulu@gmail.com',          date: '6/10/2026, 12:47 AM', status: 'Active',    type: 'user',     plan: 'Free'    },
  { id: '5',  name: 'Chisom Ukazim',      email: 'iceberg2606@gmail.com',        date: '6/10/2026, 12:25 AM', status: 'Active',    type: 'user',     plan: 'Pro'     },
  { id: '6',  name: 'Aditya Sapra',       email: 'aditya.sapra4103@gmail.com',   date: '6/9/2026, 5:02 PM',   status: 'Active',    type: 'user',     plan: 'Free'    },
  { id: '7',  name: 'Olamide Badusi',     email: 'badusimide@gmail.com',         date: '6/9/2026, 4:56 PM',   status: 'Active',    type: 'user',     plan: 'Starter' },
  { id: '8',  name: 'Bee Ade',            email: 'bummite23@gmail.com',          date: '6/9/2026, 4:45 PM',   status: 'Active',    type: 'user',     plan: 'Free'    },
  { id: '9',  name: 'Sadiya Jalal',       email: 'jalal.sadiya@gmail.com',       date: '6/9/2026, 11:46 AM',  status: 'Active',    type: 'user',     plan: 'Free'    },
  { id: '10', name: 'Adedamola Adewale',  email: 'adewaledamola52@yahoo.com',    date: '1/22/2025, 10:00 AM', status: 'Active',    type: 'user',     plan: 'Pro'     },
  { id: '11', name: 'TechVentures Ltd',   email: 'admin@techventures.com',       date: '5/15/2026, 9:00 AM',  status: 'Active',    type: 'business', plan: 'Pro'     },
  { id: '12', name: 'Grace Nwachukwu',    email: 'grace.n@gmail.com',            date: '6/8/2026, 2:00 PM',   status: 'Suspended', type: 'user',     plan: 'Free'    },
  { id: '13', name: 'David Kalu',         email: 'david.k@gmail.com',            date: '6/7/2026, 11:00 AM',  status: 'Archived',  type: 'user',     plan: 'Free'    },
]

function ChangeBadge({ value, label }: { value: string; label?: string }) {
  const isPositive = value.startsWith('+')
  const isNegative = value.startsWith('-')
  return (
    <div className={`flex items-center gap-1 text-xs font-medium mt-1 ${isPositive ? 'text-emerald-600' : isNegative ? 'text-red-500' : 'text-muted-foreground'}`}>
      {isPositive ? <TrendingUp className="h-3 w-3" /> : isNegative ? <TrendingDown className="h-3 w-3" /> : null}
      <span>{value}</span>
      {label && <span className="font-normal text-muted-foreground">{label}</span>}
    </div>
  )
}

function StatCard({ label, value, change }: { label: string; value: string; change: string }) {
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
        <ChangeBadge value={change} label=" vs last month" />
      </CardContent>
    </Card>
  )
}

const PLAN_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  Pro: 'default', Starter: 'secondary', Free: 'outline',
}

function UserTable({ users }: { users: User[] }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-8 text-sm"
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead className="hidden sm:table-cell">Plan</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map(user => (
            <TableRow
              key={user.id}
              className="cursor-pointer"
              onClick={() => navigate(`/admin/users/${user.id}`)}
            >
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{user.date}</TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge variant={PLAN_VARIANT[user.plan]} className="text-[10px]">{user.plan}</Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={user.status === 'Active' ? 'default' : user.status === 'Suspended' ? 'destructive' : 'outline'}
                  className="text-[10px]"
                >
                  {user.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default function AdminUsers() {
  const [period, setPeriod] = useState<Period>('30d')

  const allUsers      = USERS.filter(u => u.type === 'user')
  const businesses    = USERS.filter(u => u.type === 'business')
  const suspended     = USERS.filter(u => u.status === 'Suspended')
  const archived      = USERS.filter(u => u.status === 'Archived')

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Check out latest updates</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5 mr-1.5" />Export</Button>
          <Button size="sm"><UserPlus className="h-3.5 w-3.5 mr-1.5" />Invite</Button>
        </div>
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
        <StatCard label="Total Users"    value="9,396" change="+2525%" />
        <StatCard label="Regular Users"  value="9,395" change="+2532%" />
        <StatCard label="Business"       value="1"     change="+0%"    />
        <StatCard label="Corporate"      value="0"     change="+0%"    />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Subscribed"     value="2"     change="+100%"  />
        <StatCard label="Returning"      value="2"     change="+100%"  />
        <StatCard label="Active"         value="9,395" change="+2532%" />
        <StatCard label="Leads"          value="2"     change="+100%"  />
      </div>

      {/* User table with tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="users">
            <div className="border-b px-4 pt-1">
              <TabsList className="h-10 bg-transparent gap-0 p-0">
                {[
                  { value: 'users',     label: 'Users'     },
                  { value: 'business',  label: 'Businesses' },
                  { value: 'corporate', label: 'Corporate'  },
                  { value: 'leads',     label: 'Leads'      },
                  { value: 'suspended', label: 'Suspended'  },
                  { value: 'archived',  label: 'Archived'   },
                ].map(tab => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-4 h-10 text-sm"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <TabsContent value="users"     className="mt-0"><UserTable users={allUsers} /></TabsContent>
            <TabsContent value="business"  className="mt-0"><UserTable users={businesses} /></TabsContent>
            <TabsContent value="corporate" className="mt-0"><UserTable users={[]} /></TabsContent>
            <TabsContent value="leads"     className="mt-0"><UserTable users={[]} /></TabsContent>
            <TabsContent value="suspended" className="mt-0"><UserTable users={suspended} /></TabsContent>
            <TabsContent value="archived"  className="mt-0"><UserTable users={archived} /></TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
