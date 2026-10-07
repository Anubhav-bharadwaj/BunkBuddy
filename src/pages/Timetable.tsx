import { useAppStore } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit2 } from 'lucide-react'
import { TimetableDialog } from '@/components/timetable/TimetableDialog'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const PERIODS = [
  { id: 'P1', label: 'P1', time: '9:00 AM', match: '09:00' },
  { id: 'P2', label: 'P2', time: '9:50 AM', match: '09:50' },
  { id: 'P3', label: 'P3', time: '10:40 AM', match: '10:40' },
  { id: 'P4', label: 'P4', time: '11:30 AM', match: '11:30' },
  { id: 'BREAK', label: 'Break', time: '', isBreak: true },
  { id: 'P5', label: 'P5', time: '12:40 PM', match: '12:40' },
  { id: 'P6', label: 'P6', time: '1:30 PM', match: '13:30' },
  { id: 'P7', label: 'P7', time: '2:20 PM', match: '14:20' },
  { id: 'P8', label: 'P8', time: '3:10 PM', match: '15:10' },
]

export function Timetable() {
  const { timetable, subjects } = useAppStore()

  const getEntryForSlot = (day: string, timeMatch: string) => {
    return timetable.find(t => t.day === day && t.startTime === timeMatch)
  }

  const getSubjectName = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId)?.name || 'Unknown'
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Weekly Timetable</h2>
          <p className="text-slate-500 mt-1">Manage your weekly class schedule</p>
        </div>
        <TimetableDialog />
      </div>

      <Card className="overflow-hidden border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse bg-white">
            <thead>
              <tr>
                <th className="border-b border-r border-slate-200 bg-slate-50 p-4 text-left font-bold text-slate-700 w-24">
                  Day
                </th>
                {PERIODS.map((period) => (
                  <th key={period.id} className="border-b border-r border-slate-200 bg-slate-50 p-3 text-center w-32">
                    {period.isBreak ? (
                      <div className="text-slate-500 font-bold tracking-wide">Break</div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-slate-800">{period.label}</span>
                        <span className="text-xs text-slate-400 font-medium">{period.time}</span>
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day) => (
                <tr key={day} className="hover:bg-slate-50/50 transition-colors">
                  <td className="border-b border-r border-slate-200 p-4 font-semibold text-slate-700 bg-slate-50/30">
                    {day.substring(0, 3)}
                  </td>
                  {PERIODS.map((period) => {
                    if (period.isBreak) {
                      return (
                        <td key={`${day}-${period.id}`} className="border-b border-r border-slate-100 bg-slate-50/80">
                          {/* Empty break cell */}
                        </td>
                      )
                    }

                    const entry = getEntryForSlot(day, period.match!)
                    
                    return (
                      <td key={`${day}-${period.id}`} className="border-b border-r border-slate-100 p-2 text-center h-20 transition-all hover:bg-blue-50/30">
                        {entry ? (
                          <div className="flex flex-col items-center justify-center h-full">
                            <span className="text-sm font-semibold text-slate-800 leading-tight">
                              {getSubjectName(entry.subjectId)}
                            </span>
                            {entry.subjectCode && (
                              <span className="text-xs font-mono font-bold text-blue-600 mt-0.5">
                                {entry.subjectCode}
                              </span>
                            )}
                            {entry.room && (
                              <span className="text-xs font-mono text-slate-500 mt-0.5">
                                [{entry.room}]
                              </span>
                            )}
                            <div className="mt-1.5">
                              <TimetableDialog entryId={entry.id} />
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <TimetableDialog defaultDay={day} defaultPeriodStart={period.match} />
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
