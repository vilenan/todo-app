import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import styles from './App.module.css';
import Button from './components/button/button';
import TodoForm from './components/todo-form/todo-form';
import TodoList from './components/to-do-list/to-do-list';
import type { ITodo, TodoPriority } from './types/ITodo';
import { Modal } from './components/modal/modal';
import TodoEditModal from './components/todo-edit-modal/todo-edit-modal';
import { useTodos } from './store/todoStore';
import { useEditModal } from './hooks/useEditModal';
import { useAuthStore } from './store/authStore';

function App() {
  const {
    todos,
    addTodo,
    removeTodo,
    toggleTodo,
    clearAll,
    clearCompleted,
    fetchTodos,
  } = useTodos();
  const {
    isOpen: isEditOpen,
    editingId: currentEditingId,
    text: editText,
    description: editDescription,
    dueDate: editDueDate,
    priority: editPriority,
    error: editError,
    isSubmitDisabled: isEditSubmitDisabled,
    setDescription: setEditDescription,
    setDueDate: setEditDueDate,
    setPriority: setEditPriority,
    open: openEditModal,
    close: closeEditModal,
    onTextChange: onEditTextChange,
    onTextBlur: onEditTextBlur,
    submit: submitEdit,
  } = useEditModal();
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const editInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (!user) return;
    void fetchTodos();
  }, [fetchTodos, user]);

  //Добавила состояние фильтра
  type FilterType = 'all' | 'active' | 'completed';

  function getFilterSearchParams(searchParams: URLSearchParams): FilterType {
    const value = searchParams.get('filter');
    if (value === 'all' || value === 'active' || value === 'completed')
      return value;
    return 'all';
  }

  const filter: FilterType = getFilterSearchParams(searchParams);

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

  function handleFilterChange(nextFilter: FilterType) {
    const next = new URLSearchParams(searchParams);
    if (nextFilter === 'all') {
      next.delete('filter');
    } else {
      next.set('filter', nextFilter);
    }
    setSearchParams(next);
  }

  // счетчики
  const activeCount = todos.filter((todo: ITodo) => !todo.completed).length;
  const doneCount = todos.filter((todo: ITodo) => todo.completed).length;

  function openModal() {
    setIsModalOpen(true);
    setText('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setTouched(false);
    setError(null);
  }

  function closeModal() {
    setIsModalOpen(false);
    setText('');
    setDescription('');
    setPriority('medium');
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
    if (isEditOpen) {
      editInputRef.current?.focus();
    }
  }, [isEditOpen]);

  const clearEditParam = useCallback(() => {
    if (!searchParams.has('edit')) return;
    const next = new URLSearchParams(searchParams);
    next.delete('edit');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const editParam = searchParams.get('edit');
    if (!editParam) {
      if (isEditOpen) {
        closeEditModal();
      }
      return;
    }

    const editId = editParam;

    const todo = todos.find((item: ITodo) => item.id === editId);
    if (!todo) {
      clearEditParam();
      return;
    }
    if (isEditOpen && currentEditingId === editId) return;
    openEditModal(editId);
  }, [
    currentEditingId,
    clearEditParam,
    closeEditModal,
    isEditOpen,
    openEditModal,
    searchParams,
    setSearchParams,
    todos,
  ]);

  async function addTodos(
    text: string,
    descriptionValue: string,
    dateValue: string,
    priority: TodoPriority
  ) {
    if (!user) return;
    const trimmed = text.trim();
    const trimmedDescription = descriptionValue.trim();
    await addTodo({
      text: trimmed,
      description: trimmedDescription ? trimmedDescription : undefined,
      priority: priority || 'medium',
      dueDate: dateValue || undefined,
    });
  }

  function removeTask(id: string) {
    removeTodo(id);
  }

  function handleToggleTodo(id: string) {
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextError = validateText(text);
    setTouched(true);
    setError(nextError);
    if (nextError) return;
    await addTodos(text, description, dueDate, priority);
    closeModal();
  }

  function handleEdit(id: string) {
    const next = new URLSearchParams(searchParams);
    next.set('edit', String(id));
    setSearchParams(next);
  }

  function handleDetails(id: string) {
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

  function handleLogout() {
    logout();
  }

  const listPage = (
    <>
      <div className={styles.container}>
        {user ? <p>Вы вошли как {user.email}</p> : <p>Пока никто не вошел</p>}
        <Button type="button" onClick={() => handleLogout()}>
          Выйти
        </Button>

        <h1 className={styles.title}>Создай удобный список дел</h1>

        <p className={styles.slogan}>
          Фиксируй задачи. Помогаем выполнять запланированное без хаоса и лишних
          усилий.
        </p>
        <div className={styles.topActions}>
          <Button type="button" onClick={openModal}>
            + Добавить задачу
          </Button>
          <Link className={styles.statsLink} to="/stats">
            Моя статистика
          </Link>
        </div>

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
          <button
            className={`${styles.button} ${filter === 'all' ? styles.buttonActive : ''}`}
            aria-pressed={filter === 'all'}
            onClick={() => handleFilterChange('all')}
          >
            Все {todos.length}
          </button>
          <button
            className={`${styles.button} ${filter === 'active' ? styles.buttonActive : ''}`}
            aria-pressed={filter === 'active'}
            onClick={() => handleFilterChange('active')}
          >
            Активные {activeCount}
          </button>
          <button
            className={`${styles.button} ${filter === 'completed' ? styles.buttonActive : ''}`}
            aria-pressed={filter === 'completed'}
            onClick={() => handleFilterChange('completed')}
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
          <Modal title="Новая задача" onClose={closeModal}>
            <TodoForm
              text={text}
              description={description}
              dueDate={dueDate}
              priority={priority}
              error={error}
              isSubmitDisabled={isSubmitDisabled}
              submitLabel="Добавить"
              onSubmit={handleSubmit}
              onCancel={closeModal}
              onPriorityChange={setPriority}
              onTextChange={handleTextChange}
              onTextBlur={handleTextBlur}
              onDescriptionChange={setDescription}
              onDueDateChange={setDueDate}
              inputRef={inputRef}
            />
          </Modal>
        )}
        <TodoEditModal
          isOpen={isEditOpen}
          text={editText}
          description={editDescription}
          dueDate={editDueDate}
          priority={editPriority}
          error={editError}
          isSubmitDisabled={isEditSubmitDisabled}
          onSubmit={(e) => {
            const updated = submitEdit(e);
            if (updated) {
              clearEditParam();
              closeEditModal();
            }
          }}
          onClose={() => {
            clearEditParam();
            closeEditModal();
          }}
          onTextChange={onEditTextChange}
          onTextBlur={onEditTextBlur}
          onDescriptionChange={setEditDescription}
          onPriorityChange={setEditPriority}
          onDueDateChange={setEditDueDate}
          inputRef={editInputRef}
        />
      </div>
    </>
  );

  return listPage;
}

export default App;
