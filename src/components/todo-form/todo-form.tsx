import type { RefObject } from 'react';
import styles from './todo-form.module.css';
import Button from '../button/button';

interface TodoFormProps {
  text: string;
  description: string;
  dueDate: string;
  error: string | null;
  isSubmitDisabled: boolean;
  submitLabel: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  onTextChange: (value: string) => void;
  onTextBlur: () => void;
  onDescriptionChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}

function TodoForm({
  text,
  description,
  dueDate,
  error,
  isSubmitDisabled,
  submitLabel,
  onSubmit,
  onCancel,
  onTextChange,
  onTextBlur,
  onDescriptionChange,
  onDueDateChange,
  inputRef,
}: TodoFormProps) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <label className={styles.label}>
        Текст задачи
        <input
          ref={inputRef}
          type="text"
          placeholder="Например: оплатить счета"
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          onBlur={onTextBlur}
        />
      </label>

      <label className={styles.label}>
        Описание
        <textarea
          placeholder="Коротко опиши, что нужно сделать"
          className={styles.textarea}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
        />
      </label>

      <label className={styles.label}>
        Срок выполнения
        <input
          type="date"
          className={styles.input}
          value={dueDate}
          onChange={(e) => onDueDateChange(e.target.value)}
        />
      </label>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={onCancel}
        >
          Отмена
        </button>
        <Button type="submit" disabled={isSubmitDisabled}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default TodoForm;
