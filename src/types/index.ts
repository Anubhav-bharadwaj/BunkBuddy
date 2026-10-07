export interface Subject {
  id: string
  name: string
  totalClasses: number
  attendedClasses: number
}

export interface TimetableEntry {
  id: string
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'
  subjectId: string
  startTime: string
  endTime: string
  room?: string
  subjectCode?: string
  type: 'Lecture' | 'Lab' | 'Tutorial'
}

export interface AttendanceRecord {
  id: string
  subjectId: string
  date: string
  present: boolean
}

export interface AIInsight {
  recommendations: string[]
  generatedAt: number
}

export interface LibraryAttendance {
  held: number
  present: number
}

export interface Settings {
  geminiApiKey: string | null
  targetAttendance: number
  userName: string
  courseName: string
  semester: string
}
