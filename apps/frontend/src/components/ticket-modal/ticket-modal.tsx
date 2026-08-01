import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import type { TicketPriority, TicketStatus } from '@org/types';
import { ASSIGNEES, DEFAULT_TICKET_PRIORITY, DEFAULT_TICKET_STATUS, TICKET_PRIORITIES, TICKET_STATUSES } from '@org/consts';
import { Button } from '../button/button';
import { Modal } from '../modal/modal';
import { SelectField } from '../select-field/select-field';
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
  const triggerRef = useRef(document.activeElement as HTMLElement | null);

  useEffect(() => {
    return () => {
      triggerRef.current?.focus();
    };
  }, []);

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
    <Modal role="dialog" labelledBy="ticket-modal-title" onClose={onClose} className={styles.dialog}>
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
          <SelectField
            label="Priority"
            triggerLabel="Priority"
            value={priority}
            options={TICKET_PRIORITIES.map((option) => ({ value: option.value, label: option.label }))}
            onChange={(value) => setPriority(value as TicketPriority)}
          />

          <SelectField
            label="Status"
            triggerLabel="Status"
            value={status}
            options={TICKET_STATUSES.map((option) => ({ value: option.value, label: option.label }))}
            onChange={(value) => setStatus(value as TicketStatus)}
          />
        </div>

        <SelectField
          label="Assignee"
          triggerLabel="Assignee"
          value={assigneeId}
          options={[
            { value: '', label: 'Unassigned' },
            ...ASSIGNEES.map((assignee) => ({ value: assignee.id, label: assignee.name })),
          ]}
          onChange={setAssigneeId}
        />

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{TICKET_MODAL_SUBMIT_LABEL_BY_MODE[mode]}</Button>
        </div>
      </form>
    </Modal>
  );
}
