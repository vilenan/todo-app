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

## Аутентификация

Используется схема access/refresh token:

- access token — JWT со сроком действия `ACCESS_TOKEN_EXPIRES_IN` (локально
  `15m`), хранится только в памяти frontend;
- refresh token — случайный токен со сроком действия
  `REFRESH_TOKEN_EXPIRES_IN` (локально `30d`), хранится в браузере в
  `HttpOnly` cookie;
- backend хранит только SHA-256 хэш refresh token в модели `RefreshToken`;
- при обновлении refresh token ротируется: старый отзывается, новый создаётся;
- при недействительной сессии frontend очищает состояние и переводит на
  `/login`.

Frontend и backend должны использовать credentials: frontend —
`credentials: 'include'`, backend — CORS `credentials: true`.

Подтверждение email через Resend пока не реализовано и относится к следующему
этапу развития приложения.
