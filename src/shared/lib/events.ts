/**
 * 앱 전체에서 사용하는 window 커스텀 이벤트 이름 상수
 * 발행(dispatchEvent)과 수신(addEventListener) 양쪽에서 이 상수를 사용해야 합니다.
 */
export const APP_EVENTS = {
  /** Axios 인터셉터에서 401 응답 감지 시 발행 */
  AUTH_LOGOUT: 'auth:logout',
} as const;
