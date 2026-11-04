# Todo App

Монорепозиторий приложения для управления задачами: React/Vite frontend и
NestJS/Prisma backend находятся в одном проекте.

## Структура

- `src/` — frontend на React, TypeScript, Vite и Zustand
- `backend/` — backend на NestJS и Prisma (SQLite локально, PostgreSQL для размещения)

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
- подтверждение email через Resend

## Аутентификация

После входа backend возвращает короткоживущий access JWT. Frontend хранит его
только в памяти Zustand и использует в заголовке `Authorization: Bearer ...`.

Долгоживущий refresh token устанавливается backend в `HttpOnly` cookie. Его
нельзя прочитать из JavaScript или через `localStorage`. При запуске приложения
и после истечения access token frontend вызывает `/auth/refresh`; backend
проверяет cookie, ротирует refresh token и выдаёт новый access token.

При logout refresh-сессия отзывается в базе, а cookie очищается.

По умолчанию после регистрации приложение отправляет одноразовую ссылку подтверждения на
указанный email. Для демонстрации без почтового сервиса можно установить
`EMAIL_VERIFICATION_ENABLED=false` в настройках backend: письма не отправляются,
а адреса остаются неподтверждёнными. Пользователь может работать с задачами до подтверждения, но
видит соответствующее уведомление. Для локальной отправки добавьте в
`backend/.env` значения `RESEND_API_KEY`, `RESEND_FROM` и `FRONTEND_URL` из
`backend/.env.example`.

## API

- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/verify-email`
- `POST /auth/logout`
- `GET /todos`
- `POST /todos`
- `PATCH /todos/:id`
- `DELETE /todos/:id`

Для локальной разработки backend разрешает CORS для
`http://localhost:5173` и credentials-запросы для refresh cookie.

В тестовом режиме используйте email, привязанный к аккаунту Resend. Перед
отправкой писем реальным пользователям подтвердите собственный домен в Resend
и замените `RESEND_FROM` на адрес этого домена.

## Подготовка к размещению

Backend поддерживает SQLite и PostgreSQL. Prisma выбирает схему и историю
миграций по `DATABASE_URL`: `file:` для SQLite, `postgresql:` или `postgres:`
для PostgreSQL. Для PostgreSQL перед запуском нужно создать пустую базу и из
папки `backend/` выполнить `npx prisma migrate deploy`, затем `npm run build`.
Переменная `DATABASE_URL` должна быть доступна как при сборке, так и при запуске:
при смене базы нужно заново сгенерировать Prisma Client (`npm run prisma:generate`).
Истории миграций находятся в `backend/prisma/migrations` и
`backend/prisma/postgresql/migrations`; изменения моделей нужно отражать в обеих схемах.

Для HTTPS укажите `NODE_ENV=production`, `FRONTEND_URL` с адресом интерфейса,
надёжный `JWT_SECRET`, а `VITE_API_URL` задайте при сборке frontend. Backend
принимает порт из `PORT`. Frontend и API должны располагаться на одном сайте
(например, на поддоменах одного домена), чтобы работала refresh cookie
`SameSite=Lax`; доступ по HTTPS обязателен. Для React Router на хостинге нужен
SPA fallback на `index.html`.

## Размещение на ONREZA

Демонстрационная версия размещена в workspace `vilena-studio`: [frontend](https://vilena-todo-vilena-studio.onreza.app/)
и [backend](https://vilena-todo-api-vilena-studio.onreza.app/) — отдельные
проекты из ветки `main`. Backend подключён к управляемой PostgreSQL `todo_app`;
локальный файл SQLite и база на ONREZA не синхронизируются автоматически.
В демоверсии подтверждение email отключено. 4 ноября 2026 года проверены
регистрация, вход, создание задачи и её сохранение после повторного входа.
Доступ из России без VPN пока не проверен.
