import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * The service to access the DB with Prisma.
 * NB: Because of how PrismaClient is generated, the db module can't be in @repo/system
 */
@Injectable()
export class DbService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
