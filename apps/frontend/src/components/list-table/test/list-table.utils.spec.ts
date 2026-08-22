import { describe, expect, it } from 'vitest';
import { getAriaSort } from '../list-table.utils';
import { getAriaSortCases } from './stubs/list-table.utils.cases';

describe('getAriaSort', () => {
  it.each(getAriaSortCases)('maps $name to $expected', ({ direction, expected }) => {
    expect(getAriaSort(direction)).toBe(expected);
  });
});
