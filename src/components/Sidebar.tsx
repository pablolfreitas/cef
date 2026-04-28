import { Link, useLocation } from 'react-router-dom'
import s from './Sidebar.module.css'

const NAV = [
  { to: '/hoje', icon: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ), label: 'Hoje' },
  { to: '/dashboard', icon: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-7"/>
    </svg>
  ), label: 'Painel' },
  { to: '/ciclo', icon: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
    </svg>
  ), label: 'Ciclo de Estudos' },
  { to: '/stats', icon: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ), label: 'Estatísticas' },
  { to: '/sobre', icon: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ), label: 'Sobre o Edital' },
]

const MESES_NAV = [
  { mes: 1, label: 'Base forte e TI' },
  { mes: 2, label: 'Banco de dados' },
  { mes: 3, label: 'POO e algoritmos' },
  { mes: 4, label: 'Web e agilidade' },
  { mes: 5, label: 'Fechamento' },
]

interface SidebarProps {
  onMes: (mes: number) => void
  stats: { totalDone: number; totalQuestions: number; pctDone: number }
  syncing: boolean
  userEmail?: string
  onSignOut: () => void
}

export default function Sidebar({ onMes, stats, syncing, userEmail, onSignOut }: SidebarProps) {
  const location = useLocation()
  const activeView = location.pathname.substring(1) || 'hoje'

  const initials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : '??'

  const circumference = 2 * Math.PI * 20
  const strokeDash = circumference * (stats.pctDone / 100)

  return (
    <aside className={s.sidebar}>
      {/* Logo */}
      <div className={s.logo}>
        <div className={s.badge}>CEF · TBN · TI</div>
        <h1>Painel de<br />Estudos</h1>
        <p>Caixa Econômica Federal</p>

        {/* Progress ring */}
        <div className={s.progressRing}>
          <div className={s.ringWrap}>
            <svg width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="var(--bg4)" strokeWidth="4" />
              <circle
                cx="24" cy="24" r="20"
                fill="none"
                stroke="var(--gold)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${strokeDash} ${circumference}`}
                style={{ transition: 'stroke-dasharray 0.6s ease' }}
              />
            </svg>
            <span className={s.ringPct}>{stats.pctDone}%</span>
          </div>
          <div className={s.ringInfo}>
            <span className={s.ringLabel}>{stats.totalDone} sessões</span>
            <span className={s.ringSubLabel}>{stats.totalQuestions.toLocaleString('pt-BR')} questões</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className={s.nav}>
        <span className={s.navLabel}>Menu</span>
        {NAV.map(n => (
          <Link
            key={n.to}
            to={n.to}
            className={`${s.navItem} ${activeView === n.to.substring(1) ? s.active : ''}`}
          >
            <span className={s.navIcon}>{n.icon}</span>
            {n.label}
          </Link>
        ))}

        <span className={s.navLabel}>Meses</span>
        {MESES_NAV.map((m) => (
          <Link
            key={m.mes}
            to="/ciclo"
            className={s.navItem}
            onClick={() => onMes(m.mes)}
          >
            <span className={s.navIcon}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted2)' }}>0{m.mes}</span>
              {m.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className={s.foot}>
        {syncing && <div className={s.syncDot}>sincronizando</div>}

        <div className={s.userRow}>
          <div className={s.avatar}>{initials}</div>
          <div className={s.userInfo}>
            <span className={s.userEmail}>{userEmail ?? '—'}</span>
          </div>
          <button className={s.signOutBtn} onClick={onSignOut} title="Sair">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>

        <div className={s.miniStat}><span>Sessões feitas</span><b>{stats.totalDone} / 180</b></div>
        <div className={s.miniStat}><span>Horas estimadas</span><b>{(stats.totalDone * 1.5).toFixed(0)}h</b></div>
      </div>
    </aside>
  )
}
