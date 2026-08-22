// Credits are the user-facing usage unit across the product. Internally every balance and
// rate is still tracked in cents (see src/mocks/wallet.ts) so the backend accounting stays
// in real currency — this module is the one place that converts cents to the credit numbers
// shown on screen, at a fixed rate of 1 credit = 6 cents.
const CENTS_PER_CREDIT = 6
const usdFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })

export function centsToCredits(cents: number): number {
  return cents / CENTS_PER_CREDIT
}

export function creditsToCents(credits: number): number {
  return Math.round(credits * CENTS_PER_CREDIT)
}

function creditLabel(value: number): string {
  return value === 1 ? 'credit' : 'credits'
}

/** e.g. 15 -> "2.5 credits", 300 -> "50 credits" */
export function formatCredits(cents: number): string {
  const value = Math.round(centsToCredits(cents) * 10) / 10
  const text = Number.isInteger(value) ? value.toString() : value.toFixed(1)
  return `${text} ${creditLabel(value)}`
}

/** Rounds to the nearest whole credit — for summary balances where a decimal is noise. */
export function formatCreditsWhole(cents: number): string {
  const value = Math.round(centsToCredits(cents))
  return `${value} ${creditLabel(value)}`
}

/** Bare rounded number, no unit word — for compact badges. */
export function formatCreditsCompact(cents: number): string {
  return Math.round(centsToCredits(cents)).toString()
}

/** e.g. 15 -> "2.5 credits (~$0.15)" — for places that should show the dollar value too. */
export function formatCreditsWithUsd(cents: number): string {
  return `${formatCredits(cents)} (~${usdFormatter.format(cents / 100)})`
}
