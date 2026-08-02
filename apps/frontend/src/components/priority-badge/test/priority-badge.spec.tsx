import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PriorityBadge } from '../priority-badge';

describe('PriorityBadge', () => {
  it.each([
    [1, 'Low', 'low'],
    [2, 'Medium', 'medium'],
    [3, 'High', 'high'],
  ] as const)('renders the label and data-priority key for priority %i', (priority, label, key) => {
    render(<PriorityBadge priority={priority} />);

    const badge = screen.getByText(label);
    expect(badge.getAttribute('data-priority')).toBe(key);
  });
});
