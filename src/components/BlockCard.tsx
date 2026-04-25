import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import s from './BlockCard.module.css'
import { SUBJECT_COLORS } from '../data/ciclo'

const TIPO_META: any = {
  V: { label: 'Videoaula', cls: 'v' },
  Q: { label: 'Questões',  cls: 'q' },
  P: { label: 'Prática',   cls: 'p' },
}

export default function BlockCard({ session, state, onToggle, onQuestions, onNotes }: any) {
  const { done, correct, wrong, notes } = state ?? { done: false, correct: 0, wrong: 0, notes: '' }
  const color = SUBJECT_COLORS[session.materia] ?? '#888'
  const tipo  = TIPO_META[session.tipo]
  
  const [showNotes, setShowNotes] = useState(false)
  const [draftNote, setDraftNote] = useState(notes || '')

  const handleSaveNotes = () => {
    onNotes(session.sessionId, draftNote)
    setShowNotes(false)
  }

  return (
    <article className={`${s.card} ${done ? s.done : ''}`}>
      <div className={s.topRow}>
        <span className={s.blockId}>
          BLOCO {session.id} · REP {session.rep}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {notes && (
            <span className={s.hasNotesBadge} onClick={() => { setDraftNote(notes); setShowNotes(true); }} title="Ver anotações">
              📝
            </span>
          )}
          <span className={`${s.badge} ${s[tipo.cls]}`}>
            [{session.tipo}] {tipo.label}
          </span>
        </div>
      </div>

      <h3 className={s.titulo}>{session.titulo}</h3>

      <div className={s.materia}>
        <span className={s.dot} style={{ background: color }} />
        {session.materia} · {session.desc}
      </div>

      <div className={s.footer}>
        <div className={s.inputsRow}>
          <label className={s.qLabel} title="Acertos">
            🟩
            <input
              className={s.qInput}
              type="number"
              min="0"
              value={correct || ''}
              placeholder="0"
              onChange={e => onQuestions(session.sessionId, e.target.value, wrong)}
            />
          </label>
          <label className={s.qLabel} title="Erros">
            🟥
            <input
              className={s.qInput}
              type="number"
              min="0"
              value={wrong || ''}
              placeholder="0"
              onChange={e => onQuestions(session.sessionId, correct, e.target.value)}
            />
          </label>
        </div>

        <div className={s.actionsRow}>
          <button className={s.noteBtn} onClick={() => { setDraftNote(notes || ''); setShowNotes(true); }}>
            Anotar
          </button>
          <button
            className={`${s.doneBtn} ${done ? s.checked : ''}`}
            onClick={() => onToggle(session.sessionId)}
          >
            <span>{done ? '✓' : '○'}</span>
            {done ? 'Feito' : 'Marcar'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showNotes && (
          <motion.div 
            className={s.notesOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={s.notesModal}
              initial={{ y: 20, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.95 }}
            >
              <h4>Anotações de Revisão</h4>
              <p className={s.notesSub}>{session.materia} - {session.titulo}</p>
              <textarea 
                autoFocus
                className={s.notesArea}
                value={draftNote}
                onChange={e => setDraftNote(e.target.value)}
                placeholder="Ex: Revisar regra X amanhã..."
              />
              <div className={s.notesActions}>
                <button className={s.cancelBtn} onClick={() => setShowNotes(false)}>Cancelar</button>
                <button className={s.saveBtn} onClick={handleSaveNotes}>Salvar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  )
}
