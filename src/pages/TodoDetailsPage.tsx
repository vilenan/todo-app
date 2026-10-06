import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import appStyles from '../App.module.css';
import styles from './TodoDetailsPage.module.css';
import { useTodos } from '../store/todoStore';
import { useEditModal } from '../hooks/useEditModal';
import TodoEditModal from '../components/todo-edit-modal/todo-edit-modal';

function getDeadlineStatus(dueDate?: string) {
  if (!dueDate) {
    return { label: 'Срок не указан', tone: 'deadlineNeutral' as const };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadline = new Date(dueDate);
  deadline.setHours(0, 0, 0, 0);

  const diffMs = deadline.getTime() - today.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      label: `Просрочена на ${Math.abs(diffDays)} дн.`,
      tone: 'deadlineDanger' as const,
    };
  }

  if (diffDays === 0) {
    return { label: 'Срок сегодня', tone: 'deadlineWarning' as const };
  }

  return { label: `Осталось ${diffDays} дн.`, tone: 'deadlineOk' as const };
}

export function Component() {
  const { todos, removeTodo } = useTodos();
  const {
    isOpen: isEditOpen,
    editingId: currentEditingId,
    text: editText,
    description: editDescription,
    dueDate: editDueDate,
    priority: editPriority,
    category: editCategory,
    error: editError,
    isSubmitDisabled: isEditSubmitDisabled,
    setDescription: setEditDescription,
    setDueDate: setEditDueDate,
    setPriority: setEditPriority,
    setCategory: setEditCategory,
    open: openEditModal,
    close: closeEditModal,
    onTextChange: onEditTextChange,
    onTextBlur: onEditTextBlur,
    submit: submitEdit,
  } = useEditModal();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const editInputRef = useRef<HTMLInputElement | null>(null);
  const { id } = useParams();
  const todoId = id;
  const todo = id ? todos.find((item) => item.id === todoId) : undefined;

  useLayoutEffect(() => {
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

    if (!todo || editId !== todo.id) {
      clearEditParam();
      return;
    }

    if (isEditOpen && currentEditingId === editId) return;
    openEditModal(editId);
  }, [
    clearEditParam,
    closeEditModal,
    currentEditingId,
    isEditOpen,
    openEditModal,
    searchParams,
    todo,
  ]);

  function handleEdit() {
    if (!todo) return;
    setSearchParams({ edit: String(todo.id) });
  }

  function handleDelete() {
    if (!todo) return;
    const confirmed = window.confirm(
      'Удалить задачу? Это действие нельзя отменить.'
    );
    if (!confirmed) return;

    removeTodo(todo.id);
    navigate('/');
  }

  if (!todo) {
    return (
      <div className={appStyles.container}>
        <p>Задача не найдена</p>
        <Link className={styles.backLink} to="/">
          Назад к списку
        </Link>
      </div>
    );
  }

  const deadlineStatus = getDeadlineStatus(todo.dueDate);

  return (
    <div className={appStyles.container}>
      <h1 className={appStyles.title}>Задача</h1>

      <div className={styles.detailsCard}>
        <div className={styles.header}>
          <p className={styles.cardTitle}>Карточка задачи</p>
          <span
            className={`${styles.statusBadge} ${todo.completed ? styles.statusDone : styles.statusActive}`}
          >
            {todo.completed ? 'Выполнена' : 'Активна'}
          </span>
        </div>

        <div className={styles.row}>
          <h2 className={styles.label}>Текст задачи</h2>
          <p className={styles.value}>{todo.text}</p>
        </div>

        <div className={styles.row}>
          <h2 className={styles.label}>Описание задачи</h2>
          <p className={styles.value}>{todo.description || 'Нет описания'}</p>
        </div>

        <div className={styles.row}>
          <h2 className={styles.label}>Срок выполнения</h2>
          <p className={styles.value}>{todo.dueDate || 'Не указан'}</p>
        </div>

        <div className={styles.row}>
          <h2 className={styles.label}>Дедлайн-статус</h2>
          <p className={`${styles.value} ${styles[deadlineStatus.tone]}`}>
            {deadlineStatus.label}
          </p>
        </div>
      </div>

      <div className={styles.actionsRow}>
        <button
          type="button"
          className={`${styles.actionButton} ${styles.actionEdit}`}
          onClick={handleEdit}
          aria-label="Редактировать задачу"
          title="Редактировать"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </button>
        <button
          type="button"
          className={`${styles.actionButton} ${styles.actionDelete}`}
          onClick={handleDelete}
          aria-label="Удалить задачу"
          title="Удалить"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>

      <Link className={styles.backLink} to="/">
        Назад к списку
      </Link>

      <TodoEditModal
        isOpen={isEditOpen}
        text={editText}
        description={editDescription}
        dueDate={editDueDate}
        priority={editPriority}
        category={editCategory}
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
        onCategoryChange={setEditCategory}
        onDueDateChange={setEditDueDate}
        inputRef={editInputRef}
      />
    </div>
  );
}
