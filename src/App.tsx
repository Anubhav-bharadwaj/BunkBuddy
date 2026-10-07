import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Dashboard } from '@/pages/Dashboard'
import { Subjects } from '@/pages/Subjects'
import { Timetable } from '@/pages/Timetable'
import { Simulator } from '@/pages/Simulator'
import { AIRecovery } from '@/pages/AIRecovery'
import { Settings } from '@/pages/Settings'
import { useAppStore } from '@/store'

function App() {
  const currentPath = window.location.pathname

  useEffect(() => {
    // One-time migration for existing data
    const store = useAppStore.getState()
    let migrated = false
    
    const updatedSubjects = [...store.subjects]
    const updatedTimetable = [...store.timetable]

    store.subjects.forEach(subject => {
      if (subject.name.match(/\(\s*[TP]\s*\)/i)) return
      
      const entries = store.timetable.filter(t => t.subjectId === subject.id)
      
      if (entries.length > 0) {
        // Find all unique types this subject has
        const types = Array.from(new Set(entries.map(e => e.type)))
        
        // The first type takes over the existing subject ID
        const firstType = types[0]
        const firstSuffix = firstType === 'Lab' ? ' ( P )' : ' ( T )'
        const existingIndex = updatedSubjects.findIndex(s => s.id === subject.id)
        if (existingIndex !== -1) {
          updatedSubjects[existingIndex] = { 
            ...subject, 
            name: subject.name.trim() + firstSuffix 
          }
          migrated = true
        }

        // For any additional types (e.g. Lab), create a clone of the subject
        for (let i = 1; i < types.length; i++) {
          const newType = types[i]
          const newSuffix = newType === 'Lab' ? ' ( P )' : ' ( T )'
          const newId = `migrated-${subject.id}-${newType}`
          
          updatedSubjects.push({
            id: newId,
            name: subject.name.trim() + newSuffix,
            totalClasses: 0,
            attendedClasses: 0
          })
          
          // Point the timetable entries to the new subject ID
          updatedTimetable.forEach(t => {
            if (t.subjectId === subject.id && t.type === newType) {
              t.subjectId = newId
            }
          })
          migrated = true
        }
      } else {
        // Not in timetable, guess based on name
        migrated = true
        const existingIndex = updatedSubjects.findIndex(s => s.id === subject.id)
        if (subject.name.toLowerCase().includes('lab')) {
          updatedSubjects[existingIndex] = { ...subject, name: subject.name.replace(/lab/i, '').trim() + ' ( P )' }
        } else {
          updatedSubjects[existingIndex] = { ...subject, name: subject.name.trim() + ' ( T )' }
        }
      }
    })

    if (migrated) {
      useAppStore.setState({ subjects: updatedSubjects, timetable: updatedTimetable })
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/ai-recovery" element={<AIRecovery />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
