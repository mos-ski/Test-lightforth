export interface MockStudent {
  id: string
  name: string
  role: string
  location: string
  initials: string
  preferences: string[]
}

export const MOCK_STUDENTS: MockStudent[] = [
  { id: '1', name: 'Sarah Mitchell',  role: 'GRC Analyst',        location: 'New York',      initials: 'SM', preferences: ['On-site', 'Senior', 'Banking', 'GRC']             },
  { id: '2', name: 'James Okafor',    role: 'Compliance Officer', location: 'Chicago',       initials: 'JO', preferences: ['Hybrid', 'Senior', 'Fintech', 'Compliance']        },
  { id: '3', name: 'Priya Sharma',    role: 'Risk Analyst',       location: 'Austin',        initials: 'PS', preferences: ['Remote', 'Mid', 'Financial Services', 'Risk']      },
  { id: '4', name: 'David Chen',      role: 'AML Analyst',        location: 'San Francisco', initials: 'DC', preferences: ['Remote', 'Senior', 'FinTech', 'AML']              },
  { id: '5', name: 'Aisha Patel',     role: 'Risk Manager',       location: 'London',        initials: 'AP', preferences: ['Hybrid', 'Manager', 'Banking', 'Risk']            },
  { id: '6', name: 'Marcus Johnson',  role: 'Compliance Lead',    location: 'Boston',        initials: 'MJ', preferences: ['On-site', 'Lead', 'Insurance', 'Compliance']      },
  { id: '7', name: 'Elena Vasquez',   role: 'Privacy Counsel',    location: 'Miami',         initials: 'EV', preferences: ['Remote', 'Senior', 'Tech', 'Privacy']             },
  { id: '8', name: 'Kevin Osei',      role: 'Regulatory Analyst', location: 'Atlanta',       initials: 'KO', preferences: ['Hybrid', 'Mid', 'Financial Services', 'RegTech']  },
]
