# Yono Backend

Node.js + Express + Prisma + SQLite backend for managing Yono game/app listings.

## Setup

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env` and change `JWT_SECRET` and `ADMIN_PASSWORD`.
3. Install dependencies:

```bash
npm install
```

4. Create the database and admin account:

```bash
npm run db:setup
```

5. Start development server:

```bash
npm run dev
```

Server: `http://localhost:4000`

## Admin UI

The Next.js admin dashboard is in `admin-ui/` and connects to this API.

```powershell
cd admin-ui
npm install
copy .env.local.example .env.local
npm run dev
```

Open `http://localhost:3001` and sign in with the admin credentials from the root `.env` file. The dashboard supports searching, creating, editing, and deleting game listings. The public website runs separately on `http://localhost:3000`.

## API

Public:

- `GET /health`
- `GET /api/games?page=1&limit=20&search=yono`
- `GET /api/games/:slug`

Admin login:

- `POST /api/auth/login` with `{ "email": "...", "password": "..." }`

Protected routes require `Authorization: Bearer <token>`:

- `POST /api/games`
- `PUT /api/games/:id`
- `PATCH /api/games/:id`
- `DELETE /api/games/:id`

`POST` and `PUT` require the complete game object. `PATCH` accepts only the fields being changed. `logo`, `downloadUrl`, and `telegramUrl` must be valid URLs.

## Frontend usage

The public Next.js app now loads games from the API automatically using `NEXT_PUBLIC_API_URL` (default: `http://localhost:4000`). If the API is temporarily unavailable, it falls back to the bundled catalogue.

Start all local services in separate terminals:

```ts
cd YONOBACK
npm run dev

cd admin-ui
npm run dev

cd ../../yono
npm run dev
```

For production, use PostgreSQL by changing Prisma's datasource provider and `DATABASE_URL`.
