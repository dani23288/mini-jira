export const DELETE_TICKET_CONFIRM_TITLE = 'Delete ticket?';
export const DELETE_TICKET_CONFIRM_LABEL = 'Delete';
export const DELETE_TICKET_CONFIRM_VARIANT = 'danger' as const;

export function getDeleteTicketConfirmBody(ticketTitle: string): string {
  return `"${ticketTitle}" will be permanently deleted.`;
}
