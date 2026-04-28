export type SessionType = 'V' | 'Q' | 'P'

export interface StudyBlock {
  id: string
  tipo: SessionType
  materia: string
  titulo: string
  desc: string
}

export interface StudyMonth {
  mes: number
  titulo: string
  blocos: StudyBlock[]
}

export interface StudySession extends StudyBlock {
  mes: number
  mesTitulo: string
  rep: number
  sessionId: string
}

export interface SessionProgress {
  done: boolean
  questions: number
  correct: number
  wrong: number
  done_at?: string | null
  notes?: string
}

export type ProgressMap = Record<string, SessionProgress | undefined>

export interface MonthProgress {
  done: number
  total: number
  pct: number
}

export interface SubjectStats {
  done: number
  total: number
  questions: number
  correct: number
  wrong: number
  accuracy: number
  completion: number
  lastStudyAt: string | null
  notesCount: number
}

export interface ReviewItem {
  session: StudySession
  state: SessionProgress
  dueDate: string
  reason: string
  priority: 'alta' | 'media' | 'baixa'
  daysOverdue: number
}

export interface RiskItem {
  subject: string
  risk: number
  label: 'seguro' | 'atenção' | 'risco alto'
  reason: string
  accuracy: number
  completion: number
  wrong: number
  lastStudyAt: string | null
}

export interface MistakeCard {
  session: StudySession
  state: SessionProgress
  title: string
  hint: string
}

export interface NextAction {
  session: StudySession | null
  reason: string
  actionLabel: string
}
