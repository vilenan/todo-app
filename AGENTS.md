# AGENTS.md

## Purpose

This file is a short operating guide for coding agents working in this repository.
It explains what the project does, how to run it, where the main logic lives, and
which constraints matter before making changes.

## Project Summary

- App type: single-page todo application
- Stack: React 19, TypeScript, Vite, React Router, Zustand
- Backend: PocketBase running locally at `http://127.0.0.1:8090`
- Main features:
  - user sign up and login
  - protected app layout for authenticated users
  - todo list CRUD
  - completion toggling
  - filtering via URL search params
  - statistics page
  - todo details route with lazy loading

## Commands

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build production bundle: `npm run build`
- Run lint: `npm run lint`
- Preview production build: `npm run preview`

## Environment Notes

- The frontend expects PocketBase to be available at `http://127.0.0.1:8090`
- PocketBase client setup lives in `src/lib/pocketbase.ts`
- PocketBase migration files live in `tools/pocketbase/pb_migrations`
- If auth or todo requests fail locally, check whether PocketBase is running before changing frontend code

## Architecture Map

- `src/main.tsx`: app entrypoint with `RouterProvider`
- `src/router.tsx`: route configuration
- `src/AppLayout.tsx`: auth gate for protected routes
- `src/App.tsx`: main todo screen and filter/query-param behavior
- `src/store/authStore.ts`: auth state and PocketBase auth actions
- `src/store/todoStore.ts`: todo state and PocketBase CRUD actions
- `src/pages/*`: route-level screens
- `src/components/*`: reusable UI pieces
- `src/hooks/useEditModal.ts`: edit modal state and submit flow
- `src/types/*`: shared TypeScript types

## Working Conventions

- Keep the existing TypeScript + functional React style
- Preserve CSS Modules usage for component/page styles
- Reuse Zustand stores for shared state instead of introducing parallel state containers
- Keep routing changes inside `src/router.tsx` unless a route-level refactor is required
- Prefer small targeted fixes over broad rewrites
- Keep user-facing text in Russian unless the task explicitly changes product language

## Change Safety

- Do not change the PocketBase base URL unless the task explicitly requires it
- Do not modify migration files unless the task is about schema/data model changes
- When changing auth flow, verify the behavior of `AppLayout`, `LoginPage`, and `SignupPage` together
- When changing todo behavior, verify the store actions and the UI that depends on them
- Treat URL query params such as `filter` and `edit` as part of app behavior, not incidental implementation details

## Documentation Gaps Worth Keeping In Mind

- The current `README.md` is still the default Vite template and does not describe this app
- There are no visible automated tests in the repository
- Agents should validate with `npm run build` and `npm run lint` after meaningful code changes when possible
