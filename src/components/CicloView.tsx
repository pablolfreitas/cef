import { useEffect, useState } from 'react'
import BlockCard from './BlockCard'
import { MESES, getAllSessions } from '../data/ciclo'
import s from './CicloView.module.css'

const REPS = [
  { value: 1, label: 'Rodada 1: aprender' },
  { value: 2, label: 'Rodada 2: fixar' },
  { value: 3, label: 'Rodada 3: revisar' },
]

export default function CicloView({ progress, toggleDone, setQuestions, setNotes, getMesProgress, initialMes = 1 }: any) {
  const [mes, setMes]     = useState(initialMes)
  const [rep, setRep]     = useState(1)
  const mesData           = MESES.find(m => m.mes === mes)
  const { done, total, pct } = getMesProgress(mes)

  useEffect(() => {
    setMes(initialMes)
  }, [initialMes])

  // Filtra sessões do mês + repetição atual
  const sessions = getAllSessions().filter(
    s => s.mes === mes && s.rep === rep
  )

  return (
    <div className={s.wrap}>
      {/* Tabs de mês */}
      <div className={s.mesTabs}>
        {MESES.map(m => {
          const mp = getMesProgress(m.mes)
          return (
            <button
              key={m.mes}
              className={`${s.mesTab} ${mes === m.mes ? s.active : ''}`}
              onClick={() => setMes(m.mes)}
            >
              Mês {m.mes}
              {mp.done > 0 && (
                <span className={s.mesTabBadge}>{mp.pct}%</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Header do mês */}
      <div className={s.mesHeader}>
        <div>
          <div className={s.mesLabel}>MÊS {mes}</div>
          <h2 className={s.mesTitulo}>{mesData.titulo}</h2>
        </div>
        <div className={s.mesStats}>
          <span className={s.mesPct}>{pct}%</span>
          <span className={s.mesDone}>{done} / {total} sessões</span>
        </div>
      </div>
      <div className={s.progressBar}>
        <div className={s.progressFill} style={{ width: `${pct}%` }} />
      </div>

      {/* Tabs de repetição */}
      <div className={s.repTabs}>
        <span className={s.repLabel}>Objetivo da rodada:</span>
        {REPS.map(({ value: r, label }) => {
          // Conta concluídos nessa rep+mes
          const repSessions = getAllSessions().filter(x => x.mes === mes && x.rep === r)
          const repDone = repSessions.filter(x => progress[x.sessionId]?.done).length
          const repPct  = Math.round(repDone / repSessions.length * 100)
          return (
            <button
              key={r}
              className={`${s.repTab} ${rep === r ? s.repActive : ''}`}
              onClick={() => setRep(r)}
            >
              {label}
              {repDone > 0 && <span className={s.repBadge}>{repPct}%</span>}
            </button>
          )
        })}
      </div>

      {/* Grid de blocos */}
      <div className={s.grid}>
        {sessions.map(session => (
          <BlockCard
            key={session.sessionId}
            session={session}
            state={progress[session.sessionId]}
            onToggle={toggleDone}
            onQuestions={setQuestions}
            onNotes={setNotes}
          />
        ))}
      </div>
    </div>
  )
}
