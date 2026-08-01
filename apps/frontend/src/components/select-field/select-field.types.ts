export interface ISelectFieldOption {
  value: string;
  label: string;
}

export interface ISelectFieldProps {
  label: string;
  triggerLabel: string;
  value: string;
  options: ISelectFieldOption[];
  onChange: (value: string) => void;
}
