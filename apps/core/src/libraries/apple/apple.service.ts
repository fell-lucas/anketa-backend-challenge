import { Injectable } from '@nestjs/common';
import { AppError, AppErrorsEnum } from '@repo/system/errors/global.exceptions';
import verifyAppleToken from 'verify-apple-id-token';
import { AppConfigService } from '../config/app.config.service';

@Injectable()
export class AppleService {
  constructor(private readonly configService: AppConfigService) {}

  async verifyAppleIdToken(token: string, nonce?: string) {
    if (!this.configService.appleEnabled) {
      throw new AppError(AppErrorsEnum.APPLE_NOT_ENABLED);
    }

    const jwtClaims = await verifyAppleToken({
      idToken: token,
      clientId: this.configService.apple.clientId,
      nonce,
    });

    return jwtClaims;
  }
}
