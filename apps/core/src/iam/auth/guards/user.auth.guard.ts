import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  AppUnauthorizedException,
  ExceptionUnauthorizedEnum,
} from '@repo/system/errors/global.exceptions';
import { Request } from 'express';
import { FirebaseService } from '../../../libraries/firebase/firebase.service';

@Injectable()
export class UserAuthGuard implements CanActivate {
  private logger = new Logger(UserAuthGuard.name);
  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [req] = context.getArgs();
    const accessToken = this.extractTokenFromHeader(req);
    if (!accessToken) {
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.MISSING_ACCESS_TOKEN,
      );
    }

    let user;
    try {
      user = await this.firebaseService.verifyIdToken(accessToken);
    } catch (error) {
      this.logger.error(error, 'Error verifying ID token');
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.INVALID_ACCESS_TOKEN,
      );
    }

    if (!user.appId) {
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.USER_NOT_REGISTERED,
      );
    }

    req.user = user;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
