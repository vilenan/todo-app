export function formatDate(date: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'UTC',
  }).format(new Date(date));
}
