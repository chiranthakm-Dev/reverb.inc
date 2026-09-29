create extension if not exists pgcrypto;
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
  name text not null, email text not null, company text, service text not null,
  languages text, scope text not null, budget_range text, timeline text,
  status text not null default 'new' check (status in ('new','contacted','qualified','won','closed','spam')),
  notes text, source_page text
);
alter table public.enquiries enable row level security;
revoke all on public.enquiries from anon, authenticated;
-- The Cloudflare Worker inserts with the service-role key. Authenticated admin access
-- should be granted only after an `admin_users` table and organization policy are configured.
create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_status_idx on public.enquiries (status);
