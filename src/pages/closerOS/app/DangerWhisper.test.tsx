import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import DangerWhisper from './DangerWhisper'

describe('DangerWhisper', () => {
  it('renders nothing when state is none', () => {
    const { container } = render(<DangerWhisper state="none" reason="" whisperLine="" onResolve={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows the risk reason when flagged, with no whisper text yet', () => {
    render(<DangerWhisper state="flagged" reason="Prospect sentiment dropping" whisperLine="Ask what's really holding them back." onResolve={() => {}} />)
    expect(screen.getByText(/prospect sentiment dropping/i)).toBeInTheDocument()
    expect(screen.queryByText(/ask what's really holding them back/i)).not.toBeInTheDocument()
  })

  it('shows the whisper line and Saved/Lost buttons when whisper-shown, and calls onResolve', () => {
    const onResolve = vi.fn()
    render(<DangerWhisper state="whisper-shown" reason="Prospect sentiment dropping" whisperLine="Ask what's really holding them back." onResolve={onResolve} />)
    expect(screen.getByText(/ask what's really holding them back/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /mark deal saved/i }))
    expect(onResolve).toHaveBeenCalledWith('saved')
  })
})
