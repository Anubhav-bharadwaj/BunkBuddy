import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Subject, TimetableEntry, AttendanceRecord, Settings, AIInsight, LibraryAttendance } from '@/types'

interface AppState {
  subjects: Subject[]
  timetable: TimetableEntry[]
  attendanceHistory: AttendanceRecord[]
  settings: Settings
  aiInsight: AIInsight | null
  libraryAttendance: LibraryAttendance

  // Actions
  addSubject: (subject: Subject) => void
  updateSubject: (subject: Subject) => void
  deleteSubject: (id: string) => void
  markAttendance: (subjectId: string, present: boolean) => string
  addTimetableEntry: (entry: TimetableEntry) => void
  updateTimetableEntry: (entry: TimetableEntry) => void
  deleteTimetableEntry: (id: string) => void
  updateSettings: (settings: Partial<Settings>) => void
  setAIInsight: (insight: AIInsight) => void
  updateLibraryAttendance: (held: number, present: number) => void
  getOrCreateSubject: (name: string, type?: 'Lecture' | 'Lab' | 'Tutorial') => string
  undoAttendance: (historyId: string) => void
  resetData: () => void
}

const initialDemoData = {
  subjects: [],
  timetable: [],
  attendanceHistory: [],
  settings: {
    geminiApiKey: null,
    targetAttendance: 75,
    userName: 'Student',
    courseName: 'CS',
    semester: 'Semester 5',
  },
  aiInsight: null,
  libraryAttendance: { held: 0, present: 0 },
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialDemoData,

      addSubject: (subject) =>
        set((state) => ({ subjects: [...state.subjects, subject] })),
      updateSubject: (subject) =>
        set((state) => ({
          subjects: state.subjects.map((s) => (s.id === subject.id ? subject : s)),
        })),
      deleteSubject: (id) =>
        set((state) => ({
          subjects: state.subjects.filter((s) => s.id !== id),
          timetable: state.timetable.filter((t) => t.subjectId !== id),
          attendanceHistory: state.attendanceHistory.filter((h) => h.subjectId !== id),
        })),

      markAttendance: (subjectId, present) => {
        const newHistoryId = Date.now().toString()
        set((state) => {
          const newHistoryRecord: AttendanceRecord = {
            id: newHistoryId,
            subjectId,
            date: new Date().toISOString(),
            present,
          }
          return {
            subjects: state.subjects.map((s) => {
              if (s.id === subjectId) {
                return {
                  ...s,
                  totalClasses: s.totalClasses + 1,
                  attendedClasses: present ? s.attendedClasses + 1 : s.attendedClasses,
                }
              }
              return s
            }),
            attendanceHistory: [...state.attendanceHistory, newHistoryRecord],
          }
        })
        return newHistoryId
      },

      addTimetableEntry: (entry) =>
        set((state) => {
          // If a slot already exists for this day+time, replace it instead of duplicating
          const existingIndex = state.timetable.findIndex(
            t => t.day === entry.day && t.startTime === entry.startTime
          )
          if (existingIndex !== -1) {
            const updated = [...state.timetable]
            updated[existingIndex] = entry
            return { timetable: updated }
          }
          return { timetable: [...state.timetable, entry] }
        }),
      updateTimetableEntry: (entry) =>
        set((state) => ({
          timetable: state.timetable.map((t) => (t.id === entry.id ? entry : t)),
        })),
      deleteTimetableEntry: (id) =>
        set((state) => ({ timetable: state.timetable.filter((t) => t.id !== id) })),

      updateSettings: (newSettings) =>
        set((state) => ({ settings: { ...state.settings, ...newSettings } })),

      setAIInsight: (insight) => set({ aiInsight: insight }),
      updateLibraryAttendance: (held, present) => set({ libraryAttendance: { held, present } }),

      getOrCreateSubject: (name, type) => {
        let baseName = name.trim()
        // Strip trailing (T), (P), ( T ), ( P ) if user entered it manually
        baseName = baseName.replace(/\s*\(\s*[TP]\s*\)$/i, '').trim()
        
        const suffix = type === 'Lab' ? ' ( P )' : type === 'Lecture' ? ' ( T )' : ''
        const fullName = baseName + suffix

        const { subjects } = get()
        const existing = subjects.find(s => s.name.toLowerCase() === fullName.toLowerCase())
        if (existing) return existing.id
        
        const newId = Date.now().toString()
        const newSubject = { id: newId, name: fullName, totalClasses: 0, attendedClasses: 0 }
        set({ subjects: [...subjects, newSubject] })
        return newId
      },

      undoAttendance: (historyId) =>
        set((state) => {
          const record = state.attendanceHistory.find(h => h.id === historyId)
          if (!record) return state
          
          return {
            subjects: state.subjects.map(s => {
              if (s.id === record.subjectId) {
                return {
                  ...s,
                  totalClasses: Math.max(0, s.totalClasses - 1),
                  attendedClasses: record.present ? Math.max(0, s.attendedClasses - 1) : s.attendedClasses
                }
              }
              return s
            }),
            attendanceHistory: state.attendanceHistory.filter(h => h.id !== historyId)
          }
        }),

      resetData: () => set({ ...initialDemoData }),
    }),
    {
      name: 'bunkbuddy-storage',
    }
  )
)
