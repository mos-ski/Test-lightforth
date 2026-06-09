import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { AuthProvider, ProtectedRoute } from '@/hooks/useAuth'
import AppLayout from '@/components/layout/AppLayout'
import { lazy, Suspense } from 'react'
import Auth from '@/pages/Auth'
import Dashboard from '@/pages/Dashboard'

const MyDocuments = lazy(() => import('@/pages/MyDocuments'))
const ResumeBuilder = lazy(() => import('@/pages/ResumeBuilder'))
const AutoApply = lazy(() => import('@/pages/AutoApply'))
const InterviewCopilot = lazy(() => import('@/pages/InterviewCopilot'))
const InterviewPrep = lazy(() => import('@/pages/InterviewPrep'))
const JobProfile = lazy(() => import('@/pages/JobProfile'))
const Explore = lazy(() => import('@/pages/Explore'))
const Downloads = lazy(() => import('@/pages/Downloads'))
const Billing = lazy(() => import('@/pages/Billing'))
const Settings = lazy(() => import('@/pages/Settings'))
const HowToUse = lazy(() => import('@/pages/HowToUse'))
const DesktopCopilotPreview = lazy(() => import('@/pages/DesktopCopilotPreview'))
const MobileAppPreview = lazy(() => import('@/pages/MobileAppPreview'))
const AdminLayout = lazy(() => import('@/components/layout/AdminLayout'))
const AdminOverview = lazy(() => import('@/pages/admin/AdminOverview'))
const AdminRevenue = lazy(() => import('@/pages/admin/AdminRevenue'))
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'))
const AdminOKR = lazy(() => import('@/pages/admin/AdminOKR'))
const CareerSpecialistPage = lazy(() => import('@/pages/career-specialist/CareerSpecialistPage'))
const StudentProfilePage = lazy(() => import('@/pages/career-specialist/StudentProfilePage'))

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
            <Route path="/auth/*" element={<Auth />} />
            <Route path="/" element={<AppRoute><Dashboard /></AppRoute>} />
            <Route path="/documents" element={<AppRoute><Suspense fallback={null}><MyDocuments /></Suspense></AppRoute>} />
            <Route path="/resume-builder" element={<ProtectedRoute><Suspense fallback={null}><ResumeBuilder /></Suspense></ProtectedRoute>} />
            <Route path="/auto-apply" element={<AppRoute><Suspense fallback={null}><AutoApply /></Suspense></AppRoute>} />
            <Route path="/interview-prep" element={<AppRoute><Suspense fallback={null}><InterviewPrep /></Suspense></AppRoute>} />
            <Route path="/interview-copilot" element={<AppRoute><Suspense fallback={null}><InterviewCopilot /></Suspense></AppRoute>} />
            <Route path="/billing" element={<AppRoute><Suspense fallback={null}><Billing /></Suspense></AppRoute>} />
            <Route path="/billings-and-subscription" element={<AppRoute><Suspense fallback={null}><Billing /></Suspense></AppRoute>} />
            <Route path="/settings" element={<AppRoute><Suspense fallback={null}><Settings /></Suspense></AppRoute>} />
            <Route path="/job-profile" element={<AppRoute><Suspense fallback={null}><JobProfile /></Suspense></AppRoute>} />
            <Route path="/explore" element={<AppRoute><Suspense fallback={null}><Explore /></Suspense></AppRoute>} />
            <Route path="/downloads" element={<AppRoute><Suspense fallback={null}><Downloads /></Suspense></AppRoute>} />
            <Route path="/how-to-use" element={<AppRoute><Suspense fallback={null}><HowToUse /></Suspense></AppRoute>} />
            <Route path="/career-specialist" element={<Suspense fallback={null}><CareerSpecialistPage /></Suspense>} />
            <Route path="/career-specialist/students/:id" element={<Suspense fallback={null}><StudentProfilePage /></Suspense>} />
            <Route path="/desktop-copilot-preview" element={<Suspense fallback={null}><DesktopCopilotPreview /></Suspense>} />
            <Route path="/mobile-app" element={<Suspense fallback={null}><MobileAppPreview /></Suspense>} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Suspense fallback={null}>
                    <AdminLayout />
                  </Suspense>
                </ProtectedRoute>
              }
            >
              <Route index element={<Suspense fallback={null}><AdminOverview /></Suspense>} />
              <Route path="revenue" element={<Suspense fallback={null}><AdminRevenue /></Suspense>} />
              <Route path="users" element={<Suspense fallback={null}><AdminUsers /></Suspense>} />
              <Route path="okr" element={<Suspense fallback={null}><AdminOKR /></Suspense>} />
            </Route>
          </Routes>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
