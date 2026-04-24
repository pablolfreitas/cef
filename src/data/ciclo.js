// Cada mês tem 12 blocos, cada bloco é repetido 3x no ciclo.
// Total: 5 meses × 12 blocos × 3 repetições = 180 sessões de estudo.

export const MESES = [
  {
    mes: 1,
    titulo: 'Base forte e começo por TI',
    blocos: [
      { id: '1-01', tipo: 'V', materia: 'TI',                titulo: 'Engenharia de Software',         desc: 'Processos, UX, requisitos I' },
      { id: '1-02', tipo: 'Q', materia: 'Português',         titulo: 'Interpretação e Coesão',         desc: 'Tipologia, argumentação' },
      { id: '1-03', tipo: 'Q', materia: 'Mat. Financeira',   titulo: 'Juros Simples e Compostos',      desc: 'Conceitos, taxas' },
      { id: '1-04', tipo: 'V', materia: 'TI',                titulo: 'Requisitos II, UML e Padrões',   desc: 'Padrões de projeto' },
      { id: '1-05', tipo: 'V', materia: 'Compliance',        titulo: 'Lei 9.613 e Circular 3.978',     desc: 'Carta Circular 4.001, CVM 50' },
      { id: '1-06', tipo: 'Q', materia: 'Inglês',            titulo: 'Compreensão e Vocabulário',      desc: 'Fundamental' },
      { id: '1-07', tipo: 'Q', materia: 'Prob. e Estatística', titulo: 'Estatística Descritiva',       desc: 'Médias, moda, mediana, dispersão' },
      { id: '1-08', tipo: 'V', materia: 'TI',                titulo: 'Teste e Qualidade de Software',  desc: 'Estratégias e técnicas' },
      { id: '1-09', tipo: 'Q', materia: 'Comp. Digitais',    titulo: 'Mindset Digital',                desc: 'Design thinking, pensamento computacional' },
      { id: '1-10', tipo: 'P', materia: 'Redação',           titulo: 'Texto Dissertativo Guiado',      desc: 'Estrutura e escrita orientada' },
      { id: '1-11', tipo: 'Q', materia: 'TI',                titulo: 'Bateria — Eng. de Software',     desc: 'Requisitos, testes, qualidade' },
      { id: '1-12', tipo: 'Q', materia: 'Revisão',           titulo: 'Revisão Geral + Caderno de Erros', desc: 'Consolidação do mês 1' },
    ],
  },
  {
    mes: 2,
    titulo: 'Banco de dados e consolidação da base',
    blocos: [
      { id: '2-01', tipo: 'V', materia: 'TI',                titulo: 'Modelagem ER e Modelo Relacional', desc: 'Conceitos fundamentais' },
      { id: '2-02', tipo: 'Q', materia: 'Português',         titulo: 'Sintaxe e Concordância',           desc: 'Pontuação e estrutura' },
      { id: '2-03', tipo: 'Q', materia: 'Mat. Financeira',   titulo: 'Equivalência de Capitais',         desc: 'Séries uniformes' },
      { id: '2-04', tipo: 'V', materia: 'TI',                titulo: 'Normalização, SQL e SGBD',         desc: 'Formas normais e consultas' },
      { id: '2-05', tipo: 'V', materia: 'Compliance',        titulo: 'Ética e Segurança da Informação',  desc: 'Assédio, Resolução CMN 4.893' },
      { id: '2-06', tipo: 'Q', materia: 'Inglês',            titulo: 'Leitura e Gramática Básica',       desc: 'Textos e itens gramaticais' },
      { id: '2-07', tipo: 'Q', materia: 'Prob. e Estatística', titulo: 'Quartis, Percentis e Probabilidade', desc: 'Básico' },
      { id: '2-08', tipo: 'V', materia: 'TI',                titulo: 'Data Warehouse, NoSQL e Big Data', desc: 'Fundamentos' },
      { id: '2-09', tipo: 'Q', materia: 'Comp. Digitais',    titulo: 'Análise de Negócios',              desc: 'Colaboração e liderança' },
      { id: '2-10', tipo: 'P', materia: 'Redação',           titulo: 'Redação Completa',                 desc: 'Texto dissertativo autônomo' },
      { id: '2-11', tipo: 'Q', materia: 'TI',                titulo: 'Bateria — Banco de Dados',         desc: 'SQL, NoSQL, Big Data' },
      { id: '2-12', tipo: 'Q', materia: 'Revisão',           titulo: 'Revisão Geral + Caderno de Erros', desc: 'Consolidação do mês 2' },
    ],
  },
  {
    mes: 3,
    titulo: 'Algoritmos, POO e linguagens principais',
    blocos: [
      { id: '3-01', tipo: 'V', materia: 'TI',                titulo: 'Estruturas de Dados e Algoritmos', desc: 'Arrays, listas, árvores, grafos' },
      { id: '3-02', tipo: 'Q', materia: 'Português',         titulo: 'Regência, Crase e Pronomes',       desc: 'Colocação pronominal' },
      { id: '3-03', tipo: 'Q', materia: 'Mat. Financeira',   titulo: 'Amortização e Descontos',          desc: 'SAC, PRICE e descontos' },
      { id: '3-04', tipo: 'V', materia: 'TI',                titulo: 'Análise OO e UML',                 desc: 'Projeto OO + revisão de diagramas' },
      { id: '3-05', tipo: 'V', materia: 'Compliance',        titulo: 'LC 105 e LGPD',                    desc: 'Proteção de dados e sigilo' },
      { id: '3-06', tipo: 'Q', materia: 'Inglês',            titulo: 'Textos e Vocabulário Recorrente',  desc: 'Edital e técnico' },
      { id: '3-07', tipo: 'Q', materia: 'Prob. e Estatística', titulo: 'Probabilidade e Binomial',       desc: 'Condicional e independência' },
      { id: '3-08', tipo: 'V', materia: 'TI',                titulo: 'Java, Java EE, JS e TypeScript',   desc: 'Linguagens principais do edital' },
      { id: '3-09', tipo: 'Q', materia: 'Comp. Digitais',    titulo: 'CX, OKR e Trabalho Remoto',        desc: 'Customer experience, produtividade' },
      { id: '3-10', tipo: 'P', materia: 'Redação',           titulo: 'Redação Cronometrada',             desc: 'Simulando condições de prova' },
      { id: '3-11', tipo: 'Q', materia: 'TI',                titulo: 'Bateria — Algoritmos e Java',      desc: 'POO, estruturas, padrões' },
      { id: '3-12', tipo: 'Q', materia: 'Revisão',           titulo: 'Revisão Geral + Caderno de Erros', desc: 'Consolidação do mês 3' },
    ],
  },
  {
    mes: 4,
    titulo: 'Web, agilidade, arquitetura e sistemas',
    blocos: [
      { id: '4-01', tipo: 'V', materia: 'TI',                titulo: 'Desenvolvimento Web',              desc: 'Microsserviços, REST, SOAP, Quarkus' },
      { id: '4-02', tipo: 'Q', materia: 'Português',         titulo: 'Redação Oficial + Interpretação',  desc: 'Aplicada ao contexto' },
      { id: '4-03', tipo: 'Q', materia: 'Mat. Financeira',   titulo: 'Revisão Pesada por Questões',      desc: 'Todos os tópicos' },
      { id: '4-04', tipo: 'V', materia: 'TI',                titulo: 'Agilidade Completa',               desc: 'Scrum, XP, Kanban, DevSecOps, CI/CD' },
      { id: '4-05', tipo: 'V', materia: 'Compliance',        titulo: 'Lei 12.846 e Governança',          desc: 'Decreto 11.129, PRSA Caixa' },
      { id: '4-06', tipo: 'Q', materia: 'Inglês',            titulo: 'Bateria de Leitura',               desc: 'Textos técnicos e gerais' },
      { id: '4-07', tipo: 'Q', materia: 'Prob. e Estatística', titulo: 'Revisão Geral e Blocos Mistos',  desc: 'Todos os tópicos' },
      { id: '4-08', tipo: 'V', materia: 'TI',                titulo: 'Arquitetura de Computadores e SO', desc: 'Sistemas operacionais' },
      { id: '4-09', tipo: 'Q', materia: 'Comp. Digitais',    titulo: 'Ciência de Dados e Inovação',      desc: 'Lifelong learning' },
      { id: '4-10', tipo: 'P', materia: 'Redação',           titulo: 'Simulado de Discursiva',           desc: 'Condições reais de prova' },
      { id: '4-11', tipo: 'Q', materia: 'TI',                titulo: 'Bateria — Web, Agilidade e SO',    desc: 'Questões mistas' },
      { id: '4-12', tipo: 'Q', materia: 'Revisão',           titulo: 'Revisão Geral + Caderno de Erros', desc: 'Consolidação do mês 4' },
    ],
  },
  {
    mes: 5,
    titulo: 'Fechamento técnico e prova',
    blocos: [
      { id: '5-01', tipo: 'V', materia: 'TI',                titulo: 'Arquitetura de Software e Cloud',  desc: 'Serverless, segurança, gerência config' },
      { id: '5-02', tipo: 'Q', materia: 'Português',         titulo: 'Bloco Misto de Questões',          desc: 'Revisão final' },
      { id: '5-03', tipo: 'Q', materia: 'Mat. Financeira',   titulo: 'Bloco Misto Final',                desc: 'Todos os tópicos' },
      { id: '5-04', tipo: 'V', materia: 'TI',                titulo: 'ITIL, COBIT e CMMI/MPS-BR',        desc: 'Arquitetura de referência' },
      { id: '5-05', tipo: 'Q', materia: 'Compliance',        titulo: 'Revisão Seca da Lei',              desc: 'Questões diretas' },
      { id: '5-06', tipo: 'Q', materia: 'Inglês',            titulo: 'Bloco Misto de Textos',            desc: 'Revisão final' },
      { id: '5-07', tipo: 'Q', materia: 'Prob. e Estatística', titulo: 'Bloco Misto Final',              desc: 'Tudo consolidado' },
      { id: '5-08', tipo: 'V', materia: 'TI',                titulo: 'Linguagens Complementares',        desc: 'Python, C#, R, Angular, Kotlin, Flutter, Cobol' },
      { id: '5-09', tipo: 'Q', materia: 'Comp. Digitais',    titulo: 'Revisão Final por Questões',       desc: 'Consolidação' },
      { id: '5-10', tipo: 'P', materia: 'Redação',           titulo: '1 Texto por Semana',               desc: 'Manutenção da escrita' },
      { id: '5-11', tipo: 'Q', materia: 'TI',                titulo: 'Simulado Geral + Correção',        desc: 'Por assunto' },
      { id: '5-12', tipo: 'Q', materia: 'Revisão',           titulo: 'Revisão Final + Mapa de Erros',    desc: 'Fechamento do ciclo' },
    ],
  },
]

export const REPETICOES = [1, 2, 3]

export const SUBJECT_COLORS = {
  'TI':                 '#5B8DEF',
  'Português':          '#9B7FE8',
  'Mat. Financeira':    '#F5C842',
  'Compliance':         '#2DD4A8',
  'Inglês':             '#F0715A',
  'Prob. e Estatística':'#E879F9',
  'Comp. Digitais':     '#4ADE80',
  'Redação':            '#FB923C',
  'Revisão':            '#94A3B8',
}

// Gera uma chave única por sessão: mesId-blocoId-repeticao
// Ex: "1-01-R1", "1-01-R2", "1-01-R3"
export function sessionKey(blocoId, rep) {
  return `${blocoId}-R${rep}`
}

export function getAllSessions() {
  return MESES.flatMap(m =>
    m.blocos.flatMap(b =>
      REPETICOES.map(rep => ({
        ...b,
        mes: m.mes,
        mesTitulo: m.titulo,
        rep,
        sessionId: sessionKey(b.id, rep),
      }))
    )
  )
}
