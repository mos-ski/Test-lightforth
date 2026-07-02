import { useNavigate } from 'react-router-dom'
import { CheckoutFlow } from './CheckoutFlow'
import { setAccount } from '@/pages/desktopCopilot/mockAccounts'
import { createOrg, demoSeedOrg, setActiveAdminEmail } from '@/pages/sales/mockOrg'

const SETUP_FEE = 5000
const SEAT_PRICE = 79

export default function EnterpriseCheckoutPage() {
  const navigate = useNavigate()

  return (
    <CheckoutFlow
      productLabel="the Enterprise plan"
      collectCompany
      lineItems={[
        { label: 'Setup fee — one-time', amount: `$${SETUP_FEE.toLocaleString()}` },
        { label: 'Your seat — first month', amount: `$${SEAT_PRICE}` },
      ]}
      totalLabel={`$${(SETUP_FEE + SEAT_PRICE).toLocaleString()}`}
      payButtonLabel={`Pay $${(SETUP_FEE + SEAT_PRICE).toLocaleString()} and continue`}
      accentClassName="bg-[#08285c] hover:bg-[#08285c]/90"
      onCancel={() => navigate('/copilot/enterprise')}
      onComplete={({ email, fullName, companyName }) => {
        const orgName = companyName ?? `${fullName}'s team`
        setAccount(email, { accountType: 'enterprise-admin', orgName })
        createOrg(email, demoSeedOrg(email, fullName, orgName, 'enterprise'))
        setActiveAdminEmail(email)
        navigate('/sales/dashboard')
      }}
    />
  )
}
