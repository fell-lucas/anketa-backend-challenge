import { Controller, Post, Request } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeviceService } from '../../device/device.service';
import { SessionService } from '../../session/session.service';
import { AdminAuthService } from './admin.auth.service';
import { AuthRequest } from '../auth.request';
import { Admin } from '@prisma/client';

@Controller('brainbox/auth')
@ApiTags('Admin Auth')
export class AdminAuthController {
  constructor(
    private adminAuthService: AdminAuthService,
    private devicesService: DeviceService,
    private sessionService: SessionService,
  ) {}

  /**
   * Login a user return the JWT token
   */
  @ApiOperation({
    summary: 'Login the admin & return the admin object',
  })
  @Post('login')
  async login(@Request() req: AuthRequest): Promise<Admin> {
    const user = await this.adminAuthService.login(req);

    // TODO: we might want to do this in every request (in a Guard), but it will be heavy on the DB, we should use Redis for these usecases:
    await this.devicesService.registerDevice(req);
    await this.sessionService.registerSession(req);

    return user;
  }
}
