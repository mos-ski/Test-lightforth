import { useNavigate } from 'react-router-dom'

import { SignUpView } from '@/features/identity/sign-up-view'

export function AuthCreateAccountPage() {
  const navigate = useNavigate()

  return (
    <SignUpView
      nameValue="Olivia Rhye"
      emailValue="olivia@untitledui.com"
      passwordValue="password"
      signInHref="/v3/auth/sign-in"
      onGoogleSignUp={() => navigate('/v3/auth/choose-plan')}
      onSubmit={() => navigate('/v3/auth/choose-plan')}
    />
  )
}
