import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CopilotLanding from './CopilotLanding'

function renderAt(path: string, ui: React.ReactElement) {
  return render(<MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>)
}

describe('copilot waitlist landing pages', () => {
  it('hides individual pricing and footer copy in waitlist mode', () => {
    renderAt('/?waitlist', <CopilotLanding />)

    expect(screen.getByRole('heading', { name: 'Join the waitlist' })).toBeInTheDocument()
    expect(screen.getByText('Be first in line when Lightforth Copilot opens up. Drop your email and we\'ll reach out directly.')).toBeInTheDocument()
    expect(screen.queryByText(/Starting at \$49\/mo/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Plans for individuals' })).not.toBeInTheDocument()
    expect(screen.queryByText(/Lightforth\. All rights reserved\./)).not.toBeInTheDocument()
  })
})
