import { useEffect, useRef, useState } from 'react';
import type { IDropdownMenuProps } from './dropdown-menu.types';
import styles from './dropdown-menu.module.css';

export function DropdownMenu({ items, triggerLabel = 'Actions' }: IDropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className={styles['menu-wrapper']} ref={wrapperRef}>
      <button
        type="button"
        className={styles['menu-trigger']}
        aria-label={triggerLabel}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        ⋯
      </button>
      {isOpen && (
        <div className={styles.menu} role="menu">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              className={item.variant === 'danger' ? styles['menu-item-danger'] : styles['menu-item']}
              role="menuitem"
              onClick={() => {
                setIsOpen(false);
                item.onSelect();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
