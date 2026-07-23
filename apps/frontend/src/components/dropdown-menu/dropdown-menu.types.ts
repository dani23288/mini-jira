import type { ReactNode } from 'react';

export interface IDropdownMenuItem {
  label: string;
  onSelect: () => void;
  variant?: 'default' | 'danger';
  isActive?: boolean;
}

export interface IDropdownMenuProps {
  items: IDropdownMenuItem[];
  triggerLabel?: string;
  triggerContent?: ReactNode;
  triggerClassName?: string;
}
