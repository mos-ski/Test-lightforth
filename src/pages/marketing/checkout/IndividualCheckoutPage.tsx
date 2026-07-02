import { useNavigate } from 'react-router-dom'
import { CheckoutFlow } from './CheckoutFlow'
import { setAccount } from '@/pages/desktopCopilot/mockAccounts'
import { createOrg, demoSeedOrg, setActiveAdminEmail } from '@/pages/sales/mockOrg'

const MONTHLY_PRICE = 99.90

export default function IndividualCheckoutPage() {
  const navigate = useNavigate()

  return (
    <CheckoutFlow
      productLabel="the Individual plan"
      collectCompany={false}
      lineItems={[{ label: 'Individual plan — first month', amount: `$${MONTHLY_PRICE.toFixed(2)}` }]}
      totalLabel={`$${MONTHLY_PRICE.toFixed(2)}`}
      payButtonLabel={`Pay $${MONTHLY_PRICE.toFixed(2)} and continue`}
      accentClassName="bg-teal-500 hover:bg-teal-600"
      onCancel={() => navigate('/copilot/enterprise')}
      onComplete={({ email, fullName }) => {
        setAccount(email, { accountType: 'sales-individual' })
        createOrg(email, demoSeedOrg(email, fullName, `${fullName}'s workspace`, 'individual'))
        setActiveAdminEmail(email)
        navigate('/sales/dashboard')
      }}
    />
  )
}
