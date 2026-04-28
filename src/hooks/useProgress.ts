import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { getAllSessions } from '../data/ciclo'
import {
  buildSubjectStats,
  emptyProgress,
  getMistakeCards,
  getNextAction,
  getReviewQueue,
  getRiskBySubject,
  normalizeProgress,
} from '../lib/insights'
import type { ProgressMap, SessionProgress } from '../types/study'

const TABLE = 'sessions'

interface SessionRow {
  session_id: string
  done: boolean
  questions: number | null
  done_at: string | null
  correct: number | null
  wrong: number | null
  notes: string | null
}

type SessionPatch = Partial<SessionProgress>

function cacheKey(userId: string) {
  return `cef-progress:${userId}`
}

function cleanProgressMap(raw: unknown): ProgressMap {
  if (!raw || typeof raw !== 'object') return {}

  const cleanMap: ProgressMap = {}
  for (const [key, value] of Object.entries(raw as Record<string, Partial<SessionProgress>>)) {
    const normalized = normalizeProgress(value)
    if (normalized.questions > 9999 || normalized.correct > 9999 || normalized.wrong > 9999) {
      cleanMap[key] = { ...normalized, questions: 0, correct: 0, wrong: 0 }
    } else {
      cleanMap[key] = normalized
    }
  }
  return cleanMap
}

