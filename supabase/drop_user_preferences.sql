-- Remove a tabela de preferências do usuário.
-- Use este script somente se você decidiu retirar o card de preferências do projeto.

-- Remove o gatilho da tabela, caso exista.
drop trigger if exists update_user_preferences_updated_at on public.user_preferences;

-- Remove a função usada pelo gatilho, caso exista.
drop function if exists public.update_user_preferences_updated_at();

-- Remove a tabela de preferências e as policies associadas a ela.
drop table if exists public.user_preferences cascade;
