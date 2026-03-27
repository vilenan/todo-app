import { useCallback, useEffect, useRef } from 'react';
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import appStyles from '../App.module.css';
import styles from './TodoDetailsPage.module.css';
import { useTodos } from '../context/todos/useTodos';
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

export default function TodoDetailsPage() {
  const { todos, removeTodo } = useTodos();
  const {
    isOpen: isEditOpen,
    editingId: currentEditingId,
    text: editText,
    description: editDescription,
    dueDate: editDueDate,
    error: editError,
    isSubmitDisabled: isEditSubmitDisabled,
    setDescription: setEditDescription,
    setDueDate: setEditDueDate,
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
  const todoId = Number(id);
  const todo = Number.isNaN(todoId)
    ? undefined
    : todos.find((t) => t.id === todoId);

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

    const editId = Number(editParam);
    if (Number.isNaN(editId)) {
      clearEditParam();
      return;
    }

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
        >
          Редактировать
        </button>
        <button
          type="button"
          className={`${styles.actionButton} ${styles.actionDelete}`}
          onClick={handleDelete}
        >
          Удалить
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
        onDueDateChange={setEditDueDate}
        inputRef={editInputRef}
      />
    </div>
  );
}
