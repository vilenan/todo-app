export function getDatabaseProvider(url: string): 'sqlite' | 'postgresql' {
  if (url.startsWith('file:')) return 'sqlite';
  if (url.startsWith('postgresql:') || url.startsWith('postgres:')) {
    return 'postgresql';
  }
  throw new Error('DATABASE_URL must use file:, postgres:, or postgresql:');
}
