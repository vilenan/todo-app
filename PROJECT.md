# Todo App

Монорепозиторий приложения для управления личными задачами.

## Компоненты

- frontend: React 19, TypeScript, Vite, React Router, Zustand, CSS Modules
- backend: NestJS 11, Prisma 7, SQLite, JWT, bcrypt

Frontend расположен в корне, backend — в `backend/`.

## Быстрый старт

```bash
npm run install:all
cp .env.example .env
```

В двух терминалах из корня:

```bash
npm run dev:backend
npm run dev
```

Frontend ожидает API по адресу `http://localhost:3000`.

## Рабочие соглашения

- пользовательские тексты пишутся на русском языке;
- frontend-стили используют CSS Modules;
- API-запросы остаются в stores или отдельном API-слое;
- изменения DTO и auth-ответов проверяются одновременно в `src/` и `backend/`;
- локальные `backend/.env` и `backend/dev.db` не коммитятся.
