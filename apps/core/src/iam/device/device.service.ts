import { Injectable, Logger } from '@nestjs/common';
import { Device, Prisma } from '@prisma/client';
import {
  AppUnauthorizedException,
  ExceptionUnauthorizedEnum,
} from '@repo/system/errors/global.exceptions';
import { AppConfigService } from 'src/libraries/config/app.config.service';
import { DbService } from 'src/libraries/db/db.service';
import { AuthRequest } from '../auth/auth.request';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { Role } from '@repo/system/iam/roles';

@Injectable()
export class DeviceService {
  private readonly logger = new Logger(DeviceService.name);
  constructor(
    private readonly dbService: DbService,
    private readonly configService: AppConfigService,
  ) {}

  async registerDevice(req: AuthRequest, data?: RegisterDeviceDto) {
    const userAgent = req.header('User-Agent');
    const platformDeviceId = req.header('platform-device-id');

    this.logger.debug('Registering device', {
      userAgent,
      platformDeviceId,
    });

    if (!userAgent) {
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.MISSING_USER_AGENT,
      );
    }

    if (!platformDeviceId) {
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.MISSING_PLATFORM_DEVICE_ID,
      );
    }

    let user;
    if (req.user?.appId && req.user?.role == Role.USER) {
      user = await this.dbService.user.findUnique({
        where: {
          id: req.user?.appId,
        },
      });
    }

    let admin;
    if (req.user?.appId && req.user?.role == Role.ADMIN) {
      admin = await this.dbService.admin.findUnique({
        where: {
          id: req.user?.appId,
        },
      });
    }

    // NB: can't use upsert because platformDeviceId is not unique,
    // and we need to order by lastSeenAt:
    const existingDevice = await this.dbService.device.findFirst({
      where: {
        platformDeviceId,
      },
      orderBy: {
        lastSeenAt: 'desc',
      },
    });

    const deviceData: Prisma.DeviceUpsertArgs['create'] = {
      platformDeviceId,
      fcmToken: data?.fcmToken,
      ...(user?.id && { userId: user?.id }),
      ...(admin?.id && { adminId: admin?.id }),
      userAgent,
      isDisabled: false,
      name: userAgent,
      lastSeenAt: new Date(),
      updatedAt: new Date(),
    };

    let device: Device;
    if (!existingDevice) {
      device = await this.dbService.device.create({
        data: {
          ...deviceData,
          createdAt: new Date(),
        },
      });
    } else {
      device = await this.dbService.device.update({
        where: {
          id: existingDevice?.id,
        },
        data: {
          ...deviceData,
        },
      });
    }

    req.device = device;
  }
}
