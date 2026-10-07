import { useState, useEffect } from 'react'
import { useAppStore } from '@/store'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Fixed periods matching the timetable grid
const PERIODS = [
  { label: 'P1', startTime: '09:00', endTime: '09:50' },
  { label: 'P2', startTime: '09:50', endTime: '10:40' },
  { label: 'P3', startTime: '10:40', endTime: '11:30' },
  { label: 'P4', startTime: '11:30', endTime: '12:20' },
  { label: 'P5', startTime: '12:40', endTime: '13:30' },
  { label: 'P6', startTime: '13:30', endTime: '14:20' },
  { label: 'P7', startTime: '14:20', endTime: '15:10' },
  { label: 'P8', startTime: '15:10', endTime: '16:00' },
]

export function TimetableDialog({ entryId, defaultDay, defaultPeriodStart }: { entryId?: string, defaultDay?: string, defaultPeriodStart?: string }) {
  const { timetable, subjects, addTimetableEntry, updateTimetableEntry, getOrCreateSubject } = useAppStore()
  const [open, setOpen] = useState(false)
  
  const existing = entryId ? timetable.find(t => t.id === entryId) : null
  const existingSubject = existing ? subjects.find(s => s.id === existing.subjectId) : null
  const existingPeriod = existing
    ? PERIODS.find(p => p.startTime === existing.startTime)?.startTime ?? PERIODS[0].startTime
    : defaultPeriodStart || PERIODS[0].startTime

  const [day, setDay] = useState<any>(existing?.day || defaultDay || 'Monday')
  const [subjectName, setSubjectName] = useState(existingSubject?.name || '')
  const [subjectCode, setSubjectCode] = useState(existing?.subjectCode || '')
  const [selectedPeriodStart, setSelectedPeriodStart] = useState(existingPeriod)
  const [room, setRoom] = useState(existing?.room || '')
  const [type, setType] = useState<any>(existing?.type || 'Lecture')

  useEffect(() => {
    if (open) {
      setDay(existing?.day || defaultDay || 'Monday')
      setSubjectName(existingSubject?.name || '')
      setSubjectCode(existing?.subjectCode || '')
      setSelectedPeriodStart(existingPeriod)
      setRoom(existing?.room || '')
      setType(existing?.type || 'Lecture')
    }
  }, [open, existing, defaultDay, existingSubject, existingPeriod])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subjectName.trim()) return alert('Enter a subject name')

    const period = PERIODS.find(p => p.startTime === selectedPeriodStart) || PERIODS[0]
    const subjectId = getOrCreateSubject(subjectName.trim(), type)

    if (existing) {
      updateTimetableEntry({
        id: existing.id, day, subjectId, subjectCode,
        startTime: period.startTime, endTime: period.endTime, room, type
      })
    } else {
      addTimetableEntry({
        id: Date.now().toString(), day, subjectId, subjectCode,
        startTime: period.startTime, endTime: period.endTime, room, type
      })
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={existing ? "ghost" : "default"} size={existing ? "sm" : "default"}>
          {existing ? "Edit" : "Add Class"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{existing ? "Edit Class" : "Add Class"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Day</Label>
            <Select value={day} onValueChange={setDay}>
              <SelectTrigger><SelectValue placeholder="Select day" /></SelectTrigger>
              <SelectContent>
                {DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Subject Name</Label>
              <Input
                placeholder="e.g. Cloud Computing"
                value={subjectName}
                onChange={(e: any) => setSubjectName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Subject Code</Label>
              <Input
                placeholder="e.g. CS401, DAA"
                value={subjectCode}
                onChange={(e: any) => setSubjectCode(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Period</Label>
            <Select value={selectedPeriodStart} onValueChange={setSelectedPeriodStart}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PERIODS.map(p => (
                  <SelectItem key={p.startTime} value={p.startTime}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Room</Label>
            <Input placeholder="e.g. B209, CSE Lab 14" value={room} onChange={(e: any) => setRoom(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Lecture">Lecture</SelectItem>
                <SelectItem value="Lab">Lab</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full mt-4">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
