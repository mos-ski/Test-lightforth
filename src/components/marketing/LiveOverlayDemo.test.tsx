import { act, render, screen, waitFor } from '@testing-library/react'
import { LiveOverlayDemo } from './LiveOverlayDemo'

describe('LiveOverlayDemo', () => {
  it('renders the customer line typing in during the listening phase', async () => {
    render(<LiveOverlayDemo />)

    await waitFor(() => {
      expect(screen.getByText(/Prospect/i)).toBeInTheDocument()
      expect(screen.getByText(/more than we budgeted/i)).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('shows the AI suggested response after the processing phase completes', async () => {
    render(<LiveOverlayDemo />)

    await waitFor(() => {
      expect(screen.getByText('Suggested Response')).toBeInTheDocument()
    }, { timeout: 4000 })
  })

  it('does not leak timers after unmount', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { unmount } = render(<LiveOverlayDemo />)
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
    })
    unmount()
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200))
    })
    expect(errorSpy).not.toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  it('renders a static frame without animating when prefers-reduced-motion is set', () => {
    const originalMatchMedia = window.matchMedia
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })

    try {
      render(<LiveOverlayDemo />)

      expect(screen.getByText(/more than we budgeted/i)).toBeInTheDocument()
      expect(screen.getByText('Suggested Response')).toBeInTheDocument()
    } finally {
      window.matchMedia = originalMatchMedia
    }
  })

  it('variant="card" renders the original badge chrome; the default panel variant does not', () => {
    const { unmount } = render(<LiveOverlayDemo variant="card" />)
    expect(screen.getByText('Live call')).toBeInTheDocument()
    unmount()

    render(<LiveOverlayDemo />)
    expect(screen.queryByText('Live call')).not.toBeInTheDocument()
  })

  it('forceStatic freezes the frame immediately without animating', () => {
    render(<LiveOverlayDemo forceStatic />)
    expect(screen.getByText(/more than we budgeted/i)).toBeInTheDocument()
    expect(screen.getByText('Suggested Response')).toBeInTheDocument()
  })
})
