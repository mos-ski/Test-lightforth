import { useNavigate, useParams } from 'react-router-dom'
import { CheckoutFlow } from './CheckoutFlow'
import { setAccount } from '@/pages/desktopCopilot/mockAccounts'
import { getPlan, type PlanId } from '@/pages/desktopCopilot/plans'

const VALID_PLAN_IDS: PlanId[] = ['starter', 'pro', 'premium']

export default function RegularCheckoutPage() {
  const { planId } = useParams<{ planId: string }>()
  const navigate = useNavigate()
  const plan = getPlan(VALID_PLAN_IDS.includes(planId as PlanId) ? (planId as PlanId) : 'pro')

  return (
    <CheckoutFlow
      productLabel={`the ${plan.label} plan`}
      lineItems={[{ label: `${plan.label} Plan — monthly`, amount: `$${plan.monthlyPrice}/mo` }]}
      totalLabel={`$${plan.monthlyPrice}`}
      payButtonLabel={`Subscribe — $${plan.monthlyPrice}/mo`}
      onCancel={() => navigate('/')}
      onComplete={({ email }) => {
        setAccount(email, { accountType: 'regular', planId: plan.id })
        navigate('/app')
      }}
    />
  )
}
