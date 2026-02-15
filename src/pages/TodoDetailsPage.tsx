import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../components/button/button';
import formStyles from '../components/todo-form/todo-form.module.css';
import appStyles from '../App.module.css';
import type { ITodo } from '../types/ITodo';

type Props = {
  todos: ITodo[];
  onUpdate: (
    id: number,
    textValue: string,
    descriptionValue: string,
    dateValue: string
  ) => void;
};

export default function TodoDetailsPage({ todos, onUpdate }: Props) {
  const { id } = useParams();
  const todo = todos.find((t) => t.id === Number(id));

  if (!todo) {
    return (
      <div>
        <p>Задача не найдена</p>
        <Link to="/">Назад к списку</Link>
      </div>
    );
  }

  return (
    <div className={appStyles.container}>
      <TodoDetailsForm key={todo.id} todo={todo} onUpdate={onUpdate} />
    </div>
  );
}

type FormProps = {
  todo: ITodo;
  onUpdate: Props['onUpdate'];
};

function TodoDetailsForm({ todo, onUpdate }: FormProps) {
  const navigate = useNavigate();
  const [text, setText] = useState(todo.text);
  const [description, setDescription] = useState(todo.description ?? '');
  const [dueDate, setDueDate] = useState(todo.dueDate ?? '');
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function validateText(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return 'Введите задачу';
    if (trimmed.length < 3) return 'Минимум 3 символа';
    if (trimmed.length > 120) return 'Не больше 120 символов';
    return null;
  }

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

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextError = validateText(text);
    setTouched(true);
    setError(nextError);
    if (nextError) return;
    onUpdate(todo.id, text, description, dueDate);
    navigate('/');
  }

  return (
    <>
      <div>
        <h1 className={appStyles.title}>Редактирование</h1>
        <form className={formStyles.form} onSubmit={handleSubmit}>
          <label className={formStyles.label}>
            Текст задачи
            <input
              ref={inputRef}
              type="text"
              placeholder="Например: оплатить счета"
              className={`${formStyles.input} ${error ? formStyles.inputError : ''}`}
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              onBlur={handleTextBlur}
            />
          </label>

          <label className={formStyles.label}>
            Описание
            <textarea
              placeholder="Коротко опиши, что нужно сделать"
              className={formStyles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </label>

          <label className={formStyles.label}>
            Срок выполнения
            <input
              type="date"
              className={formStyles.input}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </label>

          {error && <p className={formStyles.error}>{error}</p>}

          <div className={formStyles.actions}>
            <button
              type="button"
              className={formStyles.secondaryButton}
              onClick={() => navigate('/')}
            >
              Отмена
            </button>
            <Button type="submit" disabled={Boolean(validateText(text))}>
              Сохранить
            </Button>
          </div>
        </form>
      </div>

      <Link to="/">Назад к списку</Link>
    </>
  );
}
