import { SubjectList } from '@/components/subjects/SubjectList'
import { SubjectDialog } from '@/components/subjects/SubjectDialog'
import { LibraryManager } from '@/components/subjects/LibraryManager'
import { TodayClassesWidget } from '@/components/subjects/TodayClassesWidget'

export function Subjects() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Subjects & Attendance Manager</h2>
          <p className="text-slate-500 mt-1">Mark today's attendance, track semester thresholds, and manage subjects</p>
        </div>
        <SubjectDialog />
      </div>

      <TodayClassesWidget />
      <SubjectList />
      <LibraryManager />
    </div>
  )
}
