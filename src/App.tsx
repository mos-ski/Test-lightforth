import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { AuthProvider, ProtectedRoute } from '@/hooks/useAuth'
import AppLayout from '@/components/layout/AppLayout'
import { lazy, Suspense } from 'react'
import Auth from '@/pages/Auth'
import Dashboard from '@/pages/Dashboard'

const OnboardingFlow = lazy(() => import('@/pages/OnboardingFlow'))
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
const AdminAnalytics = lazy(() => import('@/pages/admin/AdminAnalytics'))
const AdminResumeTemplates = lazy(() => import('@/pages/admin/AdminResumeTemplates'))
const AdminActivityLogs = lazy(() => import('@/pages/admin/AdminActivityLogs'))
const AdminPromotions = lazy(() => import('@/pages/admin/AdminPromotions'))
const AdminBroadcast = lazy(() => import('@/pages/admin/AdminBroadcast'))
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'))
const AdminNotifications = lazy(() => import('@/pages/admin/AdminNotifications'))
const AdminSupport = lazy(() => import('@/pages/admin/AdminSupport'))
const AdminUserDetail = lazy(() => import('@/pages/admin/AdminUserDetail'))
const CareerSpecialistLayout = lazy(() => import('@/pages/career-specialist/CareerSpecialistLayout'))
const CareerSpecialistPage = lazy(() => import('@/pages/career-specialist/CareerSpecialistPage'))
const AllSpecialistsPage = lazy(() => import('@/pages/career-specialist/AllSpecialistsPage'))
const SpecialistProfilePage = lazy(() => import('@/pages/career-specialist/SpecialistProfilePage'))
const AllStudentsPage = lazy(() => import('@/pages/career-specialist/AllStudentsPage'))
const StudentProfilePage = lazy(() => import('@/pages/career-specialist/StudentProfilePage'))
const AllApplicationsPage = lazy(() => import('@/pages/career-specialist/AllApplicationsPage'))
const ApplicationDetailPage = lazy(() => import('@/pages/career-specialist/ApplicationDetailPage'))
const JobsPage = lazy(() => import('@/pages/career-specialist/JobsPage'))
const SettingsPage = lazy(() => import('@/pages/career-specialist/SettingsPage'))
const CreateStudentPage = lazy(() => import('@/pages/career-specialist/CreateStudentPage'))

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
            <Route path="/onboarding" element={<Suspense fallback={null}><OnboardingFlow /></Suspense>} />
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
            <Route path="/career-specialist" element={<Suspense fallback={null}><CareerSpecialistLayout /></Suspense>}>
              <Route index element={<Suspense fallback={null}><CareerSpecialistPage /></Suspense>} />
              <Route path="specialists" element={<Suspense fallback={null}><AllSpecialistsPage /></Suspense>} />
              <Route path="specialists/:id" element={<Suspense fallback={null}><SpecialistProfilePage /></Suspense>} />
              <Route path="students" element={<Suspense fallback={null}><AllStudentsPage /></Suspense>} />
              <Route path="students/create" element={<Suspense fallback={null}><CreateStudentPage /></Suspense>} />
              <Route path="students/:id" element={<Suspense fallback={null}><StudentProfilePage /></Suspense>} />
              <Route path="applications" element={<Suspense fallback={null}><AllApplicationsPage /></Suspense>} />
              <Route path="applications/:id" element={<Suspense fallback={null}><ApplicationDetailPage /></Suspense>} />
              <Route path="jobs" element={<Suspense fallback={null}><JobsPage /></Suspense>} />
              <Route path="settings" element={<Suspense fallback={null}><SettingsPage /></Suspense>} />
            </Route>
            <Route path="/desktop-copilot-preview" element={<Suspense fallback={null}><DesktopCopilotPreview /></Suspense>} />
            <Route path="/mobile-app" element={<Suspense fallback={null}><MobileAppPreview /></Suspense>} />
            <Route
              path="/admin"
              element={
                <Suspense fallback={null}>
                  <AdminLayout />
                </Suspense>
              }
            >
              <Route index element={<Suspense fallback={null}><AdminOverview /></Suspense>} />
              <Route path="revenue" element={<Suspense fallback={null}><AdminRevenue /></Suspense>} />
              <Route path="users" element={<Suspense fallback={null}><AdminUsers /></Suspense>} />
              <Route path="users/:id" element={<Suspense fallback={null}><AdminUserDetail /></Suspense>} />
              <Route path="okr" element={<Suspense fallback={null}><AdminOKR /></Suspense>} />
              <Route path="analytics" element={<Suspense fallback={null}><AdminAnalytics /></Suspense>} />
              <Route path="resume-templates" element={<Suspense fallback={null}><AdminResumeTemplates /></Suspense>} />
              <Route path="activity-logs" element={<Suspense fallback={null}><AdminActivityLogs /></Suspense>} />
              <Route path="promotions" element={<Suspense fallback={null}><AdminPromotions /></Suspense>} />
              <Route path="broadcast" element={<Suspense fallback={null}><AdminBroadcast /></Suspense>} />
              <Route path="settings" element={<Suspense fallback={null}><AdminSettings /></Suspense>} />
              <Route path="notifications" element={<Suspense fallback={null}><AdminNotifications /></Suspense>} />
              <Route path="support" element={<Suspense fallback={null}><AdminSupport /></Suspense>} />
            </Route>
          </Routes>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
