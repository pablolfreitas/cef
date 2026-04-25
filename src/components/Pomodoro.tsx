import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import s from './Pomodoro.module.css'

type Mode = 'focus' | 'break'

const DURATIONS: Record<Mode, number> = {
  focus: 25 * 60,
  break: 5  * 60,
}

function playBeep() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.6)
  } catch {
    // AudioContext não disponível — ignora silenciosamente
  }
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export default function Pomodoro() {
  const [isOpen,   setIsOpen]   = useState(false)
  const [mode,     setMode]     = useState<Mode>('focus')
  const [timeLeft, setTimeLeft] = useState(DURATIONS.focus)
  const [isActive, setIsActive] = useState(false)

  // Atualiza o título da aba enquanto o timer está rodando
  useEffect(() => {
    const original = document.title
    if (isActive) {
      document.title = `${formatTime(timeLeft)} — ${mode === 'focus' ? 'Foco' : 'Pausa'}`
    } else {
      document.title = original
    }
    return () => { document.title = original }
  }, [isActive, timeLeft, mode])

  useEffect(() => {
    if (!isActive) return
    if (timeLeft === 0) {
      setIsActive(false)
      playBeep()
      const next: Mode = mode === 'focus' ? 'break' : 'focus'
      setMode(next)
      setTimeLeft(DURATIONS[next])
      return
    }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(id)
  }, [isActive, timeLeft, mode])

  const switchMode = useCallback((next: Mode) => {
    setMode(next)
    setTimeLeft(DURATIONS[next])
    setIsActive(false)
  }, [])

  const reset = useCallback(() => {
    setIsActive(false)
    setTimeLeft(DURATIONS[mode])
  }, [mode])

  const pct = Math.round(((DURATIONS[mode] - timeLeft) / DURATIONS[mode]) * 100)
  const circumference = 2 * Math.PI * 36  // raio 36

  return (
    <>
      {/* FAB — ícone SVG de relógio, sem emoji */}
      <button
        className={s.fab}
        onClick={() => setIsOpen(o => !o)}
        aria-label="Abrir Pomodoro Timer"
        title="Pomodoro Timer"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        {isActive && <span className={s.fabDot} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={s.panel}
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            <div className={s.header}>
              <h3>Pomodoro</h3>
              <button className={s.closeBtn} onClick={() => setIsOpen(false)} aria-label="Fechar">×</button>
            </div>

            <div className={s.modes}>
              <button
                className={`${s.modeBtn} ${mode === 'focus' ? s.activeMode : ''}`}
                onClick={() => switchMode('focus')}
              >
                Foco
              </button>
              <button
                className={`${s.modeBtn} ${mode === 'break' ? s.activeMode : ''}`}
                onClick={() => switchMode('break')}
              >
                Pausa
              </button>
            </div>

            {/* Anel de progresso SVG */}
            <div className={s.ring}>
              <svg width="92" height="92" viewBox="0 0 92 92">
                <circle cx="46" cy="46" r="36" fill="none" stroke="var(--bg3)" strokeWidth="5" />
                <circle
                  cx="46" cy="46" r="36"
                  fill="none"
                  stroke={mode === 'focus' ? 'var(--gold)' : 'var(--teal)'}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - pct / 100)}
                  transform="rotate(-90 46 46)"
                  style={{ transition: 'stroke-dashoffset 0.8s linear' }}
                />
              </svg>
              <span className={s.timerDisplay}>{formatTime(timeLeft)}</span>
            </div>

            <div className={s.controls}>
              <button className={s.mainBtn} onClick={() => setIsActive(a => !a)}>
                {isActive ? 'Pausar' : 'Iniciar'}
              </button>
              <button className={s.resetBtn} onClick={reset} aria-label="Reiniciar">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 .49-5.5" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
