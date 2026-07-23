import { BUTTON_VARIANT_CLASS_BY_VARIANT } from './button.consts';
import type { IButtonProps } from './button.types';
import styles from './button.module.css';

export function Button({ variant = 'primary', className, ...rest }: IButtonProps) {
  const variantClass = styles[BUTTON_VARIANT_CLASS_BY_VARIANT[variant]];
  const combinedClassName = [styles.button, variantClass, className].filter(Boolean).join(' ');

  return <button className={combinedClassName} {...rest} />;
}
