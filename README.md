# Todo App

Монорепозиторий приложения для управления задачами: React/Vite frontend и
NestJS/Prisma backend находятся в одном проекте.

## Структура

- `src/` — frontend на React, TypeScript, Vite и Zustand
- `backend/` — backend на NestJS, Prisma и SQLite

Сервисы запускаются на `http://localhost:5173` и `http://localhost:3000`.
Frontend получает URL API из `VITE_API_URL` (по умолчанию —
`http://localhost:3000`).

## Установка и запуск

Из корня репозитория:

```bash
npm run install:all
cp .env.example .env
```

В первом терминале запустите backend:

```bash
npm run dev:backend
```

Во втором терминале запустите frontend:

```bash
npm run dev
```

Откройте `http://localhost:5173`. Backend использует локальную SQLite-базу
`backend/dev.db`; переменные backend хранятся в `backend/.env`.

## Команды

- `npm run dev` — frontend
- `npm run dev:backend` — backend в watch-режиме
- `npm run build` — сборка frontend
- `npm run build:backend` — сборка backend
- `npm run generate:backend` — генерация Prisma Client
- `npm run lint` — проверка frontend
- `npm run lint:backend` — проверка backend
- `npm run test:backend` — тесты backend
- `npm run preview` — preview frontend-сборки

## Возможности

- регистрация и вход пользователя
- создание, редактирование, удаление и просмотр задач
- статусы, приоритеты, фильтры и статистика
- защищённые маршруты и JWT-аутентификация

## API

- `POST /auth/signup`
- `POST /auth/login`
- `GET /todos`
- `POST /todos`
- `PATCH /todos/:id`
- `DELETE /todos/:id`
