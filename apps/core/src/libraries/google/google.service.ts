import { Injectable } from '@nestjs/common';
import { AppError, AppErrorsEnum } from '@repo/system/errors/global.exceptions';
import { OAuth2Client } from 'google-auth-library';
import { AppConfigService } from '../config/app.config.service';
@Injectable()
export class GoogleService {
  private client: OAuth2Client;
  constructor(private readonly configService: AppConfigService) {
    if (this.configService.googleEnabled) {
      this.client = new OAuth2Client({
        clientId: this.configService.google.clientId,
      });
    }
  }

  async verifyGoogleIdToken(token: string) {
    if (!this.client) {
      throw new AppError(AppErrorsEnum.GOOGLE_CLIENT_NOT_INITIALIZED);
    }

    const decodedToken = await this.client.verifyIdToken({
      idToken: token,
      audience: this.configService.google.clientId,
    });
    return decodedToken.getPayload();
  }
}
