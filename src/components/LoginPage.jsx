import { useState } from 'react'
import { supabase } from '../lib/supabase'
import s from './LoginPage.module.css'

export default function LoginPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const isSignup = mode === 'signup'

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    const credentials = {
      email: email.trim(),
      password,
    }

    const { data, error: authError } = isSignup
      ? await supabase.auth.signUp(credentials)
      : await supabase.auth.signInWithPassword(credentials)

    if (authError) {
      setError(authError.message)
    } else if (isSignup && !data.session) {
      setMessage('Cadastro criado. Confira seu e-mail para confirmar o acesso.')
    } else {
      setMessage(isSignup ? 'Conta criada com sucesso.' : 'Login realizado.')
    }

    setLoading(false)
  }

  async function handlePasswordReset() {
    setError('')
    setMessage('')

    const cleanEmail = email.trim()
    if (!cleanEmail) {
      setError('Informe seu e-mail para receber o link de redefinicao.')
      return
    }

    setLoading(true)
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: window.location.origin,
    })

    if (resetError) {
      setError(resetError.message)
    } else {
      setMessage('Enviamos um link de redefinicao para o seu e-mail.')
    }

    setLoading(false)
  }

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

      <section className={s.card} aria-label={isSignup ? 'Criar conta' : 'Entrar'}>
        <div className={s.tabs}>
          <button
            type="button"
            className={mode === 'login' ? s.activeTab : ''}
            onClick={() => { setMode('login'); setError(''); setMessage('') }}
          >
            Entrar
          </button>
          <button
            type="button"
            className={mode === 'signup' ? s.activeTab : ''}
            onClick={() => { setMode('signup'); setError(''); setMessage('') }}
          >
            Criar conta
          </button>
        </div>

        <form className={s.form} onSubmit={handleSubmit}>
          <div className={s.heading}>
            <h2>{isSignup ? 'Crie seu acesso' : 'Acesse sua conta'}</h2>
            <p>{isSignup ? 'Seu progresso ficara ligado ao seu e-mail.' : 'Continue de onde parou.'}</p>
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
            />
          </label>

          <label className={s.field}>
            Senha
            <input
              type="password"
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              value={password}
              onChange={event => setPassword(event.target.value)}
              minLength={6}
              placeholder="Minimo de 6 caracteres"
              required
            />
          </label>

          {error && <div className={s.feedbackError}>{error}</div>}
          {message && <div className={s.feedbackOk}>{message}</div>}

          <button className={s.submit} type="submit" disabled={loading}>
            {loading ? 'Aguarde...' : isSignup ? 'Criar conta' : 'Entrar'}
          </button>
        </form>

        {!isSignup && (
          <button className={s.linkButton} type="button" onClick={handlePasswordReset} disabled={loading}>
            Esqueci minha senha
          </button>
        )}
      </section>
    </main>
  )
}
