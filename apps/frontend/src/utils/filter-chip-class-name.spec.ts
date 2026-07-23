import { describe, expect, it } from 'vitest';
import { getFilterChipClassName } from './filter-chip-class-name';

const classes = { chip: 'chip', selected: 'chip-selected', muted: 'chip-muted' };

describe('getFilterChipClassName', () => {
  it('returns just the base class when no filter is active', () => {
    expect(getFilterChipClassName(classes, false, false)).toBe('chip');
  });

  it('adds the selected class for the selected chip', () => {
    expect(getFilterChipClassName(classes, true, true)).toBe('chip chip-selected');
  });

  it('adds the muted class for unselected chips while a filter is active', () => {
    expect(getFilterChipClassName(classes, false, true)).toBe('chip chip-muted');
  });
});
