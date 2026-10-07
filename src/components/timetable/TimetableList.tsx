import { useAppStore } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TimetableDialog } from './TimetableDialog'
import { Button } from '@/components/ui/button'
import { Trash2, Clock } from 'lucide-react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function TimetableList() {
  const { timetable, subjects, deleteTimetableEntry } = useAppStore()

  const formatTime12Hour = (time24: string) => {
    if (!time24) return ''
    const [hours, minutes] = time24.split(':')
    const h = parseInt(hours, 10)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${minutes} ${ampm}`
  }

  return (
    <Tabs defaultValue="Monday" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <TabsList className="bg-white border border-slate-200">
          {DAYS.map(day => (
            <TabsTrigger key={day} value={day} className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              {day}
            </TabsTrigger>
          ))}
        </TabsList>
        <TimetableDialog />
      </div>

      {DAYS.map(day => {
        const dayClasses = timetable.filter(t => t.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime))
        
        return (
          <TabsContent key={day} value={day} className="space-y-4 outline-none">
            {dayClasses.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
                No classes scheduled for {day}.
                <div className="mt-4">
                  <TimetableDialog defaultDay={day} />
                </div>
              </div>
            ) : (
              dayClasses.map(entry => {
                const subject = subjects.find(s => s.id === entry.subjectId)
                return (
                  <Card key={entry.id} className="overflow-hidden border-l-4 border-l-blue-500">
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-6">
                          <div className="flex flex-col items-center justify-center bg-slate-50 rounded-lg px-4 py-2 border border-slate-100 min-w-[100px]">
                            <span className="font-semibold text-slate-900">{formatTime12Hour(entry.startTime)}</span>
                            <span className="text-xs text-slate-500">{formatTime12Hour(entry.endTime)}</span>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                {entry.type}
                              </span>
                            </div>
                            <h4 className="font-bold text-slate-900 text-lg mt-1">
                              {subject?.name || 'Unknown Subject'}
                            </h4>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <TimetableDialog entryId={entry.id} />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            onClick={() => {
                              if(confirm('Delete class?')) deleteTimetableEntry(entry.id)
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
