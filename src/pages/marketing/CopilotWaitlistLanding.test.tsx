import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CopilotLanding from './CopilotLanding'
import ExamCopilotLanding from './ExamCopilotLanding'
import EnterpriseCopilotLanding from './EnterpriseCopilotLanding'

function renderAt(path: string, ui: React.ReactElement) {
  return render(<MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>)
}

describe('copilot waitlist landing pages', () => {
  it('hides individual pricing and footer copy in waitlist mode', () => {
    renderAt('/copilot?waitlist', <CopilotLanding />)

    expect(screen.getByRole('heading', { name: 'Join the waitlist' })).toBeInTheDocument()
    expect(screen.getByText('Be first in line when Lightforth Copilot opens up. Drop your email and we\'ll reach out directly.')).toBeInTheDocument()
    expect(screen.queryByText(/Starting at \$49\/mo/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Plans for individuals' })).not.toBeInTheDocument()
    expect(screen.queryByText(/Lightforth\. All rights reserved\./)).not.toBeInTheDocument()
  })

  it('hides exam pricing and footer copy in waitlist mode', () => {
    renderAt('/copilot/exam?waitlist', <ExamCopilotLanding />)

    expect(screen.getByRole('heading', { name: 'Join the waitlist' })).toBeInTheDocument()
    expect(screen.getByText('Be first in line when Exam Ghost opens up. Drop your email and we\'ll reach out directly.')).toBeInTheDocument()
    expect(screen.queryByText(/\$500/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'One price. 30 days access.' })).not.toBeInTheDocument()
    expect(screen.queryByText(/Lightforth\. All rights reserved\./)).not.toBeInTheDocument()
  })

  it('hides enterprise pricing and footer copy in waitlist mode', async () => {
    renderAt('/copilot/enterprise?waitlist', <EnterpriseCopilotLanding />)

    expect(screen.getByRole('heading', { name: 'Join the waitlist' })).toBeInTheDocument()
    expect(screen.getByText('Be first in line when Lightforth Sales Copilot opens up. Drop your email and we\'ll reach out directly.')).toBeInTheDocument()
    expect(screen.queryByText(/\$5,000/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/\$79/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Simple, per-seat pricing' })).not.toBeInTheDocument()
    expect(screen.queryByText(/Lightforth\. All rights reserved\./)).not.toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Suggested Response')).toBeInTheDocument()
    }, { timeout: 4000 })

    expect(screen.getByRole('heading', { name: 'Sales Closer AI listens in to the call' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Undetectable, every call' })).toBeInTheDocument()
  })
})
