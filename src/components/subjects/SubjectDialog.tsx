import { useState } from 'react'
import { useAppStore } from '@/store'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function SubjectDialog({ subjectId }: { subjectId?: string }) {
  const { subjects, addSubject, updateSubject } = useAppStore()
  const [open, setOpen] = useState(false)
  
  const existingSubject = subjectId ? subjects.find(s => s.id === subjectId) : null

  const [name, setName] = useState(existingSubject?.name || '')
  const [totalClasses, setTotalClasses] = useState(existingSubject?.totalClasses || 0)
  const [attendedClasses, setAttendedClasses] = useState(existingSubject?.attendedClasses || 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (existingSubject) {
      updateSubject({
        ...existingSubject,
        name,
        totalClasses: Number(totalClasses),
        attendedClasses: Number(attendedClasses),
      })
    } else {
      addSubject({
        id: Date.now().toString(),
        name,
        totalClasses: Number(totalClasses),
        attendedClasses: Number(attendedClasses),
      })
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={existingSubject ? "outline" : "default"}>
          {existingSubject ? "Edit" : "Add New Subject"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{existingSubject ? "Edit Subject" : "Add Subject"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Subject Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e: any) => setName(e.target.value)} 
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total">Total Classes</Label>
              <Input 
                id="total" 
                type="number" 
                min={0}
                value={totalClasses} 
                onChange={(e: any) => setTotalClasses(Number(e.target.value))} 
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attended">Attended</Label>
              <Input 
                id="attended" 
                type="number" 
                min={0}
                max={totalClasses}
                value={attendedClasses} 
                onChange={(e: any) => setAttendedClasses(Number(e.target.value))} 
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full mt-4">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
