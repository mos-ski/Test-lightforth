import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import CloserOSDownloadPage from './CloserOSDownloadPage'

describe('CloserOSDownloadPage', () => {
  it('renders download buttons and an Open Closer OS link carrying the email through', () => {
    render(
      <MemoryRouter initialEntries={['/closer-os/download?email=ada%40acme.com']}>
        <Routes>
          <Route path="/closer-os/download" element={<CloserOSDownloadPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByRole('button', { name: /download for mac/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /download for windows/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /download for mac/i }))
    expect(screen.getByRole('button', { name: /open closer os/i })).toBeInTheDocument()
  })
})
