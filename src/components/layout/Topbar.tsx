import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { useAppStore } from '@/store'
import { SidebarContent } from './Sidebar'

export function Topbar() {
  const { subjects, settings } = useAppStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const totalClasses = subjects.reduce((sum, s) => sum + s.totalClasses, 0)
  const attendedClasses = subjects.reduce((sum, s) => sum + s.attendedClasses, 0)
  const overallPercentage = totalClasses === 0 ? 0 : (attendedClasses / totalClasses) * 100
  
  const isOptimal = overallPercentage >= settings.targetAttendance

  return (
    <header className="h-16 border-b border-slate-200 bg-white/50 backdrop-blur-sm flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-3">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden shrink-0">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 pt-6 flex flex-col">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SidebarContent onNavClick={() => setMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 font-medium hidden sm:inline">Tomorrow:</span>
          {isOptimal ? (
            <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              Safe to skip
            </span>
          ) : (
            <span className="text-sm font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-md">
              Do not skip
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Link to="/subjects">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm text-xs sm:text-sm px-3 sm:px-4">
            Today's Classes →
          </Button>
        </Link>
      </div>
    </header>
  )
}
