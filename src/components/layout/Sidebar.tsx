import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, BookOpen, CalendarRange, Sparkles, Settings as SettingsIcon, CalendarDays, GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'

import { useAppStore } from '@/store'

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Subjects', href: '/subjects', icon: BookOpen },
  { name: 'Timetable', href: '/timetable', icon: CalendarDays },
  { name: 'Simulator', href: '/simulator', icon: CalendarRange },
  { name: 'AI Recovery', href: '/ai-recovery', icon: Sparkles },
  { name: 'Settings', href: '/settings', icon: SettingsIcon }, // Renamed Settings to SettingsIcon to avoid conflict with store settings
]

export function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const location = useLocation()
  const { settings } = useAppStore()

  return (
    <>
      <div className="px-6 mb-8 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900 text-lg leading-tight">BunkBuddy</h1>
          <p className="text-xs text-blue-600 font-medium">Can I Skip This?</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onNavClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400")} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-6 border-t border-slate-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 shrink-0 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold uppercase mt-1">
            {(settings.userName || 'Student').charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-slate-900 truncate">{settings.userName || 'Student'}</p>
            <p className="text-xs text-slate-500 truncate">{settings.courseName || 'CS'}</p>
            <p className="text-xs text-slate-500 truncate">{settings.semester || 'Semester 5'}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 h-screen flex-col pt-6 shrink-0">
      <SidebarContent />
    </aside>
  )
}
