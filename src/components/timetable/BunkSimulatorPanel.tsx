import { useState } from 'react'
import { useAppStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { evaluateStatus, calculateOverallAttendance, calculateSimulatedAttendance } from '@/lib/attendance'
import { AlertTriangle, TrendingDown } from 'lucide-react'

export function BunkSimulatorPanel() {
  const { subjects, settings, libraryAttendance, timetable } = useAppStore()
  const [skipCount, setSkipCount] = useState([0])
  
  const skips = skipCount[0]
  const currentPercentage = calculateOverallAttendance(subjects, libraryAttendance)
  const simPercentage = calculateSimulatedAttendance(subjects, skips, libraryAttendance)
  
  const status = evaluateStatus(simPercentage, settings.targetAttendance)

  return (
    <Card className="border-blue-100 shadow-sm sticky top-24">
      <CardHeader className="bg-blue-50/50 pb-4 border-b border-blue-50">
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <AlertTriangle className="w-4 h-4" />
          </div>
          Interactive Bunk Simulator
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-8">
        {skips > 0 && status === 'critical' && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
            <h4 className="font-bold text-rose-700 flex items-center gap-2 text-sm uppercase tracking-wide">
              <AlertTriangle className="w-4 h-4" /> High Risk: Threshold Breach
            </h4>
            <p className="text-rose-900 mt-2 font-medium">
              Skipping {skips} classes drops your aggregate below the {settings.targetAttendance}% cutoff!
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-slate-500">Classes to skip in sequence:</span>
            <span className="text-2xl font-bold text-blue-600">{skips}</span>
          </div>
          
          <Slider
            defaultValue={[0]}
            max={Math.max(20, timetable.length * 2)}
            step={1}
            value={skipCount}
            onValueChange={setSkipCount}
            className="py-4"
          />
          
          <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
            <span>0</span>
            <span>{Math.max(10, timetable.length)}</span>
            <span>{Math.max(20, timetable.length * 2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 font-medium mb-1">Simulated Attendance</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold ${status === 'safe' ? 'text-emerald-600' : status === 'warning' ? 'text-amber-600' : 'text-rose-600'}`}>
                {simPercentage}%
              </span>
            </div>
            {skips > 0 && (
              <p className="text-xs font-semibold text-rose-500 flex items-center mt-1">
                <TrendingDown className="w-3 h-3 mr-1" />
                {(currentPercentage - simPercentage).toFixed(1)}% Drop
              </p>
            )}
          </div>
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 font-medium mb-1">Target Buffer</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold ${simPercentage >= settings.targetAttendance ? 'text-emerald-600' : 'text-rose-600'}`}>
                {(simPercentage - settings.targetAttendance).toFixed(2)}%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Above {settings.targetAttendance}% requirement
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-100">
          <p className="text-sm font-semibold text-slate-900 mb-3">Fast Scenarios</p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => setSkipCount([1])} className="text-xs">
              Skip Next Class
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSkipCount([3])} className="text-xs">
              Skip Next 3 Classes
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSkipCount([timetable.length])} className="text-xs">
              Skip Entire Week
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSkipCount([0])} className="text-xs text-emerald-600 border-emerald-200">
              Reset Simulator
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
