import { Injectable, Logger } from '@nestjs/common';
import {
  TEST_ADMIN_1,
  TEST_USER_1,
  TEST_USER_1_BUT_CHANGED_EMAIL,
  TEST_USER_1_NOT_REGISTERED_BUT_SAME_EMAIL,
  TEST_USER_2,
  TEST_USER_2_BUT_CHANGED_EMAIL_CONFLICT,
  TEST_USER_3,
  TEST_USER_4,
  TEST_USER_5,
  TEST_USER_6,
  TEST_USER_NOT_REGISTERED,
} from '@repo/system/test/users.fixtures';
import firebaseAdmin from 'firebase-admin';
import {
  BatchResponse,
  Message,
} from 'node_modules/firebase-admin/lib/messaging/messaging-api';
import { AppConfigService } from '../config/app.config.service';
import { DbService } from '../db/db.service';
/**
 * A dev service that allows to use the API without a real Firebase account.
 */
@Injectable()
export class FirebaseTestService {
  private logger = new Logger(FirebaseTestService.name);

  static readonly users: firebaseAdmin.auth.DecodedIdToken[] = [
    TEST_ADMIN_1,
    TEST_USER_1,
    TEST_USER_2,
    TEST_USER_3,
    TEST_USER_NOT_REGISTERED,
    TEST_USER_1_NOT_REGISTERED_BUT_SAME_EMAIL,
    TEST_USER_1_BUT_CHANGED_EMAIL,
    TEST_USER_2_BUT_CHANGED_EMAIL_CONFLICT,
    TEST_USER_4,
    TEST_USER_5,
    TEST_USER_6,
  ];

  constructor(
    private configService: AppConfigService,
    private db: DbService,
  ) {
    if (!['development', 'test'].includes(process.env.NODE_ENV)) {
      throw new Error('FirebaseTestService is only available in development');
    }
    this.logger.log('🚧 Simulating Firebase Login');
  }

  async verifyIdToken(
    token: string,
    checkRevoked = false,
  ): Promise<firebaseAdmin.auth.DecodedIdToken> {
    const user = FirebaseTestService.users.find((user) => user.token === token);
    if (!user) {
      throw new Error('Firebase User not found');
    }

    return user;
  }

  async setCustomClaims(uid: string, claims: Record<string, any>) {
    const user = FirebaseTestService.users.find((user) => user.uid === uid);
    if (!user) {
      throw new Error('User not found');
    }
    user.customClaims = claims;
    return user;
  }

  async deleteUser(uid: string): Promise<void> {
    const user = FirebaseTestService.users.find((user) => user.uid === uid);
    if (!user) {
      throw new Error('User not found');
    }
    user.deletedAt = new Date();
  }

  async sendFCMNotification(message: Message): Promise<string> {
    return '123';
  }

  async sendFCMNotificationsBatch(messages: Message[]): Promise<BatchResponse> {
    return {
      successCount: 1,
      failureCount: 0,
      responses: [],
    };
  }
}
