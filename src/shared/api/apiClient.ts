import axios from 'axios';
import { APP_EVENTS } from '@/shared/lib/events';

export const apiClient = axios.create({
  baseURL: '',
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

/* ⭐ XSRF 토큰 수동 주입 */

apiClient.interceptors.request.use((config) => {
  if (typeof document !== 'undefined') {
    const xsrfToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
    if (xsrfToken) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
    }
  }
  return config;
});

/* ⭐ 세션 만료 자동 처리 */

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url ?? '';
    if (err.response?.status === 401 && !url.includes('/api/me')) {
      window.dispatchEvent(new Event(APP_EVENTS.AUTH_LOGOUT));
    }

    return Promise.reject(err);
  },
);
