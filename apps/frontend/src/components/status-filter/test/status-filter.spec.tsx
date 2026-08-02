import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { StatusFilter } from '../status-filter';

describe('StatusFilter', () => {
  it('renders a chip per status, marking the selected ones pressed', () => {
    render(<StatusFilter selected={['in-progress']} onToggle={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'To Do' }).getAttribute('aria-pressed')).toBe('false');
    expect(screen.getByRole('button', { name: 'In Progress' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'Done' }).getAttribute('aria-pressed')).toBe('false');
  });

  it('calls onToggle with the clicked status', () => {
    const onToggle = vi.fn();
    render(<StatusFilter selected={[]} onToggle={onToggle} />);

    fireEvent.click(screen.getByRole('button', { name: 'Done' }));

    expect(onToggle).toHaveBeenCalledWith('done');
  });
});
