import { useAppStore } from '@/store'
import { Card } from '@/components/ui/card'
import { format, addDays } from 'date-fns'
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'
import { calculateOverallAttendance, calculateSimulatedAttendance } from '@/lib/attendance'

export function SkipTomorrowWidget() {
  const { subjects, timetable, settings, libraryAttendance } = useAppStore()

  const tomorrow = addDays(new Date(), 1)
  const tomorrowDayName = format(tomorrow, 'EEEE') as any

  const tomorrowsClasses = timetable.filter(t => t.day === tomorrowDayName)

  const currentPercentage = calculateOverallAttendance(subjects, libraryAttendance)
  const simulatedPercentage = calculateSimulatedAttendance(subjects, tomorrowsClasses.length, libraryAttendance)

  const isSafeToSkip = simulatedPercentage >= settings.targetAttendance

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3 overflow-hidden shadow-sm border-0 bg-slate-900 text-white relative">
      <div className="p-8 md:p-12 relative z-10 flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        
        {/* Left Side: Stats */}
        <div className="space-y-6 flex-1 text-center md:text-left w-full">
          <div>
            <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">Can I Skip Tomorrow?</h3>
            <p className="text-slate-400 font-medium">
              Decision matrix for {tomorrowDayName}, {format(tomorrow, 'MMM do')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto md:mx-0">
            <div className="bg-white/10 rounded-xl p-4 border border-white/5">
              <div className="text-slate-400 text-sm font-medium mb-1">Current Attendance</div>
              <div className="text-2xl font-bold">{currentPercentage}%</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 border border-white/5">
              <div className="text-slate-400 text-sm font-medium mb-1">Classes Tomorrow</div>
              <div className="text-2xl font-bold">{tomorrowsClasses.length}</div>
            </div>
          </div>
        </div>

        {/* Right Side: Decision Box */}
        <div className="bg-white rounded-2xl p-6 md:p-8 text-slate-900 shadow-xl min-w-[300px] w-full md:w-auto relative overflow-hidden group">
          {tomorrowsClasses.length === 0 ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="font-bold text-slate-900 text-xl">No classes tomorrow</p>
              <p className="text-slate-500 mt-1">Enjoy your day off!</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">If Missed</div>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-3xl font-bold text-slate-300 line-through decoration-slate-400/30">{currentPercentage}%</span>
                  <ArrowRight className="w-5 h-5 text-slate-400" />
                  <span className="text-4xl font-black text-slate-900">{simulatedPercentage}%</span>
                </div>
              </div>

              {isSafeToSkip ? (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center justify-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  <span className="font-black text-emerald-600 text-xl tracking-tight">SAFE TO SKIP</span>
                </div>
              ) : (
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-center justify-center gap-3">
                  <AlertCircle className="w-8 h-8 text-rose-600" />
                  <span className="font-black text-rose-600 text-xl tracking-tight">MUST ATTEND</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
    </Card>
  )
}
