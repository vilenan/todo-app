import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { getDatabaseProvider } from '../config/database';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const url = process.env.DATABASE_URL ?? 'file:./dev.db';
    const adapter =
      getDatabaseProvider(url) === 'postgresql'
        ? new PrismaPg({ connectionString: url })
        : new PrismaBetterSqlite3({ url });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
