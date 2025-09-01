# Freight API (NestJS + Prisma + PostgreSQL)

- Auth: register/login/me (roles: customer | carrier | admin).
- Loads: create/list/detail/award (statuses: draft|open|closed|awarded|cancelled).
- Bids: carriers upsert a bid; owner sees all bids **after** deadline (sealed before).

## Local
```bash
cp .env.example .env
npm install
npm run db:push
npm run start:dev
```
Docs: http://localhost:3001/docs

## Railway
- Source → Root Directory: `apps/api`
- Build: `npm run build`
- Start: `npm start`
- Variables: `DATABASE_URL`, `JWT_SECRET`
- After first deploy: Shell → `npm run db:push`
