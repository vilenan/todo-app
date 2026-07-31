# Todo App Frontend

Фронтенд приложения для управления задачами.

## Что находится в этом репозитории

Этот репозиторий содержит клиентскую часть приложения на React + TypeScript.
Backend вынесен в соседний проект NestJS:

- frontend: `/Users/vilenan/Desktop/React/todo-app`
- backend: `/Users/vilenan/Desktop/React/todo-backend`

## Стек

- React 19
- TypeScript 5
- Vite 7
- React Router 7
- Zustand 5
- CSS Modules
- ESLint 9
- Prettier 3
- Husky
- lint-staged

## Архитектура

Сейчас приложение разделено на две части:

- `todo-app` — frontend на React/Vite
- `todo-backend` — backend на NestJS + Prisma + SQLite

Фронтенд отправляет запросы в Nest API по адресу `http://localhost:3000`.
В backend включён CORS для `http://localhost:5173`.

Базовый URL backend на фронтенде настраивается через `VITE_API_URL`.

## Команды

```bash
npm install
npm run dev
```

Для локальной настройки можно создать `.env` на основе примера:

```bash
cp .env.example .env
```

Дополнительно:

- `npm run build` — сборка frontend
- `npm run lint` — проверка ESLint
- `npm run preview` — локальный preview production-сборки

Пример значения:

```bash
VITE_API_URL=http://localhost:3000
```

Для локальной разработки backend запускается в соседней папке:

```bash
cd /Users/vilenan/Desktop/React/todo-backend
npm install
npm run start:dev
```

## Что умеет текущий frontend

- регистрация и вход пользователя
- защищённая зона приложения
- создание, редактирование и удаление задач
- переключение статуса выполнения
- фильтрация задач через query param `filter`
- открытие редактирования через query param `edit`
- страница статистики
- lazy-loaded страница деталей задачи

## Структура проекта

```text
src/
  main.tsx
  router.tsx
  AppLayout.tsx
  App.tsx

  components/
  hooks/
  lib/
  pages/
  store/
  types/
```

Ключевые места:

- `src/router.tsx` — маршруты
- `src/AppLayout.tsx` — защищённая оболочка
- `src/App.tsx` — основной экран списка задач
- `src/store/authStore.ts` — auth state
- `src/store/todoStore.ts` — todo state
- `src/store/*` — здесь находится вся интеграция с backend API

## API, которые использует frontend

Авторизация:

- `POST /auth/signup`
- `POST /auth/login`

Задачи:

- `GET /todos`
- `POST /todos`
- `PATCH /todos/:id`
- `DELETE /todos/:id`

Токен хранится во frontend в `localStorage` и отправляется в заголовке
`Authorization: Bearer <token>`.

## Рекомендация по следующему шагу

Следующее полезное улучшение для frontend:

- при желании выделить отдельный API-layer поверх `fetch`
- добавить обработку ошибок загрузки и сохранения задач в UI
