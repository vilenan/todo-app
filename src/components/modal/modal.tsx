import type { ReactNode } from 'react';
import { useCallback, useEffect } from 'react';
import { useBlocker } from 'react-router-dom';
import { confirmDiscard } from '../../lib/todoDraft';
import { ModalOverlay } from '../modal-overlay/modal-overlay';
import styles from './modal.module.css';

type Props = {
  title: string;
  children: ReactNode;
  onClose: () => void;
  isDirty?: boolean;
};

export function Modal({ title, children, onClose, isDirty = false }: Props) {
  const requestClose = useCallback(() => {
    if (!confirmDiscard(isDirty)) return;
    onClose();
  }, [isDirty, onClose]);
  const blocker = useBlocker(({ historyAction }) => historyAction === 'POP');

  useEffect(() => {
    if (blocker.state === 'blocked') {
      blocker.reset();
      requestClose();
    }
  }, [blocker, requestClose]);
  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        requestClose();
      }
    }

    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [requestClose]);

  return (
    <ModalOverlay onClose={requestClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <h2>{title}</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={requestClose}
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </ModalOverlay>
  );
}
