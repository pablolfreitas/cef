import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from './store/useAppStore'
import Sidebar from './components/Sidebar'
import { useAuth } from './hooks/useAuth'
import { useProgress } from './hooks/useProgress'
import s from './App.module.css'
import Pomodoro from './components/Pomodoro'

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

const Dashboard = lazy(() => import('./components/Dashboard'))
const CicloView = lazy(() => import('./components/CicloView'))
const StatsView = lazy(() => import('./components/StatsView'))
const SobreView = lazy(() => import('./components/SobreView'))
const LoginPage = lazy(() => import('./components/LoginPage'))
const PasswordUpdatePage = lazy(() => import('./components/PasswordUpdatePage'))

const VIEW_TITLES = {
  dashboard: 'Dashboard',
  ciclo: 'Ciclo de Estudos',
  stats: 'Estatisticas',
  sobre: 'Sobre o Edital',
}

export default function App() {
  const curMes = useAppStore(state => state.curMes)
  const setCurMes = useAppStore(state => state.setCurMes)
  const location = useLocation()
  const view = location.pathname.substring(1) || 'dashboard'

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

  const loadingFallback = (
    <div className={s.loading}>
      <div className={s.loadingSpinner} />
      <p>Carregando...</p>
    </div>
  )

  if (auth.recovery) {
    return (
      <Suspense fallback={loadingFallback}>
        <PasswordUpdatePage onDone={auth.finishRecovery} />
      </Suspense>
    )
  }

  if (!auth.user) {
    return (
      <Suspense fallback={loadingFallback}>
        <LoginPage />
      </Suspense>
    )
  }

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
          <Suspense fallback={loadingFallback}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                <Route path="/dashboard" element={
                  <PageTransition>
                    <Dashboard
                      pctDone={progress.pctDone}
                      totalDone={progress.totalDone}
                      totalSessions={progress.totalSessions}
                      totalQuestions={progress.totalQuestions}
                      totalCorrect={progress.totalCorrect}
                      totalWrong={progress.totalWrong}
                      avgPerDay={progress.avgPerDay}
                      horasEstudadas={progress.horasEstudadas}
                      studyDaysCount={progress.studyDaysCount}
                      getMesProgress={progress.getMesProgress}
                      getSubjectStats={progress.getSubjectStats}
                      getWeeklyData={progress.getWeeklyData}
                      getDailyActivity={progress.getDailyActivity}
                    />
                  </PageTransition>
                } />

                <Route path="/ciclo" element={
                  <PageTransition>
                    <CicloView
                      progress={progress.progress}
                      toggleDone={progress.toggleDone}
                      setQuestions={progress.setQuestions}
                      setNotes={progress.setNotes}
                      getMesProgress={progress.getMesProgress}
                      initialMes={curMes}
                    />
                  </PageTransition>
                } />

                <Route path="/stats" element={
                  <PageTransition>
                    <StatsView
                      progress={progress.progress}
                      totalDone={progress.totalDone}
                      totalSessions={progress.totalSessions}
                      totalQuestions={progress.totalQuestions}
                      totalCorrect={progress.totalCorrect}
                      totalWrong={progress.totalWrong}
                      avgPerDay={progress.avgPerDay}
                      horasEstudadas={progress.horasEstudadas}
                      studyDaysCount={progress.studyDaysCount}
                      getMesProgress={progress.getMesProgress}
                      getSubjectStats={progress.getSubjectStats}
                      getWeeklyData={progress.getWeeklyData}
                      onReset={handleReset}
                    />
                  </PageTransition>
                } />

                <Route path="/sobre" element={<PageTransition><SobreView /></PageTransition>} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </div>
      </main>
      <Pomodoro />
    </div>
  )
}
