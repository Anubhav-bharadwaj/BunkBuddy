import { useAppStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarClock, BookOpen } from 'lucide-react'
import { format } from 'date-fns'

export function TodayClassesWidget() {
  const { timetable, subjects } = useAppStore()

  const today = format(new Date(), 'EEEE')
  const todaysClasses = timetable
    .filter(t => t.day === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  const formatTime = (time: string) => {
    const [hStr, mStr] = time.split(':')
    let h = parseInt(hStr, 10)
    const m = mStr
    const ampm = h >= 12 ? 'PM' : 'AM'
    h = h % 12 || 12
    return `${h}:${m} ${ampm}`
  }

  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || 'Unknown'

  return (
    <Card className="border-blue-200 shadow-sm overflow-hidden mb-8">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50/50 pb-4 border-b border-blue-100">
        <div>
          <CardTitle className="text-xl font-bold text-blue-900 flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-blue-600" />
            Today's Classes
          </CardTitle>
          <p className="text-sm text-blue-600/80 mt-1">{format(new Date(), 'EEEE, MMMM do')}</p>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {todaysClasses.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <p className="font-medium text-slate-700">No classes scheduled for today.</p>
            <p className="text-sm mt-1">Enjoy your free time!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {todaysClasses.map(cls => (
              <div key={cls.id} className="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors">
                <div className="w-20 text-center shrink-0">
                  <span className="text-xs font-bold text-slate-700 leading-tight">{formatTime(cls.startTime)}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900">{getSubjectName(cls.subjectId)}</h4>
                  <p className="text-xs text-slate-500">{cls.type}{cls.room ? ` • ${cls.room}` : ''}</p>
                </div>
                <div className="shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                    <BookOpen className="w-3 h-3" />
                    {cls.type === 'Lab' ? '( P )' : '( T )'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
