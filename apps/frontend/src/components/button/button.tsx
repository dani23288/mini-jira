import type { IButtonProps } from './button.types';
import styles from './button.module.css';

export function Button({ variant = 'primary', className, ...rest }: IButtonProps) {
  const variantClass = variant === 'secondary' ? styles['button-secondary'] : styles['button-primary'];
  const combinedClassName = [styles.button, variantClass, className].filter(Boolean).join(' ');

  return <button className={combinedClassName} {...rest} />;
}
