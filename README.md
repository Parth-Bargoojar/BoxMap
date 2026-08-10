# BoxMap — Know what's where.

BoxMap is a modern, high-performance **Progressive Web App (PWA)** designed to catalog your physical storage boxes and locate any stored item in seconds. It turns your physical storage (garages, attics, storage units) into a fully searchable digital inventory.

---

## Key Features

- **🔐 Secure Authentication:** Complete email/password authentication and Google OAuth integration, backed by Supabase Auth and server-side middleware session guards.
- **📦 Box Management:** Create physical box entries with auto-incrementing sequential codes (`BOX-001`, `BOX-002`), custom names, structural locations (Room, Area, Position), and notes.
- **⚡ Fast Item Entry:** A keyboard-driven, fast-entry system that commits current rows on `Enter` and focuses new item rows automatically for high-speed logging.
- **📷 Client-Side Compression:** Camera-first mobile photo uploads with instant client-side WebP compression (targeting ≤1.5MB) before uploading to private cloud storage.
- **🔍 Multi-Location Search:** Smart search engine with PostgreSQL trigram case-insensitive indexing. Identifies which items are stored where, with automated multi-location item grouping (e.g. *"3 locations found"*).
- **📲 Progressive Web App (PWA):** Installs natively on iOS, Android, and Desktop. Supports custom title bars (Window Controls Overlay), custom deep links (`web+boxmap://`), and offline caching via Serwist.
- **🌓 Dark Mode Support:** Full high-contrast dark theme toggle with seamless visual transition.

---

## Tech Stack

- **Frontend Framework:** Next.js 16 (App Router) using React Server Components (RSC).
- **Styling & UI:** Tailwind CSS v4, shadcn/ui components, and Lucide React icons.
- **Database & Backend:** Supabase (PostgreSQL, Row Level Security (RLS), custom Storage policies, Trigram indexing).
- **Service Worker / PWA:** Serwist / Webpack plugin wrapper.
- **Unit & Integration Testing:** Vitest.
- **End-to-End Browser Testing:** Playwright.

---

## Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Parth-Bargoojar/BoxMap.git
cd BoxMap/boxmap
npm install
```

### 2. Environment Variables Setup
Copy the example environment template and fill in your Supabase configurations:
```bash
cp .env.local.example .env.local
```

Modify `.env.local` with your values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Run Development Server
To support the custom Serwist PWA service worker compiler, the development server is configured to run in Webpack mode:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build & Testing

### Compile Production Build
```bash
npm run build
```

### Start Production Server Locally
```bash
npm run start
```

### Run Test Suites
```bash
# Run unit & integration tests (Vitest)
npm run test

# Run End-to-End browser tests (Playwright)
npm run test:e2e

# Run linting checks
npm run lint

# Run TypeScript typechecks
npm run typecheck
```

---

## Database Configuration

BoxMap runs on Supabase. SQL migrations are stored under `supabase/migrations/` and include:
1. `0001_init_schema.sql`: Core tables (`profiles`, `locations`, `boxes`, `items`) and profile synchronization triggers.
2. `0002_rls_policies.sql`: Strict Row Level Security policies allowing users access only to their own rows.
3. `0003_storage_policies.sql`: Bucket access policies for secure photo uploading.
4. `0004_indexes.sql`: Index setups including PostgreSQL trigram indexes for case-insensitive partial searches on item names.
