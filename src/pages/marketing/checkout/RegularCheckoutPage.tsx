import { useNavigate, useParams } from 'react-router-dom'
import { CheckoutFlow } from './CheckoutFlow'
import { setAccount } from '@/pages/desktopCopilot/mockAccounts'
import { getPlan, type PlanId } from '@/pages/desktopCopilot/plans'

export default function RegularCheckoutPage() {
  const { planId } = useParams<{ planId: string }>()
  const navigate = useNavigate()
  const plan = getPlan((planId as PlanId) === 'premium' ? 'premium' : 'pro')

  return (
    <CheckoutFlow
      productLabel={`the ${plan.label} plan`}
      lineItems={[{ label: `${plan.label} Plan — monthly`, amount: `$${plan.monthlyPrice}/mo` }]}
      totalLabel={`$${plan.monthlyPrice}`}
      payButtonLabel={`Subscribe — $${plan.monthlyPrice}/mo`}
      onCancel={() => navigate('/copilot')}
      onComplete={({ email }) => {
        setAccount(email, { accountType: 'regular', planId: plan.id })
        navigate(`/copilot/download?email=${encodeURIComponent(email)}`)
      }}
    />
  )
}
