import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { getAllSessions } from '../data/ciclo'

const TABLE = 'sessions'

function cacheKey(userId) {
  return `cef-progress:${userId}`
}

export function useProgress(userId) {
  const [progress, setProgress] = useState({})
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState(null)

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
          if (local) setProgress(JSON.parse(local))
        } catch {}
      } else {
        const map: any = {}
        data.forEach(row => {
          map[row.session_id] = {
            done: row.done,
            questions: row.questions,
            done_at: row.done_at,
            correct: row.correct,
            wrong: row.wrong,
            notes: row.notes,
          }
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

  const saveSession = useCallback(async (sessionId, patch) => {
    if (!userId) return

    const current = progress[sessionId] ?? { done: false, questions: 0, done_at: null, correct: 0, wrong: 0, notes: '' }
    const updated = { ...current, ...patch }

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
        notes: updated.notes,
      }, { onConflict: 'user_id,session_id' })

    if (error) setError(error.message)
    setSyncing(false)
  }, [progress, userId])

  const toggleDone = useCallback((sessionId: string) => {
    const current = progress[sessionId] ?? { done: false, questions: 0, correct: 0, wrong: 0, notes: '' }
    const nowDone = !current.done
    saveSession(sessionId, {
      done: nowDone,
      done_at: nowDone ? new Date().toISOString() : null,
    })
  }, [progress, saveSession])

  const setQuestions = useCallback((sessionId: string, correct: number, wrong: number) => {
    const questions = correct + wrong;
    saveSession(sessionId, { correct: Number(correct) || 0, wrong: Number(wrong) || 0, questions })
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

  const allSessions = getAllSessions()
  const totalSessions = allSessions.length

  const totalDone = allSessions.filter(s => progress[s.sessionId]?.done).length
  const totalQuestions = allSessions.reduce(
    (sum, s) => sum + (progress[s.sessionId]?.questions ?? 0), 0
  )
  const totalCorrect = allSessions.reduce(
    (sum, s) => sum + (progress[s.sessionId]?.correct ?? 0), 0
  )
  const totalWrong = allSessions.reduce(
    (sum, s) => sum + (progress[s.sessionId]?.wrong ?? 0), 0
  )
  const pctDone = totalSessions > 0 ? Math.round((totalDone / totalSessions) * 100) : 0
  const horasEstudadas = (totalDone * 1.5).toFixed(0)

  const studyDays = new Set(
    allSessions
      .filter(s => progress[s.sessionId]?.done_at)
      .map(s => progress[s.sessionId].done_at.split('T')[0])
  )
  const avgPerDay = studyDays.size > 0
    ? Math.round(totalQuestions / studyDays.size)
    : null

  function getMesProgress(mes) {
    const sessions = allSessions.filter(s => s.mes === mes)
    const done = sessions.filter(s => progress[s.sessionId]?.done).length
    return { done, total: sessions.length, pct: Math.round(done / sessions.length * 100) }
  }

  function getSubjectStats() {
    const stats: any = {}
    allSessions.forEach(s => {
      if (!stats[s.materia]) stats[s.materia] = { done: 0, total: 0, questions: 0, correct: 0, wrong: 0 }
      stats[s.materia].total++
      if (progress[s.sessionId]?.done) stats[s.materia].done++
      stats[s.materia].questions += progress[s.sessionId]?.questions ?? 0
      stats[s.materia].correct += progress[s.sessionId]?.correct ?? 0
      stats[s.materia].wrong += progress[s.sessionId]?.wrong ?? 0
    })
    return stats
  }

  function getWeeklyData() {
    const weeks = {}
    allSessions.forEach(s => {
      const p = progress[s.sessionId]
      if (p?.done && p?.done_at) {
        const d = new Date(p.done_at)
        const start = new Date(d)
        start.setDate(d.getDate() - d.getDay())
        const key = start.toISOString().split('T')[0]
        weeks[key] = (weeks[key] ?? 0) + (p.questions ?? 0)
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
    const days = {}
    allSessions.forEach(s => {
      const p = progress[s.sessionId]
      if (p?.done && p?.done_at) {
        const key = p.done_at.split('T')[0]
        days[key] = (days[key] ?? 0) + 1
      }
    })
    const result = []
    const now = new Date()
    for (let i = 365; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      const count = days[key] ?? 0
      let level = 0
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
  }
}
