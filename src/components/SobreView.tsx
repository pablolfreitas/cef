import s from './SobreView.module.css'

export default function SobreView() {
  return (
    <div className={s.wrap}>
      <div className={s.banner}>
        <span className={s.bannerIcon}>🏦</span>
        <div>
          <strong>Caixa Econômica Federal — TBN · TI</strong>
          <p>Técnico Bancário Novo com ênfase em Tecnologia da Informação. Um dos concursos mais disputados do Brasil.</p>
        </div>
      </div>

      <div className={s.grid}>
        <div className={s.card}>
          <h3 className={s.cardTitle}>Prova Objetiva</h3>
          <InfoRow label="Língua Portuguesa"              val="10 questões" />
          <InfoRow label="Língua Inglesa"                 val="5 questões" />
          <InfoRow label="Matemática Financeira e Est."   val="10 questões" />
          <InfoRow label="Tecnologia da Informação"       val="30 questões" highlight />
          <InfoRow label="Compliance e Ética"             val="5 questões" />
          <InfoRow label="Comportamentos Digitais"        val="5 questões" />
          <InfoRow label="Total"                          val="65 questões" gold />
        </div>

        <div className={s.card}>
          <h3 className={s.cardTitle}>Prova Discursiva</h3>
          <InfoRow label="Tipo"           val="Dissertativa" />
          <InfoRow label="Mínimo"         val="20 linhas" />
          <InfoRow label="Máximo"         val="30 linhas" />
          <InfoRow label="Caráter"        val="Eliminatório" highlight />
          <h3 className={s.cardTitle} style={{ marginTop: 20 }}>TI no ciclo</h3>
          <InfoRow label="Sessões TI"     val="~75 de 180" />
          <InfoRow label="Peso objetiva"  val="46%" highlight />
          <InfoRow label="Banca usual"    val="CESGRANRIO / CESPE" />
        </div>
      </div>

      <div className={s.card}>
        <h3 className={s.cardTitle}>Como usar o ciclo</h3>
        <div className={s.tipoGrid}>
          <TipoCard
            cor="blue"
            tag="[V] VIDEOAULA"
            desc="Teoria enxuta primeiro + 5 a 10 questões no final para fixação imediata."
          />
          <TipoCard
            cor="purple"
            tag="[Q] QUESTÕES"
            desc="10 a 15 questões primeiro, depois volta apenas no que errou para revisão ativa."
          />
          <TipoCard
            cor="coral"
            tag="[P] PRÁTICA"
            desc="Escrever e corrigir. Para redação e discursivas. Simula a prova real."
          />
        </div>
        <div className={s.ruleBox}>
          <span className={s.ruleTitle}>⚡ Regra do ciclo</span>
          <p>1 bloco = 1h30 líquida. Você não prende em dia da semana. Faz o bloco 1, depois 2, depois 3. Se sobrar tempo no dia, adianta o próximo. Cada mês é percorrido 3 vezes antes de avançar.</p>
        </div>
      </div>

      <div className={s.card}>
        <h3 className={s.cardTitle}>Tópicos de TI — Edital</h3>
        <div className={s.topicGrid}>
          {TOPICS.map(t => <span key={t} className={s.topic}>{t}</span>)}
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, val, highlight, gold }) {
  return (
    <div className={s.infoRow}>
      <span className={s.infoLabel}>{label}</span>
      <span className={`${s.infoVal} ${highlight ? s.highlight : ''} ${gold ? s.gold : ''}`}>{val}</span>
    </div>
  )
}

function TipoCard({ cor, tag, desc }) {
  return (
    <div className={`${s.tipoCard} ${s[cor]}`}>
      <div className={s.tipoTag}>{tag}</div>
      <p className={s.tipoDesc}>{desc}</p>
    </div>
  )
}

const TOPICS = [
  'Engenharia de Software', 'UX e Requisitos', 'UML', 'Padrões de Projeto',
  'Qualidade e Testes', 'Modelagem ER', 'SQL', 'SGBD', 'Normalização',
  'Data Warehouse', 'NoSQL', 'Big Data', 'Estruturas de Dados', 'Algoritmos',
  'POO e Java', 'Java EE', 'JavaScript', 'TypeScript', 'Python', 'C# / .NET',
  'REST e SOAP', 'XML / WSDL', 'Microsserviços', 'Quarkus', 'Angular', 'Kotlin',
  'Swift', 'Flutter', 'Cobol', 'R', 'Scrum', 'XP', 'Kanban', 'Lean',
  'TDD / BDD', 'CI/CD', 'DevSecOps', 'Arquitetura de Computadores', 'SO',
  'Cloud e Serverless', 'ITIL', 'COBIT', 'CMMI / MPS-BR', 'LGPD', 'LC 105',
  'Segurança da Informação', 'Gerência de Configuração',
]
