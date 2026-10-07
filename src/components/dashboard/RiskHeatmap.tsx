import { useState } from 'react'
import { useAppStore } from '@/store'
import { Card } from '@/components/ui/card'
import { evaluateStatus, calculateOverallAttendance, calculateSimulatedAttendance } from '@/lib/attendance'
import { cn } from '@/lib/utils'
import { Calendar, TrendingDown, AlertTriangle, ShieldCheck } from 'lucide-react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function RiskHeatmap() {
  const { subjects, timetable, settings, libraryAttendance } = useAppStore()
  
  // Start with today or first day
  const defaultDay = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const initialDay = DAYS.includes(defaultDay) ? defaultDay : 'Monday'
  const [selectedDay, setSelectedDay] = useState<string>(initialDay)

  const currentPercentage = calculateOverallAttendance(subjects, libraryAttendance)

  // Buffer calculation
  const buffer = currentPercentage - settings.targetAttendance

  const selectedDayClasses = timetable.filter(t => t.day === selectedDay)
  const simPercentage = calculateSimulatedAttendance(subjects, selectedDayClasses.length, libraryAttendance)
  const selectedStatus = selectedDayClasses.length === 0 ? 'safe' : evaluateStatus(simPercentage, settings.targetAttendance)

  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm p-0">
      <div className="bg-slate-50 border-b border-slate-100 p-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-slate-500" />
          <h3 className="font-semibold text-slate-900">Weekly Decision Zone</h3>
        </div>
      </div>

      <div className="p-6 md:p-8 flex flex-col md:flex-row gap-12">
        {/* Left Side: The Heatmap selector */}
        <div className="flex-1">
          <div className="flex justify-between items-center max-w-lg mx-auto">
            {DAYS.map((day) => {
              const dayClasses = timetable.filter(t => t.day === day)
              const dSimPercentage = calculateSimulatedAttendance(subjects, dayClasses.length, libraryAttendance)
              const status = dayClasses.length === 0 ? 'safe' : evaluateStatus(dSimPercentage, settings.targetAttendance)
              
              const isSelected = selectedDay === day
              
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className="flex flex-col items-center gap-3 group relative outline-none"
                >
                  <span className={cn(
                    "text-sm font-semibold transition-colors",
                    isSelected ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
                  )}>
                    {day.slice(0, 3)}
                  </span>
                  
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ring-offset-2",
                    isSelected ? "ring-2 ring-slate-400 scale-110 shadow-md" : "hover:scale-105",
                    dayClasses.length === 0 ? "bg-slate-100" :
                    status === 'safe' ? "bg-emerald-100 text-emerald-600" :
                    status === 'warning' ? "bg-amber-100 text-amber-600" :
                    "bg-rose-100 text-rose-600"
                  )}>
                    <div className={cn(
                      "w-4 h-4 rounded-full",
                      dayClasses.length === 0 ? "bg-slate-300" :
                      status === 'safe' ? "bg-emerald-500" :
                      status === 'warning' ? "bg-amber-500" :
                      "bg-rose-500"
                    )} />
                  </div>
                  
                  {isSelected && (
                    <div className="absolute -bottom-4 w-1.5 h-1.5 bg-slate-900 rounded-full" />
                  )}
                  <span className="text-[10px] font-medium text-slate-400">
                    {dayClasses.length === 0 ? 'Free' : `${dayClasses.length} cls`}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Buffer Gauge */}
          <div className="mt-12 max-w-lg mx-auto">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-slate-500">Attendance Buffer Gauge</span>
              <span className={buffer >= 0 ? "text-emerald-600" : "text-rose-600"}>
                {buffer >= 0 ? `+${buffer.toFixed(1)}% Safe` : `${buffer.toFixed(1)}% Danger`}
              </span>
            </div>
            
            <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden flex items-center">
              {/* Target Line marker */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-20" 
                style={{ left: '50%' }}
              />
              
              {/* Target Line label */}
              <div 
                className="absolute -top-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider z-20 -ml-[18px]" 
                style={{ left: '50%' }}
              >
                Target
              </div>

              {buffer >= 0 ? (
                <div 
                  className="absolute left-1/2 top-0 bottom-0 bg-emerald-400 z-10 transition-all duration-500"
                  style={{ width: `${Math.min((buffer / (100 - settings.targetAttendance)) * 50, 50)}%` }}
                />
              ) : (
                <div 
                  className="absolute right-1/2 top-0 bottom-0 bg-rose-400 z-10 transition-all duration-500"
                  style={{ width: `${Math.min((Math.abs(buffer) / settings.targetAttendance) * 50, 50)}%` }}
                />
              )}
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
              <span>0%</span>
              <span className="translate-x-3">{settings.targetAttendance}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Right Side: Details Panel */}
        <div className="w-full md:w-72 shrink-0 bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-center">
          {selectedDayClasses.length === 0 ? (
            <div className="text-center">
              <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-slate-900">No classes</h4>
              <p className="text-slate-500 text-sm mt-1">Enjoy your {selectedDay}.</p>
            </div>
          ) : (
            <div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">Skip {selectedDay}?</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Attendance becomes</div>
                  <div className="text-3xl font-black text-slate-900 flex items-center gap-2">
                    {simPercentage}%
                    <TrendingDown className="w-5 h-5 text-rose-500" />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-200">
                  <div className="text-sm text-slate-500 mb-1">Risk Assessment</div>
                  {selectedStatus === 'safe' && (
                    <div className="inline-flex items-center gap-2 text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg font-bold text-sm">
                      <ShieldCheck className="w-4 h-4" /> LOW RISK
                    </div>
                  )}
                  {selectedStatus === 'warning' && (
                    <div className="inline-flex items-center gap-2 text-amber-700 bg-amber-100 px-3 py-1.5 rounded-lg font-bold text-sm">
                      <AlertTriangle className="w-4 h-4" /> MEDIUM RISK
                    </div>
                  )}
                  {selectedStatus === 'critical' && (
                    <div className="inline-flex items-center gap-2 text-rose-700 bg-rose-100 px-3 py-1.5 rounded-lg font-bold text-sm">
                      <AlertTriangle className="w-4 h-4" /> HIGH RISK
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
