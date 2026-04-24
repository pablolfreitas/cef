import s from './BlockCard.module.css'
import { SUBJECT_COLORS } from '../data/ciclo'

const TIPO_META = {
  V: { label: 'Videoaula', cls: 'v' },
  Q: { label: 'Questões',  cls: 'q' },
  P: { label: 'Prática',   cls: 'p' },
}

export default function BlockCard({ session, state, onToggle, onQuestions }) {
  const { done, questions } = state ?? { done: false, questions: 0 }
  const color = SUBJECT_COLORS[session.materia] ?? '#888'
  const tipo  = TIPO_META[session.tipo]

  return (
    <article className={`${s.card} ${done ? s.done : ''}`}>
      <div className={s.topRow}>
        <span className={s.blockId}>
          BLOCO {session.id} · REP {session.rep}
        </span>
        <span className={`${s.badge} ${s[tipo.cls]}`}>
          [{session.tipo}] {tipo.label}
        </span>
      </div>

      <h3 className={s.titulo}>{session.titulo}</h3>

      <div className={s.materia}>
        <span className={s.dot} style={{ background: color }} />
        {session.materia} · {session.desc}
      </div>

      <div className={s.footer}>
        <label className={s.qLabel}>
          Questões
          <input
            className={s.qInput}
            type="number"
            min="0"
            max="999"
            value={questions || ''}
            placeholder="0"
            onChange={e => onQuestions(session.sessionId, e.target.value)}
          />
        </label>

        <button
          className={`${s.doneBtn} ${done ? s.checked : ''}`}
          onClick={() => onToggle(session.sessionId)}
        >
          <span>{done ? '✓' : '○'}</span>
          {done ? 'Feito' : 'Marcar'}
        </button>
      </div>
    </article>
  )
}
