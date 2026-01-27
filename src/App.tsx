import { useState, useEffect } from 'react';
import styles from './App.module.css';
import Button from './components/button/button';
import TodoList from './components/to-do-list/to-do-list';

// Todo = { id: number, text: string, completed: boolean }

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [text, setText] = useState('');

  useEffect(() => {
    (localStorage.setItem('todos', JSON.stringify(todos)), [todos]);
  });

  function addTodos(text) {
    setTodos([...todos, { id: Date.now(), text: text, completed: false }]);
  }

  function removeTask(id) {
    setTodos(todos.filter((item) => item.id !== id));
  }

  function toggleTodo(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function handleSubmit(e) {
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
          <Button type="submit">Добавить задачу</Button>
        </form>

        <TodoList todos={todos} onRemove={removeTask} onToggle={toggleTodo} />

        <p>Всего задач: {todos.length}</p>
      </div>
    </>
  );
}

export default App;
