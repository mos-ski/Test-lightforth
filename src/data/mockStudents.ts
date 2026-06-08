export interface MockStudent {
  id: string
  name: string
  role: string
  location: string
  initials: string
}

export const MOCK_STUDENTS: MockStudent[] = [
  { id: '1', name: 'Sarah Mitchell', role: 'GRC Analyst', location: 'New York', initials: 'SM' },
  { id: '2', name: 'James Okafor', role: 'Compliance Officer', location: 'Chicago', initials: 'JO' },
  { id: '3', name: 'Priya Sharma', role: 'Risk Analyst', location: 'Austin', initials: 'PS' },
]
