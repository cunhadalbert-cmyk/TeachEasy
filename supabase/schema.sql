create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  plan text not null default 'premium',
  subscription_status text not null default 'pending_payment',
  subscription_price numeric(10,2) not null default 19.90,
  mercadopago_subscription_id text,
  mercadopago_status text,
  ai_limit integer not null default 60 check (ai_limit between 0 and 10000),
  ai_used integer not null default 0 check (ai_used >= 0),
  period_start timestamptz not null default now(),
  period_end timestamptz not null default (now() + interval '1 month'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_subscription_status_check check (subscription_status in ('pending_payment','active','past_due','cancelled'))
);

alter table public.profiles add column if not exists subscription_price numeric(10,2) not null default 19.90;
alter table public.profiles add column if not exists mercadopago_subscription_id text;
alter table public.profiles add column if not exists mercadopago_status text;
create unique index if not exists profiles_mercadopago_subscription_id_key on public.profiles(mercadopago_subscription_id) where mercadopago_subscription_id is not null;

alter table public.profiles enable row level security;

drop policy if exists "profile owner can read" on public.profiles;
create policy "profile owner can read" on public.profiles for select to authenticated using ((select auth.uid()) = id);

create or replace function public.handle_new_teacheasy_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_teacheasy_auth_user_created on auth.users;
create trigger on_teacheasy_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_teacheasy_user();

create or replace function public.consume_ai_generation(p_user_id uuid)
returns table(ai_limit integer, ai_used integer, remaining integer, period_start timestamptz, period_end timestamptz)
language plpgsql security definer set search_path = public
as $$
declare v_profile public.profiles%rowtype;
begin
  select * into v_profile from public.profiles where id = p_user_id for update;
  if not found then raise exception 'PROFILE_NOT_FOUND'; end if;
  if v_profile.subscription_status <> 'active' then raise exception 'SUBSCRIPTION_INACTIVE'; end if;
  if now() >= v_profile.period_end then
    update public.profiles set ai_used = 0, period_start = now(), period_end = now() + interval '1 month', updated_at = now()
    where id = p_user_id returning * into v_profile;
  end if;
  if v_profile.ai_used >= v_profile.ai_limit then raise exception 'AI_QUOTA_EXCEEDED'; end if;
  update public.profiles set ai_used = ai_used + 1, updated_at = now() where id = p_user_id returning * into v_profile;
  return query select v_profile.ai_limit, v_profile.ai_used, greatest(0, v_profile.ai_limit - v_profile.ai_used), v_profile.period_start, v_profile.period_end;
end;
$$;

create or replace function public.refund_ai_generation(p_user_id uuid)
returns void language plpgsql security definer set search_path = public
as $$
begin
  update public.profiles set ai_used = greatest(0, ai_used - 1), updated_at = now() where id = p_user_id;
end;
$$;

revoke all on function public.consume_ai_generation(uuid) from public, anon, authenticated;
revoke all on function public.refund_ai_generation(uuid) from public, anon, authenticated;
grant execute on function public.consume_ai_generation(uuid) to service_role;
grant execute on function public.refund_ai_generation(uuid) to service_role;
