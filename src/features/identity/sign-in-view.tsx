import type { FormEvent } from 'react'

import { Button, Divider, TextField } from '@/ui'

export type SignInViewProps = {
  readonly emailValue: string
  readonly passwordValue: string
  readonly onSubmit: () => void
  readonly onGoogleSignIn: () => void
  readonly createAccountHref: string
}

function GoogleMark() {
  return (
    <span aria-hidden="true" className="relative block size-6 overflow-hidden">
      <img className="absolute end-0 top-2.5 h-3 w-3" src="/v3-assets/google-blue.svg" alt="" />
      <img className="absolute bottom-0 start-1 h-2.5 w-4" src="/v3-assets/google-green.svg" alt="" />
      <img className="absolute start-0 top-1.5 h-3 w-1.5" src="/v3-assets/google-yellow.svg" alt="" />
      <img className="absolute start-1 top-0 h-2.5 w-4" src="/v3-assets/google-red.svg" alt="" />
    </span>
  )
}

export function SignInView({ emailValue, passwordValue, onSubmit, onGoogleSignIn, createAccountHref }: SignInViewProps) {
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
            <h1 className="text-center text-2xl font-semibold leading-tight text-brand-bar-text">Log in to your Lightforth account</h1>

            <form
              onSubmit={handleSubmit}
              className="mt-10 grid w-full gap-6 border border-input bg-surface p-8 shadow-panel"
            >
              <Button variant="secondary" onClick={onGoogleSignIn} leadingIcon={<GoogleMark />}>
                Sign in with Google
              </Button>

              <div className="flex items-center gap-3">
                <Divider />
                <span className="text-sm font-medium text-ink">OR</span>
                <Divider />
              </div>

              <TextField id="v3-auth-email" label="Email" type="email" value={emailValue} readOnly />
              <TextField id="v3-auth-password" label="Password" type="password" value={passwordValue} readOnly />
              <Button type="submit">Sign In</Button>
            </form>

            <p className="mt-7 flex flex-wrap items-center justify-center gap-1 text-base font-medium text-ink-muted">
              <span>Don&apos;t have an account?</span>
              <a className="font-semibold text-accent-text underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus" href={createAccountHref}>
                Create new
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
