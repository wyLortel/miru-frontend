import { apiClient } from '@/shared/api/apiClient';
import { HasUnreadResponse, AlarmsListResponse } from '../model/types';

export const alarmApi = {
  getHasUnread: async (): Promise<HasUnreadResponse> => {
    const { data } = await apiClient.get('/api/alarms/has-unread');
    return data.data;
  },

  getAlarms: async (page: number): Promise<AlarmsListResponse> => {
    const { data } = await apiClient.get('/api/alarms', { params: { page } });
    return data.data;
  },
};
