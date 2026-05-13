import Sidebar from './Sidebar'
import TopNav from './TopNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen overflow-hidden bg-background md:h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto bg-white px-4 pb-24 pt-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
