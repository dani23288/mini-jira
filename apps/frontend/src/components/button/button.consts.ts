import type { ButtonVariant } from './button.types';

export function getButtonVariantClassName(variant: ButtonVariant): string {
  return `button-${variant}`;
}
