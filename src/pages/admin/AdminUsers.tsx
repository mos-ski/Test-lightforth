import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, TrendingDown, Search, Download, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'

type Period = '12m' | '30d' | '7d' | '24h'
type TabKey = 'users' | 'business' | 'corporate' | 'leads' | 'suspended' | 'archived'

interface User {
  id: string; name: string; email: string; date: string
  status: 'Active' | 'Suspended' | 'Archived'
  type: 'user' | 'business' | 'corporate' | 'lead'
  plan: 'Free' | 'Starter' | 'Pro'
}

const USERS: User[] = [
  { id: '1',  name: 'Timothy Ogundipe',  email: 'timothy.ogundipe@gmail.com',  date: '6/10/2026, 7:38 PM',  status: 'Active',    type: 'user',     plan: 'Free'    },
  { id: '2',  name: 'Kevin Jefferson',   email: 'kevjefferson01@gmail.com',     date: '6/10/2026, 7:02 PM',  status: 'Active',    type: 'user',     plan: 'Free'    },
  { id: '3',  name: 'Hannah Mbu',        email: 'ebaimbuh@yahoo.com',           date: '6/10/2026, 1:39 PM',  status: 'Active',    type: 'user',     plan: 'Starter' },
  { id: '4',  name: 'Zulukainani Lawal', email: 'lawalzulu@gmail.com',          date: '6/10/2026, 12:47 AM', status: 'Active',    type: 'user',     plan: 'Free'    },
  { id: '5',  name: 'Chisom Ukazim',     email: 'iceberg2606@gmail.com',        date: '6/10/2026, 12:25 AM', status: 'Active',    type: 'user',     plan: 'Pro'     },
  { id: '6',  name: 'Aditya Sapra',      email: 'aditya.sapra4103@gmail.com',   date: '6/9/2026, 5:02 PM',   status: 'Active',    type: 'user',     plan: 'Free'    },
  { id: '7',  name: 'Olamide Badusi',    email: 'badusimide@gmail.com',         date: '6/9/2026, 4:56 PM',   status: 'Active',    type: 'user',     plan: 'Starter' },
  { id: '8',  name: 'Bee Ade',           email: 'bummite23@gmail.com',          date: '6/9/2026, 4:45 PM',   status: 'Active',    type: 'user',     plan: 'Free'    },
  { id: '9',  name: 'Sadiya Jalal',      email: 'jalal.sadiya@gmail.com',       date: '6/9/2026, 11:46 AM',  status: 'Active',    type: 'user',     plan: 'Free'    },
  { id: '10', name: 'Adedamola Adewale', email: 'adewaledamola52@yahoo.com',    date: '1/22/2025, 10:00 AM', status: 'Active',    type: 'user',     plan: 'Pro'     },
  { id: '11', name: 'TechVentures Ltd',  email: 'admin@techventures.com',       date: '5/15/2026, 9:00 AM',  status: 'Active',    type: 'business', plan: 'Pro'     },
  { id: '12', name: 'Grace Nwachukwu',   email: 'grace.n@gmail.com',            date: '6/8/2026, 2:00 PM',   status: 'Suspended', type: 'user',     plan: 'Free'    },
  { id: '13', name: 'David Kalu',        email: 'david.k@gmail.com',            date: '6/7/2026, 11:00 AM',  status: 'Archived',  type: 'user',     plan: 'Free'    },
]

