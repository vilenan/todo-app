import { useCallback, useMemo, useState } from 'react';
import type React from 'react';
import { useTodos } from '../context/todos/useTodos';
import type { ITodo } from '../types/ITodo';

function validateText(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return 'Введите задачу';
  if (trimmed.length < 3) return 'Минимум 3 символа';
  if (trimmed.length > 120) return 'Не больше 120 символов';
  return null;
}

export function useEditModal() {
  const { todos, updateTodo } = useTodos();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSubmitDisabled = useMemo(() => Boolean(validateText(text)), [text]);

  const open = useCallback(
    (id: number) => {
      const todo = todos.find((item: ITodo) => item.id === id);
      if (!todo) return false;

      setEditingId(id);
      setText(todo.text);
      setDescription(todo.description ?? '');
      setDueDate(todo.dueDate ?? '');
      setTouched(false);
      setError(null);
      setIsOpen(true);
      return true;
    },
    [todos]
  );

  const close = useCallback(() => {
    setIsOpen(false);
    setEditingId(null);
    setText('');
    setDescription('');
    setDueDate('');
    setTouched(false);
    setError(null);
  }, []);

  const onTextChange = useCallback(
    (value: string) => {
      setText(value);
      if (touched) {
        setError(validateText(value));
      }
    },
    [touched]
  );

  const onTextBlur = useCallback(() => {
    setTouched(true);
    setError(validateText(text));
  }, [text]);

  const submit = useCallback(
    (e?: React.FormEvent<HTMLFormElement>) => {
      if (e) e.preventDefault();

      const nextError = validateText(text);
      setTouched(true);
      setError(nextError);
      if (nextError || editingId === null) return false;

      const trimmed = text.trim();
      const trimmedDescription = description.trim();

      updateTodo({
        id: editingId,
        text: trimmed,
        description: trimmedDescription ? trimmedDescription : undefined,
        dueDate: dueDate || undefined,
      });

      return true;
    },
    [description, dueDate, editingId, text, updateTodo]
  );

  return {
    isOpen,
    editingId,
    text,
    description,
    dueDate,
    touched,
    error,
    isSubmitDisabled,
    setDescription,
    setDueDate,
    open,
    close,
    onTextChange,
    onTextBlur,
    submit,
  };
}
