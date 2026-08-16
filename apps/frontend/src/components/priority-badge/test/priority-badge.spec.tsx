import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PriorityBadge } from '../priority-badge';
import { priorityBadgeCases } from './stubs/priority-badge.cases';

describe('PriorityBadge', () => {
  it.each(priorityBadgeCases)('renders the label and data-priority key for $name', ({ priority, label, key }) => {
    render(<PriorityBadge priority={priority} />);

    const badge = screen.getByText(label);
    expect(badge.getAttribute('data-priority')).toBe(key);
  });
});
