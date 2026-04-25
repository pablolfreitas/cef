import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import s from './Pomodoro.module.css'

export default function Pomodoro() {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<'focus' | 'break'>('focus')
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000)
    } else if (isActive && timeLeft === 0) {
      setIsActive(false)
      if (mode === 'focus') {
        new Audio('/notification.mp3').play().catch(() => {})
        // Pode integrar com o log manual aqui futuramente
        setMode('break')
        setTimeLeft(5 * 60)
      } else {
        new Audio('/notification.mp3').play().catch(() => {})
        setMode('focus')
        setTimeLeft(25 * 60)
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, mode])

  const toggleTimer = () => setIsActive(!isActive)

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const reset = () => {
    setIsActive(false)
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60)
  }

  return (
    <>
      <button 
        className={s.fab} 
        onClick={() => setIsOpen(!isOpen)}
        title="Pomodoro Timer"
      >
        ⏱️
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={s.panel}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
          >
            <div className={s.header}>
              <h3>Pomodoro</h3>
              <button className={s.closeBtn} onClick={() => setIsOpen(false)}>×</button>
            </div>
            
            <div className={s.modes}>
              <button 
                className={`${s.modeBtn} ${mode === 'focus' ? s.activeMode : ''}`}
                onClick={() => { setMode('focus'); setTimeLeft(25 * 60); setIsActive(false) }}
              >
                Foco
              </button>
              <button 
                className={`${s.modeBtn} ${mode === 'break' ? s.activeMode : ''}`}
                onClick={() => { setMode('break'); setTimeLeft(5 * 60); setIsActive(false) }}
              >
                Pausa
              </button>
            </div>

            <div className={s.timerDisplay}>
              {formatTime(timeLeft)}
            </div>

            <div className={s.controls}>
              <button className={s.mainBtn} onClick={toggleTimer}>
                {isActive ? 'Pausar' : 'Iniciar'}
              </button>
              <button className={s.resetBtn} onClick={reset}>
                ↻
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
