import type { ButtonVariant } from '../button/button.types';

export interface IConfirmOptions {
  title: string;
  body: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: ButtonVariant;
}

export interface IConfirmDialogProps extends IConfirmOptions {
  onConfirm: () => void;
  onCancel: () => void;
}
