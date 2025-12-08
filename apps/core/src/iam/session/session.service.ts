import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Session } from '@prisma/client';
import {
  AppUnauthorizedException,
  ExceptionUnauthorizedEnum,
} from '@repo/system/errors/global.exceptions';
import ms from 'ms';
import { AppConfigService } from 'src/libraries/config/app.config.service';
import { DbService } from 'src/libraries/db/db.service';
import { AuthRequest } from '../auth/auth.request';
import { Role } from '@repo/system/iam/roles';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);
  constructor(
    private readonly dbService: DbService,
    private readonly configService: AppConfigService,
  ) {}

  async registerSession(req: AuthRequest) {
    const deviceId = req.device.id;

    if (!deviceId) {
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.MISSING_PLATFORM_DEVICE_ID,
      );
    }

    const appSession = await this.dbService.session.findFirst({
      where: {
        deviceId,
        ...(req.user?.appId &&
          req.user?.role == Role.USER && { userId: req.user?.appId }),
        ...(req.user?.appId &&
          req.user?.role == Role.ADMIN && { adminId: req.user?.appId }),
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    const newSession: Prisma.SessionUpsertArgs['create'] = {
      ...(req.user?.appId &&
        req.user?.role == Role.USER && { userId: req.user?.appId }),
      ...(req.user?.appId &&
        req.user?.role == Role.ADMIN && { adminId: req.user?.appId }),
      deviceId,
      lastSeenAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(
        Date.now() + ms(this.configService.auth.jwtExpiration),
      ),
    };

    let session: Session;
    if (
      !appSession?.id &&
      !appSession?.userId &&
      !appSession?.adminId &&
      !appSession?.deviceId
    ) {
      // Create new session
      session = await this.dbService.session.create({
        data: newSession,
      });
      this.logger.debug('Registered new session', {
        sessionId: session.id,
      });
    } else {
      // Match not expired session from id, then user and finally device id
      session = await this.dbService.session.upsert({
        where: {
          ...(appSession?.id && { id: appSession.id }),
          ...(appSession?.userId && { userId: appSession.userId }),
          ...(appSession?.adminId && { adminId: appSession.adminId }),
          deviceId,
          expiresAt: {
            gte: new Date(),
          },
        },
        update: {
          ...newSession,
        },
        create: {
          ...newSession,
          createdAt: new Date(),
        },
      });
      this.logger.debug('Renewed session', {
        sessionId: session.id,
      });
    }

    req.appSession = session;

    return session;
  }
}
