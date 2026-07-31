import { describe, expect, it } from 'vitest';
import { getFilterChipClassName } from '../filter-chip-class-name';
import { getFilterChipClassNameCases } from './stubs/filter-chip-class-name.cases';

const classes = { chip: 'chip', selected: 'chip-selected', muted: 'chip-muted' };

describe('getFilterChipClassName', () => {
  it.each(getFilterChipClassNameCases)('$name', ({ isSelected, hasActiveFilter, expected }) => {
    expect(getFilterChipClassName(classes, isSelected, hasActiveFilter)).toBe(expected);
  });
});
