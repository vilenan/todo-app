# Todo App

Одностраничное приложение для управления личными задачами.

## Стек

- React 19.2, TypeScript 5.9, Vite 7
- React Router 7 для маршрутизации
- Zustand 5 для состояния авторизации и задач
- PocketBase как локальный backend по адресу `http://127.0.0.1:8090`
- CSS Modules для стилей компонентов и страниц
- ESLint 9, Prettier 3, Husky и lint-staged

## Быстрый старт

```bash
npm install
npm run dev
```

Перед запуском frontend убедитесь, что PocketBase доступен по адресу
`http://127.0.0.1:8090`. Клиент PocketBase настроен в
`src/lib/pocketbase.ts`.

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
    pocketbase.ts                  # PocketBase client
    todoPriority.ts                # утилиты приоритетов задач

  pages/
    LoginPage.tsx                  # вход
    SignupPage.tsx                 # регистрация
    StatisticPage.tsx              # статистика
    TodoDetailsPage.tsx            # детали задачи

  store/
    authStore.ts                   # авторизация через PocketBase
    todoStore.ts                   # CRUD задач через PocketBase

  types/
    ITodo.ts                       # тип задачи и приоритета
    ITodoItem.ts                   # props для элемента списка

tools/
  pocketbase/pb_migrations/        # миграции PocketBase
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
PocketBase
  -> src/lib/pocketbase.ts
    -> src/store/authStore.ts / src/store/todoStore.ts
      -> src/App.tsx, src/pages/*
        -> src/components/*
```

Авторизация хранится в `authStore`. Задачи хранятся в `todoStore` и
синхронизируются с коллекцией `todos` в PocketBase.

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

## PocketBase

Frontend ожидает, что в PocketBase есть:

- коллекция `users` для авторизации
- коллекция `todos` для задач

Миграции лежат в `tools/pocketbase/pb_migrations`. Не меняйте их без задачи на
изменение схемы или данных.

Если авторизация или задачи не работают локально, сначала проверьте, запущен ли
PocketBase на `http://127.0.0.1:8090`.

## Договорённости

- Пишите пользовательские тексты на русском языке.
- Сохраняйте функциональный React-стиль и TypeScript-типы.
- Для общего состояния используйте существующие Zustand stores.
- Для стилей используйте CSS Modules рядом с компонентом или страницей.
- Роуты добавляйте в `src/router.tsx`, если не требуется более крупный рефакторинг.
- Query params `filter` и `edit` считаются частью поведения приложения.
- Не меняйте base URL PocketBase без явного требования.
- Не изменяйте миграции PocketBase без задачи на backend-схему.

## Что полезно улучшить позже

- Заменить стандартный `README.md` Vite на краткое описание приложения.
- Добавить автоматические тесты для store-логики, auth flow и URL-фильтров.
- Добавить обработку ошибок загрузки и сохранения задач в UI.
