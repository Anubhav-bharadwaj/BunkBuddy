import { OverallAttendanceWidget } from '@/components/dashboard/OverallAttendanceWidget'
import { SafeBunksWidget } from '@/components/dashboard/SafeBunksWidget'
import { SkipTomorrowWidget } from '@/components/dashboard/SkipTomorrowWidget'
import { RecoveryWidget } from '@/components/dashboard/RecoveryWidget'
import { RiskHeatmap } from '@/components/dashboard/RiskHeatmap'
import { GoalTracker } from '@/components/dashboard/GoalTracker'
import { SetupBaseAttendanceDialog } from '@/components/dashboard/SetupBaseAttendanceDialog'

export function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Attendance Dashboard</h2>
          <p className="text-slate-500 mt-1">Your live attendance overview and bunk safety check</p>
        </div>
        <SetupBaseAttendanceDialog />
      </div>

      {/* Row 1 — Hero Command Center */}
      <SkipTomorrowWidget />

      {/* Row 2 — KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <OverallAttendanceWidget />
        <SafeBunksWidget />
        <RecoveryWidget />
        <GoalTracker />
      </div>

      {/* Row 3 — Weekly Decision Zone */}
      <RiskHeatmap />

    </div>
  )
}
