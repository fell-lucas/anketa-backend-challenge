import { Injectable } from '@nestjs/common';
import { Admin } from '@prisma/client';
import { Seeds } from '@repo/system/test/seeds.interface';
import { TEST_ADMIN_1 } from '@repo/system/test/users.fixtures';
import { DbService } from '../../libraries/db/db.service';

@Injectable()
export class AdminSeeds implements Seeds {
  constructor(private db: DbService) {}

  admin: Admin;

  async seed(): Promise<void> {
    await this.createAdmins();
  }

  async createAdmins() {
    this.admin = await this.db.admin.create({
      data: {
        id: TEST_ADMIN_1.appId,
        name: TEST_ADMIN_1.name,
        email: TEST_ADMIN_1.email,
        firebaseUid: TEST_ADMIN_1.uid,
        role: 'manager',
      },
    });
  }
}
