import { DropdownMenu } from '../dropdown-menu/dropdown-menu';
import type { ISelectFieldProps } from './select-field.types';
import styles from './select-field.module.css';

export function SelectField({ label, triggerLabel, value, options, onChange }: ISelectFieldProps) {
  const selected = options.find((option) => option.value === value);

  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      <DropdownMenu
        triggerLabel={triggerLabel}
        align="left"
        triggerClassName={styles['field-trigger']}
        triggerContent={
          <>
            <bdi>{selected?.label}</bdi> <span aria-hidden="true">▾</span>
          </>
        }
        items={options.map((option) => ({
          label: option.label,
          onSelect: () => onChange(option.value),
          isActive: option.value === value,
        }))}
      />
    </div>
  );
}
