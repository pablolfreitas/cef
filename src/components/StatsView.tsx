import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { SUBJECT_COLORS, MESES, getAllSessions } from '../data/ciclo'
import s from './StatsView.module.css'

export default function StatsView({
  progress, totalDone, totalSessions, totalQuestions,
  avgPerDay, horasEstudadas, studyDaysCount,
  getMesProgress, getSubjectStats, getWeeklyData, getRiskBySubject, getMistakeCards, onReset,
  totalCorrect, totalWrong,
}: any) {
  const subStats   = getSubjectStats()
  const weekData   = getWeeklyData()

  const byType = { V: 0, Q: 0, P: 0 }
  getAllSessions().forEach(s => {
    byType[s.tipo] += Number(progress[s.sessionId]?.questions ?? 0)
  })
  const typeData = [
    { name: '[V] Videoaula', value: byType.V, color: '#5B8DEF' },
    { name: '[Q] Questões',  value: byType.Q, color: '#9B7FE8' },
    { name: '[P] Prática',   value: byType.P, color: '#F0715A' },
  ]

  const monthData = MESES.map(m => {
    const { done, total } = getMesProgress(m.mes)
    return { name: `Mês ${m.mes}`, done, total }
  })

  const subjectRows = Object.entries(subStats)
    .sort((a: any, b: any) => b[1].questions - a[1].questions)

  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
  const riskRows = getRiskBySubject ? getRiskBySubject().slice(0, 6) : []
  const mistakeRows = getMistakeCards ? getMistakeCards().slice(0, 6) : []

  return (
    <div className={s.wrap}>
      <div className={s.topGrid}>
        {/* Questões por matéria */}
        <div className={s.card}>
          <h3 className={s.cardTitle}>Questões por matéria</h3>
          <div className={s.subjectList}>
            {subjectRows.map(([name, v]) => {
              const color = SUBJECT_COLORS[name] ?? '#888'
              const pct   = Math.round(v.done / v.total * 100)
              return (
                <div key={name} className={s.subjectRow}>
                  <span className={s.dot} style={{ background: color }} />
                  <span className={s.subName}>{name}</span>
                  <span className={s.subQ}>{v.correct} ✅ / {v.wrong} ❌</span>
                  <span className={s.subPct} style={{ color }}>{pct}% (Acc: {v.questions > 0 ? Math.round((v.correct/v.questions)*100) : 0}%)</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Análise geral */}
        <div className={s.card}>
          <h3 className={s.cardTitle}>Análise do ciclo</h3>
          <div className={s.infoList}>
            <InfoRow label="Total de sessões"      val={`${totalDone} / ${totalSessions}`} />
            <InfoRow label="% do ciclo completo"   val={`${Math.round(totalDone / totalSessions * 100)}%`} highlight />
            <InfoRow label="Total de questões"     val={totalQuestions.toLocaleString('pt-BR')} />
            <InfoRow label="Total de acertos"      val={totalCorrect.toLocaleString('pt-BR')} highlight />
            <InfoRow label="Total de erros"        val={totalWrong.toLocaleString('pt-BR')} />
            <InfoRow label="Taxa de Acerto Geral"  val={`${accuracy}%`} highlight />
            <InfoRow label="Horas estudadas (est.)"val={`${horasEstudadas}h`} />
            <InfoRow label="Dias de estudo"        val={studyDaysCount} />
            <InfoRow label="Média por dia ativo"   val={avgPerDay != null ? `${avgPerDay} q` : '—'} />
            <InfoRow label="Sessões restantes"     val={totalSessions - totalDone} />
            <InfoRow label="Horas restantes (est.)"val={`${((totalSessions - totalDone) * 1.5).toFixed(0)}h`} />
          </div>
        </div>
      </div>

      <div className={s.topGrid}>
        <div className={s.card}>
          <h3 className={s.cardTitle}>Score de risco por matéria</h3>
          <div className={s.insightList}>
            {riskRows.map((item: any) => (
              <div key={item.subject} className={s.insightRow}>
                <div>
                  <strong>{item.subject}</strong>
                  <span>{item.reason}</span>
                </div>
                <b className={item.label === 'risco alto' ? s.danger : item.label === 'atenção' ? s.warn : s.safe}>{item.risk}</b>
              </div>
            ))}
          </div>
        </div>

        <div className={s.card}>
          <h3 className={s.cardTitle}>Caderno de erros</h3>
          {mistakeRows.length === 0 ? (
            <p className={s.emptyText}>Registre erros ou anotações no ciclo para gerar cartões de revisão.</p>
          ) : (
            <div className={s.insightList}>
              {mistakeRows.map((item: any) => (
                <div key={item.session.sessionId} className={s.mistakeRow}>
                  <strong>{item.session.materia} · {item.session.titulo}</strong>
                  <span>{item.hint}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Questões por tipo de bloco */}
      <div className={s.card}>
        <h3 className={s.cardTitle}>Questões por tipo de bloco</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={typeData} layout="vertical" margin={{ top: 4, right: 20, bottom: 4, left: 10 }}>
            <XAxis type="number" tick={{ fill: '#7A8099', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#7A8099', fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
            <Tooltip
              contentStyle={{ background: '#181C24', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }}
              itemStyle={{ color: '#F0F2F8' }}
            />
            <Bar dataKey="value" name="Questões" radius={[0, 4, 4, 0]}>
              {typeData.map(d => <Cell key={d.name} fill={d.color} fillOpacity={0.7} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Progresso mensal */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <h3 className={s.cardTitle}>Blocos concluídos por mês</h3>
          <button className={s.resetBtn} onClick={onReset}>Resetar tudo</button>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <XAxis dataKey="name" tick={{ fill: '#7A8099', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#7A8099', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#181C24', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }}
              itemStyle={{ color: '#F0F2F8' }}
            />
            <Bar dataKey="total"  name="Total"      fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" strokeWidth={1} radius={[4,4,0,0]} />
            <Bar dataKey="done"   name="Concluídos" fill="#2DD4A8" fillOpacity={0.7} radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function InfoRow({ label, val, highlight }: any) {
  return (
    <div className={s.infoRow}>
      <span className={s.infoLabel}>{label}</span>
      <span className={`${s.infoVal} ${highlight ? s.highlight : ''}`}>{val}</span>
    </div>
  )
}
