# Features (Sprint 1)
## Venue Display
1. Shows available slots for Campbelltown Library.
2. Expandable slot list inside card.
3. Clickable 📍 address toggles an inline Google Map.

## Authentication (Supabase)
1. Users can log in with email + password.
2. Roles: admin, coordinator, listener, pending.
3. Mock Admin account is pre-seeded.

## Admin Dashboard
1. Layout ready (Navbar + Sidebar).
2. Weekly calendar scheduler (FullCalendar).

# Dev
```
cd csapp
npm start

```
# Set up
### .env file 

```
# Backend API
REACT_APP_API_URL=https://localhost:<your_mvc_port>

# Supabase
REACT_APP_SUPABASE_URL=https://<yourproject>.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

# Mock Accounts (create user at supabase)
	•	Admin
	•	Email: admin@chatseat.com
	•	Password: Admin123

 # Supabase SQL Table
 ``` create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text check (role in ('admin','coordinator','listener','pending')) not null default 'pending',
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy if not exists "read public profiles"
  on profiles for select using (true);

create policy if not exists "user can update own profile"
  on profiles for update using (auth.uid() = id);

# then delete the current sql, rerun: 
insert into profiles (id, email, role)
values ('<uuid from auth.users>', 'admin@chatseat.com', 'admin');
```
