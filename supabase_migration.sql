-- ============================================================
-- CEF TBN-TI - Auth + tabela de progresso por usuario
-- Execute no SQL Editor do Supabase depois de habilitar Auth por e-mail.
-- ============================================================

create table if not exists public.sessions (
  user_id     uuid        not null references auth.users(id) on delete cascade,
  session_id  text        not null,
  done        boolean     not null default false,
  questions   integer     not null default 0 check (questions >= 0),
  done_at     timestamptz,
  updated_at  timestamptz not null default now(),
  primary key (user_id, session_id)
);

-- Se a tabela antiga ja existia com primary key apenas em session_id,
-- as linhas anonimas precisam ser removidas porque nao pertencem a um usuario.
alter table public.sessions
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

delete from public.sessions
where user_id is null;

alter table public.sessions
  alter column user_id set not null;

do $$
declare
  pk_name text;
  pk_cols text[];
begin
  select c.conname, array_agg(a.attname order by cols.ord)
    into pk_name, pk_cols
  from pg_constraint c
  join unnest(c.conkey) with ordinality as cols(attnum, ord) on true
  join pg_attribute a on a.attrelid = c.conrelid and a.attnum = cols.attnum
  where c.conrelid = 'public.sessions'::regclass
    and c.contype = 'p'
  group by c.conname;

  if pk_name is not null and pk_cols <> array['user_id', 'session_id'] then
    execute format('alter table public.sessions drop constraint %I', pk_name);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.sessions'::regclass
      and contype = 'p'
  ) then
    alter table public.sessions add primary key (user_id, session_id);
  end if;
end $$;

create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists sessions_updated_at on public.sessions;

create trigger sessions_updated_at
  before update on public.sessions
  for each row execute function public.update_updated_at();

alter table public.sessions enable row level security;

drop policy if exists "allow_all_anon" on public.sessions;
drop policy if exists "sessions_own_rows" on public.sessions;

create policy "sessions_own_rows" on public.sessions
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
