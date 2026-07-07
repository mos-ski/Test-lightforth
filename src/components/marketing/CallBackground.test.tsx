import { render, screen } from '@testing-library/react'
import { CallBackground } from './CallBackground'

describe('CallBackground', () => {
  it('renders both call-tile name badges', () => {
    render(<CallBackground />)
    expect(screen.getByText('You')).toBeInTheDocument()
    expect(screen.getByText('Prospect')).toBeInTheDocument()
  })
})
