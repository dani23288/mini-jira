import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ConfirmDialogProvider, useConfirm } from './use-confirm';

function TestHarness({ onResult }: { onResult: (result: boolean) => void }) {
  const confirm = useConfirm();
  return (
    <button
      onClick={async () => {
        const result = await confirm({ title: 'Delete ticket?', body: 'Are you sure?' });
        onResult(result);
      }}
    >
      trigger
    </button>
  );
}

describe('useConfirm', () => {
  it('resolves true when the confirm button is clicked', async () => {
    const onResult = vi.fn();
    render(
      <ConfirmDialogProvider>
        <TestHarness onResult={onResult} />
      </ConfirmDialogProvider>,
    );

    fireEvent.click(screen.getByText('trigger'));
    fireEvent.click(await screen.findByText('Confirm'));

    await waitFor(() => expect(onResult).toHaveBeenCalledWith(true));
  });

  it('resolves false when the cancel button is clicked', async () => {
    const onResult = vi.fn();
    render(
      <ConfirmDialogProvider>
        <TestHarness onResult={onResult} />
      </ConfirmDialogProvider>,
    );

    fireEvent.click(screen.getByText('trigger'));
    fireEvent.click(await screen.findByText('Cancel'));

    await waitFor(() => expect(onResult).toHaveBeenCalledWith(false));
  });

  it('resolves false when Escape is pressed', async () => {
    const onResult = vi.fn();
    render(
      <ConfirmDialogProvider>
        <TestHarness onResult={onResult} />
      </ConfirmDialogProvider>,
    );

    fireEvent.click(screen.getByText('trigger'));
    fireEvent.keyDown(await screen.findByRole('alertdialog'), { key: 'Escape' });

    await waitFor(() => expect(onResult).toHaveBeenCalledWith(false));
  });

  it('throws when used outside a ConfirmDialogProvider', () => {
    function Bad() {
      useConfirm();
      return null;
    }
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<Bad />)).toThrow('useConfirm must be used within a ConfirmDialogProvider');

    consoleError.mockRestore();
  });
});
