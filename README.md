# CEF TBN-TI - Painel de Estudos

Painel para acompanhar o ciclo de estudos do concurso **Caixa Economica Federal - Tecnico Bancario Novo (TI)**.

- 180 sessoes: 5 meses x 12 blocos x 3 repeticoes
- Login/cadastro por e-mail e senha com Supabase Auth
- Progresso salvo por usuario no Supabase
- Graficos de evolucao, atividade recente e estatisticas por materia

## Stack

| Camada   | Tecnologia                   |
|----------|------------------------------|
| Frontend | React 18 + Vite              |
| Estilos  | CSS Modules                  |
| Graficos | Recharts                     |
| Backend  | Supabase Auth + PostgreSQL   |
| Deploy   | Cloudflare Pages ou similar  |

## Estrutura

```text
src/
  data/ciclo.js
  lib/supabase.js
  hooks/useAuth.js
  hooks/useProgress.js
  components/
    LoginPage.jsx / .css
    PasswordUpdatePage.jsx
    Sidebar.jsx / .css
    Dashboard.jsx / .css
    CicloView.jsx / .css
    BlockCard.jsx / .css
    StatsView.jsx / .css
    SobreView.jsx / .css
  App.jsx / .css
  main.jsx
  styles/globals.css
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
4. Se usar confirmacao por e-mail, inclua tambem a URL local `http://localhost:5173` durante desenvolvimento.

A tabela `sessions` usa RLS com `auth.uid() = user_id`, entao cada usuario acessa apenas o proprio progresso.

> Observacao: se voce ja tinha a tabela antiga sem login, a migration remove linhas anonimas porque elas nao pertencem a nenhum usuario autenticado.

## Deploy

### GitHub

Crie/suba o repositorio e envie estes arquivos. O `.env` nao deve ser commitado.

### Cloudflare Pages

1. **Create a project > Connect to Git**
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Scripts

```bash
npm run dev
npm run build
npm run preview
```
