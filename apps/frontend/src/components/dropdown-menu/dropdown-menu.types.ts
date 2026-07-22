export interface IDropdownMenuItem {
  label: string;
  onSelect: () => void;
  variant?: 'default' | 'danger';
}

export interface IDropdownMenuProps {
  items: IDropdownMenuItem[];
  triggerLabel?: string;
}
