export interface IFilterChipClasses {
  chip: string;
  selected: string;
  muted: string;
}

export function getFilterChipClassName(
  classes: IFilterChipClasses,
  isSelected: boolean,
  hasActiveFilter: boolean,
): string {
  return [classes.chip, isSelected && classes.selected, hasActiveFilter && !isSelected && classes.muted]
    .filter(Boolean)
    .join(' ');
}
