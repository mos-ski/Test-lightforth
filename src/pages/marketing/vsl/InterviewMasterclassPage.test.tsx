import { render, screen } from '@testing-library/react'
import InterviewMasterclassPage from './InterviewMasterclassPage'

it('renders a long-form VSL landing page for the Lightforth job-search system', () => {
  render(<InterviewMasterclassPage />)

  expect(
    screen.getByRole('heading', {
      name: /stop losing job offers you were qualified enough to win/i,
    }),
  ).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /play the free lightforth training/i })).toBeInTheDocument()
  expect(screen.getByText(/the hiring process changed/i)).toBeInTheDocument()
  expect(screen.getByText(/lightforth connects the work before, during, and after the interview/i)).toBeInTheDocument()
  expect(screen.getByText(/activate the full lightforth job-search system/i)).toBeInTheDocument()
})

it('covers offer reassurance, next steps, and faq objections', () => {
  render(<InterviewMasterclassPage />)

  expect(screen.getByText('$49')).toBeInTheDocument()
  expect(screen.getByText(/you stay in control of applications/i)).toBeInTheDocument()
  expect(screen.getByText('STEP 01')).toBeInTheDocument()
  expect(screen.getByText('Watch the free 22-minute training.')).toBeInTheDocument()
  expect(screen.getByText(/is this only interview prep/i)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /watch the free training/i })).toHaveAttribute('href', '#training')
})
