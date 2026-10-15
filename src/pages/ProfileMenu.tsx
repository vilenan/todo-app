import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ProfileMenu.module.css';

type ProfileMenuProps = {
  email: string;
  onLogout: () => void;
};

export default function ProfileMenu({ email, onLogout }: ProfileMenuProps) {
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isProfileMenuOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isProfileMenuOpen]);

  useEffect(() => {
    if (!isProfileMenuOpen) return;
    function handleMouseDown(event: MouseEvent) {
      const clickedElement = event.target;
      if (
        profileMenuRef.current &&
        clickedElement instanceof Node &&
        !profileMenuRef.current.contains(clickedElement)
      )
        setIsProfileMenuOpen(false);
    }

    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isProfileMenuOpen]);

  return (
    <div className={styles.profileMenu} ref={profileMenuRef}>
      <button
        type="button"
        className={styles.avatarButton}
        aria-label="Открыть меню профиля"
        aria-expanded={isProfileMenuOpen}
        onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
      >
        {email.charAt(0).toUpperCase()}
      </button>
      {isProfileMenuOpen && (
        <div className={styles.profileDropdown}>
          <p className={styles.profileEmail}>{email}</p>
          <div className={styles.menuDivider} />
          <Link
            className={styles.menuItem}
            to="/profile"
            onClick={() => setIsProfileMenuOpen(false)}
          >
            <svg
              className={styles.menuIcon}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M20 21a8 8 0 0 0-16 0" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Профиль</span>
          </Link>
          <Link
            className={styles.menuItem}
            to="/stats"
            onClick={() => setIsProfileMenuOpen(false)}
          >
            <svg
              className={styles.menuIcon}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M4 19V10" />
              <path d="M10 19V4" />
              <path d="M16 19v-7" />
              <path d="M22 19H2" />
            </svg>
            <span>Моя статистика</span>
          </Link>
          <div className={styles.menuDivider} />
          <button
            type="button"
            className={styles.menuItem}
            onClick={() => {
              setIsProfileMenuOpen(false);
              onLogout();
            }}
          >
            <svg
              className={styles.menuIcon}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M10 17l5-5-5-5" />
              <path d="M15 12H3" />
              <path d="M21 3v18" />
            </svg>
            <span>Выйти</span>
          </button>
        </div>
      )}
    </div>
  );
}
