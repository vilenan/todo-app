# AGENTS.md

## Purpose

This file is a working guide for coding agents in this repository.
It explains what is actually stored here, how the project is evolving, and what
must be verified before changing code or documentation.

## Current State

- This repository contains the frontend application
- Frontend stack: React 19, TypeScript, Vite, React Router, Zustand
- Product domain: todo application with auth, task CRUD, filters, statistics, and task details
- Backend now lives in the sibling repository `/Users/vilenan/Desktop/React/todo-backend`
- Frontend talks to the NestJS API at `http://localhost:3000`

## Architecture Notes

- Treat this repo as the frontend client
- The backend is a separate NestJS + Prisma service in the sibling `todo-backend` folder
- Do not reintroduce PocketBase files or dependencies unless the task explicitly requires rollback

## Commands Available In This Repo

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build frontend: `npm run build`
- Run lint: `npm run lint`
- Preview production build: `npm run preview`

## External Backend Contract

- Backend repo: `/Users/vilenan/Desktop/React/todo-backend`
- Backend dev URL: `http://localhost:3000`
- Frontend env var for backend URL: `VITE_API_URL`
- Allowed frontend origin configured in backend: `http://localhost:5173`
- Auth endpoints used by frontend:
  - `POST /auth/signup`
  - `POST /auth/login`
- Todo endpoints used by frontend:
  - `GET /todos`
  - `POST /todos`
  - `PATCH /todos/:id`
  - `DELETE /todos/:id`

## Frontend Structure

- `src/main.tsx`: app entrypoint
- `src/router.tsx`: route configuration
- `src/AppLayout.tsx`: protected layout and auth gate
- `src/App.tsx`: main todo screen
- `src/store/authStore.ts`: frontend auth state/actions backed by Nest auth endpoints
- `src/store/todoStore.ts`: frontend todo state/actions backed by Nest todo endpoints
- `src/pages/*`: route-level pages
- `src/components/*`: reusable UI
- `src/hooks/useEditModal.ts`: edit modal state flow
- `src/types/*`: shared frontend types

## Backend Coordination Guidance

- Backend ownership now sits in the sibling `todo-backend` project
- If frontend API shapes change, update both:
  - frontend stores in this repo
  - backend controllers, DTOs, and services in `todo-backend`
- Keep auth token handling aligned with the backend JWT contract
- If backend URL or CORS origin changes, update docs and frontend API configuration together

## Working Conventions

- Keep user-facing text in Russian unless the task explicitly changes product language
- Prefer small, targeted updates over broad rewrites
- Preserve CSS Modules usage unless the task includes a styling-system migration
- Reuse existing frontend patterns instead of introducing a new state layer without a clear reason
- Keep route changes centralized in `src/router.tsx` unless a broader refactor is required

## Documentation Rules

- Keep README aligned with the actual repository contents
- If architecture is in transition, say so explicitly
- Distinguish clearly between:
  - code that exists in this repo now
  - planned architecture
  - external services

## Change Safety

- Keep frontend and backend docs consistent across both repositories
- Do not hardcode new API routes in components; keep request logic inside stores or a dedicated API layer
- If you change auth payloads or todo DTOs, verify compatibility with the Nest backend before finalizing
- Validate `README.md`, `PROJECT.md`, and `AGENTS.md` against the real file tree before finalizing
