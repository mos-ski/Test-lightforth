import { useNavigate } from 'react-router-dom'
import { CheckoutFlow } from '@/pages/marketing/checkout/CheckoutFlow'
import { COSELLA_SETUP_FEE, COSELLA_SEAT_PRICE } from './CosellaLanding'
import { setCosellaAccount } from '../cosellaAccounts'
import { createOrg, demoSeedCosellaOrg, setActiveAdminEmail } from '../cosellaOrgStore'

export default function CosellaCheckoutPage() {
  const navigate = useNavigate()

  return (
    <CheckoutFlow
      productLabel="Cosella"
      collectCompany
      lineItems={[
        { label: 'Setup fee — one-time', amount: `$${COSELLA_SETUP_FEE.toLocaleString()}` },
        { label: 'Your seat — first month', amount: `$${COSELLA_SEAT_PRICE}` },
      ]}
      totalLabel={`$${(COSELLA_SETUP_FEE + COSELLA_SEAT_PRICE).toLocaleString()}`}
      payButtonLabel={`Pay $${(COSELLA_SETUP_FEE + COSELLA_SEAT_PRICE).toLocaleString()} and continue`}
      accentClassName="bg-rose-600 hover:bg-rose-700"
      onCancel={() => navigate('/cosella')}
      onComplete={({ email, fullName, companyName }) => {
        const orgName = companyName ?? `${fullName}'s team`
        setCosellaAccount(email, { accountType: 'cosella-admin', orgName })
        createOrg(email, demoSeedCosellaOrg(email, fullName, orgName))
        setActiveAdminEmail(email)
        navigate(`/cosella/download?email=${encodeURIComponent(email)}`)
      }}
    />
  )
}
