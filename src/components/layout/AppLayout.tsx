import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f7f9] text-slate-900 font-sans">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
