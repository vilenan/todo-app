import styles from './to-do-list.module.css'
import TodoItem from '../to-do-item/to-do-item'

function TodoList({todos, onRemove, onToggle}) {
    return (
        <ul className={styles.list}>
            {todos.map(item => (
                <li key={item.id}>
                    <TodoItem text={item.text} id={item.id} completed={item.completed} onRemove={onRemove} onToggle={onToggle}/>
                </li>
            ))}
            
        </ul>
    )
}

export default TodoList;