import { useState, useEffect, useMemo, useRef } from 'react';
import styles from './App.module.css';
import Button from './components/button/button';
import TodoForm from './components/todo-form/todo-form';
import TodoList from './components/to-do-list/to-do-list';
import type { ITodo } from './types/ITodo';
import type { ITodoItem } from './types/ITodoItem';

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
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

  const activeCount = todos.filter((todo: ITodo) => !todo.completed).length;
  const doneCount = todos.filter((todo: ITodo) => todo.completed).length;

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  function openModal() {
    setIsModalOpen(true);
    setEditingId(null);
    setText('');
    setDescription('');
    setDueDate('');
    setTouched(false);
    setError(null);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
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

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeModal();
      }
    }

    if (isModalOpen) {
      window.addEventListener('keydown', onKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
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
    if (editingId !== null) {
      updateTodo(editingId, text, description, dueDate);
    } else {
      addTodos(text, description, dueDate);
    }
    closeModal();
  }

  function handleEdit(id: number) {
    const todo = todos.find((item: ITodo) => item.id === id);
    if (!todo) return;
    setEditingId(id);
    setIsModalOpen(true);
    setText(todo.text);
    setDescription(todo.description ?? '');
    setDueDate(todo.dueDate ?? '');
    setTouched(false);
    setError(null);
  }

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Создай удобный список дел</h1>

        <p className={styles.slogan}>
          Фиксируй задачи. Помогаем выполнять запланированное без хаоса и лишних
          усилий.
        </p>

        <Button type="button" onClick={openModal}>
          Добавить задачу
        </Button>

        <TodoList
          todos={filteredTodos}
          onRemove={removeTask}
          onToggle={toggleTodo}
          onEdit={handleEdit}
        />

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
          <div className={styles.modalOverlay} onClick={closeModal}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>
                  {editingId !== null ? 'Редактировать задачу' : 'Новая задача'}
                </h2>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={closeModal}
                  aria-label="Закрыть"
                >
                  ×
                </button>
              </div>

              <TodoForm
                text={text}
                description={description}
                dueDate={dueDate}
                error={error}
                isSubmitDisabled={isSubmitDisabled}
                submitLabel={editingId !== null ? 'Сохранить' : 'Добавить'}
                onSubmit={handleSubmit}
                onCancel={closeModal}
                onTextChange={handleTextChange}
                onTextBlur={handleTextBlur}
                onDescriptionChange={setDescription}
                onDueDateChange={setDueDate}
                inputRef={inputRef}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
