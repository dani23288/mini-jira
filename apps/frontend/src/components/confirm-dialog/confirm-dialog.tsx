import { Button } from '../button/button';
import { Modal } from '../modal/modal';
import type { IConfirmDialogProps } from './confirm-dialog.types';
import styles from './confirm-dialog.module.css';

export function ConfirmDialog({
  title,
  body,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
}: IConfirmDialogProps) {
  return (
    <Modal
      role="alertdialog"
      labelledBy="confirm-dialog-title"
      describedBy="confirm-dialog-body"
      onClose={onCancel}
      className={styles.dialog}
    >
      <h2 id="confirm-dialog-title" className={styles.title}>
        {title}
      </h2>
      <p id="confirm-dialog-body" className={styles.body}>
        {body}
      </p>
      <div className={styles.actions}>
        <Button type="button" variant="secondary" autoFocus onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button type="button" variant={confirmVariant} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
