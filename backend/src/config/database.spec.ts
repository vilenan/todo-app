import { getDatabaseProvider } from './database';

describe('database provider', () => {
  it('uses SQLite for local file databases', () => {
    expect(getDatabaseProvider('file:./dev.db')).toBe('sqlite');
  });

  it('uses PostgreSQL for both supported URL schemes', () => {
    expect(getDatabaseProvider('postgresql://localhost/todo')).toBe(
      'postgresql',
    );
    expect(getDatabaseProvider('postgres://localhost/todo')).toBe('postgresql');
  });

  it('rejects unknown connection strings', () => {
    expect(() => getDatabaseProvider('mysql://localhost/todo')).toThrow();
  });
});
