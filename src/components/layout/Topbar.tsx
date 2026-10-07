import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store'

export function Topbar() {
  const { subjects, settings } = useAppStore()
  
  const totalClasses = subjects.reduce((sum, s) => sum + s.totalClasses, 0)
  const attendedClasses = subjects.reduce((sum, s) => sum + s.attendedClasses, 0)
  const overallPercentage = totalClasses === 0 ? 0 : (attendedClasses / totalClasses) * 100
  
  const isOptimal = overallPercentage >= settings.targetAttendance

  return (
    <header className="h-16 border-b border-slate-200 bg-white/50 backdrop-blur-sm flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 font-medium">Tomorrow:</span>
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
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm">
            Today's Classes →
          </Button>
        </Link>
      </div>
    </header>
  )
}
