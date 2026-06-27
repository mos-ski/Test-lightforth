import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { toast } from 'sonner'
import { updateOrg } from './mockOrg'
import type { SalesDashboardContext } from './SalesAdminLayout'

export default function Settings() {
  const { adminEmail, org, refresh } = useOutletContext<SalesDashboardContext>()
  const admin = org.members.find(m => m.role === 'admin')

  const [orgName, setOrgName] = useState(org.orgName)
  const [adminName, setAdminName] = useState(admin?.name ?? '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  function saveProfile() {
    updateOrg(adminEmail, current => ({
      ...current,
      orgName,
      members: current.members.map(m => (m.role === 'admin' ? { ...m, name: adminName } : m)),
    }))
    refresh()
    toast.success('Profile updated')
  }

  function changePassword() {
    if (!currentPassword || !newPassword || newPassword !== confirmPassword) {
      toast.error('Check your password fields and try again')
      return
    }
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    toast.success('Password updated')
  }

  return (
    <div className="mx-auto max-w-3xl px-10 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      <p className="mt-1 text-sm text-slate-500">Manage your profile and security.</p>

      <section className="mt-8 lf-panel p-6">
        <h2 className="lf-section-title">Profile</h2>
        <div className="mt-5 space-y-4">
          <div>
            <label className="lf-label mb-1.5 block">Company name</label>
            <input value={orgName} onChange={e => setOrgName(e.target.value)} className="lf-input" />
          </div>
          <div>
            <label className="lf-label mb-1.5 block">Your name</label>
            <input value={adminName} onChange={e => setAdminName(e.target.value)} className="lf-input" />
          </div>
          <div>
            <label className="lf-label mb-1.5 block">Email</label>
            <input value={adminEmail} disabled className="lf-input" />
            <p className="mt-1.5 text-xs text-slate-400">Your email is tied to your login and can't be changed here.</p>
          </div>
        </div>
        <button onClick={saveProfile} className="mt-5 h-9 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90">
          Save changes
        </button>
      </section>

      <section className="mt-6 lf-panel p-6">
        <h2 className="lf-section-title">Security</h2>
        <div className="mt-5 space-y-4">
          <div>
            <label className="lf-label mb-1.5 block">Current password</label>
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="lf-input" />
          </div>
          <div>
            <label className="lf-label mb-1.5 block">New password</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="lf-input" />
          </div>
          <div>
            <label className="lf-label mb-1.5 block">Confirm new password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="lf-input" />
          </div>
        </div>
        <button onClick={changePassword} className="mt-5 h-9 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90">
          Update password
        </button>
      </section>
    </div>
  )
}
