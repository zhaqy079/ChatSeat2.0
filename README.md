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

# Sprint 2
## Database Merge
New connection, use the new keys. Is different database so we're not affecting live database and to test new database structure.

### Main Admin Login 
<br/>
|| Email: admin@email.com 
<br/>
|| Password: admin123
<br/> <br/>
Feel free to add your own profiles/info in the Supabase, find login info in `Project/Previous Version/Credential Document` of the Onedrive
<br/> <br/> <br/>

### Keys
```
NEXT_PUBLIC_SUPABASE_URL=https://nuarimunhutwzmcknhwj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51YXJpbXVuaHV0d3ptY2tuaHdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NTk2MjIsImV4cCI6MjA3MTIzNTYyMn0.fwdTA0n_vSrT_kUqlExIPdDpPrHo_fRIkOUcd5aHi0c
```

### Troubleshooting
- Check ``` console.log(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY) ``` matches new database. 
- If not, check your local .env file (should be contained within the app section) to make sure it has updated to the new values. 
- Restart your current instance (redo ```npm start```) 
- If all else fails, manually assign ```process.env.REACT_APP_SUPABASE_URL``` and ```process.env.REACT_APP_SUPABASE_ANON_KEY``` to the new keys. (This will probably crash the instance but after deleting and reloading, everything should work) 
