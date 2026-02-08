import styles from './button.module.css';

interface IButton {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}

function Button({
  children,
  type = 'button',
  onClick,
  disabled,
  ariaLabel,
}: IButton) {
  return (
    <button
      type={type}
      className={styles.button}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

export default Button;
