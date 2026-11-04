# Todo Backend

NestJS backend для приложения управления задачами.

## Стек

- NestJS 11
- Prisma 7
- SQLite для локальной разработки; PostgreSQL для размещения
- JWT auth with access/refresh tokens
- bcrypt

## Связанный frontend

- frontend: корень монорепозитория
- backend: `backend/`

По умолчанию backend запускается на `http://localhost:3000` и разрешает CORS
для `http://localhost:5173`; `FRONTEND_URL` и `PORT` настраивают origin и порт.

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
- `POST /auth/refresh`
- `POST /auth/verify-email`
- `POST /auth/logout`

Задачи:

- `GET /todos`
- `GET /todos/stats`
- `POST /todos`
- `PATCH /todos/:id`
- `DELETE /todos/:id`

Все маршруты `/todos/*` защищены JWT через `Authorization: Bearer <token>`.

## База данных

Схема SQLite находится в `prisma/schema.prisma`, PostgreSQL — в
`prisma/postgresql/schema.prisma`. `prisma.config.ts` выбирает схему и
соответствующие миграции по `DATABASE_URL`.

Сейчас используются модели:

- `User`
- `Todo`
- `RefreshToken`

Для локальной разработки используется SQLite; развёрнутый на ONREZA backend
подключён к отдельной управляемой PostgreSQL. Данные между ними автоматически
не синхронизируются.

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

После `signup` и `login` backend также устанавливает refresh token в
`HttpOnly` cookie `refresh_token`. Сырой refresh token не сохраняется в базе —
хранится только его SHA-256 хэш.

`POST /auth/refresh` читает cookie, проверяет срок действия и отзыв, отзывает
старую refresh-сессию и выдаёт новую пару access/refresh token. `POST
/auth/logout` отзывает текущую refresh-сессию и очищает cookie.

Сроки задаются в `backend/.env`:

```env
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="30d"
```

Подтверждение email реализовано через Resend и `POST /auth/verify-email`.
В демонстрационной среде оно отключено через `EMAIL_VERIFICATION_ENABLED=false`.

Todo routes должны возвращать данные, совместимые с типом задачи во frontend:

- `id`
- `text`
- `description`
- `completed`
- `dueDate`
- `priority`
