import styles from './button.module.css'
function Button({ children, type='button', onClick}) {
    return (
        <button
            type={type}
            className={styles.button}
            onClick={onClick}>
            {children}
        </button>
    )
}

export default Button;