# Todo Backend

NestJS backend для приложения управления задачами.

## Стек

- NestJS 11
- Prisma 7
- SQLite
- JWT auth
- bcrypt

## Связанный frontend

- frontend: корень монорепозитория
- backend: `backend/`

По умолчанию backend запускается на `http://localhost:3000` и разрешает CORS
для `http://localhost:5173`.

## Установка и запуск

Из корня монорепозитория:

```bash
npm run install:all
npm run dev:backend
```

Другие команды:

- `npm run build` — сборка backend
- `npm run start` — обычный запуск
- `npm run start:prod` — запуск собранной версии
- `npm run lint` — ESLint
- `npm run test` — unit tests
- `npm run test:e2e` — e2e tests

## Архитектура

Основные модули:

- `src/auth` — регистрация, логин, JWT strategy и guard
- `src/todos` — CRUD задач и статистика
- `src/prisma` — Prisma service/module

Точка входа:

- `src/main.ts`

Корневой модуль:

- `src/app.module.ts`

## API

Авторизация:

- `POST /auth/signup`
- `POST /auth/login`

Задачи:

- `GET /todos`
- `GET /todos/stats`
- `POST /todos`
- `PATCH /todos/:id`
- `DELETE /todos/:id`

Все маршруты `/todos/*` защищены JWT через `Authorization: Bearer <token>`.

## База данных

Prisma schema лежит в `prisma/schema.prisma`.

Сейчас используются модели:

- `User`
- `Todo`

Для локальной разработки используется SQLite.

## Что ожидает frontend

Frontend использует auth response формата:

```json
{
  "accessToken": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com"
  }
}
```

Todo routes должны возвращать данные, совместимые с типом задачи во frontend:

- `id`
- `text`
- `description`
- `completed`
- `dueDate`
- `priority`
