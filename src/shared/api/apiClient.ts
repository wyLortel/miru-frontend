import axios from 'axios';
import { APP_EVENTS } from '@/shared/lib/events';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

// 요청 인터셉터: XSRF 토큰을 헤더에 자동으로 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];

    if (token) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/* ⭐ 세션 만료 자동 처리 */

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.dispatchEvent(new Event(APP_EVENTS.AUTH_LOGOUT));
    }

    return Promise.reject(err);
  },
);
