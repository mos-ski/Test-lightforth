import { useState } from 'react'
import { Mail, Bell, Smartphone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface SentMessage {
  id: string
  subject: string
  audience: string
  channels: string[]
  sentAt: string
  openRate: string
  recipients: number
}

const SENT: SentMessage[] = [
  { id: '1', subject: 'New feature: Career Specialist is live',       audience: 'All Users',    channels: ['email', 'inapp'],         sentAt: 'Jun 8 · 10:00',  openRate: '61%', recipients: 2880 },
  { id: '2', subject: 'Your monthly application summary is ready',    audience: 'Paid Plan',    channels: ['email'],                  sentAt: 'Jun 1 · 09:00',  openRate: '74%', recipients: 420  },
  { id: '3', subject: "We've missed you — come back and apply",       audience: 'Inactive 30d', channels: ['email', 'push'],          sentAt: 'May 25 · 14:00', openRate: '38%', recipients: 311  },
  { id: '4', subject: 'Interview Copilot: now on mobile',             audience: 'Free Plan',    channels: ['inapp', 'push'],          sentAt: 'May 18 · 11:30', openRate: '52%', recipients: 2460 },
  { id: '5', subject: 'Exclusive upgrade offer — 30% off this week',  audience: 'Free Plan',    channels: ['email', 'inapp', 'push'], sentAt: 'May 10 · 09:00', openRate: '44%', recipients: 2460 },
]

const CHANNEL_ICON: Record<string, React.ElementType> = {
  email: Mail,
  inapp: Bell,
  push:  Smartphone,
}

export default function AdminBroadcast() {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [channels, setChannels] = useState({ email: true, inapp: false, push: false })
  const [schedule, setSchedule] = useState<'now' | 'later'>('now')
  const [sent, setSent] = useState(false)

  const toggleChannel = (ch: keyof typeof channels) =>
    setChannels(c => ({ ...c, [ch]: !c[ch] }))

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
    setSubject('')
    setBody('')
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Broadcast</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">Send messages and announcements to your users</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Compose */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">New Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSend} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Audience</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users (2,880)</SelectItem>
                    <SelectItem value="paid">Paid Plan (420)</SelectItem>
                    <SelectItem value="free">Free Plan (2,460)</SelectItem>
                    <SelectItem value="inactive">Inactive — 30+ days (311)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Channels</label>
                <div className="flex gap-2">
                  {(['email', 'inapp', 'push'] as const).map(ch => {
                    const Icon = CHANNEL_ICON[ch]
                    const labels = { email: 'Email', inapp: 'In-App', push: 'Push' }
                    return (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => toggleChannel(ch)}
                        className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                          channels[ch]
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border text-muted-foreground hover:border-primary/40'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {labels[ch]}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Subject</label>
                <Input
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Message subject..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  placeholder="Write your message..."
                  rows={5}
                  className="resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Schedule</label>
                <div className="flex gap-2">
                  {(['now', 'later'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSchedule(s)}
                      className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                        schedule === s
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      {s === 'now' ? 'Send Now' : 'Schedule for Later'}
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">
                {sent ? '✓ Message Sent' : 'Send Message'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sent history */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-semibold">Sent History</h2>
          {SENT.map(msg => (
            <Card key={msg.id}>
              <CardContent className="p-4 space-y-2">
                <p className="text-sm font-medium leading-snug">{msg.subject}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span>{msg.audience}</span>
                  <span>·</span>
                  <span>{msg.recipients.toLocaleString()} recipients</span>
                  <span>·</span>
                  <span className="text-emerald-600 font-medium">{msg.openRate} opened</span>
                </div>
                <div className="flex items-center gap-2">
                  {msg.channels.map(ch => {
                    const Icon = CHANNEL_ICON[ch]
                    return <Icon key={ch} className="h-3.5 w-3.5 text-muted-foreground" />
                  })}
                  <span className="text-xs text-muted-foreground ml-1">{msg.sentAt}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
