import { Injectable } from '@nestjs/common';
import firebaseAdmin from 'firebase-admin';
import {
  BatchResponse,
  Message,
} from 'node_modules/firebase-admin/lib/messaging/messaging-api';
import { AppConfigService } from '../config/app.config.service';

@Injectable()
export class FirebaseService {
  app: firebaseAdmin.app.App;

  constructor(private configService: AppConfigService) {
    this.initialize();
  }

  private initialize() {
    this.app = firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert({
        projectId: this.configService.firebase.projectId,
        clientEmail: this.configService.firebase.clientEmail,
        // replace `\` and `n` character pairs w/ single `\n` character
        privateKey: this.configService.firebase.privateKey?.replace(
          /\\n/g,
          '\n',
        ),
      }),
    });
  }

  async verifyIdToken(
    token: string,
    checkRevoked = false,
  ): Promise<firebaseAdmin.auth.DecodedIdToken> {
    return this.auth.verifyIdToken(token, checkRevoked);
  }

  async setCustomClaims(uid: string, claims: Record<string, any>) {
    await this.auth.setCustomUserClaims(uid, claims);
  }

  async deleteUser(uid: string): Promise<void> {
    try {
      await this.auth.deleteUser(uid);
    } catch (error) {
      // If user doesn't exist in Firebase, that's fine - they're already "deleted"
      if (error.code === 'auth/user-not-found') {
        return;
      }
      throw error;
    }
  }

  private get messaging(): firebaseAdmin.messaging.Messaging {
    return this.app.messaging();
  }

  private get auth(): firebaseAdmin.auth.Auth {
    return this.app.auth();
  }

  private get firestore(): firebaseAdmin.firestore.Firestore {
    return this.app.firestore();
  }

  async sendFCMNotification(message: Message): Promise<string> {
    return this.messaging.send(message);
  }

  async sendFCMNotificationsBatch(messages: Message[]): Promise<BatchResponse> {
    return this.messaging.sendEach(messages);
  }
}