export function useProgress(userId?: string) {
  const [progress, setProgress] = useState<ProgressMap>({})
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function load() {
      if (!userId) {
        setProgress({})
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from(TABLE)
        .select('session_id, done, questions, done_at, correct, wrong, notes')
        .eq('user_id', userId)

      if (!active) return

      if (error) {
        setError(error.message)
        try {
          const local = localStorage.getItem(cacheKey(userId))
          if (local) setProgress(cleanProgressMap(JSON.parse(local)))
        } catch {
          setProgress({})
        }
      } else {
        const map: ProgressMap = {}
        ;(data as SessionRow[]).forEach(row => {
          map[row.session_id] = normalizeProgress({
            done: row.done,
            questions: row.questions ?? 0,
            done_at: row.done_at,
            correct: row.correct ?? 0,
            wrong: row.wrong ?? 0,
            notes: row.notes ?? '',
          })
        })
        setProgress(map)
        localStorage.setItem(cacheKey(userId), JSON.stringify(map))
      }

      setLoading(false)
    }

    load()

    return () => {
      active = false
    }
  }, [userId])

  const saveSession = useCallback(async (sessionId: string, patch: SessionPatch) => {
    if (!userId) return

    const current = normalizeProgress(progress[sessionId] ?? emptyProgress())
    const updated = normalizeProgress({ ...current, ...patch })

    setProgress(prev => {
      const next = { ...prev, [sessionId]: updated }
      localStorage.setItem(cacheKey(userId), JSON.stringify(next))
      return next
    })

    setSyncing(true)
    setError(null)

    const { error } = await supabase
      .from(TABLE)
      .upsert({
        user_id: userId,
        session_id: sessionId,
        done: updated.done,
        questions: updated.questions,
        done_at: updated.done_at,
        correct: updated.correct,
        wrong: updated.wrong,
        notes: updated.notes ?? '',
      }, { onConflict: 'user_id,session_id' })

    if (error) setError(error.message)
    setSyncing(false)
  }, [progress, userId])

  const toggleDone = useCallback((sessionId: string) => {
    const current = normalizeProgress(progress[sessionId] ?? emptyProgress())
    const nowDone = !current.done
    saveSession(sessionId, {
      done: nowDone,
      done_at: nowDone ? new Date().toISOString() : null,
    })
  }, [progress, saveSession])

  const setQuestions = useCallback((sessionId: string, feitas: number | string, erros: number | string) => {
    const f = Math.max(0, Number(feitas) || 0)
    const w = Math.min(f, Math.max(0, Number(erros) || 0))
    const c = Math.max(0, f - w)
    saveSession(sessionId, { correct: c, wrong: w, questions: f })
  }, [saveSession])

  const setNotes = useCallback((sessionId: string, notes: string) => {
    saveSession(sessionId, { notes })
  }, [saveSession])

  const clearProgress = useCallback(async () => {
    if (!userId) return

    setSyncing(true)
    setError(null)

    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('user_id', userId)

    if (error) {
      setError(error.message)
    } else {
      setProgress({})
      localStorage.removeItem(cacheKey(userId))
    }

    setSyncing(false)
  }, [userId])

  const allSessions = useMemo(() => getAllSessions(), [])
  const totalSessions = allSessions.length

  const totalDone = allSessions.filter(s => progress[s.sessionId]?.done).length
  const totalQuestions = allSessions.reduce(
    (sum, s) => sum + Number(progress[s.sessionId]?.questions ?? 0), 0
  )
  const totalCorrect = allSessions.reduce(
    (sum, s) => sum + Number(progress[s.sessionId]?.correct ?? 0), 0
  )
  const totalWrong = allSessions.reduce(
    (sum, s) => sum + Number(progress[s.sessionId]?.wrong ?? 0), 0
  )
  const pctDone = totalSessions > 0 ? Math.round((totalDone / totalSessions) * 100) : 0
  const horasEstudadas = Math.round(totalDone * 1.5)

  const studyDays = new Set(
    allSessions
      .filter(s => progress[s.sessionId]?.done_at)
      .map(s => progress[s.sessionId]?.done_at?.split('T')[0])
      .filter(Boolean)
  )
  const avgPerDay = studyDays.size > 0
    ? Math.round(totalQuestions / studyDays.size)
    : null

  function getMesProgress(mes: number) {
    const sessions = allSessions.filter(s => s.mes === mes)
    const done = sessions.filter(s => progress[s.sessionId]?.done).length
    return { done, total: sessions.length, pct: sessions.length ? Math.round(done / sessions.length * 100) : 0 }
  }

  function getSubjectStats() {
    return buildSubjectStats(allSessions, progress)
  }

  function getWeeklyData() {
    const weeks: Record<string, number> = {}
    allSessions.forEach(s => {
      const p = progress[s.sessionId]
      if (p?.done && p?.done_at) {
        const d = new Date(p.done_at)
        const start = new Date(d)
        start.setDate(d.getDate() - d.getDay())
        const key = start.toISOString().split('T')[0]
        weeks[key] = (weeks[key] ?? 0) + Number(p.questions ?? 0)
      }
    })
    const result = []
    const now = new Date()
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i * 7)
      const start = new Date(d)
      start.setDate(d.getDate() - d.getDay())
      const key = start.toISOString().split('T')[0]
      result.push({ label: `S${8 - i}`, value: weeks[key] ?? 0 })
    }
    return result
  }

  function getDailyActivity() {
    const days: Record<string, number> = {}
    allSessions.forEach(s => {
      const p = progress[s.sessionId]
      if (p?.done && p?.done_at) {
        const key = p.done_at.split('T')[0]
        days[key] = (days[key] ?? 0) + 1
      }
    })
    const result: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[] = []
    const now = new Date()
    for (let i = 365; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      const count = days[key] ?? 0
      let level: 0 | 1 | 2 | 3 | 4 = 0
      if (count > 0 && count <= 2) level = 1
      else if (count >= 3 && count <= 5) level = 2
      else if (count >= 6 && count <= 8) level = 3
      else if (count > 8) level = 4
      result.push({ date: key, count, level })
    }
    return result
  }

  return {
    progress,
    loading,
    syncing,
    error,
    toggleDone,
    setQuestions,
    setNotes,
    clearProgress,
    totalSessions,
    totalDone,
    totalQuestions,
    totalCorrect,
    totalWrong,
    pctDone,
    horasEstudadas,
    avgPerDay,
    studyDaysCount: studyDays.size,
    getMesProgress,
    getSubjectStats,
    getWeeklyData,
    getDailyActivity,
    getNextAction: () => getNextAction(allSessions, progress),
    getReviewQueue: () => getReviewQueue(allSessions, progress),
    getRiskBySubject: () => getRiskBySubject(allSessions, progress),
    getMistakeCards: () => getMistakeCards(allSessions, progress),
  }
}
