# Todo App Frontend

Клиентская часть приложения для управления личными задачами.

## Стек

- React 19.2, TypeScript 5.9, Vite 7
- React Router 7 для маршрутизации
- Zustand 5 для состояния авторизации и задач
- NestJS backend в соседнем проекте `../todo-backend`
- Prisma + SQLite на backend
- CSS Modules для стилей компонентов и страниц
- ESLint 9, Prettier 3, Husky и lint-staged

## Быстрый старт

```bash
npm install
npm run dev
```

Перед запуском frontend поднимите backend в соседней папке:

```bash
cd /Users/vilenan/Desktop/React/todo-backend
npm install
npm run start:dev
```

Frontend ожидает API по адресу `http://localhost:3000`.
Базовый адрес backend задаётся через `VITE_API_URL` с fallback на
`http://localhost:3000`.

## Команды

| Команда           | Что делает                                       |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Запускает dev-сервер Vite                        |
| `npm run build`   | Проверяет TypeScript и собирает production-бандл |
| `npm run lint`    | Запускает ESLint по проекту                      |
| `npm run preview` | Запускает локальный preview production-сборки    |
| `npm run prepare` | Устанавливает Husky hooks                        |

Перед значимыми изменениями и перед PR стоит запускать:

```bash
npm run lint
npm run build
```

## Основные возможности

- регистрация и вход пользователя
- защищённая зона приложения для авторизованных пользователей
- создание, редактирование, удаление и просмотр задач
- отметка задач выполненными
- удаление всех задач или только выполненных
- фильтрация задач через URL query param `filter`
- открытие модального окна редактирования через query param `edit`
- страница статистики
- отдельная страница деталей задачи с lazy loading

## Структура проекта

```text
src/
  main.tsx                         # входная точка приложения
  router.tsx                       # конфигурация маршрутов
  AppLayout.tsx                    # protected layout и проверка авторизации
  App.tsx                          # главный экран списка задач
  App.module.css                   # стили главного экрана

  components/
    button/                        # переиспользуемая кнопка
    modal/                         # базовая модалка
    modal-overlay/                 # затемнение модалки
    to-do-item/                    # карточка одной задачи
    to-do-list/                    # список задач
    todo-form/                     # форма создания/редактирования
    todo-edit-modal/               # модалка редактирования задачи

  hooks/
    useEditModal.ts                # состояние и submit-flow редактирования

  lib/
    todoPriority.ts                # утилиты приоритетов задач

  pages/
    LoginPage.tsx                  # вход
    SignupPage.tsx                 # регистрация
    StatisticPage.tsx              # статистика
    TodoDetailsPage.tsx            # детали задачи

  store/
    authStore.ts                   # авторизация через NestJS API
    todoStore.ts                   # CRUD задач через NestJS API

  types/
    ITodo.ts                       # тип задачи и приоритета
    ITodoItem.ts                   # props для элемента списка

```

## Маршруты

| Маршрут     | Назначение                                           |
| ----------- | ---------------------------------------------------- |
| `/login`    | страница входа                                       |
| `/signup`   | страница регистрации                                 |
| `/`         | защищённый главный экран задач                       |
| `/stats`    | защищённая страница статистики                       |
| `/todo/:id` | защищённая страница деталей задачи, загружается lazy |

`AppLayout` вызывает `initAuth()` из `authStore`. Если пользователь не
авторизован, защищённые маршруты перенаправляют на `/login`.

## Как данные доходят до интерфейса

```text
NestJS API (todo-backend)
  -> src/store/authStore.ts / src/store/todoStore.ts
    -> src/App.tsx, src/pages/*
      -> src/components/*
```

Авторизация хранится в `authStore`. Задачи хранятся в `todoStore` и
синхронизируются через HTTP API backend.

## Работа с задачами

Главный экран живёт в `src/App.tsx`. Он:

- загружает задачи текущего пользователя через `fetchTodos(user.id)`
- хранит состояние модалки создания задачи
- фильтрует задачи по `filter=all | active | completed`
- открывает редактирование через `edit=<todoId>`
- передаёт действия списка в `TodoList` и `TodoItem`

Сами операции с backend находятся в `src/store/todoStore.ts`:

- `fetchTodos`
- `addTodo`
- `updateTodo`
- `removeTodo`
- `toggleTodo`
- `clearAll`
- `clearCompleted`

## Backend API

Frontend использует NestJS backend из соседнего проекта
`/Users/vilenan/Desktop/React/todo-backend`.

Для конфигурации frontend добавьте `.env` на основе `.env.example`.

Основные маршруты:

- `POST /auth/signup`
- `POST /auth/login`
- `GET /todos`
- `POST /todos`
- `PATCH /todos/:id`
- `DELETE /todos/:id`

Если авторизация или задачи не работают локально, сначала проверьте, запущен ли
backend на `http://localhost:3000`.

## Договорённости

- Пишите пользовательские тексты на русском языке.
- Сохраняйте функциональный React-стиль и TypeScript-типы.
- Для общего состояния используйте существующие Zustand stores.
- Для стилей используйте CSS Modules рядом с компонентом или страницей.
- Роуты добавляйте в `src/router.tsx`, если не требуется более крупный рефакторинг.
- Query params `filter` и `edit` считаются частью поведения приложения.
- Не меняйте frontend API URL без согласования с backend-конфигурацией.
- Изменения DTO и auth-ответов согласовывайте с backend-кодом.

## Что полезно улучшить позже

- Добавить автоматические тесты для store-логики, auth flow и URL-фильтров.
- Добавить обработку ошибок загрузки и сохранения задач в UI.
