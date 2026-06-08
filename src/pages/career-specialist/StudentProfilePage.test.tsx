import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import StudentProfilePage from './StudentProfilePage'

function renderWithRouter(id = '1') {
  return render(
    <MemoryRouter initialEntries={[`/career-specialist/students/${id}`]}>
      <Routes>
        <Route path="/career-specialist/students/:id" element={<StudentProfilePage />} />
      </Routes>
    </MemoryRouter>
  )
}

it('renders student name for known id', () => {
  renderWithRouter('1')
  expect(screen.getByText('Sarah Mitchell')).toBeInTheDocument()
})

it('Agents tab is active by default', () => {
  renderWithRouter('1')
  const agentsTab = screen.getByRole('button', { name: 'Agents' })
  expect(agentsTab.className).toMatch(/lf-tab-active/)
})

it('clicking Overview tab changes active tab', () => {
  renderWithRouter('1')
  const overviewBtn = screen.getByRole('button', { name: 'Overview' })
  fireEvent.click(overviewBtn)
  expect(overviewBtn.className).toMatch(/lf-tab-active/)
})
