import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { MESES, SUBJECT_COLORS } from '../data/ciclo'
import s from './Dashboard.module.css'

const MOTIVATIONS = [
  { min: 0,  max: 1,   icon: '🎯', title: 'Bem-vindo ao painel!',    sub: 'Faça o primeiro bloco e comece a jornada rumo à CEF.' },
  { min: 1,  max: 15,  icon: '🚀', title: 'Decolagem iniciada!',       sub: 'A consistência agora é mais importante que a velocidade.' },
  { min: 15, max: 35,  icon: '💪', title: 'Construindo a base!',       sub: 'Cada bloco feito é um ponto a mais no gabarito.' },
  { min: 35, max: 55,  icon: '⚡', title: 'Ritmo excelente!',          sub: 'Você está no ritmo de quem vai ser aprovado.' },
  { min: 55, max: 75,  icon: '🔥', title: 'Mais da metade!',           sub: 'A maioria desiste aqui. Você não é a maioria.' },
  { min: 75, max: 95,  icon: '🏆', title: 'Reta final!',               sub: 'Cada sessão agora pesa ouro. Continue.' },
  { min: 95, max: 101, icon: '👑', title: 'Ciclo quase completo!',     sub: 'Você fez o que poucos fazem. A aprovação é consequência.' },
]

function getMotivation(pct) {
  return MOTIVATIONS.find(m => pct >= m.min && pct < m.max) ?? MOTIVATIONS[0]
}

function StreakGrid({ getDailyActivity }) {
  const days = getDailyActivity()
  return (
    <div className={s.streakGrid}>
      {days.map(d => (
        <div
          key={d.key}
          title={`${d.key}: ${d.count} sessão(ões)`}
          className={`${s.streakDay} ${d.count >= 3 ? s.full : d.count > 0 ? s.partial : ''}`}
        />
      ))}
    </div>
  )
}

export default function Dashboard({
  pctDone, totalDone, totalSessions, totalQuestions,
  avgPerDay, horasEstudadas, studyDaysCount,
  getMesProgress, getSubjectStats, getWeeklyData, getDailyActivity,
}) {
  const mot = getMotivation(pctDone)
  const weekData = getWeeklyData()
  const subStats = getSubjectStats()
  const pieData  = Object.entries(subStats)
    .filter(([, v]) => v.done > 0)
    .map(([name, v]) => ({ name, value: v.done, color: SUBJECT_COLORS[name] ?? '#888' }))

  return (
    <div className={s.wrap}>
      {/* Banner motivacional */}
      <div className={s.banner}>
        <span className={s.bannerIcon}>{mot.icon}</span>
        <div className={s.bannerText}>
          <strong>{mot.title}</strong>
          <p>{mot.sub}</p>
        </div>
        <span className={s.bannerPct}>{pctDone}%</span>
      </div>

      {/* Stat cards */}
      <div className={s.statsGrid}>
        <StatCard color="gold"   label="Total de Questões"  value={totalQuestions.toLocaleString('pt-BR')} sub="registradas no ciclo" pct={pctDone} />
        <StatCard color="teal"   label="Sessões Concluídas" value={`${totalDone} / ${totalSessions}`}       sub="de 180 sessões (5×12×3)" pct={Math.round(totalDone/totalSessions*100)} />
        <StatCard color="blue"   label="Média por Dia"      value={avgPerDay != null ? avgPerDay : '—'}      sub={`em ${studyDaysCount} dia(s) de estudo`} />
        <StatCard color="purple" label="Horas Estudadas"    value={`${horasEstudadas}h`}                    sub="estimado (1h30 / sessão)" />
      </div>

      {/* Charts row */}
      <div className={s.chartsRow}>
        <div className={s.chartCard}>
          <h3 className={s.chartTitle}>Questões por semana</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weekData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <XAxis dataKey="label" tick={{ fill: '#7A8099', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#7A8099', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#181C24', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#F0F2F8' }}
                itemStyle={{ color: '#F5C842' }}
              />
              <Bar dataKey="value" name="Questões" fill="#F5C842" fillOpacity={0.7} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={s.chartCard}>
          <h3 className={s.chartTitle}>Sessões por matéria</h3>
          {pieData.length === 0 ? (
            <div className={s.emptyChart}>Nenhuma sessão concluída ainda</div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} fillOpacity={0.85} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#181C24', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }}
                  formatter={(v, n) => [v + ' sessões', n]}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Progresso por mês */}
      <h3 className={s.sectionTitle}>Progresso por mês</h3>
      <div className={s.mesCard}>
        {MESES.map(m => {
          const { done, total, pct } = getMesProgress(m.mes)
          return (
            <div key={m.mes} className={s.mesRow}>
              <div className={s.mesName}>
                <span className={s.mesNum}>Mês {m.mes}</span>
                <span className={s.mesSub}>{m.titulo}</span>
              </div>
              <div className={s.mesRight}>
                <span className={s.mesCount}>{done}/{total}</span>
                <div className={s.mesBar}><div className={s.mesBarFill} style={{ width: `${pct}%` }} /></div>
                <span className={s.mesPct}>{pct}%</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Streak */}
      <h3 className={s.sectionTitle}>Atividade — últimos 35 dias</h3>
      <div className={s.chartCard}>
        <StreakGrid getDailyActivity={getDailyActivity} />
        <div className={s.streakLegend}>
          <span><i className={s.dotEmpty} /> Sem estudo</span>
          <span><i className={s.dotPartial} /> Parcial</span>
          <span><i className={s.dotFull} /> 3+ sessões</span>
        </div>
      </div>
    </div>
  )
}

function StatCard({ color, label, value, sub, pct }) {
  return (
    <div className={`${s.statCard} ${s[color]}`}>
      <div className={s.statLabel}>{label}</div>
      <div className={`${s.statValue} ${s[color + 'Text']}`}>{value}</div>
      <div className={s.statSub}>{sub}</div>
      {pct != null && (
        <div className={s.statBar}>
          <div className={s.statBarFill} style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
      )}
    </div>
  )
}