function ChangeBadge({ value }: { value: string }) {
  const isDown = value.startsWith('-')
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${isDown ? 'text-red-600' : 'text-emerald-600'}`}>
      {isDown ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
      {value}
    </span>
  )
}

function StatCard({ label, value, change }: { label: string; value: string; change: string }) {
  return (
    <div className="lf-panel p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
      <div className="mt-1.5 flex items-center gap-1.5">
        <ChangeBadge value={change} />
        <span className="text-xs text-muted-foreground">vs last month</span>
      </div>
    </div>
  )
}

const PLAN_COLORS: Record<string, string> = {
  Pro: 'bg-primary/10 text-primary',
  Starter: 'bg-violet-50 text-violet-700',
  Free: 'bg-muted text-muted-foreground',
}

const STATUS_COLORS: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-700',
  Suspended: 'bg-red-50 text-red-600',
  Archived: 'bg-muted text-muted-foreground',
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
      <div className="p-4 border-b border-border">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="lf-input pl-9 h-9"
          />
        </div>
      </div>
      <div className="lf-table-wrap rounded-none border-0">
        <table className="lf-table">
          <thead className="lf-table-head">
            <tr>
              <th className="lf-table-th">Name</th>
              <th className="lf-table-th">Email</th>
              <th className="lf-table-th hidden md:table-cell">Date</th>
              <th className="lf-table-th hidden sm:table-cell">Plan</th>
              <th className="lf-table-th">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="lf-table-cell text-center text-muted-foreground">No users found</td></tr>
            ) : filtered.map(user => (
              <tr
                key={user.id}
                className="lf-table-row cursor-pointer"
                onClick={() => navigate(`/admin/users/${user.id}`)}
              >
                <td className="lf-table-cell font-medium text-foreground">{user.name}</td>
                <td className="lf-table-cell text-muted-foreground">{user.email}</td>
                <td className="lf-table-cell hidden md:table-cell text-muted-foreground">{user.date}</td>
                <td className="lf-table-cell hidden sm:table-cell">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${PLAN_COLORS[user.plan]}`}>{user.plan}</span>
                </td>
                <td className="lf-table-cell">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[user.status]}`}>{user.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const TABS: { key: TabKey; label: string }[] = [
  { key: 'users',     label: 'Users'      },
  { key: 'business',  label: 'Businesses' },
  { key: 'corporate', label: 'Corporate'  },
  { key: 'leads',     label: 'Leads'      },
  { key: 'suspended', label: 'Suspended'  },
  { key: 'archived',  label: 'Archived'   },
]

export default function AdminUsers() {
  const [period, setPeriod] = useState<Period>('30d')
  const [tab, setTab] = useState<TabKey>('users')

  const tabData: Record<TabKey, User[]> = {
    users:     USERS.filter(u => u.type === 'user' && u.status !== 'Suspended' && u.status !== 'Archived'),
    business:  USERS.filter(u => u.type === 'business'),
    corporate: USERS.filter(u => u.type === 'corporate'),
    leads:     USERS.filter(u => u.type === 'lead'),
    suspended: USERS.filter(u => u.status === 'Suspended'),
    archived:  USERS.filter(u => u.status === 'Archived'),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="lf-page-title">Users</h1>
          <p className="lf-body mt-0.5">Check out latest updates</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Download className="h-3.5 w-3.5" />Export
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
            <UserPlus className="h-3.5 w-3.5" />Invite
          </button>
        </div>
      </div>

      {/* Time filter */}
      <div className="flex items-center gap-1.5">
        {(['12m', '30d', '7d', '24h'] as Period[]).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
              period === p ? 'bg-foreground text-white' : 'border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Users"   value="9,396" change="+2525%" />
        <StatCard label="Regular Users" value="9,395" change="+2532%" />
        <StatCard label="Business"      value="1"     change="+0%"    />
        <StatCard label="Corporate"     value="0"     change="+0%"    />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Subscribed"    value="2"     change="+100%"  />
        <StatCard label="Returning"     value="2"     change="+100%"  />
        <StatCard label="Active"        value="9,395" change="+2532%" />
        <StatCard label="Leads"         value="2"     change="+100%"  />
      </div>

      {/* Table */}
      <div className="lf-panel overflow-hidden">
        <div className="lf-tabs px-4 pt-1 gap-0">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn('lf-tab px-4 py-2.5', tab === t.key && 'lf-tab-active')}
            >
              {t.label}
            </button>
          ))}
        </div>
        <UserTable users={tabData[tab]} />
      </div>
    </div>
  )
}
