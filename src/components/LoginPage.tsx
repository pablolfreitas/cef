import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import s from './LoginPage.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  
  const [attempts, setAttempts] = useState(0)
  const [blockedUntil, setBlockedUntil] = useState(null)

  useEffect(() => {
    // Check local storage for existing blocks
    const storedBlock = localStorage.getItem('login_blocked_until')
    if (storedBlock) {
      const blockTime = parseInt(storedBlock, 10)
      if (Date.now() < blockTime) {
        setBlockedUntil(blockTime)
      } else {
        localStorage.removeItem('login_blocked_until')
        localStorage.removeItem('login_attempts')
      }
    } else {
      const storedAttempts = localStorage.getItem('login_attempts')
      if (storedAttempts) setAttempts(parseInt(storedAttempts, 10))
    }
  }, [])

  useEffect(() => {
    if (!blockedUntil) return
    
    const interval = setInterval(() => {
      if (Date.now() >= blockedUntil) {
        setBlockedUntil(null)
        setAttempts(0)
        localStorage.removeItem('login_blocked_until')
        localStorage.removeItem('login_attempts')
        setError('')
      }
    }, 1000)
    
    return () => clearInterval(interval)
  }, [blockedUntil])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    
    if (blockedUntil) {
      setError('Muitas tentativas falhas. Tente novamente mais tarde.')
      return
    }

    setLoading(true)

    const credentials = {
      email: email.trim(),
      password,
    }

    const { error: authError } = await supabase.auth.signInWithPassword(credentials)

    if (authError) {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      localStorage.setItem('login_attempts', newAttempts.toString())
      
      if (newAttempts >= 5) {
        // Bloqueia por 15 minutos (900000 ms)
        const blockTime = Date.now() + 900000
        setBlockedUntil(blockTime)
        localStorage.setItem('login_blocked_until', blockTime.toString())
        setError('Acesso bloqueado por muitas tentativas falhas. Aguarde 15 minutos.')
      } else {
        setError(`Credenciais invalidas. Tentativa ${newAttempts} de 5.`)
      }
    } else {
      setAttempts(0)
      localStorage.removeItem('login_attempts')
      localStorage.removeItem('login_blocked_until')
      setMessage('Login realizado.')
    }

    setLoading(false)
  }

  const isBlocked = !!blockedUntil

  return (
    <main className={s.page}>
      <section className={s.hero}>
        <span className={s.badge}>CEF · TBN · TI</span>
        <h1>Painel de Estudos</h1>
        <p>
          Acompanhe seu ciclo, registre questoes e mantenha seu progresso salvo
          em qualquer dispositivo.
        </p>
        <div className={s.metrics} aria-label="Resumo do ciclo">
          <span><strong>180</strong> sessoes</span>
          <span><strong>5</strong> meses</span>
          <span><strong>3x</strong> repeticoes</span>
        </div>
      </section>

      <section className={s.card} aria-label="Entrar">
        <form className={s.form} onSubmit={handleSubmit}>
          <div className={s.heading}>
            <h2>Acesse sua conta</h2>
            <p>Continue de onde parou.</p>
          </div>

          <label className={s.field}>
            E-mail
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              placeholder="voce@email.com"
              required
              disabled={isBlocked}
            />
          </label>

          <label className={s.field}>
            Senha
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              minLength={6}
              placeholder="Minimo de 6 caracteres"
              required
              disabled={isBlocked}
            />
          </label>

          {error && <div className={s.feedbackError}>{error}</div>}
          {message && <div className={s.feedbackOk}>{message}</div>}

          <button className={s.submit} type="submit" disabled={loading || isBlocked}>
            {loading ? 'Aguarde...' : isBlocked ? 'Bloqueado temporariamente' : 'Entrar'}
          </button>
        </form>
      </section>
    </main>
  )
}
