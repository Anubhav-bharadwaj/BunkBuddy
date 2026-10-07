import { useAppStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'

export function LibraryWidget() {
  const { libraryAttendance } = useAppStore()
  
  const { held, present } = libraryAttendance
  const libraryPercentage = held > 0 ? (present / held) * 100 : 0
  const bonus = libraryPercentage * 0.1

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-indigo-600 uppercase flex items-center justify-between">
          <span>Library Bonus Active</span>
          <BookOpen className="w-4 h-4 text-indigo-500" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-indigo-700">+{bonus.toFixed(2)}%</span>
          <span className="text-sm font-medium text-indigo-500">to aggregate</span>
        </div>
        <p className="mt-4 text-xs text-indigo-600/80">
          Based on {present} / {held} library sessions attended
        </p>
      </CardContent>
    </Card>
  )
}
