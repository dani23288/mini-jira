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
  /** 'right' (default) anchors the menu's right edge to the trigger, for small icon/pill
   *  triggers. 'left' anchors the left edge and matches the trigger's width, for wide
   *  form-field triggers where the label text starts on the left. */
  align?: 'left' | 'right';
}
