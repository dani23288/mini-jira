import { gql } from '@apollo/client';

// Board fetches all tickets unfiltered — status/priority filters stay client-side (board-view.tsx).
const TICKET_FIELDS = gql`
  fragment TicketFields on Ticket {
    id
    title
    description
    status
    priority
    assigneeId
    rank
    createdAt
  }
`;

export const TICKETS_QUERY = gql`
  ${TICKET_FIELDS}
  query Tickets {
    tickets {
      ...TicketFields
    }
  }
`;

export const CREATE_TICKET_MUTATION = gql`
  ${TICKET_FIELDS}
  mutation CreateTicket($input: CreateTicketInput!) {
    createTicket(input: $input) {
      ...TicketFields
    }
  }
`;

export const UPDATE_TICKET_MUTATION = gql`
  ${TICKET_FIELDS}
  mutation UpdateTicket($id: ID!, $input: UpdateTicketInput!) {
    updateTicket(id: $id, input: $input) {
      ...TicketFields
    }
  }
`;

export const DELETE_TICKET_MUTATION = gql`
  mutation DeleteTicket($id: ID!) {
    deleteTicket(id: $id)
  }
`;
