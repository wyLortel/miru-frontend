// Hierarchical query key factory for alarms
export const alarmQueryKeys = {
  hasUnread: () => ['alarms', 'has-unread'] as const,
  items: () => ['alarms', 'items'] as const, // Common parent for list/infinite
  list: (page: number) => ['alarms', 'items', 'list', page] as const,
  infinite: () => ['alarms', 'items', 'infinite'] as const,
};
