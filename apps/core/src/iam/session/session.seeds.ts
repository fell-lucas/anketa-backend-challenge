import { Injectable } from '@nestjs/common';
import { Admin, User } from '@prisma/client';
import { Seeds } from '@repo/system/test/seeds.interface';
import { DbService } from '../../libraries/db/db.service';

@Injectable()
export class SessionSeeds implements Seeds {
  constructor(private db: DbService) {}

  user1: User;
  user2: User;
  admin: Admin;

  async seed(): Promise<void> {}
}
