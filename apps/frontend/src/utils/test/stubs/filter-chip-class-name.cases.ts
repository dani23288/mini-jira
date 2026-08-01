export const getFilterChipClassNameCases: {
  name: string;
  isSelected: boolean;
  hasActiveFilter: boolean;
  expected: string;
}[] = [
  { name: 'returns just the base class when no filter is active', isSelected: false, hasActiveFilter: false, expected: 'chip' },
  { name: 'adds the selected class for the selected chip', isSelected: true, hasActiveFilter: true, expected: 'chip chip-selected' },
  { name: 'adds the muted class for unselected chips while a filter is active', isSelected: false, hasActiveFilter: true, expected: 'chip chip-muted' },
];
