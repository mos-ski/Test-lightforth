import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ChevronRight, ExternalLink, X, CreditCard } from 'lucide-react'

const MOCK_USERS: Record<string, {
  id: string; name: string; email: string; initials: string
  dateCreated: string; lastSeen: string; birthday: string; gender: string
  plan: string; price: string; credits: number; nextBilling: string
  phone: string; location: string; city: string; countryCode: string; postalCode: string; referralCode: string
  profileCompletion: number
  paymentMethod: string | null
  surveys: { question: string; answer: string }[]
}> = {
  '1':  {
    id: '1', name: 'Timothy Ogundipe',  email: 'timothy.ogundipe@gmail.com', initials: 'TO',
    dateCreated: '10th of June, 2026', lastSeen: '*****', birthday: 'Not available', gender: '',
    plan: 'Freemium', price: '$0.00', credits: 4, nextBilling: '10th of July, 2026',
    phone: '+234 2349065045365', location: 'Nigeria', city: 'Lagos, Lagos', countryCode: 'NG', postalCode: '200106', referralCode: 'Timothy6whnn',
    profileCompletion: 60, paymentMethod: null,
    surveys: [
      { question: "What's your dream job and why?",              answer: 'undefined – undefined' },
      { question: "What's the biggest challenge you're facing?", answer: '' },
      { question: 'How did you hear about Lightforth?',          answer: '' },
    ],
  },
  '10': {
    id: '10', name: 'Adedamola Adewale', email: 'adewaledamola52@yahoo.com', initials: 'AA',
    dateCreated: '22nd of January, 2025', lastSeen: '*****', birthday: '6th of February, 1997', gender: 'male',
    plan: 'Pro', price: '$20,000.00', credits: 51, nextBilling: '5th of July, 2026',
    phone: '+234 8012345678', location: 'Nigeria', city: 'Lagos, Lagos', countryCode: 'NG', postalCode: '100001', referralCode: 'MOSKI25',
    profileCompletion: 95, paymentMethod: 'Visa •••• 0382',
    surveys: [
      { question: "What's your dream job and why?",              answer: 'Product Manager at a global tech company' },
      { question: "What's the biggest challenge you're facing?", answer: 'Breaking into product management' },
      { question: 'How did you hear about Lightforth?',          answer: 'Twitter / X' },
    ],
  },
}

function getFallbackUser(id: string) {
  return {
    id, name: 'Unknown User', email: 'user@example.com', initials: 'U',
    dateCreated: '1st of June, 2026', lastSeen: '*****', birthday: 'Not available', gender: '',
    plan: 'Free', price: '$0.00', credits: 0, nextBilling: '—',
    phone: '—', location: '—', city: '—', countryCode: '—', postalCode: '—', referralCode: '—',
    profileCompletion: 0, paymentMethod: null,
    surveys: [],
  }
}

function AssignPlanModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-card border border-border shadow-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold">Assign Subscription Plan</h2>
          <button onClick={onClose}><X className="h-4 w-4 text-muted-foreground" /></button>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Subscription Plan <span className="text-destructive">*</span></label>
            <Select defaultValue="starter">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="starter">Starter Plan – ₦5,000/month</SelectItem>
                <SelectItem value="pro">Pro Plan – ₦20,000/month</SelectItem>
                <SelectItem value="corporate">Corporate Plan – ₦50,000/month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Billing Cycle <span className="text-destructive">*</span></label>
            <Select defaultValue="monthly">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly ($)</SelectItem>
                <SelectItem value="annual">Annual ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Reason <span className="text-muted-foreground font-normal">(Optional)</span></label>
            <Input placeholder="e.g. Promotional offer, Support compensation" />
            <p className="text-xs text-muted-foreground">Add context for audit trail and tracking purposes</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Custom End Date <span className="text-muted-foreground font-normal">(Optional)</span></label>
            <Input type="date" />
            <p className="text-xs text-muted-foreground">If not set, defaults to monthly from today</p>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" onClick={onClose}>Continue</Button>
        </div>
      </div>
    </div>
  )
}

