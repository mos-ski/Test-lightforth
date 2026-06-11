import { useState } from 'react'
import { Mail, Bell, Smartphone } from 'lucide-react'

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
  { id: '1', subject: 'New feature: Career Specialist is live',       audience: 'All Users',    channels: ['email', 'inapp'],        sentAt: 'Jun 8, 2026 · 10:00',  openRate: '61%', recipients: 2880 },
  { id: '2', subject: 'Your monthly application summary is ready',    audience: 'Paid Plan',    channels: ['email'],                 sentAt: 'Jun 1, 2026 · 09:00',  openRate: '74%', recipients: 420  },
  { id: '3', subject: "We've missed you — come back and apply",       audience: 'Inactive 30d', channels: ['email', 'push'],         sentAt: 'May 25, 2026 · 14:00', openRate: '38%', recipients: 311  },
  { id: '4', subject: 'Interview Copilot: now on mobile',             audience: 'Free Plan',    channels: ['inapp', 'push'],         sentAt: 'May 18, 2026 · 11:30', openRate: '52%', recipients: 2460 },
  { id: '5', subject: 'Exclusive upgrade offer — 30% off this week',  audience: 'Free Plan',    channels: ['email', 'inapp', 'push'], sentAt: 'May 10, 2026 · 09:00', openRate: '44%', recipients: 2460 },
]

const CHANNEL_ICON: Record<string, React.ElementType> = {
  email: Mail,
  inapp: Bell,
  push: Smartphone,
}

export default function AdminBroadcast() {
  const [audience, setAudience] = useState('all')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [channels, setChannels] = useState<Record<string, boolean>>({ email: true, inapp: false, push: false })
  const [schedule, setSchedule] = useState<'now' | 'later'>('now')
  const [sent, setSent] = useState(false)

  const toggleChannel = (ch: string) => setChannels(c => ({ ...c, [ch]: !c[ch] }))

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
    setSubject('')
    setBody('')
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Broadcast</h1>
        <p className="mt-1 text-sm text-slate-500">Send messages and announcements to your users</p>
      </div>

      <div className="flex gap-6 items-start">
        {/* Compose form */}
        <form onSubmit={handleSend} className="flex-[3] space-y-5 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-slate-700">New Message</h2>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Audience</label>
            <select
              value={audience}
              onChange={e => setAudience(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Users (2,880)</option>
              <option value="paid">Paid Plan (420)</option>
              <option value="free">Free Plan (2,460)</option>
              <option value="inactive">Inactive — 30+ days (311)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Channels</label>
            <div className="flex gap-3">
              {(['email', 'inapp', 'push'] as const).map(ch => {
                const Icon = CHANNEL_ICON[ch]
                const label = ch === 'inapp' ? 'In-App' : ch === 'push' ? 'Push' : 'Email'
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => toggleChannel(ch)}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                      channels[ch]
                        ? 'border-blue-300 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Message subject line..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Message</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={5}
              placeholder="Write your message here..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Schedule</label>
            <div className="flex gap-3">
              {(['now', 'later'] as const).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSchedule(s)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    schedule === s
                      ? 'border-blue-300 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {s === 'now' ? 'Send Now' : 'Schedule for Later'}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            {sent ? '✓ Sent!' : 'Send Message'}
          </button>
        </form>

        {/* Sent history */}
        <div className="flex-[2] space-y-3">
          <h2 className="text-sm font-semibold text-slate-700">Sent History</h2>
          {SENT.map(msg => (
            <div key={msg.id} className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
              <p className="text-sm font-medium text-slate-900 leading-snug">{msg.subject}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-500">{msg.audience}</span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500">{msg.recipients.toLocaleString()} recipients</span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-emerald-600 font-medium">{msg.openRate} opened</span>
              </div>
              <div className="flex items-center gap-2">
                {msg.channels.map(ch => {
                  const Icon = CHANNEL_ICON[ch]
                  return <Icon key={ch} className="h-3 w-3 text-slate-400" />
                })}
                <span className="text-xs text-slate-400 ml-1">{msg.sentAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
