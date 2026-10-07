import { useState } from 'react'
import { useAppStore } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { calculateSubjectAttendance } from '@/lib/attendance'
import { Check, X, Trash2, Search } from 'lucide-react'
import { SubjectDialog } from './SubjectDialog'

export function SubjectList() {
  const { subjects, markAttendance, deleteSubject, settings } = useAppStore()
  const [query, setQuery] = useState('')

  const filtered = subjects
    .filter(s => s.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      const aIsP = a.name.includes('( P )')
      const bIsP = b.name.includes('( P )')
      if (aIsP !== bIsP) return aIsP ? 1 : -1  // T before P
      return a.name.localeCompare(b.name)        // alphabetical within group
    })

  if (subjects.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No subjects added yet. Click "Add New Subject" to get started.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search subjects..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 bg-slate-50 border-slate-200"
        />
      </div>

      {filtered.length === 0 && (
        <p className="text-slate-500 text-sm py-4">No subjects match "{query}".</p>
      )}

      {filtered.map((subject) => {
        const percentage = calculateSubjectAttendance(subject)
        const isSafe = percentage >= settings.targetAttendance
        
        return (
          <Card key={subject.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-6 p-4">
              <div className="flex-1 w-full md:w-auto flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 text-lg">{subject.name}</h4>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-slate-500">
                      {subject.attendedClasses} / {subject.totalClasses} Held
                    </span>
                    <span className={isSafe ? "text-emerald-600 font-medium text-sm" : "text-rose-600 font-medium text-sm"}>
                      {percentage}%
                    </span>
                  </div>
                </div>
                
                <div className="w-full md:w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={isSafe ? "h-full bg-emerald-500 transition-all" : "h-full bg-rose-500 transition-all"} 
                    style={{
                      width: isSafe
                        ? `${Math.min(((percentage - settings.targetAttendance) / (100 - settings.targetAttendance)) * 100, 100)}%`
                        : `${Math.min(((settings.targetAttendance - percentage) / settings.targetAttendance) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Button 
                  variant="outline" 
                  className="flex-1 md:flex-none text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 font-medium"
                  onClick={() => markAttendance(subject.id, true)}
                >
                  <Check className="w-4 h-4 mr-1" /> Present
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 md:flex-none text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 font-medium"
                  onClick={() => markAttendance(subject.id, false)}
                >
                  <X className="w-4 h-4 mr-1" /> Absent
                </Button>
                <SubjectDialog subjectId={subject.id} />
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  onClick={() => {
                    if(confirm('Are you sure you want to delete this subject?')) deleteSubject(subject.id)
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
