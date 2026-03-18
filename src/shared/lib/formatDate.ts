import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.extend(relativeTime);
dayjs.locale('ko');

/**
 * 하이브리드 날짜 포맷 (Velog/GitHub 스타일)
 *
 * - 1분 미만     → "방금 전"
 * - 1시간 미만   → "15분 전"
 * - 24시간 미만  → "5시간 전"
 * - 48시간 미만  → "1일 전"
 * - 올해 안      → "2월 15일"
 * - 작년 이전    → "2024년 11월 5일"
 */
export function formatDate(isoString: string): string {
  const date = dayjs(isoString);
  const now = dayjs();
  const diffMin = now.diff(date, 'minute');
  const diffHour = now.diff(date, 'hour');

  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffHour < 48) return '1일 전';

  if (date.year() === now.year()) {
    return date.format('M월 D일');
  }
  return date.format('YYYY년 M월 D일');
}

/** 툴팁용 정확한 날짜 (예: 2026. 02. 25. 18:30) */
export function formatDateFull(isoString: string): string {
  return dayjs(isoString).format('YYYY. MM. DD. HH:mm');
}

/** 날짜+시간 (예: 2026년 2월 15일 14:30) */
export function formatDateTime(isoString: string): string {
  return dayjs(isoString).format('YYYY년 M월 D일 HH:mm');
}
