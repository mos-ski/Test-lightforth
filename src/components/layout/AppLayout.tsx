import Sidebar from './Sidebar'
import TopNav from './TopNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto bg-white px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
