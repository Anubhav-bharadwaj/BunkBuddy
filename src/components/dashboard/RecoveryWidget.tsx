import { useAppStore } from '@/store'
import { calculateRecoveryClasses } from '@/lib/attendance'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

export function RecoveryWidget() {
  const { subjects, settings, libraryAttendance } = useAppStore()
  
  const recoveryClasses = calculateRecoveryClasses(subjects, settings.targetAttendance, libraryAttendance)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center justify-between">
          <span>Deficit Backlog</span>
          <AlertTriangle className={recoveryClasses > 0 ? "w-4 h-4 text-rose-500" : "w-4 h-4 text-slate-300"} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className={recoveryClasses > 0 ? "text-4xl font-bold text-rose-600" : "text-4xl font-bold text-slate-900"}>
            {recoveryClasses > 0 ? `-${recoveryClasses}` : '0'}
          </span>
          <span className="text-sm font-medium text-slate-600">to safe</span>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          {recoveryClasses > 0 
            ? `Attend ${recoveryClasses} consecutive classes globally to reach ${settings.targetAttendance}%` 
            : 'No deficit. You are currently in the safe zone.'}
        </p>
      </CardContent>
    </Card>
  )
}
