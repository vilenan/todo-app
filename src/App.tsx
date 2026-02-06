import { useState, useEffect } from 'react';
import styles from './App.module.css';
import Button from './components/button/button';
import TodoList from './components/to-do-list/to-do-list';
import type { ITodo } from './types/ITodo';
import type { ITodoItem } from './components/to-do-item/to-do-item';

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [text, setText] = useState('');
  //Добавила состояние фильтра
  type FilterType = 'all' | 'active' | 'completed';
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredTodos = todos.filter((todo: ITodo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  function addTodos(text: string) {
    setTodos([...todos, { id: Date.now(), text: text, completed: false }]);
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!text.trim()) return;
    addTodos(text);
    setText('');
  }

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Создай удобный список дел</h1>

        <p className={styles.slogan}>
          Фиксируй задачи. Помогаем выполнять запланированное без хаоса и лишних
          усилий.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Введите задачу"
            className={styles.input}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
          <Button type="submit">Добавить</Button>
        </form>

        <TodoList
          todos={filteredTodos}
          onRemove={removeTask}
          onToggle={toggleTodo}
        />

        <p>Всего задач: {todos.length}</p>
        <div className={styles.controls}>
          <button className={styles.button} onClick={() => setFilter('all')}>
            Все
          </button>
          <button className={styles.button} onClick={() => setFilter('active')}>
            Активные
          </button>
          <button
            className={styles.button}
            onClick={() => setFilter('completed')}
          >
            Выполненные
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
