import { Injectable, Logger } from '@nestjs/common';
import {
  AppUnauthorizedException,
  ExceptionUnauthorizedEnum,
} from '@repo/system/errors/global.exceptions';
import { Role } from '@repo/system/iam/roles';
import { AuthRequest } from '../auth.request';
import { Admin } from '@prisma/client';
import { AdminService } from '../../admin/admin.service';
import { FirebaseService } from '../../../libraries/firebase/firebase.service';
@Injectable()
export class AdminAuthService {
  private readonly logger = new Logger(AdminAuthService.name);

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly adminService: AdminService,
  ) {}

  async login(request: AuthRequest): Promise<Admin> {
    // We need the access token to checkRevoked in verifyIdToken:
    console.log('authorization:', !!request.headers['authorization']);
    console.log('authorization:', request.headers['authorization']);
    const accessToken = request.headers['authorization']?.split(' ')[1];
    console.log('accessToken:', accessToken);
    if (!accessToken) {
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.MISSING_ACCESS_TOKEN,
      );
    }

    let decodedToken;
    try {
      decodedToken = await this.firebaseService.verifyIdToken(
        accessToken,
        true,
      );
    } catch (error) {
      this.logger.error(error, 'Error verifying ID token');
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.INVALID_ACCESS_TOKEN,
      );
    }

    const user = await this.adminService.getAuthUser(decodedToken);

    if (!decodedToken.appId || decodedToken.appId !== user.id) {
      const customClaims = {
        appId: user.id,
        role: Role.ADMIN,
      };
      await this.firebaseService.setCustomClaims(
        decodedToken.uid,
        customClaims,
      );

      //NB: in the client we need to refresh the token to get the new custom claims
      Object.assign(decodedToken, customClaims);
    }

    // Register the user for the rest of this request:
    request.user = decodedToken;
    return user;
  }
}
