import { useNavigate } from 'react-router-dom'
import { CheckoutFlow } from '@/pages/marketing/checkout/CheckoutFlow'
import { CLOSER_OS_SETUP_FEE, CLOSER_OS_SEAT_PRICE } from './CloserOSLanding'
import { setCloserAccount } from '../closerAccounts'
import { createOrg, demoSeedCloserOrg, setActiveAdminEmail } from '../closerOrgStore'

export default function CloserOSCheckoutPage() {
  const navigate = useNavigate()

  return (
    <CheckoutFlow
      productLabel="Closer OS"
      collectCompany
      lineItems={[
        { label: 'Setup fee — one-time', amount: `$${CLOSER_OS_SETUP_FEE.toLocaleString()}` },
        { label: 'Your seat — first month', amount: `$${CLOSER_OS_SEAT_PRICE}` },
      ]}
      totalLabel={`$${(CLOSER_OS_SETUP_FEE + CLOSER_OS_SEAT_PRICE).toLocaleString()}`}
      payButtonLabel={`Pay $${(CLOSER_OS_SETUP_FEE + CLOSER_OS_SEAT_PRICE).toLocaleString()} and continue`}
      accentClassName="bg-emerald-600 hover:bg-emerald-700"
      onCancel={() => navigate('/closer-os')}
      onComplete={({ email, fullName, companyName }) => {
        const orgName = companyName ?? `${fullName}'s team`
        setCloserAccount(email, { accountType: 'closer-os-admin', orgName })
        createOrg(email, demoSeedCloserOrg(email, fullName, orgName))
        setActiveAdminEmail(email)
        navigate(`/closer-os/download?email=${encodeURIComponent(email)}`)
      }}
    />
  )
}
