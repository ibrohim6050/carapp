# Freight Marketplace (MVP) — Auth ready

Monorepo with **Next.js** (frontend) and **NestJS + Prisma + PostgreSQL** (backend).
Implements sealed reverse-auction endpoints and **password login for admin & customer**.

## Quick Start

### 0) Prereqs
- Node 18+
- npm 9+
- Docker (for PostgreSQL)

### 1) Start DB
```bash
docker compose up -d
```

### 2) Install deps
```bash
npm i
```

### 3) Backend: env + migrate
```bash
cp apps/api/.env.example apps/api/.env
# edit JWT_SECRET and ADMIN_SETUP_KEY in apps/api/.env
npm run dev:api
# in a new terminal:
cd apps/api
npm run prisma:migrate -- --name init
```

### 4) Frontend: env + dev
```bash
cp apps/web/.env.example apps/web/.env
npm run dev:web
```

- API: http://localhost:3001
- Web: http://localhost:3000

## Auth (Admin & Customer)
- Register customer: `POST /auth/register` `{ email, password, role: "customer" }`
- Register admin: `POST /auth/register` `{ email, password, role: "admin", adminSetupKey: ADMIN_SETUP_KEY }`
- Login: `POST /auth/login` → `{ accessToken }` (send as `Authorization: Bearer <token>`)
- Frontend page: `/login` to login/register; token saved in localStorage.

> Dev fallback headers still work for quick testing:
> `x-role`, `x-user-id`, `x-company-id` (for carrier). Replace with real auth in production.

## Endpoints (excerpt)
- `POST /loads` — create a load (customer)
- `GET /loads?status=open` — list loads
- `GET /loads/:id` — load details
- `POST /loads/:id/bids` — upsert your bid (carrier)
- `GET /loads/:id/my-bid` — get your bid (carrier)
- `GET /loads/:id/bids` — view all bids (customer/admin after deadline)
- `POST /loads/:id/award` — choose winner (customer after deadline)
- `POST /auth/register`, `POST /auth/login` — passwords for admin & customer
