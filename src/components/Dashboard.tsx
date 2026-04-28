import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { MESES, SUBJECT_COLORS } from '../data/ciclo'
import { ActivityCalendar } from 'react-activity-calendar'
import s from './Dashboard.module.css'

interface DashboardProps {
  pctDone: number; totalDone: number; totalSessions: number
  totalQuestions: number; totalCorrect: number; totalWrong: number
  avgPerDay: number | null; horasEstudadas: number; studyDaysCount: number
  getMesProgress: (mes: number) => { done: number; total: number; pct: number }
  getSubjectStats: () => Record<string, any>
  getWeeklyData: () => { label: string; value: number }[]
  getDailyActivity: () => { date: string; count: number; level: 0|1|2|3|4 }[]
}

const MOTIVATIONS = [
  { min: 0,  max: 1,   icon: '🎯', title: 'Bem-vindo ao painel!',  sub: 'Comece o primeiro bloco. A jornada rumo à CEF começa agora.' },
  { min: 1,  max: 15,  icon: '🚀', title: 'Decolagem!',             sub: 'Consistência supera intensidade. Continue todos os dias.' },
  { min: 15, max: 35,  icon: '💪', title: 'Construindo a base!',    sub: 'Cada bloco feito é mais um ponto no gabarito.' },
  { min: 35, max: 55,  icon: '⚡', title: 'Ritmo excelente!',       sub: 'Você está no ritmo de quem vai ser aprovado.' },
  { min: 55, max: 75,  icon: '🔥', title: 'Mais da metade!',        sub: 'A maioria desiste aqui. Você não é a maioria.' },
  { min: 75, max: 95,  icon: '🏆', title: 'Reta final!',            sub: 'Cada sessão agora pesa ouro. Não pare.' },
  { min: 95, max: 101, icon: '👑', title: 'Ciclo quase completo!',  sub: 'Você fez o que poucos fazem. A aprovação é consequência.' },
]

function getMotivation(pct: number) {
  return MOTIVATIONS.find(m => pct >= m.min && pct < m.max) ?? MOTIVATIONS[0]
}

const TOOLTIP_STYLE = {
  contentStyle: {
    background: '#1C1C22',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 10,
    fontSize: 12,
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
  },
  labelStyle: { color: '#F4F4F5', fontWeight: 600 },
  itemStyle:  { color: '#8F8FA3' },
}

function StatCard({ color, label, value, sub, pct, icon }: any) {
  return (
    <div className={`${s.statCard} ${s[color]}`}>
      <div className={s.statIcon}>{icon}</div>
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

export default function Dashboard({
  pctDone, totalDone, totalSessions, totalQuestions, totalCorrect, totalWrong,
  avgPerDay, horasEstudadas, studyDaysCount,
  getMesProgress, getSubjectStats, getWeeklyData, getDailyActivity,
}: DashboardProps) {
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
  const mot = getMotivation(pctDone)
  const weekData = getWeeklyData()
  const subStats = getSubjectStats()
  const pieData = Object.entries(subStats)
    .filter(([, v]) => (v as any).done > 0)
    .map(([name, v]) => ({ name, value: (v as any).done, color: SUBJECT_COLORS[name] ?? '#888' }))

  return (
    <div className={s.wrap}>
      {/* Banner */}
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
        <StatCard
          color="teal" label="Taxa de Acerto" value={`${accuracy}%`}
          sub={`${totalCorrect.toLocaleString()} acertos · ${totalWrong.toLocaleString()} erros`}
          pct={accuracy}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
        />
        <StatCard
          color="gold" label="Questões Totais" value={totalQuestions.toLocaleString('pt-BR')}
          sub="registradas no ciclo" pct={pctDone}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>}
        />
        <StatCard
          color="blue" label="Sessões Feitas" value={`${totalDone}/${totalSessions}`}
          sub="de 180 sessões (5 × 12 × 3)"
          pct={Math.round(totalDone / totalSessions * 100)}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
        />
        <StatCard
          color="purple" label="Horas Estudadas" value={`${horasEstudadas}h`}
          sub={`${studyDaysCount} dia(s) · ~${avgPerDay ?? '—'} q/dia`}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
        />
      </div>

      {/* Charts */}
      <div className={s.chartsRow}>
        <div className={s.chartCard}>
          <div className={s.chartHeader}>
            <span className={s.chartTitle}>Questões por semana</span>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={weekData} margin={{ top: 4, right: 4, bottom: 0, left: -22 }}>
              <XAxis dataKey="label" tick={{ fill: '#8F8FA3', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8F8FA3', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v: any) => [v, 'Questões']} />
              <Bar dataKey="value" fill="#FBBF24" fillOpacity={0.75} radius={[5, 5, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={s.chartCard}>
          <div className={s.chartHeader}>
            <span className={s.chartTitle}>Sessões por matéria</span>
          </div>
          {pieData.length === 0 ? (
            <div className={s.emptyChart}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--muted2)' }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>Nenhuma sessão<br />concluída ainda</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={52} outerRadius={82} paddingAngle={2} dataKey="value">
                  {pieData.map(entry => <Cell key={entry.name} fill={entry.color} fillOpacity={0.88} />)}
                </Pie>
                <Tooltip
                  {...TOOLTIP_STYLE}
                  formatter={(v: any, n: any) => [v + ' sessões', n]}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Progresso mensal */}
      <div className={s.sectionHeader}>
        <span className={s.sectionTitle}>Progresso por mês</span>
      </div>
      <div className={s.mesCard}>
        {MESES.map(m => {
          const { done, total, pct } = getMesProgress(m.mes)
          return (
            <div key={m.mes} className={s.mesRow}>
              <span className={s.mesIndex}>0{m.mes}</span>
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

      {/* Streak anual */}
      <div className={s.sectionHeader}>
        <span className={s.sectionTitle}>Atividade de Estudos — Último Ano</span>
      </div>
      <div className={s.streakCard}>
        <div style={{ overflowX: 'auto' }}>
          <ActivityCalendar
            data={getDailyActivity()}
            theme={{
              light: ['#27272A', '#34D39940', '#34D39980', '#34D399C0', '#34D399'],
              dark:  ['#27272A', '#34D39940', '#34D39980', '#34D399C0', '#34D399'],
            }}
            colorScheme="dark"
            labels={{
              legend: { less: 'Menos', more: 'Mais' },
              months: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
              weekdays: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
              totalCount: '{{count}} sessões em {{year}}',
            }}
            showWeekdayLabels
            blockSize={13}
            blockMargin={4}
            blockRadius={3}
            fontSize={11}
          />
        </div>
      </div>
    </div>
  )
}
