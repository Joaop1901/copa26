-- Schema base para o projeto Calendário da Copa 2026
-- Execute no SQL Editor do Supabase.
-- Importante: ajuste conforme o nome real das suas tabelas se algo já existir.

create extension if not exists "pgcrypto";

-- =========================
-- PERFIL
-- =========================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  username text,
  favorite_team text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- =========================
-- PREFERÊNCIAS
-- =========================

create table if not exists public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  language text not null default 'pt-BR',
  theme text not null default 'dark',
  receive_notifications boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_preferences_user_unique unique (user_id)
);

alter table public.user_preferences enable row level security;

create policy "preferences_select_own"
on public.user_preferences
for select
to authenticated
using (auth.uid() = user_id);

create policy "preferences_insert_own"
on public.user_preferences
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "preferences_update_own"
on public.user_preferences
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- =========================
-- JOGOS FAVORITOS
-- =========================

create table if not exists public.favorite_matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  match_key text not null,
  home_team text,
  away_team text,
  match_date timestamptz,
  stadium text,
  stage text,
  created_at timestamptz not null default now(),
  constraint favorite_matches_user_match_unique unique (user_id, match_key)
);

alter table public.favorite_matches enable row level security;

create policy "favorite_matches_select_own"
on public.favorite_matches
for select
to authenticated
using (auth.uid() = user_id);

create policy "favorite_matches_insert_own"
on public.favorite_matches
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "favorite_matches_update_own"
on public.favorite_matches
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "favorite_matches_delete_own"
on public.favorite_matches
for delete
to authenticated
using (auth.uid() = user_id);

-- =========================
-- SELEÇÕES ACOMPANHADAS
-- =========================

create table if not exists public.followed_teams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  team_name text not null,
  created_at timestamptz not null default now(),
  constraint followed_teams_user_team_unique unique (user_id, team_name)
);

alter table public.followed_teams enable row level security;

create policy "followed_teams_select_own"
on public.followed_teams
for select
to authenticated
using (auth.uid() = user_id);

create policy "followed_teams_insert_own"
on public.followed_teams
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "followed_teams_delete_own"
on public.followed_teams
for delete
to authenticated
using (auth.uid() = user_id);

-- =========================
-- ESTÁDIOS FAVORITOS
-- =========================

create table if not exists public.favorite_stadiums (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stadium_slug text not null,
  stadium_name text not null,
  city text,
  country text,
  created_at timestamptz not null default now(),
  constraint favorite_stadiums_user_stadium_unique unique (user_id, stadium_slug)
);

alter table public.favorite_stadiums enable row level security;

create policy "favorite_stadiums_select_own"
on public.favorite_stadiums
for select
to authenticated
using (auth.uid() = user_id);

create policy "favorite_stadiums_insert_own"
on public.favorite_stadiums
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "favorite_stadiums_update_own"
on public.favorite_stadiums
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "favorite_stadiums_delete_own"
on public.favorite_stadiums
for delete
to authenticated
using (auth.uid() = user_id);

-- =========================
-- STORAGE AVATARS
-- =========================
-- Crie no painel do Supabase um bucket chamado: avatars
-- Para bucket público, use getPublicUrl no frontend, como o projeto já faz.
-- Configure políticas de storage conforme a necessidade da apresentação.
