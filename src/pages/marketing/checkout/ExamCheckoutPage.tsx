import { useNavigate } from 'react-router-dom'
import { CheckoutFlow } from './CheckoutFlow'
import { setAccount } from '@/pages/desktopCopilot/mockAccounts'

const EXAM_PRICE = 500

export default function ExamCheckoutPage() {
  const navigate = useNavigate()

  return (
    <CheckoutFlow
      productLabel="Exam Ghost"
      lineItems={[{ label: 'Exam Ghost — one-time', amount: `$${EXAM_PRICE}` }]}
      totalLabel={`$${EXAM_PRICE}`}
      payButtonLabel={`Pay $${EXAM_PRICE}`}
      accentClassName="bg-amber-500 hover:bg-amber-600"
      onCancel={() => navigate('/copilot/exam')}
      onComplete={({ email }) => {
        setAccount(email, { accountType: 'exam' })
        navigate(`/copilot/download?email=${encodeURIComponent(email)}`)
      }}
    />
  )
}
