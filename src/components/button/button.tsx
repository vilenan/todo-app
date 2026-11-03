import styles from './button.module.css';

interface IButton {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

function Button({
  children,
  type = 'button',
  onClick,
  disabled,
  ariaLabel,
  className,
}: IButton) {
  return (
    <button
      type={type}
      className={`${styles.button} ${className ?? ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

export default Button;
