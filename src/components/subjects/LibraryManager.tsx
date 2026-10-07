import { useAppStore } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, X, BookOpen } from 'lucide-react'

export function LibraryManager() {
  const { libraryAttendance, updateLibraryAttendance } = useAppStore()

  const percentage = libraryAttendance.held > 0 
    ? (libraryAttendance.present / libraryAttendance.held) * 100 
    : 0

  const handleMark = (present: boolean) => {
    updateLibraryAttendance(
      libraryAttendance.held + 1,
      present ? libraryAttendance.present + 1 : libraryAttendance.present
    )
  }

  return (
    <Card className="overflow-hidden border-indigo-200 shadow-sm mt-6 mb-8">
      <div className="bg-indigo-50 border-b border-indigo-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <BookOpen className="w-5 h-5 text-indigo-700" />
          </div>
          <div>
            <h3 className="font-bold text-indigo-900">Library Attendance</h3>
            <p className="text-xs text-indigo-700">Adds a 10% weightage bonus to your cumulative attendance.</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm font-semibold text-indigo-800">
            {libraryAttendance.present} / {libraryAttendance.held} Sessions
          </p>
          <p className="text-2xl font-bold text-indigo-600">
            {percentage.toFixed(1)}% <span className="text-sm font-medium text-indigo-400">({(percentage * 0.1).toFixed(2)}% Bonus)</span>
          </p>
        </div>
      </div>
      
      <CardContent className="p-4 bg-white flex justify-end gap-3">
        <Button 
          variant="outline" 
          className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 font-medium"
          onClick={() => handleMark(true)}
        >
          <Check className="w-4 h-4 mr-1" /> Attended Library
        </Button>
        <Button 
          variant="outline" 
          className="text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700 font-medium"
          onClick={() => handleMark(false)}
        >
          <X className="w-4 h-4 mr-1" /> Missed Library
        </Button>
      </CardContent>
    </Card>
  )
}
