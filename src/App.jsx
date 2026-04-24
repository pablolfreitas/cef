import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import CicloView from './components/CicloView'
import StatsView from './components/StatsView'
import SobreView from './components/SobreView'
import LoginPage from './components/LoginPage'
import PasswordUpdatePage from './components/PasswordUpdatePage'
import { useAuth } from './hooks/useAuth'
import { useProgress } from './hooks/useProgress'
import s from './App.module.css'

const VIEW_TITLES = {
  dashboard: 'Dashboard',
  ciclo: 'Ciclo de Estudos',
  stats: 'Estatisticas',
  sobre: 'Sobre o Edital',
}

export default function App() {
  const [view, setView] = useState('dashboard')
  const [curMes, setCurMes] = useState(1)
  const auth = useAuth()
  const progress = useProgress(auth.user?.id)

  const now = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  async function handleReset() {
    if (window.confirm('Tem certeza? Todos os seus dados serao apagados permanentemente.')) {
      await progress.clearProgress()
    }
  }

  if (auth.loading) {
    return (
      <div className={s.loading}>
        <div className={s.loadingSpinner} />
        <p>Carregando seu progresso...</p>
      </div>
    )
  }

  if (auth.recovery) {
    return <PasswordUpdatePage onDone={auth.finishRecovery} />
  }

  if (!auth.user) return <LoginPage />

  if (progress.loading) {
    return (
      <div className={s.loading}>
        <div className={s.loadingSpinner} />
        <p>Carregando seu progresso...</p>
      </div>
    )
  }

  const sidebarStats = {
    totalDone: progress.totalDone,
    totalQuestions: progress.totalQuestions,
    pctDone: progress.pctDone,
  }

  return (
    <div className={s.layout}>
      <Sidebar
        activeView={view}
        onNav={setView}
        onMes={mes => { setCurMes(mes) }}
        stats={sidebarStats}
        syncing={progress.syncing}
      />

      <main className={s.main}>
        <header className={s.topbar}>
          <h2 className={s.topbarTitle}>{VIEW_TITLES[view]}</h2>
          <div className={s.topbarRight}>
            {progress.error && (
              <span className={s.errorPill} title={progress.error}>
                offline
              </span>
            )}
            {progress.syncing && (
              <span className={s.syncPill}>sync</span>
            )}
            <span className={s.userEmail}>{auth.user.email}</span>
            <button className={s.signOutBtn} onClick={auth.signOut}>
              Sair
            </button>
            <span className={s.date}>{now}</span>
          </div>
        </header>

        <div className={s.content}>
          {view === 'dashboard' && (
            <Dashboard
              pctDone={progress.pctDone}
              totalDone={progress.totalDone}
              totalSessions={progress.totalSessions}
              totalQuestions={progress.totalQuestions}
              avgPerDay={progress.avgPerDay}
              horasEstudadas={progress.horasEstudadas}
              studyDaysCount={progress.studyDaysCount}
              getMesProgress={progress.getMesProgress}
              getSubjectStats={progress.getSubjectStats}
              getWeeklyData={progress.getWeeklyData}
              getDailyActivity={progress.getDailyActivity}
            />
          )}

          {view === 'ciclo' && (
            <CicloView
              progress={progress.progress}
              toggleDone={progress.toggleDone}
              setQuestions={progress.setQuestions}
              getMesProgress={progress.getMesProgress}
              initialMes={curMes}
            />
          )}

          {view === 'stats' && (
            <StatsView
              progress={progress.progress}
              totalDone={progress.totalDone}
              totalSessions={progress.totalSessions}
              totalQuestions={progress.totalQuestions}
              avgPerDay={progress.avgPerDay}
              horasEstudadas={progress.horasEstudadas}
              studyDaysCount={progress.studyDaysCount}
              getMesProgress={progress.getMesProgress}
              getSubjectStats={progress.getSubjectStats}
              getWeeklyData={progress.getWeeklyData}
              onReset={handleReset}
            />
          )}

          {view === 'sobre' && <SobreView />}
        </div>
      </main>
    </div>
  )
}
