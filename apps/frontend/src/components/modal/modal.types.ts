import type { ReactNode } from 'react';

export interface IModalProps {
  role: 'dialog' | 'alertdialog';
  labelledBy: string;
  describedBy?: string;
  onClose: () => void;
  className?: string;
  children: ReactNode;
}
