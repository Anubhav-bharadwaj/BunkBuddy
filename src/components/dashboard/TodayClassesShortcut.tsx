import { Link } from 'react-router-dom'
import { useAppStore } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarClock, ArrowRight, Check, X } from 'lucide-react'
import { format } from 'date-fns'

export function TodayClassesShortcut() {
  const { timetable, subjects } = useAppStore()

  const today = format(new Date(), 'EEEE')
  const todaysClasses = timetable
    .filter(t => t.day === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || 'Unknown'

  return (
    <Link to="/subjects">
      <Card className="border-blue-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <CalendarClock className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Today's Classes</h3>
                <p className="text-xs text-slate-500">{today}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
          </div>

          {todaysClasses.length === 0 ? (
            <p className="text-sm text-slate-500">No classes today — enjoy the break!</p>
          ) : (
            <ul className="space-y-2">
              {todaysClasses.slice(0, 4).map(cls => (
                <li key={cls.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-400 w-12 shrink-0">{cls.startTime}</span>
                    <span className="font-medium text-slate-700 truncate">{getSubjectName(cls.subjectId)}</span>
                  </div>
                </li>
              ))}
              {todaysClasses.length > 4 && (
                <li className="text-xs text-blue-600 font-medium">+{todaysClasses.length - 4} more — tap to mark all</li>
              )}
            </ul>
          )}

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <Check className="w-3 h-3" /> Present
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-rose-600 font-medium">
              <X className="w-3 h-3" /> Absent
            </span>
            <span className="text-xs text-slate-400 ml-auto">Go to Subjects →</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
