import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.extend(relativeTime);
dayjs.locale('ko');

export function formatTimeAgo(timestamp: string): string {
  return dayjs(timestamp).fromNow();
}

export function getFormattedLocation(location: string): string | null {
  if (!location?.trim()) {
    return null;
  }

  const reversedLocation = location.split(' ').reverse();

  return reversedLocation.length === 1
    ? reversedLocation.join(' ')
    : reversedLocation.slice(0, 2).reverse().join(' ');
}
