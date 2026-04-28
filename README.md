# CEF TBN-TI — Study OS

Aplicacao React para guiar o ciclo de estudos do concurso **Caixa Economica Federal — Tecnico Bancario Novo (TI)**.

A proposta atual e simples: o usuario abre o app e ve exatamente o que estudar agora, o que revisar, quais materias estao em risco e quais erros precisam voltar para a fila.

## O que o app faz

- Ciclo completo com **180 sessoes**: 5 meses x 12 blocos x 3 rodadas.
- Tela **Hoje** com proxima acao recomendada.
- Revisao inteligente baseada em erros, anotacoes, acerto e data da ultima sessao.
- Caderno de erros automatico usando os campos existentes de erros e anotacoes.
- Score de risco por materia.
- Dashboard com progresso, questoes, acertos, erros, atividade anual e graficos.
- Pomodoro flutuante.
- Login/cadastro por e-mail e senha com Supabase Auth.
- Progresso salvo por usuario no Supabase e cache local como fallback.
- PWA com assets basicos em `public/`.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Frontend | React 18 + Vite + TypeScript |
| Estado | Zustand + hooks locais |
| Estilos | CSS Modules |
| Graficos | Recharts + react-activity-calendar |
| Animacoes | Framer Motion |
| Backend | Supabase Auth + PostgreSQL |
| PWA | vite-plugin-pwa |
| Deploy | Cloudflare Pages ou similar |

## Estrutura principal

```text
src/
  App.tsx
  main.tsx
  data/
    ciclo.ts
  hooks/
    useAuth.ts
    useProgress.ts
  lib/
    insights.ts
    supabase.ts
  types/
    study.ts
  store/
    useAppStore.ts
  components/
    HojeView.tsx / .module.css
    Dashboard.tsx / .module.css
    CicloView.tsx / .module.css
    BlockCard.tsx / .module.css
    StatsView.tsx / .module.css
    Pomodoro.tsx / .module.css
    Sidebar.tsx / .module.css
    LoginPage.tsx / .module.css
    PasswordUpdatePage.tsx
    SobreView.tsx / .module.css
  styles/
    globals.css
public/
  favicon.svg
  apple-touch-icon.png
  pwa-192x192.png
  pwa-512x512.png
```

## Setup local

Requer Node.js 20.19 ou superior.

```bash
npm install
cp .env.example .env
npm run dev
```

Preencha o `.env`:

```bash
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

As credenciais ficam em **Supabase > Project Settings > API**.

## Configurar Supabase

1. Em **Authentication > Providers**, habilite **Email**.
2. Em **SQL Editor**, execute o conteudo de `supabase_migration.sql`.
3. Em **Authentication > URL Configuration**, configure a URL do app depois do deploy.
4. Se usar confirmacao por e-mail, inclua tambem `http://localhost:5173` durante desenvolvimento.

A tabela `sessions` usa RLS com `auth.uid() = user_id`, entao cada usuario acessa apenas o proprio progresso.

## Como a inteligencia funciona

A inteligencia atual nao exige novas tabelas. Ela usa os campos existentes:

- `done` e `done_at` para saber quando a sessao foi concluida.
- `questions`, `correct` e `wrong` para calcular desempenho.
- `notes` para transformar duvidas em revisoes.

Regras principais:

- Erro ou acerto intermediario gera revisao curta.
- Acerto baixo ou anotacao gera prioridade alta.
- Sessoes maduras entram em revisao espacada mais longa.
- Materias com baixo acerto, pouco avanco, muitos erros ou muitos dias sem estudo recebem score de risco maior.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run test
```

## Deploy na Cloudflare Pages

1. **Create a project > Connect to Git**
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Observacoes de manutencao

- Evite alterar nomes das colunas da tabela `sessions` sem atualizar `useProgress.ts`.
- Antes de mudar o algoritmo de recomendacao, edite `src/lib/insights.ts` e mantenha as regras puras/testaveis.
- O modo prova nao foi implementado por decisao de escopo.
