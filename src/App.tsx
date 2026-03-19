import { useState, useEffect, useMemo, useRef } from 'react';
import styles from './App.module.css';
import Button from './components/button/button';
import TodoForm from './components/todo-form/todo-form';
import TodoList from './components/to-do-list/to-do-list';
import type { ITodo } from './types/ITodo';
import { Modal } from './components/modal/modal';

import { Routes, Route, useNavigate } from 'react-router-dom';
import TodoDetailsPage from './pages/TodoDetailsPage';
import { useTodos } from './context/todos/useTodos';

function App() {
  const {
    todos,
    addTodo,
    updateTodo,
    removeTodo,
    toggleTodo,
    clearAll,
    clearCompleted,
  } = useTodos();
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
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

  function openModal() {
    setIsModalOpen(true);
    setEditingId(null);
    setText('');
    setDescription('');
    setDueDate('');
    setTouched(false);
    setError(null);
  }

  function openEditModal(id: number) {
    const todo = todos.find((item: ITodo) => item.id === id);
    if (!todo) return;
    setIsModalOpen(true);
    setEditingId(id);
    setText(todo.text);
    setDescription(todo.description ?? '');
    setDueDate(todo.dueDate ?? '');
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

  function addTodos(text: string, descriptionValue: string, dateValue: string) {
    const trimmed = text.trim();
    const trimmedDescription = descriptionValue.trim();
    addTodo({
      text: trimmed,
      description: trimmedDescription ? trimmedDescription : undefined,
      dueDate: dateValue || undefined,
    });
  }

  function handleUpdateTodo(
    id: number,
    textValue: string,
    descriptionValue: string,
    dateValue: string
  ) {
    const trimmed = textValue.trim();
    const trimmedDescription = descriptionValue.trim();
    updateTodo({
      id,
      text: trimmed,
      description: trimmedDescription ? trimmedDescription : undefined,
      dueDate: dateValue || undefined,
    });
  }

  function removeTask(id: number) {
    removeTodo(id);
  }

  function handleToggleTodo(id: number) {
    toggleTodo(id);
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
    if (editingId === null) {
      addTodos(text, description, dueDate);
    } else {
      handleUpdateTodo(editingId, text, description, dueDate);
    }
    closeModal();
  }

  function handleEdit(id: number) {
    openEditModal(id);
  }

  function handleDetails(id: number) {
    navigate(`/todo/${id}`);
  }

  function handleReset() {
    if (todos.length === 0) return;
    const confirmed = window.confirm(
      'Очистить список задач? Это действие нельзя отменить.'
    );
    if (!confirmed) return;
    clearAll();
  }
  function handleDoneReset() {
    if (doneCount === 0) return;

    clearCompleted();
  }

  const isEditing = editingId !== null;

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
            onToggle={handleToggleTodo}
            onEdit={handleEdit}
            onDetails={handleDetails}
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
        <div className={styles.resetsWrapper}>
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleDoneReset}
            disabled={doneCount === 0}
          >
            Удалить выполненные
          </button>
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleReset}
            disabled={todos.length === 0}
          >
            Очистить список задач
          </button>
        </div>

        {isModalOpen && (
          <Modal
            title={isEditing ? 'Редактирование' : 'Новая задача'}
            onClose={closeModal}
          >
            <TodoForm
              text={text}
              description={description}
              dueDate={dueDate}
              error={error}
              isSubmitDisabled={isSubmitDisabled}
              submitLabel={isEditing ? 'Сохранить' : 'Добавить'}
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
      <Route path="/todo/:id" element={<TodoDetailsPage todos={todos} />} />
    </Routes>
  );
}

export default App;
