import { useState, type SubmitEvent } from 'react';
import type { TicketPriority, TicketStatus } from '@org/types';
import { DEFAULT_TICKET_PRIORITY, DEFAULT_TICKET_STATUS, TICKET_PRIORITIES, TICKET_STATUSES } from '@org/consts';
import { Button } from '../button/button';
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
  const [showTitleError, setShowTitleError] = useState(false);

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
            <label className={styles.field}>
              <span className={styles.label}>Priority</span>
              <select
                className={styles.select}
                value={priority}
                onChange={(event) => setPriority(event.target.value as TicketPriority)}
              >
                {TICKET_PRIORITIES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Status</span>
              <select
                className={styles.select}
                value={status}
                onChange={(event) => setStatus(event.target.value as TicketStatus)}
              >
                {TICKET_STATUSES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
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
