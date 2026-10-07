import { useAppStore } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { calculateSubjectAttendance } from '@/lib/attendance'
import { Check, X } from 'lucide-react'

export function SubjectOverviewCards() {
  const { subjects, markAttendance } = useAppStore()

  if (subjects.length === 0) {
    return null
  }

  return (
    <div className="space-y-4 mt-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Subject Ledger & Live Steppers</h3>
        <span className="text-sm text-slate-500">Tap +/- to instantly simulate ledger shifts</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {subjects.map((subject) => {
          const percentage = calculateSubjectAttendance(subject)
          
          return (
            <Card key={subject.id} className="overflow-hidden">
              <div className="h-1 bg-slate-100 w-full">
                <div 
                  className="h-full bg-blue-500" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 line-clamp-1" title={subject.name}>
                      {subject.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {subject.attendedClasses} / {subject.totalClasses} Held
                    </p>
                  </div>
                  <span className="text-lg font-bold text-slate-700">
                    {percentage}%
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    className="h-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 font-medium"
                    onClick={() => markAttendance(subject.id, true)}
                  >
                    <Check className="w-3.5 h-3.5 mr-1" /> Present
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-8 text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 font-medium"
                    onClick={() => markAttendance(subject.id, false)}
                  >
                    <X className="w-3.5 h-3.5 mr-1" /> Absent
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
