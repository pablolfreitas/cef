import type {
  MistakeCard,
  NextAction,
  ProgressMap,
  ReviewItem,
  RiskItem,
  SessionProgress,
  StudySession,
  SubjectStats,
} from '../types/study'

const DAY_MS = 24 * 60 * 60 * 1000

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n))
}

function asDateOnly(date: Date) {
  return date.toISOString().split('T')[0]
}

function safeDate(value?: string | null) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function daysBetween(a: Date, b: Date) {
  return Math.floor((asDateOnly(a) === asDateOnly(b) ? 0 : (a.getTime() - b.getTime()) / DAY_MS))
}

export function emptyProgress(): SessionProgress {
  return { done: false, questions: 0, correct: 0, wrong: 0, done_at: null, notes: '' }
}

export function normalizeProgress(value: Partial<SessionProgress> | undefined): SessionProgress {
  const questions = Math.max(0, Number(value?.questions) || 0)
  const correct = Math.max(0, Number(value?.correct) || 0)
  const wrong = Math.max(0, Number(value?.wrong) || 0)
  return {
    done: Boolean(value?.done),
    questions: correct > 0 || wrong > 0 ? correct + wrong : questions,
    correct,
    wrong,
    done_at: value?.done_at ?? null,
    notes: value?.notes ?? '',
  }
}

export function buildSubjectStats(sessions: StudySession[], progress: ProgressMap): Record<string, SubjectStats> {
  const stats: Record<string, SubjectStats> = {}

  sessions.forEach(session => {
    const state = normalizeProgress(progress[session.sessionId])
    const subject = session.materia

    if (!stats[subject]) {
      stats[subject] = {
        done: 0,
        total: 0,
        questions: 0,
        correct: 0,
        wrong: 0,
        accuracy: 0,
        completion: 0,
        lastStudyAt: null,
        notesCount: 0,
      }
    }

    const item = stats[subject]
    item.total += 1
    item.questions += state.questions
    item.correct += state.correct
    item.wrong += state.wrong
    if (state.done) item.done += 1
    if ((state.notes ?? '').trim()) item.notesCount += 1

    const currentDate = safeDate(state.done_at)
    const lastDate = safeDate(item.lastStudyAt)
    if (currentDate && (!lastDate || currentDate > lastDate)) {
      item.lastStudyAt = currentDate.toISOString()
    }
  })

  Object.values(stats).forEach(item => {
    item.accuracy = item.questions > 0 ? Math.round((item.correct / item.questions) * 100) : 0
    item.completion = item.total > 0 ? Math.round((item.done / item.total) * 100) : 0
  })

  return stats
}

export function getNextAction(sessions: StudySession[], progress: ProgressMap): NextAction {
  const dueReviews = getReviewQueue(sessions, progress).filter(item => item.daysOverdue >= 0)
  if (dueReviews.length > 0) {
    const first = dueReviews[0]
    return {
      session: first.session,
      reason: first.reason,
      actionLabel: 'Revisar agora',
    }
  }

  const next = sessions.find(session => !progress[session.sessionId]?.done) ?? null
  if (!next) {
    return {
      session: null,
      reason: 'Você concluiu todas as sessões do ciclo. Use as estatísticas para revisar pontos fracos.',
      actionLabel: 'Ciclo completo',
    }
  }

  const repText = next.rep === 1 ? 'aprender' : next.rep === 2 ? 'fixar' : 'revisar para a prova'
  return {
    session: next,
    reason: `Próxima sessão em ordem. Rodada ${next.rep}: ${repText}.`,
    actionLabel: 'Começar sessão',
  }
}

