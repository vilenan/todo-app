import { useState, useEffect, useMemo, useRef } from 'react';
import styles from './App.module.css';
import Button from './components/button/button';
import TodoForm from './components/todo-form/todo-form';
import TodoList from './components/to-do-list/to-do-list';
import type { ITodo } from './types/ITodo';
import type { ITodoItem } from './types/ITodoItem';
import { Modal } from './components/modal/modal';

import { Routes, Route, useNavigate } from 'react-router-dom';
import TodoDetailsPage from './pages/TodoDetailsPage';

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  //Добавила состояние фильтра
  type FilterType = 'all' | 'active' | 'completed';

  const [filter, setFilter] = useState<FilterType>('all');

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter((t: ITodo) => !t.completed);
      case 'completed':
        return todos.filter((t: ITodo) => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  // счетчики
  const activeCount = todos.filter((todo: ITodo) => !todo.completed).length;
  const doneCount = todos.filter((todo: ITodo) => todo.completed).length;

  // сохраняем задачи в браузере при изменении списка задач
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  function openModal() {
    setIsModalOpen(true);
    setText('');
    setDescription('');
    setDueDate('');
    setTouched(false);
    setError(null);
  }

  function closeModal() {
    setIsModalOpen(false);
    setText('');
    setDescription('');
    setDueDate('');
    setTouched(false);
    setError(null);
  }

  useEffect(() => {
    if (isModalOpen) {
      inputRef.current?.focus();
    }
  }, [isModalOpen]);

  function addTodos(text: string, descriptionValue: string, dateValue: string) {
    const trimmed = text.trim();
    const trimmedDescription = descriptionValue.trim();
    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: trimmed,
        description: trimmedDescription ? trimmedDescription : undefined,
        dueDate: dateValue || undefined,
        completed: false,
      },
    ]);
  }

  function updateTodo(
    id: number,
    textValue: string,
    descriptionValue: string,
    dateValue: string
  ) {
    const trimmed = textValue.trim();
    const trimmedDescription = descriptionValue.trim();
    setTodos(
      todos.map((todo: ITodo) =>
        todo.id === id
          ? {
              ...todo,
              text: trimmed,
              description: trimmedDescription ? trimmedDescription : undefined,
              dueDate: dateValue || undefined,
            }
          : todo
      )
    );
  }

  function removeTask(id: number) {
    setTodos(todos.filter((item: ITodoItem) => item.id !== id));
  }

  function toggleTodo(id: number) {
    setTodos(
      todos.map((todo: ITodo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function validateText(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return 'Введите задачу';
    if (trimmed.length < 3) return 'Минимум 3 символа';
    if (trimmed.length > 120) return 'Не больше 120 символов';
    return null;
  }

  const isSubmitDisabled = Boolean(validateText(text));

  function handleTextChange(value: string) {
    setText(value);
    if (touched) {
      setError(validateText(value));
    }
  }

  function handleTextBlur() {
    setTouched(true);
    setError(validateText(text));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextError = validateText(text);
    setTouched(true);
    setError(nextError);
    if (nextError) return;
    addTodos(text, description, dueDate);
    closeModal();
  }

  function handleEdit(id: number) {
    navigate(`/todo/${id}`);
  }

  const listPage = (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Создай удобный список дел</h1>

        <p className={styles.slogan}>
          Фиксируй задачи. Помогаем выполнять запланированное без хаоса и лишних
          усилий.
        </p>

        <Button type="button" onClick={openModal}>
          + Добавить задачу
        </Button>

        {filteredTodos.length === 0 ? (
          <div className={styles.emptyState}>
            <h2 className={styles.emptyTitle}>Пока задач нет</h2>
            <p className={styles.emptyText}>
              Создай первую задачу и начни планировать.
            </p>
          </div>
        ) : (
          <TodoList
            todos={filteredTodos}
            onRemove={removeTask}
            onToggle={toggleTodo}
            onEdit={handleEdit}
          />
        )}

        <div className={styles.controls}>
          <button className={styles.button} onClick={() => setFilter('all')}>
            Все {todos.length}
          </button>
          <button className={styles.button} onClick={() => setFilter('active')}>
            Активные {activeCount}
          </button>
          <button
            className={styles.button}
            onClick={() => setFilter('completed')}
          >
            Выполненные {doneCount}
          </button>
        </div>

        {isModalOpen && (
          <Modal title="Новая задача" onClose={closeModal}>
            <TodoForm
              text={text}
              description={description}
              dueDate={dueDate}
              error={error}
              isSubmitDisabled={isSubmitDisabled}
              submitLabel="Добавить"
              onSubmit={handleSubmit}
              onCancel={closeModal}
              onTextChange={handleTextChange}
              onTextBlur={handleTextBlur}
              onDescriptionChange={setDescription}
              onDueDateChange={setDueDate}
              inputRef={inputRef}
            />
          </Modal>
        )}
      </div>
    </>
  );

  return (
    <Routes>
      <Route path="/" element={listPage} />
      <Route
        path="/todo/:id"
        element={<TodoDetailsPage todos={todos} onUpdate={updateTodo} />}
      />
    </Routes>
  );
}

export default App;
