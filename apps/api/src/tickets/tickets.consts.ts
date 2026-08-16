// Equality filters: input field -> mongo field (same name today, but kept explicit so a
// renamed/derived mongo field doesn't have to fight this loop). Mongo-only mapping, not shared
// with the frontend, so it stays local instead of in @org/consts.
export const EQUALITY_FILTER_FIELDS: { input: 'status' | 'priority' | 'assigneeId'; mongo: string }[] = [
  { input: 'status', mongo: 'status' },
  { input: 'priority', mongo: 'priority' },
  { input: 'assigneeId', mongo: 'assigneeId' },
];
