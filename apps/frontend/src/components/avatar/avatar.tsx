import type { IAvatarProps } from './avatar.types';
import styles from './avatar.module.css';

export function Avatar({ initials, label, className }: IAvatarProps) {
  const combinedClassName = className ? `${styles.avatar} ${className}` : styles.avatar;

  return (
    <span className={combinedClassName} title={label} aria-label={label}>
      {initials}
    </span>
  );
}
