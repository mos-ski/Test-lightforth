import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { AuthProvider, ProtectedRoute } from '@/hooks/useAuth'
import AppLayout from '@/components/layout/AppLayout'
import Auth from '@/pages/Auth'
import Dashboard from '@/pages/Dashboard'
import Placeholder from '@/pages/Placeholder'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function AppRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<AppRoute><Dashboard /></AppRoute>} />
            <Route path="/documents" element={<AppRoute><Placeholder title="My Documents" /></AppRoute>} />
            <Route path="/resume-builder" element={<AppRoute><Placeholder title="Resume Builder" /></AppRoute>} />
            <Route path="/auto-apply" element={<AppRoute><Placeholder title="Auto-Apply" /></AppRoute>} />
            <Route path="/interview-prep" element={<AppRoute><Placeholder title="Interview Prep" /></AppRoute>} />
            <Route path="/interview-copilot" element={<AppRoute><Placeholder title="Interview Copilot" /></AppRoute>} />
            <Route path="/billing" element={<AppRoute><Placeholder title="Billing" /></AppRoute>} />
            <Route path="/settings" element={<AppRoute><Placeholder title="Settings" /></AppRoute>} />
            <Route path="/job-profile" element={<AppRoute><Placeholder title="Job Profile" /></AppRoute>} />
            <Route path="/explore" element={<AppRoute><Placeholder title="Explore" /></AppRoute>} />
            <Route path="/downloads" element={<AppRoute><Placeholder title="Download Apps" /></AppRoute>} />
          </Routes>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
