import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { toast } from 'sonner'
import { updateOrg } from '../cosellaOrgStore'
import type { CosellaDashboardContext } from './CosellaAdminLayout'

export default function Settings() {
  const { adminEmail, org, refresh } = useOutletContext<CosellaDashboardContext>()
  const [orgName, setOrgName] = useState(org.orgName)
  const [adminName, setAdminName] = useState(org.admin.name)

  function saveProfile() {
    updateOrg(adminEmail, current => ({ ...current, orgName, admin: { ...current.admin, name: adminName } }))
    refresh()
    toast.success('Profile updated')
  }

  return (
    <div className="mx-auto max-w-3xl px-10 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      <p className="mt-1 text-sm text-slate-500">Manage your profile.</p>

      <section className="mt-8 lf-panel p-6">
        <h2 className="lf-section-title">Profile</h2>
        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="org-name" className="lf-label mb-1.5 block">Company name</label>
            <input id="org-name" value={orgName} onChange={e => setOrgName(e.target.value)} className="lf-input" />
          </div>
          <div>
            <label htmlFor="admin-name" className="lf-label mb-1.5 block">Your name</label>
            <input id="admin-name" value={adminName} onChange={e => setAdminName(e.target.value)} className="lf-input" />
          </div>
          <div>
            <label htmlFor="admin-email" className="lf-label mb-1.5 block">Email</label>
            <input id="admin-email" value={adminEmail} disabled className="lf-input" />
          </div>
        </div>
        <button onClick={saveProfile} className="mt-5 h-9 rounded-lg bg-rose-600 px-4 text-sm font-semibold text-white hover:bg-rose-700">Save changes</button>
      </section>
    </div>
  )
}
