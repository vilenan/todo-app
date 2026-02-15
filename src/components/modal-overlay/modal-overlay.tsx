import type { ReactNode } from 'react';
import styles from './modal-overlay.module.css';

type Props = {
  onClose: () => void;
  children: ReactNode;
};

export function ModalOverlay({ onClose, children }: Props) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      {children}
    </div>
  );
}
