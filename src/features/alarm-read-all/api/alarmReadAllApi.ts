import { apiClient } from '@/shared/api/apiClient';

export const alarmReadAllApi = {
  readAll: async (): Promise<void> => {
    await apiClient.patch('/api/alarms/read-all');
  },
};
