import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { IDropdownMenuProps } from './dropdown-menu.types';
import styles from './dropdown-menu.module.css';

export function DropdownMenu({
  items,
  triggerLabel = 'Actions',
  triggerContent = '⋯',
  triggerClassName,
}: IDropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (isOpen) {
      menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus();
    }
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
      return;
    }
    event.preventDefault();
    const menuItems = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [],
    );
    if (menuItems.length === 0) {
      return;
    }
    const currentIndex = menuItems.indexOf(document.activeElement as HTMLButtonElement);
    const lastIndex = menuItems.length - 1;
    const nextIndex =
      event.key === 'ArrowDown'
        ? currentIndex < lastIndex ? currentIndex + 1 : 0
        : currentIndex > 0 ? currentIndex - 1 : lastIndex;
    menuItems[nextIndex].focus();
  };

  return (
    <div className={styles['menu-wrapper']} ref={wrapperRef}>
      <button
        type="button"
        ref={triggerRef}
        className={triggerClassName ? `${styles['menu-trigger']} ${triggerClassName}` : styles['menu-trigger']}
        aria-label={triggerLabel}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        {triggerContent}
      </button>
      {isOpen && (
        <div className={styles.menu} role="menu" ref={menuRef} onKeyDown={handleMenuKeyDown}>
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              className={item.variant === 'danger' ? styles['menu-item-danger'] : styles['menu-item']}
              role="menuitem"
              aria-current={item.isActive || undefined}
              onClick={() => {
                closeMenu();
                item.onSelect();
              }}
            >
              {item.isActive && <span aria-hidden="true">✓ </span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
