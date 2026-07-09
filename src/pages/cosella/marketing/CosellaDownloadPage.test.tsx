import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import CosellaDownloadPage from './CosellaDownloadPage'

describe('CosellaDownloadPage', () => {
  it('renders download buttons and opens the desktop app directly, carrying the email through', () => {
    render(
      <MemoryRouter initialEntries={['/cosella/download?email=ada%40acme.com']}>
        <Routes>
          <Route path="/cosella/download" element={<CosellaDownloadPage />} />
          <Route path="/cosella/app" element={<p>App landed</p>} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByRole('button', { name: /download for mac/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /download for windows/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /download for mac/i }))
    fireEvent.click(screen.getByRole('button', { name: /open cosella/i }))
    expect(screen.getByText('App landed')).toBeInTheDocument()
  })
})
