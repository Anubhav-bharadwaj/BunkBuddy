import { useAppStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { calculateOverallAttendance } from '@/lib/attendance'

export function OverallAttendanceWidget() {
  const { subjects, settings, libraryAttendance } = useAppStore()

  const totalClasses = subjects.reduce((sum, s) => sum + s.totalClasses, 0)
  const attendedClasses = subjects.reduce((sum, s) => sum + s.attendedClasses, 0)
  
  // Use the same formula as the college portal: base % + library bonus (10% of lib %)
  const percentage = calculateOverallAttendance(subjects, libraryAttendance)
  const isSafe = percentage >= settings.targetAttendance

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-500 uppercase">
          Overall Aggregate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-slate-900">{percentage}%</span>
          <span className={isSafe ? "text-emerald-600 flex items-center text-sm font-semibold" : "text-rose-600 flex items-center text-sm font-semibold"}>
            {isSafe ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {isSafe ? `+${(percentage - settings.targetAttendance).toFixed(1)}%` : `${(percentage - settings.targetAttendance).toFixed(1)}%`}
          </span>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex flex-wrap justify-between gap-2 text-xs text-slate-500">
            <span>{attendedClasses} of {totalClasses} attended</span>
            <span>Target: {settings.targetAttendance}%</span>
          </div>
          {/* Custom margin bar: left half = deficit zone (red), right half = cushion zone (green) */}
          <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            {isSafe ? (
              <div
                className="absolute left-0 top-0 h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{
                  width: `max(4%, ${Math.min(((percentage - settings.targetAttendance) / (100 - settings.targetAttendance)) * 100, 100)}%)`
                }}
              />
            ) : (
              <div
                className="absolute left-0 top-0 h-full bg-rose-500 rounded-full transition-all duration-500"
                style={{
                  width: `max(4%, ${Math.min(((settings.targetAttendance - percentage) / settings.targetAttendance) * 100, 100)}%)`
                }}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
