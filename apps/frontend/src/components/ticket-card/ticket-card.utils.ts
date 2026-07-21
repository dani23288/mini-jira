export function getTapeRotation(ticketId: string): string {
  return ticketId.charCodeAt(0) % 2 === 0 ? '-1.5deg' : '1.5deg';
}
