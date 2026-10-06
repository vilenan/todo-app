import type { FormEvent, RefObject } from 'react';
import { Modal } from '../modal/modal';
import TodoForm from '../todo-form/todo-form';
import type { TodoPriority, TodoCategory } from '../../types/ITodo';

type TodoEditModalProps = {
  isOpen: boolean;
  text: string;
  description: string;
  dueDate: string;
  priority?: TodoPriority;
  category: TodoCategory | null;
  error: string | null;
  isSubmitDisabled: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  onTextChange: (value: string) => void;
  onTextBlur: () => void;
  onDescriptionChange: (value: string) => void;
  onPriorityChange?: (value: TodoPriority) => void;
  onCategoryChange: (value: TodoCategory | null) => void;
  onDueDateChange: (value: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
};

export default function TodoEditModal({
  isOpen,
  text,
  description,
  dueDate,
  priority = 'medium',
  category,
  error,
  isSubmitDisabled,
  onSubmit,
  onClose,
  onTextChange,
  onTextBlur,
  onDescriptionChange,
  onPriorityChange = () => {},
  onCategoryChange,
  onDueDateChange,
  inputRef,
}: TodoEditModalProps) {
  if (!isOpen) return null;

  return (
    <Modal title="Редактирование" onClose={onClose}>
      <TodoForm
        text={text}
        description={description}
        dueDate={dueDate}
        priority={priority}
        category={category}
        error={error}
        isSubmitDisabled={isSubmitDisabled}
        submitLabel="Сохранить"
        onSubmit={onSubmit}
        onCancel={onClose}
        onTextChange={onTextChange}
        onTextBlur={onTextBlur}
        onDescriptionChange={onDescriptionChange}
        onPriorityChange={onPriorityChange}
        onCategoryChange={onCategoryChange}
        onDueDateChange={onDueDateChange}
        inputRef={inputRef}
      />
    </Modal>
  );
}
