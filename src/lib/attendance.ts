import type { Subject, LibraryAttendance } from '@/types'

export function calculateLibraryBonus(lib: LibraryAttendance | undefined): number {
  if (!lib || lib.held === 0) return 0
  const libraryPercentage = (lib.present / lib.held) * 100
  // Weightage is 10% of the library percentage
  return libraryPercentage * 0.1
}

export function calculateOverallAttendance(subjects: Subject[], lib?: LibraryAttendance): number {
  const totalClasses = subjects.reduce((sum, s) => sum + s.totalClasses, 0)
  const attendedClasses = subjects.reduce((sum, s) => sum + s.attendedClasses, 0)

  if (totalClasses === 0) return 0
  
  const basePercentage = Math.round((attendedClasses / totalClasses) * 10000) / 100
  
  let bonus = 0
  if (lib && lib.held > 0) {
    const rawBonus = (lib.present / lib.held) * 100 * 0.1
    bonus = Math.round(rawBonus * 100) / 100
  }
  
  return Math.round((basePercentage + bonus) * 100) / 100
}

export function calculateSimulatedAttendance(subjects: Subject[], additionalHeld: number, lib?: LibraryAttendance): number {
  const totalClasses = subjects.reduce((sum, s) => sum + s.totalClasses, 0) + additionalHeld
  const attendedClasses = subjects.reduce((sum, s) => sum + s.attendedClasses, 0)

  if (totalClasses === 0) return 0
  
  const basePercentage = Math.round((attendedClasses / totalClasses) * 10000) / 100
  
  let bonus = 0
  if (lib && lib.held > 0) {
    const rawBonus = (lib.present / lib.held) * 100 * 0.1
    bonus = Math.round(rawBonus * 100) / 100
  }
  
  return Math.round((basePercentage + bonus) * 100) / 100
}

export function calculateSubjectAttendance(subject: Subject): number {
  if (subject.totalClasses === 0) return 0
  return Math.round((subject.attendedClasses / subject.totalClasses) * 1000) / 10
}

export function calculateSafeBunks(subjects: Subject[], target: number = 75, lib?: LibraryAttendance): number {
  const totalClasses = subjects.reduce((sum, s) => sum + s.totalClasses, 0)
  if (totalClasses === 0) return 0

  const currentPercentage = calculateOverallAttendance(subjects, lib)
  if (currentPercentage < target) return 0

  let x = 0
  while (x < 1000) { // Add absolute safety max iteration limit
    // Simulate skipping x+1 classes
    const projectedPercentage = calculateSimulatedAttendance(subjects, x + 1, lib)
    if (projectedPercentage >= target) {
      x++
    } else {
      break
    }
  }

  return x
}

export function calculateRecoveryClasses(subjects: Subject[], target: number = 75, lib?: LibraryAttendance): number {
  const totalClasses = subjects.reduce((sum, s) => sum + s.totalClasses, 0)
  if (totalClasses === 0) return 0

  const currentPercentage = calculateOverallAttendance(subjects, lib)
  if (currentPercentage >= target) return 0

  let n = 0
  while (n < 1000) { // Add absolute safety max iteration limit
    // Simulate attending n classes
    // We do this by artificially bumping attendedClasses and totalClasses
    const simSubjects = subjects.map(s => ({ ...s }))
    
    if (simSubjects.length > 0) {
      simSubjects[0].totalClasses += n
      simSubjects[0].attendedClasses += n
    }

    const projectedPercentage = calculateOverallAttendance(simSubjects, lib)
    if (projectedPercentage >= target) {
      break
    }
    n++
  }

  return n
}

export function evaluateStatus(percentage: number, target: number = 75): 'safe' | 'warning' | 'critical' {
  if (percentage >= target + 5) return 'safe'
  if (percentage >= target) return 'warning'
  return 'critical'
}
