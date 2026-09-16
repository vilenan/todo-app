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

## Аутентификация

После входа backend возвращает короткоживущий access JWT. Frontend хранит его
только в памяти Zustand и использует в заголовке `Authorization: Bearer ...`.

Долгоживущий refresh token устанавливается backend в `HttpOnly` cookie. Его
нельзя прочитать из JavaScript или через `localStorage`. При запуске приложения
и после истечения access token frontend вызывает `/auth/refresh`; backend
проверяет cookie, ротирует refresh token и выдаёт новый access token.

При logout refresh-сессия отзывается в базе, а cookie очищается.

## API

- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /todos`
- `POST /todos`
- `PATCH /todos/:id`
- `DELETE /todos/:id`

Для локальной разработки backend разрешает CORS для
`http://localhost:5173` и credentials-запросы для refresh cookie.

Подтверждение email и отправка писем через Resend пока не подключены.
