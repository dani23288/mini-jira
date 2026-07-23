import { useState, type SubmitEvent } from 'react';
import type { TicketPriority, TicketStatus } from '@org/types';
import { ASSIGNEES, DEFAULT_TICKET_PRIORITY, DEFAULT_TICKET_STATUS, TICKET_PRIORITIES, TICKET_STATUSES } from '@org/consts';
import { Button } from '../button/button';
import { DropdownMenu } from '../dropdown-menu/dropdown-menu';
import {
  DESCRIPTION_TEXTAREA_ROWS,
  TICKET_MODAL_SUBMIT_LABEL_BY_MODE,
  TICKET_MODAL_TITLE_BY_MODE,
} from './ticket-modal.consts';
import type { ITicketModalProps } from './ticket-modal.types';
import styles from './ticket-modal.module.css';

export function TicketModal({ mode, initialTicket, onClose, onSubmit }: ITicketModalProps) {
  const [title, setTitle] = useState(initialTicket?.title ?? '');
  const [description, setDescription] = useState(initialTicket?.description ?? '');
  const [priority, setPriority] = useState<TicketPriority>(initialTicket?.priority ?? DEFAULT_TICKET_PRIORITY);
  const [status, setStatus] = useState<TicketStatus>(initialTicket?.status ?? DEFAULT_TICKET_STATUS);
  const [assigneeId, setAssigneeId] = useState(initialTicket?.assigneeId ?? '');
  const [showTitleError, setShowTitleError] = useState(false);

  const priorityLabel = TICKET_PRIORITIES.find((option) => option.value === priority)?.label ?? priority;
  const statusLabel = TICKET_STATUSES.find((option) => option.value === status)?.label ?? status;
  const assigneeLabel = ASSIGNEES.find((option) => option.id === assigneeId)?.name ?? 'Unassigned';

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setShowTitleError(true);
      return;
    }
    onSubmit({
      title: trimmedTitle,
      description: description.trim() || undefined,
      priority,
      status,
      assigneeId: assigneeId || undefined,
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="ticket-modal-title" className={styles['modal-title']}>
          {TICKET_MODAL_TITLE_BY_MODE[mode]}
        </h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span className={styles.label}>Title</span>
            <input
              className={styles.input}
              type="text"
              value={title}
              autoFocus
              onChange={(event) => {
                setTitle(event.target.value);
                if (showTitleError) {
                  setShowTitleError(false);
                }
              }}
            />
            {showTitleError && <span className={styles['error-text']}>Title is required.</span>}
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Description</span>
            <textarea
              className={styles.textarea}
              value={description}
              rows={DESCRIPTION_TEXTAREA_ROWS}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>

          <div className={styles.row}>
            <div className={styles.field}>
              <span className={styles.label}>Priority</span>
              <DropdownMenu
                triggerLabel="Priority"
                align="left"
                triggerClassName={styles['field-trigger']}
                triggerContent={
                  <>
                    {priorityLabel} <span aria-hidden="true">▾</span>
                  </>
                }
                items={TICKET_PRIORITIES.map((option) => ({
                  label: option.label,
                  onSelect: () => setPriority(option.value),
                  isActive: option.value === priority,
                }))}
              />
            </div>

            <div className={styles.field}>
              <span className={styles.label}>Status</span>
              <DropdownMenu
                triggerLabel="Status"
                align="left"
                triggerClassName={styles['field-trigger']}
                triggerContent={
                  <>
                    {statusLabel} <span aria-hidden="true">▾</span>
                  </>
                }
                items={TICKET_STATUSES.map((option) => ({
                  label: option.label,
                  onSelect: () => setStatus(option.value),
                  isActive: option.value === status,
                }))}
              />
            </div>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Assignee</span>
            <DropdownMenu
              triggerLabel="Assignee"
              align="left"
              triggerClassName={styles['field-trigger']}
              triggerContent={
                <>
                  <bdi>{assigneeLabel}</bdi> <span aria-hidden="true">▾</span>
                </>
              }
              items={[
                { label: 'Unassigned', onSelect: () => setAssigneeId(''), isActive: assigneeId === '' },
                ...ASSIGNEES.map((assignee) => ({
                  label: assignee.name,
                  onSelect: () => setAssigneeId(assignee.id),
                  isActive: assigneeId === assignee.id,
                })),
              ]}
            />
          </div>

          <div className={styles.actions}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{TICKET_MODAL_SUBMIT_LABEL_BY_MODE[mode]}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
