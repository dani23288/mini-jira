import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { DropdownMenu } from '../dropdown-menu';

function renderMenu(onSelectOne = vi.fn(), onSelectTwo = vi.fn()) {
  render(
    <DropdownMenu
      triggerLabel="Actions"
      items={[
        { label: 'One', onSelect: onSelectOne },
        { label: 'Two', onSelect: onSelectTwo },
      ]}
    />,
  );
  return { onSelectOne, onSelectTwo };
}

describe('DropdownMenu', () => {
  it('opens on trigger click, calls onSelect, and closes on item click', async () => {
    const { onSelectOne } = renderMenu();

    fireEvent.click(screen.getByLabelText('Actions'));
    fireEvent.click(await screen.findByRole('menuitem', { name: 'One' }));

    expect(onSelectOne).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  });

  it('closes and refocuses the trigger on Escape', async () => {
    renderMenu();
    const trigger = screen.getByLabelText('Actions');

    fireEvent.click(trigger);
    fireEvent.keyDown(await screen.findByRole('menu'), { key: 'Escape' });

    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it('cycles focus between items with ArrowDown, wrapping at the end', async () => {
    renderMenu();
    fireEvent.click(screen.getByLabelText('Actions'));

    const [first, second] = await screen.findAllByRole('menuitem');
    expect(document.activeElement).toBe(first);

    fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(second);

    fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(first);
  });

  it('closes on window resize', async () => {
    renderMenu();
    fireEvent.click(screen.getByLabelText('Actions'));
    await screen.findByRole('menu');

    fireEvent(window, new Event('resize'));

    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  });
});
