// src/hooks/useAuth.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './useAuth'

vi.mock('../lib/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        plan: 'free' as const,
        credits: 3,
        creditsUsed: 0,
      },
    }),
  },
  TOKEN_KEY: 'lf_token',
}))

function TestConsumer() {
  const { user, isLoading } = useAuth()
  if (isLoading) return <div>Loading...</div>
  return <div>{user ? `Hello ${user.name}` : 'No user'}</div>
}

function Wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return (
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <AuthProvider>{children}</AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('useAuth', () => {
  beforeEach(() => localStorage.clear())

  it('shows loading on initial render', () => {
    render(<TestConsumer />, { wrapper: Wrapper })
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows No user when no token in localStorage', async () => {
    render(<TestConsumer />, { wrapper: Wrapper })
    await waitFor(() => expect(screen.getByText('No user')).toBeInTheDocument())
  })

  it('fetches and shows user when token exists', async () => {
    localStorage.setItem('lf_token', 'valid-token')
    render(<TestConsumer />, { wrapper: Wrapper })
    await waitFor(() => expect(screen.getByText('Hello Test User')).toBeInTheDocument())
  })
})
