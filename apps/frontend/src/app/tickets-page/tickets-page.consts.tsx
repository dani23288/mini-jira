import type { ReactNode } from 'react';
import type { IBoardViewProps } from '../board/board-view.types';
import type { ButtonVariant } from '../../components/button/button.types';
import { BoardView } from '../board/board-view';
import { ListView } from '../list/list-view';

export type TicketsView = 'board' | 'list';

export const DELETE_TICKET_CONFIRM_TITLE = 'Delete ticket?';
export const DELETE_TICKET_CONFIRM_LABEL = 'Delete';
export const DELETE_TICKET_CONFIRM_VARIANT = 'danger' as const;

export function getDeleteTicketConfirmBody(ticketTitle: string): string {
  return `"${ticketTitle}" will be permanently deleted.`;
}

export const BUTTON_VARIANT_BY_ACTIVE: Record<'true' | 'false', ButtonVariant> = {
  true: 'primary',
  false: 'secondary',
};

export function createViewConfigByMode({
  tickets,
  onEditTicket,
  onDeleteTicket,
  onStatusChange,
  moveTicket,
}: IBoardViewProps): Record<TicketsView, { label: string; element: ReactNode }> {
  return {
    board: {
      label: 'Board',
      element: (
        <BoardView
          tickets={tickets}
          onEditTicket={onEditTicket}
          onDeleteTicket={onDeleteTicket}
          onStatusChange={onStatusChange}
          moveTicket={moveTicket}
        />
      ),
    },
    list: {
      label: 'List',
      element: (
        <ListView
          tickets={tickets}
          onEditTicket={onEditTicket}
          onDeleteTicket={onDeleteTicket}
          onStatusChange={onStatusChange}
        />
      ),
    },
  };
}
