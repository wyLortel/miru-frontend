// Alarm types with extensibility for future types
export type AlarmType = 'COMMENT' | 'INQUIRY' | (string & {});

export interface AlarmItem {
  id: number;
  type: AlarmType;
  content: string;
  senderNickname: string;
  targetUrl: string;
  isRead: boolean;
  createdAt: string; // "2026.03.11" format — displayed as-is from backend
}

export interface HasUnreadResponse {
  hasUnread: boolean;
}

export interface AlarmsListResponse {
  totalCount: number;
  items: AlarmItem[];
}
