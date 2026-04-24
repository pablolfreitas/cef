import s from './Sidebar.module.css'

const NAV = [
  { view: 'dashboard', icon: '◈', label: 'Dashboard' },
  { view: 'ciclo',     icon: '⊞', label: 'Ciclo Completo' },
  { view: 'stats',     icon: '◑', label: 'Estatísticas' },
  { view: 'sobre',     icon: '◉', label: 'Sobre o Edital' },
]

const MESES_NAV = [
  { mes: 1, label: 'Mês 1 — Base' },
  { mes: 2, label: 'Mês 2 — BD' },
  { mes: 3, label: 'Mês 3 — POO' },
  { mes: 4, label: 'Mês 4 — Web' },
  { mes: 5, label: 'Mês 5 — Final' },
]

export default function Sidebar({ activeView, onNav, onMes, stats, syncing }) {
  return (
    <aside className={s.sidebar}>
      <div className={s.logo}>
        <span className={s.badge}>CEF · TBN · TI</span>
        <h1>Painel de<br />Estudos</h1>
        <p>Caixa Econômica Federal</p>
      </div>

      <nav className={s.nav}>
        <span className={s.navLabel}>Navegação</span>
        {NAV.map(n => (
          <button
            key={n.view}
            className={`${s.navItem} ${activeView === n.view ? s.active : ''}`}
            onClick={() => onNav(n.view)}
          >
            <span className={s.icon}>{n.icon}</span>
            {n.label}
          </button>
        ))}

        <span className={s.navLabel}>Meses</span>
        {MESES_NAV.map(m => (
          <button
            key={m.mes}
            className={s.navItem}
            onClick={() => { onNav('ciclo'); onMes(m.mes) }}
          >
            <span className={s.icon}>{'①②③④⑤'[m.mes - 1]}</span>
            {m.label}
          </button>
        ))}
      </nav>

      <div className={s.foot}>
        {syncing && <div className={s.sync}>↻ sincronizando…</div>}
        <div className={s.miniStat}><span>Sessões feitas</span><b>{stats.totalDone}</b></div>
        <div className={s.miniStat}><span>Questões</span><b>{stats.totalQuestions.toLocaleString('pt-BR')}</b></div>
        <div className={s.miniStat}><span>% do ciclo</span><b className={s.gold}>{stats.pctDone}%</b></div>
      </div>
    </aside>
  )
}
