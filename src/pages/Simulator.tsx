import { TimetableList } from '@/components/timetable/TimetableList'
import { BunkSimulatorPanel } from '@/components/timetable/BunkSimulatorPanel'
import { useAppStore } from '@/store'
import { Clock } from 'lucide-react'

export function Simulator() {
  const { timetable } = useAppStore()

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Timetable & Simulator</h2>
          <p className="text-slate-500 mt-1">Manage your weekly schedule and forecast attendance risks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Weekly Workload</p>
                <p className="text-2xl font-bold text-slate-900">{timetable.length} <span className="text-lg font-medium text-slate-500">Scheduled Classes</span></p>
              </div>
            </div>
          </div>
          
          <TimetableList />
        </div>

        <div className="lg:col-span-1">
          <BunkSimulatorPanel />
        </div>
      </div>
    </div>
  )
}
