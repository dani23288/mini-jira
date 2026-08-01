import { getButtonVariantClassName } from './button.consts';
import type { IButtonProps } from './button.types';
import styles from './button.module.css';

export function Button({ variant = 'primary', className, ...rest }: IButtonProps) {
  const variantClass = styles[getButtonVariantClassName(variant)];
  const combinedClassName = [styles.button, variantClass, className].filter(Boolean).join(' ');

  return <button className={combinedClassName} {...rest} />;
}
