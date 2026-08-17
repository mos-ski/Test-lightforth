import type { FormEvent } from 'react'

import { FormDividerLabel, FormField, GoogleAuthButton } from '@/ui'

export type SignUpViewProps = {
  readonly nameValue: string
  readonly emailValue: string
  readonly passwordValue: string
  readonly onSubmit: () => void
  readonly onGoogleSignUp: () => void
  readonly signInHref: string
}

export function SignUpView({ nameValue, emailValue, passwordValue, onSubmit, onGoogleSignUp, signInHref }: SignUpViewProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-80 bg-brand-bar" />
        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-9">
          <a href="/v3" aria-label="Lightforth UI Studio home" className="inline-flex w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <img src="/v3-assets/lightforth-logo.svg" alt="Lightforth" className="h-10 w-auto" />
          </a>

          <div className="mx-auto mt-12 flex w-full max-w-md flex-1 flex-col items-center">
            <h1 className="text-center text-2xl font-semibold leading-tight text-brand-bar-text">Create your Lightforth account</h1>

            <form onSubmit={handleSubmit} className="mt-10 grid w-full gap-6 border border-border bg-surface p-8 shadow-panel">
              <GoogleAuthButton onClick={onGoogleSignUp}>Sign up with Google</GoogleAuthButton>

              <FormDividerLabel>OR</FormDividerLabel>

              <FormField id="v3-auth-signup-name" label="Full Name" value={nameValue} readOnly />
              <FormField id="v3-auth-signup-email" label="Email" type="email" value={emailValue} readOnly />
              <FormField id="v3-auth-signup-password" label="Password" type="password" value={passwordValue} readOnly />
              <button type="submit" className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                Create Account
              </button>
            </form>

            <p className="mt-7 flex flex-wrap items-center justify-center gap-1 text-base font-medium text-ink-muted">
              <span>Already have an account?</span>
              <a className="font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus" href={signInHref}>
                Sign in
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
