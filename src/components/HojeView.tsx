import { Link } from 'react-router-dom'
import { SUBJECT_COLORS } from '../data/ciclo'
import type { MistakeCard, NextAction, ProgressMap, ReviewItem, RiskItem } from '../types/study'
import s from './HojeView.module.css'

interface HojeViewProps {
  progress: ProgressMap
  pctDone: number
  totalQuestions: number
  totalCorrect: number
  totalWrong: number
  getNextAction: () => NextAction
  getReviewQueue: () => ReviewItem[]
  getRiskBySubject: () => RiskItem[]
  getMistakeCards: () => MistakeCard[]
  setCurMes: (mes: number) => void
  toggleDone: (sessionId: string) => void
  setQuestions: (sessionId: string, feitas: number | string, erros: number | string) => void
}

function accuracy(totalCorrect: number, totalQuestions: number) {
  return totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
}

function priorityText(priority: ReviewItem['priority']) {
  if (priority === 'alta') return 'Alta'
  if (priority === 'media') return 'Média'
  return 'Baixa'
}

export default function HojeView({
  progress,
  pctDone,
  totalQuestions,
  totalCorrect,
  totalWrong,
  getNextAction,
  getReviewQueue,
  getRiskBySubject,
  getMistakeCards,
  setCurMes,
  toggleDone,
  setQuestions,
}: HojeViewProps) {
  const next = getNextAction()
  const reviews = getReviewQueue().slice(0, 4)
  const risks = getRiskBySubject().slice(0, 4)
  const mistakes = getMistakeCards().slice(0, 5)
  const acc = accuracy(totalCorrect, totalQuestions)
  const state = next.session ? progress[next.session.sessionId] : undefined
  const feitas = Number(state?.questions ?? 0)
  const erradas = Number(state?.wrong ?? 0)

  return (
    <div className={s.wrap}>
      <section className={s.hero}>
        <div className={s.heroText}>
          <span className={s.kicker}>Plano de hoje</span>
          <h1>Abra, estude, registre e revise sem pensar no próximo passo.</h1>
          <p>
            O app prioriza revisão pendente, depois segue a ordem do ciclo. Assim você combina avanço,
            repetição espaçada e correção de pontos fracos sem complicar a rotina.
          </p>
        </div>
        <div className={s.heroStats}>
          <div><strong>{pctDone}%</strong><span>do ciclo</span></div>
          <div><strong>{acc}%</strong><span>acerto geral</span></div>
          <div><strong>{totalWrong}</strong><span>erros mapeados</span></div>
        </div>
      </section>

      <section className={s.mainGrid}>
        <article className={s.todayCard}>
          <span className={s.cardEyebrow}>Próxima ação recomendada</span>
          {next.session ? (
            <>
              <div className={s.sessionTop}>
                <span className={s.sessionCode}>Mês {next.session.mes} · Bloco {next.session.id} · Rodada {next.session.rep}</span>
                <span className={s.subjectPill} style={{ borderColor: SUBJECT_COLORS[next.session.materia] ?? '#888' }}>
                  {next.session.materia}
                </span>
              </div>
              <h2>{next.session.titulo}</h2>
              <p className={s.sessionDesc}>{next.session.desc}</p>
              <div className={s.whyBox}>{next.reason}</div>

              <div className={s.quickLog}>
                <label>
                  Questões feitas
                  <input
                    type="number"
                    min="0"
                    value={feitas || ''}
                    placeholder="0"
                    onChange={e => setQuestions(next.session!.sessionId, e.target.value, erradas)}
                  />
                </label>
                <label>
                  Erradas
                  <input
                    type="number"
                    min="0"
                    value={erradas || ''}
                    placeholder="0"
                    onChange={e => setQuestions(next.session!.sessionId, feitas, e.target.value)}
                  />
                </label>
              </div>

              <div className={s.actions}>
                <Link to="/ciclo" className={s.primaryBtn} onClick={() => setCurMes(next.session!.mes)}>
                  {next.actionLabel}
                </Link>
                <button className={s.secondaryBtn} onClick={() => toggleDone(next.session!.sessionId)}>
                  {state?.done ? 'Desmarcar feito' : 'Marcar como feito'}
                </button>
              </div>
            </>
          ) : (
            <div className={s.emptyState}>
              <h2>Ciclo completo 🎉</h2>
              <p>{next.reason}</p>
              <Link to="/stats" className={s.primaryBtn}>Ver estatísticas</Link>
            </div>
          )}
        </article>

        <aside className={s.sideStack}>
          <article className={s.card}>
            <div className={s.cardHeader}>
              <h3>Risco por matéria</h3>
              <Link to="/stats">ver tudo</Link>
            </div>
            <div className={s.riskList}>
              {risks.map(item => (
                <div key={item.subject} className={s.riskRow}>
                  <div>
                    <strong>{item.subject}</strong>
                    <span>{item.reason}</span>
                  </div>
                  <b className={s[item.label === 'risco alto' ? 'danger' : item.label === 'atenção' ? 'warn' : 'safe']}>
                    {item.risk}
                  </b>
                </div>
              ))}
            </div>
          </article>

          <article className={s.card}>
            <div className={s.cardHeader}>
              <h3>Revisões pendentes</h3>
              <span>{reviews.length}</span>
            </div>
            {reviews.length === 0 ? (
              <p className={s.muted}>Nenhuma revisão vencida. Continue o próximo bloco.</p>
            ) : (
              <div className={s.reviewList}>
                {reviews.map(item => (
                  <Link
                    to="/ciclo"
                    onClick={() => setCurMes(item.session.mes)}
                    key={item.session.sessionId}
                    className={s.reviewItem}
                  >
                    <span>{priorityText(item.priority)} · {item.dueDate}</span>
                    <strong>{item.session.materia}</strong>
                    <small>{item.session.titulo}</small>
                  </Link>
                ))}
              </div>
            )}
          </article>
        </aside>
      </section>

      <section className={s.card}>
        <div className={s.cardHeader}>
          <h3>Caderno de erros inteligente</h3>
          <span>{mistakes.length} foco(s)</span>
        </div>
        {mistakes.length === 0 ? (
          <p className={s.muted}>Quando você registrar erros ou anotações, eles aparecerão aqui como cartões de revisão.</p>
        ) : (
          <div className={s.mistakeGrid}>
            {mistakes.map(item => (
              <Link
                to="/ciclo"
                onClick={() => setCurMes(item.session.mes)}
                key={item.session.sessionId}
                className={s.mistakeCard}
              >
                <span>{item.session.materia}</span>
                <strong>{item.session.titulo}</strong>
                <p>{item.hint}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
