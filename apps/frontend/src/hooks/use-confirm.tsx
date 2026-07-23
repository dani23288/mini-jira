import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { ConfirmDialog } from '../components/confirm-dialog/confirm-dialog';
import type { IConfirmOptions } from '../components/confirm-dialog/confirm-dialog.types';

type ConfirmFn = (options: IConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<IConfirmOptions | null>(null);
  const resolveRef = useRef<((result: boolean) => void) | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const confirm = useCallback<ConfirmFn>((options) => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    setRequest(options);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const settle = (result: boolean) => {
    setRequest(null);
    resolveRef.current?.(result);
    resolveRef.current = null;
    triggerRef.current?.focus();
    triggerRef.current = null;
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {request && <ConfirmDialog {...request} onConfirm={() => settle(true)} onCancel={() => settle(false)} />}
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmFn {
  const confirm = useContext(ConfirmContext);
  if (!confirm) {
    throw new Error('useConfirm must be used within a ConfirmDialogProvider');
  }
  return confirm;
}