export function getReviewQueue(sessions: StudySession[], progress: ProgressMap, today = new Date()): ReviewItem[] {
  return sessions
    .map(session => {
      const state = progress[session.sessionId]
      if (!state?.done || !state.done_at) return null

      const doneAt = safeDate(state.done_at)
      if (!doneAt) return null

      const questions = Number(state.questions) || 0
      const accuracy = questions > 0 ? Math.round(((Number(state.correct) || 0) / questions) * 100) : 100
      const hasNotes = Boolean((state.notes ?? '').trim())
      const hasErrors = (Number(state.wrong) || 0) > 0

      let interval = 14
      let reason = 'Revisão de manutenção para consolidar memória.'
      let priority: ReviewItem['priority'] = 'baixa'

      if (hasNotes || accuracy < 60) {
        interval = 1
        reason = hasNotes ? 'Há anotação pendente: transforme a dúvida em revisão ativa.' : 'Taxa de acerto baixa: revise antes de avançar demais.'
        priority = 'alta'
      } else if (hasErrors || accuracy < 80) {
        interval = 3
        reason = 'Teve erro ou acerto intermediário: revisar em curto prazo evita esquecimento.'
        priority = 'media'
      } else if (session.rep >= 3) {
        interval = 21
        reason = 'Sessão madura: revisão espaçada de longo prazo.'
        priority = 'baixa'
      } else {
        interval = 7
      }

      const due = new Date(doneAt)
      due.setDate(doneAt.getDate() + interval)
      return {
        session,
        state: normalizeProgress(state),
        dueDate: asDateOnly(due),
        reason,
        priority,
        daysOverdue: daysBetween(today, due),
      }
    })
    .filter((item): item is ReviewItem => Boolean(item))
    .sort((a, b) => {
      const priorityScore = { alta: 0, media: 1, baixa: 2 }
      return priorityScore[a.priority] - priorityScore[b.priority]
        || b.daysOverdue - a.daysOverdue
        || a.dueDate.localeCompare(b.dueDate)
    })
}

export function getRiskBySubject(sessions: StudySession[], progress: ProgressMap, today = new Date()): RiskItem[] {
  const stats = buildSubjectStats(sessions, progress)

  return Object.entries(stats).map(([subject, item]) => {
    const last = safeDate(item.lastStudyAt)
    const daysIdle = last ? Math.max(0, daysBetween(today, last)) : 999
    const accuracyPenalty = item.questions > 0 ? clamp(85 - item.accuracy, 0, 45) : 20
    const completionPenalty = clamp(100 - item.completion, 0, 100) * 0.35
    const errorPenalty = Math.min(25, item.wrong * 2)
    const idlePenalty = Math.min(25, Math.max(0, daysIdle - 7) * 2)
    const notesPenalty = Math.min(10, item.notesCount * 2)
    const risk = Math.round(clamp(accuracyPenalty + completionPenalty + errorPenalty + idlePenalty + notesPenalty))

    const label: RiskItem['label'] = risk >= 65 ? 'risco alto' : risk >= 35 ? 'atenção' : 'seguro'
    const reason = item.questions === 0
      ? 'Ainda faltam dados de questões para medir segurança.'
      : item.accuracy < 70
        ? 'A taxa de acerto está abaixo do ideal.'
        : item.completion < 50
          ? 'Poucas sessões concluídas nessa matéria.'
          : daysIdle > 10
            ? 'Faz muitos dias que essa matéria não aparece no estudo.'
            : 'Risco controlado, mantenha revisões espaçadas.'

    return {
      subject,
      risk,
      label,
      reason,
      accuracy: item.accuracy,
      completion: item.completion,
      wrong: item.wrong,
      lastStudyAt: item.lastStudyAt,
    }
  }).sort((a, b) => b.risk - a.risk)
}

export function getMistakeCards(sessions: StudySession[], progress: ProgressMap): MistakeCard[] {
  return sessions
    .map(session => {
      const state = normalizeProgress(progress[session.sessionId])
      const notes = (state.notes ?? '').trim()
      if (state.wrong <= 0 && !notes) return null

      const hint = state.wrong > 0
        ? `${state.wrong} erro(s) registrado(s). Refaça sem olhar a resolução e anote a regra decisiva.`
        : 'Há anotação de revisão. Transforme em pergunta e tente responder de memória.'

      return {
        session,
        state,
        title: `${session.materia} · ${session.titulo}`,
        hint,
      }
    })
    .filter((item): item is MistakeCard => Boolean(item))
    .sort((a, b) => b.state.wrong - a.state.wrong || a.session.materia.localeCompare(b.session.materia))
}
