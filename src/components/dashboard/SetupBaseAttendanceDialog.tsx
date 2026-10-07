import { useState, useEffect } from 'react'
import { useAppStore } from '@/store'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Settings2 } from 'lucide-react'

export function SetupBaseAttendanceDialog() {
  const { subjects, updateSubject, libraryAttendance, updateLibraryAttendance } = useAppStore()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<Record<string, { held: number, attended: number }>>({})
  const [libHeld, setLibHeld] = useState(0)
  const [libAttended, setLibAttended] = useState(0)

  useEffect(() => {
    if (open) {
      const initialData: Record<string, { held: number, attended: number }> = {}
      subjects.forEach(s => {
        initialData[s.id] = { held: s.totalClasses, attended: s.attendedClasses }
      })
      setFormData(initialData)
      setLibHeld(libraryAttendance.held)
      setLibAttended(libraryAttendance.present)
    }
  }, [open, subjects, libraryAttendance])

  const handleSave = () => {
    subjects.forEach(s => {
      const data = formData[s.id]
      if (data) {
        updateSubject({
          ...s,
          totalClasses: Number(data.held),
          attendedClasses: Number(data.attended)
        })
      }
    })
    updateLibraryAttendance(Number(libHeld), Number(libAttended))
    setOpen(false)
  }

  const handleChange = (id: string, field: 'held' | 'attended', value: string) => {
    setFormData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: Number(value)
      }
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-white hover:bg-slate-50 text-slate-700 border-slate-200">
          <Settings2 className="w-4 h-4 text-blue-500" />
          Set Base Attendance
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Set Base Attendance</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <p className="text-sm text-slate-500">
            Manually enter your current accumulated attendance for each subject to establish a baseline.
          </p>
          
          {subjects.length === 0 ? (
            <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
              No subjects found. Add subjects in the Timetable or Subjects tab first.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
                <div className="col-span-8">Subject</div>
                <div className="col-span-2 text-center">Held</div>
                <div className="col-span-2 text-center">Present</div>
              </div>
              
              <div className="space-y-2">
                {subjects.map(subject => (
                  <div key={subject.id} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="col-span-8 font-semibold text-slate-800 text-sm leading-snug">
                      {subject.name}
                    </div>
                    <div className="col-span-2">
                      <Input 
                        type="number" 
                        min="0"
                        className="h-9 text-center bg-white font-medium px-1"
                        value={formData[subject.id]?.held ?? 0}
                        onChange={(e) => handleChange(subject.id, 'held', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input 
                        type="number" 
                        min="0"
                        max={formData[subject.id]?.held || 0}
                        className="h-9 text-center bg-white font-medium px-1"
                        value={formData[subject.id]?.attended ?? 0}
                        onChange={(e) => handleChange(subject.id, 'attended', e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                {/* Library Attendance Row */}
                <div className="grid grid-cols-12 gap-2 items-center bg-blue-50/50 p-3 rounded-xl border border-blue-100 mt-4">
                  <div className="col-span-8 font-semibold text-blue-900 text-sm leading-snug">
                    Library Attendance <span className="text-blue-500 font-normal text-xs ml-1">(10% Bonus)</span>
                  </div>
                  <div className="col-span-2">
                    <Input 
                      type="number" 
                      min="0"
                      className="h-9 text-center bg-white font-medium border-blue-200 px-1"
                      value={libHeld}
                      onChange={(e) => setLibHeld(Number(e.target.value))}
                    />
                  </div>
                  <div className="col-span-2">
                    <Input 
                      type="number" 
                      min="0"
                      max={libHeld || 0}
                      className="h-9 text-center bg-white font-medium border-blue-200 px-1"
                      value={libAttended}
                      onChange={(e) => setLibAttended(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <Button onClick={handleSave} className="w-full">
                  Save Attendance Baseline
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
