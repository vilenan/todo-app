# AGENTS.md

## Purpose

This file is a working guide for coding agents in this repository. It describes
the code that currently exists and the checks required before changing it.

## Current State

- This repository is a monorepo containing the frontend and backend
- Frontend stack: React 19, TypeScript, Vite, React Router, Zustand
- Product domain: a personal todo application with authentication, task CRUD,
  filtering, sorting, statistics, task details, and a profile page
- Backend lives in the `backend/` directory in this repository
- Frontend uses `VITE_API_URL` to reach the NestJS API; the local default is
  `http://localhost:3000`
- Authentication uses short-lived access JWTs in frontend memory and refresh
  tokens in `HttpOnly` cookies; tokens are not stored in `localStorage`
- Email verification links are sent through Resend by default; the demo can disable
  email verification via `EMAIL_VERIFICATION_ENABLED=false`
- The backend uses SQLite (`backend/dev.db`) locally or PostgreSQL through Prisma

## Current Deployment

- ONREZA workspace: `vilena-studio`; GitHub repository `vilenan/todo-app`, branch `main`
- Frontend project `vilena-todo`: https://vilena-todo-vilena-studio.onreza.app
- Backend project `vilena-todo-api`: https://vilena-todo-api-vilena-studio.onreza.app
- Production uses the managed PostgreSQL database `todo_app`; local SQLite and
  production PostgreSQL are separate databases, not automatically synchronized
- ONREZA builds the backend from `backend/` with Node.js 24, output `dist`, and
  `npx prisma migrate deploy && npm run build && npm prune --omit=dev`
- The demonstration has email verification disabled. Do not commit secrets or
  database connection strings; configure them in the hosting environment
- On 2026-11-04, registration, login, task creation and persistence after
  signing out and back in were checked against the deployed app. Accessibility
  from Russia without a VPN remains unverified
- The earlier artifact-publication failure was resolved by ONREZA support; do
  not assume a future deployment failure has the same cause
- Prisma selects the schema and migrations using `DATABASE_URL`: SQLite uses
  `backend/prisma/schema.prisma` and `backend/prisma/migrations/`; PostgreSQL
  uses `backend/prisma/postgresql/schema.prisma` and its `migrations/` directory.
  Keep both schemas aligned and generate the client for the selected database

## Architecture Notes

- Treat the root as the frontend client and `backend/` as the NestJS + Prisma service
- Do not reintroduce PocketBase files or dependencies unless the task explicitly requires rollback

## Commands Available In This Repo

- Install dependencies: `npm run install:all`
- Start dev server: `npm run dev`
- Build frontend: `npm run build`
- Run lint: `npm run lint`
- Preview production build: `npm run preview`
- Start backend: `npm run dev:backend`
- Build backend: `npm run build:backend`
- Generate Prisma Client: `npm run generate:backend`
- Lint backend: `npm run lint:backend`
- Test backend: `npm run test:backend`

## External Backend Contract

- Backend directory: `backend/`
- Backend dev URL: `http://localhost:3000`
- Frontend env var for backend URL: `VITE_API_URL`
- Allowed frontend origin configured by `FRONTEND_URL` (local default: `http://localhost:5173`)
- Auth endpoints used by frontend:
  - `POST /auth/signup`
  - `POST /auth/login`
  - `POST /auth/refresh`
  - `POST /auth/verify-email`
  - `POST /auth/logout`
- Todo endpoints exposed by the backend:
  - `GET /todos`
  - `GET /todos/stats`
  - `POST /todos`
  - `PATCH /todos/:id`
  - `DELETE /todos/:id`

All todo endpoints require `Authorization: Bearer <access token>`. The backend
also accepts `filter=all | active | completed` on `GET /todos`.

## Frontend Structure

- `src/main.tsx`: app entrypoint
- `src/router.tsx`: route configuration
- `src/AppLayout.tsx`: protected layout and auth gate
- `src/App.tsx`: main todo screen
- `src/config/api.ts`: API base URL from `VITE_API_URL`, with a local default
- `src/store/authStore.ts`: frontend auth state/actions backed by Nest auth endpoints
- `src/store/todoStore.ts`: frontend todo state/actions backed by Nest todo endpoints
- `src/pages/*`: login, signup, email verification, profile, statistics, and task-details pages
- `src/components/*`: reusable UI
- `src/hooks/useEditModal.ts`: edit modal state flow
- `src/lib/*`: todo date, priority, category, and display-format helpers
- `src/types/ITodo.ts`: task type, priority, and category unions

### Routes and query parameters

- Public routes: `/login`, `/signup`, `/verify-email`
- Protected routes: `/`, `/profile`, `/stats`, `/todo/:id`
- `AppLayout` initializes auth through the refresh cookie and redirects
  unauthenticated users to `/login`.
- The list page keeps its view state in query parameters:
  - `filter=active | completed | overdue | withoutDueDate` (`all` is omitted)
  - `category=home | study | work | uncategorized` (`all` is omitted)
  - `sort=deadline` (`default` is omitted)
  - `edit=<todoId>` opens the edit modal

### Todo data

- A todo has `text`, optional `description` and `dueDate`, `completed`,
  `priority` (`low | medium | high`), and an optional category
  (`home | study | work`).
- Todo request logic belongs in `src/store/todoStore.ts`; components and pages
  must not introduce ad-hoc API calls for todo CRUD.

## Backend Coordination Guidance

- Backend ownership now sits in `backend/`
- If frontend API shapes change, update both:
  - frontend stores in this repo
  - backend controllers, DTOs, and services in `backend/`
- Keep auth token handling aligned with the backend JWT contract
- Keep `credentials: 'include'` on requests that need the refresh cookie
- Keep refresh token hashes in the database; never expose or persist raw refresh tokens server-side
- If backend URL or CORS origin changes, update docs and frontend API configuration together
- Keep `secure: false` for refresh cookies only in local development; assess
  production cookie and CORS settings together when deployment work is requested
- Keep the frontend todo unions and backend Prisma enums/DTOs aligned whenever
  priority or category values change

## Working Conventions

- Keep user-facing text in Russian unless the task explicitly changes product language
- Prefer small, targeted updates over broad rewrites
- Preserve CSS Modules usage unless the task includes a styling-system migration
- Reuse existing frontend patterns instead of introducing a new state layer without a clear reason
- Keep route changes centralized in `src/router.tsx` unless a broader refactor is required
- Preserve the list-page query-parameter behavior unless the task explicitly
  changes it
- Validate task text in the UI (currently 3--120 non-whitespace characters)
  and retain server-side validation as the authority

## Documentation Rules

- Keep README aligned with the actual repository contents
- If architecture is in transition, say so explicitly
- Distinguish clearly between:
  - code that exists in this repo now
  - planned architecture
  - external services

## Change Safety

- Keep frontend and backend docs consistent within this monorepo
- Do not hardcode new API routes in components; keep request logic inside stores or a dedicated API layer
- If you change auth payloads or todo DTOs, verify compatibility with the Nest backend before finalizing
- When documentation is changed, validate `README.md`, `PROJECT.md`, and
  `AGENTS.md` against the real file tree before finalizing
