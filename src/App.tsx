import { lazy, Suspense, Component, ReactNode } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from './store/useAppStore'
import Sidebar from './components/Sidebar'
import { useAuth } from './hooks/useAuth'
import { useProgress } from './hooks/useProgress'
import s from './App.module.css'
import Pomodoro from './components/Pomodoro'

// ─── Error Boundary ──────────────────────────────────────────────────────────
interface ErrorBoundaryState { hasError: boolean; message: string }

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={s.loading} role="alert">
          <p style={{ color: 'var(--coral)', fontWeight: 700 }}>Algo deu errado.</p>
          <p style={{ color: 'var(--muted)', fontSize: 12, maxWidth: 360, textAlign: 'center' }}>
            {this.state.message || 'Tente recarregar a página.'}
          </p>
          <button
            style={{
              marginTop: 12, padding: '6px 16px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg3)', border: '1px solid var(--border2)',
              color: 'var(--text)', fontSize: 13, cursor: 'pointer'
            }}
            onClick={() => window.location.reload()}
          >
            Recarregar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// ─── Page transition ──────────────────────────────────────────────────────────
function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

const Dashboard          = lazy(() => import('./components/Dashboard'))
const CicloView          = lazy(() => import('./components/CicloView'))
const StatsView          = lazy(() => import('./components/StatsView'))
const SobreView          = lazy(() => import('./components/SobreView'))
const LoginPage          = lazy(() => import('./components/LoginPage'))
const PasswordUpdatePage = lazy(() => import('./components/PasswordUpdatePage'))

const VIEW_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  ciclo:     'Ciclo de Estudos',
  stats:     'Estatísticas',
  sobre:     'Sobre o Edital',
}

export default function App() {
  const curMes    = useAppStore(state => state.curMes)
  const setCurMes = useAppStore(state => state.setCurMes)
  const location  = useLocation()
  const view      = location.pathname.substring(1) || 'dashboard'

  const auth     = useAuth()
  const progress = useProgress(auth.user?.id)

  const now = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  async function handleReset() {
    if (window.confirm('Tem certeza? Todos os seus dados serão apagados permanentemente.')) {
      await progress.clearProgress()
    }
  }

  const loadingFallback = (
    <div className={s.loading}>
      <div className={s.loadingSpinner} />
      <p>Carregando...</p>
    </div>
  )

  if (auth.loading) return (
    <div className={s.loading}>
      <div className={s.loadingSpinner} />
      <p>Carregando seu progresso...</p>
    </div>
  )

  if (auth.recovery) return (
    <ErrorBoundary>
      <Suspense fallback={loadingFallback}>
        <PasswordUpdatePage onDone={auth.finishRecovery} />
      </Suspense>
    </ErrorBoundary>
  )

  if (!auth.user) return (
    <ErrorBoundary>
      <Suspense fallback={loadingFallback}>
        <LoginPage />
      </Suspense>
    </ErrorBoundary>
  )

  if (progress.loading) return (
    <div className={s.loading}>
      <div className={s.loadingSpinner} />
      <p>Carregando seu progresso...</p>
    </div>
  )

  const sidebarStats = {
    totalDone:      progress.totalDone,
    totalQuestions: progress.totalQuestions,
    pctDone:        progress.pctDone,
  }

  return (
    <ErrorBoundary>
      <div className={s.layout}>
        <Sidebar
          onMes={mes => setCurMes(mes)}
          stats={sidebarStats}
          syncing={progress.syncing}
          userEmail={auth.user.email}
          onSignOut={auth.signOut}
        />

        <main className={s.main}>
          <header className={s.topbar}>
            <div className={s.topbarLeft}>
              <h2 className={s.topbarTitle}>{VIEW_TITLES[view] ?? 'Painel'}</h2>
            </div>
            <div className={s.topbarRight}>
              {progress.error && <span className={s.errorPill}>offline</span>}
              {progress.syncing && <span className={s.syncPill}>sync</span>}
              <span className={s.date}>{now}</span>
            </div>
          </header>

          <div className={s.content}>
            <ErrorBoundary>
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
            </ErrorBoundary>
          </div>
        </main>
        <Pomodoro />
      </div>
    </ErrorBoundary>
  )
}
