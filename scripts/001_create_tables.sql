-- Create profiles table for user management
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  annual_income numeric,
  credit_score integer,
  loan_type text,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "Allow users to view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Allow users to update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Allow users to insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Create loan_products table
create table if not exists public.loan_products (
  id uuid primary key default gen_random_uuid(),
  bank_name text not null,
  product_name text not null,
  description text,
  apr numeric not null,
  min_apr numeric,
  max_apr numeric,
  loan_amount_min numeric,
  loan_amount_max numeric,
  min_credit_score integer,
  min_income numeric,
  features text[] default '{}',
  processing_time text,
  created_at timestamp with time zone default now()
);

alter table public.loan_products enable row level security;

-- Allow all authenticated users to view loan products
create policy "Allow authenticated users to view loan products"
  on public.loan_products for select
  using (true);

-- Create chat_history table
create table if not exists public.chat_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  message text not null,
  response text,
  created_at timestamp with time zone default now()
);

alter table public.chat_history enable row level security;

create policy "Allow users to view their own chat history"
  on public.chat_history for select
  using (auth.uid() = user_id);

create policy "Allow users to insert their own chat messages"
  on public.chat_history for insert
  with check (auth.uid() = user_id);
