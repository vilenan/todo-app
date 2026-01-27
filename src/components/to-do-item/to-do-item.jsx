import styles from './to-do-item.module.css'
import Button from '../button/button';

function TodoItem({text, id, completed, onRemove, onToggle}) {
    return (
        <div className={styles.item}>
            <input type='checkbox'
            checked={completed} 
            onChange={() => {

                console.log('переключаем', id, onToggle);
                onToggle(id)
            }}/>
            <span className={`${styles.text} ${completed? styles.done:""}`}>{text}</span>
            <Button onClick={() => {
                console.log('Удаляем', id);
                onRemove(id)
                }}>Удалить задачу</Button>
        </div>
    )

}
export default TodoItem;