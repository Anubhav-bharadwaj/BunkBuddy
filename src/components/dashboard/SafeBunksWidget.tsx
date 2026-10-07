import { useAppStore } from '@/store'
import { calculateSafeBunks } from '@/lib/attendance'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Moon } from 'lucide-react'

export function SafeBunksWidget() {
  const { subjects, settings, libraryAttendance } = useAppStore()
  
  const safeBunks = calculateSafeBunks(subjects, settings.targetAttendance, libraryAttendance)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center justify-between">
          <span>Available Cushion</span>
          <Moon className="w-4 h-4 text-emerald-500" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-emerald-600">+{safeBunks}</span>
          <span className="text-sm font-medium text-slate-600">lectures</span>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Across all subjects globally
        </p>
      </CardContent>
    </Card>
  )
}
