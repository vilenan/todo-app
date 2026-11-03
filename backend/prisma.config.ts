import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';
import { getDatabaseProvider } from './src/config/database';

const provider = getDatabaseProvider(
  process.env.DATABASE_URL ?? 'file:./dev.db',
);

export default defineConfig({
  schema:
    provider === 'sqlite'
      ? 'prisma/schema.prisma'
      : 'prisma/postgresql/schema.prisma',
  migrations: {
    path:
      provider === 'sqlite'
        ? 'prisma/migrations'
        : 'prisma/postgresql/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
