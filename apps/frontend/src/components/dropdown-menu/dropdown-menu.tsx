import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import type { IDropdownMenuProps } from './dropdown-menu.types';
import styles from './dropdown-menu.module.css';

const MENU_GAP_PX = 4;

interface IMenuPosition {
  top: number;
  left?: number;
  right?: number;
  width?: number;
}

export function DropdownMenu({
  items,
  triggerLabel = 'Actions',
  triggerContent = '⋯',
  triggerClassName,
  align = 'right',
}: IDropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<IMenuPosition | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // The trigger can sit inside a scrollable ancestor (e.g. the ticket modal), which
  // would clip an absolutely-positioned menu. Portal to <body> and position it with
  // fixed, viewport-relative coordinates so it always floats above its container.
  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) {
      return;
    }
    const rect = triggerRef.current.getBoundingClientRect();
    const top = rect.bottom + MENU_GAP_PX;
    setMenuPosition(
      align === 'left'
        ? { top, left: rect.left, width: rect.width }
        : { top, right: window.innerWidth - rect.right },
    );
  }, [isOpen, align]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideTrigger = !wrapperRef.current || !wrapperRef.current.contains(target);
      const isOutsideMenu = !menuRef.current || !menuRef.current.contains(target);
      if (isOutsideTrigger && isOutsideMenu) {
        setIsOpen(false);
      }
    };
    const handleScroll = () => setIsOpen(false);
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && menuPosition) {
      menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus();
    }
  }, [isOpen, menuPosition]);

  const showCheckSlot = items.some((item) => item.isActive !== undefined);

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
      {isOpen &&
        menuPosition &&
        createPortal(
          <div
            className={styles.menu}
            role="menu"
            ref={menuRef}
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
              right: menuPosition.right,
              width: menuPosition.width,
            }}
            onKeyDown={handleMenuKeyDown}
          >
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
                {showCheckSlot && (
                  <span className={styles['menu-item-check']} aria-hidden="true">
                    {item.isActive ? '✓' : ''}
                  </span>
                )}
                <bdi>{item.label}</bdi>
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}
