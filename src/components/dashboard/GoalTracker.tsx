import { useAppStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target } from 'lucide-react'
import { calculateOverallAttendance } from '@/lib/attendance'

export function GoalTracker() {
  const { subjects, settings, libraryAttendance } = useAppStore()

  const percentage = calculateOverallAttendance(subjects, libraryAttendance)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center justify-between">
          <span>Semester Goal Tracker</span>
          <Target className="w-4 h-4 text-blue-500" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">Current Progress</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{percentage}%</span>
              <span className="text-sm font-medium text-slate-500">/ {settings.targetAttendance}%</span>
            </div>
          </div>
          
          <div className="text-left sm:text-right">
            <span className="text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-700 rounded-md uppercase tracking-wide whitespace-nowrap">
              {percentage >= settings.targetAttendance ? 'On Track' : 'Falling Behind'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