export default function AdminUserDetail() {
  const { id } = useParams<{ id: string }>()
  const user = (id && MOCK_USERS[id]) ? MOCK_USERS[id] : getFallbackUser(id ?? '0')
  const [showAssignPlan, setShowAssignPlan] = useState(false)

  const isPaid = user.plan !== 'Freemium' && user.plan !== 'Free'

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/admin/users" className="hover:text-foreground transition-colors">Users</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium truncate">{user.id}</span>
      </div>

      {/* Profile header */}
      <Card>
        <CardContent className="pt-6 pb-5 flex flex-col items-center relative">
          <Button variant="outline" size="sm" className="absolute top-4 right-4 text-xs gap-1.5">
            Login to user's account <ExternalLink className="h-3.5 w-3.5" />
          </Button>
          <Avatar className="h-16 w-16 text-lg mb-3">
            <AvatarFallback className="bg-primary/10 text-primary font-bold">{user.initials}</AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-bold">{user.name}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
            <div className="flex gap-1.5"><span className="text-muted-foreground">Date Created:</span><span className="font-medium">{user.dateCreated}</span></div>
            <div className="flex gap-1.5"><span className="text-muted-foreground">Last Seen:</span><span className="font-medium">{user.lastSeen}</span></div>
            <div className="flex gap-1.5"><span className="text-muted-foreground">Birthday:</span><span className="font-medium">{user.birthday}</span></div>
            <div className="flex gap-1.5"><span className="text-muted-foreground">Gender:</span><span className="font-medium">{user.gender || '—'}</span></div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="details">
        <TabsList className="h-10 bg-transparent border-b border-border rounded-none w-full justify-start gap-0 p-0">
          {['User Details', 'Subscriptions'].map(t => (
            <TabsTrigger
              key={t}
              value={t === 'User Details' ? 'details' : 'subscriptions'}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-5 h-10"
            >
              {t}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* User Details */}
        <TabsContent value="details" className="mt-5 space-y-5">
          {/* Profile details */}
          <div>
            <div className="rounded-t-lg border border-border bg-muted/40 px-4 py-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Profile Details</p>
            </div>
            <Card className="rounded-t-none border-t-0">
              <CardContent className="p-0">
                {/* Profile completion */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 shrink-0">
                      <svg className="rotate-[-90deg]" viewBox="0 0 36 36" width="48" height="48">
                        <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                        <circle
                          cx="18" cy="18" r="15" fill="none"
                          stroke="hsl(var(--primary))" strokeWidth="3"
                          strokeDasharray={`${user.profileCompletion * 0.942} 100`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                        {user.profileCompletion}%
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Personal Profile Completion</p>
                      <p className="text-xs text-muted-foreground">
                        {user.profileCompletion < 80 ? 'User has not completed profile set up' : 'Profile is complete'}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">Dismiss</Button>
                </div>

                {/* Profile table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead className="hidden md:table-cell">Country Code</TableHead>
                      <TableHead className="hidden md:table-cell">Postal Code</TableHead>
                      <TableHead className="hidden lg:table-cell">Referral Code</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-sm">{user.phone}</TableCell>
                      <TableCell><Badge variant="default" className="text-[10px]">Active</Badge></TableCell>
                      <TableCell className="text-sm">{user.location}</TableCell>
                      <TableCell className="text-sm">{user.city}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{user.countryCode}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{user.postalCode}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm font-mono">{user.referralCode}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Survey */}
          <div>
            <div className="rounded-t-lg border border-border bg-muted/40 px-4 py-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Survey</p>
            </div>
            <Card className="rounded-t-none border-t-0">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question</TableHead>
                      <TableHead>Answer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.surveys.map((s, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-sm">{s.question}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{s.answer || '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Career Profile */}
          <div>
            <div className="rounded-t-lg border border-border bg-muted/40 px-4 py-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Career Profile</p>
            </div>
            <Card className="rounded-t-none border-t-0">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">S/N</TableHead>
                      <TableHead>Profile Name</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Date Created</TableHead>
                      <TableHead>Date Modified</TableHead>
                      <TableHead>Stage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-sm text-muted-foreground">
                        No career profiles found
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Subscriptions */}
        <TabsContent value="subscriptions" className="mt-5 space-y-5">
          {/* Info banner */}
          <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 flex items-start justify-between">
            <p className="text-sm text-primary">
              This user is currently on the <strong>{user.plan} plan</strong>.
              {user.nextBilling !== '—' && <> Their next billing date is <strong>{user.nextBilling}</strong>.</>}
            </p>
          </div>

          {/* Plan card */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="outline" className="mb-3 text-xs">{user.plan}_Plan</Badge>
                  <p className="text-3xl font-bold tracking-tight">
                    {user.price}<span className="text-sm font-normal text-muted-foreground ml-1">/per month</span>
                  </p>
                </div>
                {isPaid ? (
                  <div className="flex gap-2 flex-wrap justify-end">
                    <Button variant="outline" size="sm" className="text-xs gap-1">↑ Upgrade</Button>
                    <Button variant="outline" size="sm" className="text-xs gap-1">↓ Downgrade</Button>
                    <Button variant="outline" size="sm" className="text-xs gap-1">⏸ Pause</Button>
                    <Button variant="destructive" size="sm" className="text-xs gap-1">✕ Cancel</Button>
                  </div>
                ) : (
                  <Button size="sm" onClick={() => setShowAssignPlan(true)}>+ Assign Plan</Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Credits + Payment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Monthly Credits</p>
                <p className="mt-1 text-4xl font-bold">{user.credits}</p>
                <Button variant="outline" size="sm" className="mt-4 text-xs gap-1.5">
                  <CreditCard className="h-3.5 w-3.5" />Give Credits
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Payment Method</p>
                {user.paymentMethod ? (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="rounded border border-border px-2 py-1 text-xs font-bold bg-muted">VISA</div>
                      <span className="font-medium">{user.paymentMethod}</span>
                    </div>
                    {user.nextBilling !== '—' && (
                      <p className="mt-2 text-xs text-muted-foreground">Next invoice {user.nextBilling}</p>
                    )}
                    <Button variant="destructive" size="sm" className="mt-4 text-xs">Cancel Subscription</Button>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">No payment method found</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Billing history */}
          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="history">
                <div className="border-b px-4 pt-1">
                  <TabsList className="h-10 bg-transparent gap-0 p-0">
                    {['Billing History', 'Payment Methods'].map(t => (
                      <TabsTrigger
                        key={t}
                        value={t === 'Billing History' ? 'history' : 'methods'}
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-4 h-10 text-sm"
                      >
                        {t}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                <TabsContent value="history" className="mt-0">
                  <div className="flex items-center gap-3 p-4 border-b border-border">
                    <div className="relative flex-1 max-w-sm">
                      <Input placeholder="Search..." className="pl-3 h-8 text-sm" />
                    </div>
                  </div>
                  <div className="py-12 text-center text-sm text-muted-foreground">
                    No payment history available for this user.
                  </div>
                </TabsContent>
                <TabsContent value="methods" className="mt-0">
                  <div className="py-12 text-center text-sm text-muted-foreground">
                    {user.paymentMethod ? user.paymentMethod : 'No payment methods on file.'}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showAssignPlan && <AssignPlanModal onClose={() => setShowAssignPlan(false)} />}
    </div>
  )
}
