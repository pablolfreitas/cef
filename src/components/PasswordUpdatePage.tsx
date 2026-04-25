import { useState } from 'react'
import { supabase } from '../lib/supabase'
import s from './LoginPage.module.css'

export default function PasswordUpdatePage({ onDone }) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
    } else {
      setMessage('Senha atualizada com sucesso.')
      onDone()
    }

    setLoading(false)
  }

  return (
    <main className={s.page}>
      <section className={s.hero}>
        <span className={s.badge}>CEF · TBN · TI</span>
        <h1>Nova senha</h1>
        <p>Defina uma nova senha para voltar ao seu painel de estudos.</p>
      </section>

      <section className={s.card} aria-label="Atualizar senha">
        <form className={s.form} onSubmit={handleSubmit}>
          <div className={s.heading}>
            <h2>Atualizar acesso</h2>
            <p>Use pelo menos 6 caracteres.</p>
          </div>

          <label className={s.field}>
            Nova senha
            <input
              type="password"
              autoComplete="new-password"
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
            {loading ? 'Aguarde...' : 'Atualizar senha'}
          </button>
        </form>
      </section>
    </main>
  )
}
