import { getAriaSort } from './list-table.utils';
import { ListTableRow } from './list-table-row';
import type { IListTableProps } from './list-table.types';
import styles from './list-table.module.css';

export function ListTable({
  tickets,
  prioritySort,
  onTogglePrioritySort,
  onEditTicket,
  onDeleteTicket,
  onStatusChange,
}: IListTableProps) {
  return (
    <div className={styles['table-wrapper']}>
      <table className={styles.table}>
        <thead>
          <tr className={styles['head-row']}>
            <th className={styles['head-cell']} scope="col">
              Title
            </th>
            <th className={styles['head-cell']} scope="col" aria-sort={getAriaSort(prioritySort)}>
              <button type="button" className={styles['sort-button']} onClick={onTogglePrioritySort}>
                Priority
                <span aria-hidden="true">{prioritySort === 'desc' ? '▾' : prioritySort === 'asc' ? '▴' : ''}</span>
              </button>
            </th>
            <th className={styles['head-cell']} scope="col">
              Status
            </th>
            <th className={styles['actions-head-cell']} scope="col">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <ListTableRow
              key={ticket.id}
              ticket={ticket}
              onEdit={() => onEditTicket(ticket)}
              onDelete={() => onDeleteTicket(ticket)}
              onStatusChange={(status) => onStatusChange(ticket, status)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
