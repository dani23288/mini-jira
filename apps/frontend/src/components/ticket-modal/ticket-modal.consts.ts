import type { TicketModalMode } from './ticket-modal.types';

export const DESCRIPTION_TEXTAREA_ROWS = 3;

export const TICKET_MODAL_TITLE_BY_MODE: Record<TicketModalMode, string> = {
  create: 'New ticket',
  edit: 'Edit ticket',
};

export const TICKET_MODAL_SUBMIT_LABEL_BY_MODE: Record<TicketModalMode, string> = {
  create: 'Create ticket',
  edit: 'Save changes',
};
