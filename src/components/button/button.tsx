import styles from './button.module.css';

interface IButton {
  children: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

function Button({ children, type = 'button', onClick }: IButton) {
  return (
    <button type={type} className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
