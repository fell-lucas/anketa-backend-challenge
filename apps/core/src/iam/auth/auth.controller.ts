import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExceptionUnauthorizedEnum } from '@repo/system/errors/global.exceptions';
import { User } from 'prisma/generated/user';
import { DeviceService } from '../device/device.service';
import { SessionService } from '../session/session.service';
import { UserService } from '../user/user.service';
import { AuthPhoneService } from './auth.phone.service';
import { AuthRequest } from './auth.request';
import { AuthService } from './auth.service';
import { CheckSignupDto, CheckSignupResponseDto } from './dto/check-signup.dto';
import { RegisterDto } from './dto/register.dto';
import { UsernameStatusDto } from './dto/username-status.dto';
import {
  UpdatePhoneNumberDto,
  VerifyPhoneNumberDto,
  VerifyPhoneNumberResponseDto,
} from './dto/verify-phone.dto';
import { UserAuthGuard } from './guards/user.auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private devicesService: DeviceService,
    private sessionService: SessionService,
    private usersService: UserService,
    private authPhoneService: AuthPhoneService,
  ) {}

  @ApiOperation({
    summary: 'Check if signup is allowed for a specific email',
  })
  @Post('sign-up/check')
  async checkSignup(
    @Body() data: CheckSignupDto,
  ): Promise<CheckSignupResponseDto> {
    const allowed = await this.authService.checkSignupAllowed(data.email);
    if (!allowed) {
      return {
        allowed,
        reason: ExceptionUnauthorizedEnum.SIGN_UP_TEMPORARILY_RESTRICTED,
      };
    }
    return { allowed };
  }

  /**
   * Login a user return the JWT token
   */
  @ApiOperation({
    summary: 'Register the user if new or update if already exists',
  })
  @Post('me')
  async register(
    @Body() data: RegisterDto,
    @Request() req: AuthRequest,
  ): Promise<User> {
    const user = await this.authService.loginOrSignup(req, data);
    // TODO: we might want to do this in every request (in a Guard), but it will be heavy on the DB, we should use Redis for these usecases:
    await this.devicesService.registerDevice(req, data);
    await this.sessionService.registerSession(req);

    return user;
  }

  /**
   * Login endpoint to notify backend of user login and assign daily active user points
   */
  @ApiOperation({
    summary: 'Notify backend of user login and assign daily active user points',
  })
  @Post('login')
  @UseGuards(UserAuthGuard)
  async login(@Request() req: AuthRequest): Promise<{ success: boolean }> {
    // Register device and session
    await this.devicesService.registerDevice(req);
    await this.sessionService.registerSession(req);

    // Unschedule user deletion if it was previously scheduled (user is active again)
    await this.usersService.unscheduleUserDeletion(req.user.appId);

    return {
      success: true,
    };
  }

  @ApiOperation({
    summary: 'Update the email of a user from the new JWT Token from Firebase',
  })
  @Patch('email')
  async changeEmail(@Request() req: AuthRequest): Promise<User> {
    return await this.authService.changeEmail(req);
  }

  @ApiOperation({
    summary: 'Check if the username is available',
  })
  @Get('username/:username/status')
  @UseGuards(UserAuthGuard)
  async usernameStatus(
    @Param('username') username: string,
  ): Promise<UsernameStatusDto> {
    return { taken: await this.usersService.usernameTaken(username) };
  }

  @ApiOperation({ summary: 'Verify phone number' })
  @Post('phone/verify')
  @UseGuards(UserAuthGuard)
  async verifyPhoneNumber(
    @Request() req: AuthRequest,
    @Body() data: VerifyPhoneNumberDto,
  ): Promise<VerifyPhoneNumberResponseDto> {
    // TODO: we need to register the device and session on every request, but it will be heavy on the DB, we should use Redis for these usecases:
    await this.devicesService.registerDevice(req);
    await this.sessionService.registerSession(req);

    const verificationId = await this.authPhoneService.verifyPhoneNumber(
      req.user.appId,
      req.appSession.id,
      data.phoneNumber,
    );
    return { verificationId };
  }

  @ApiOperation({ summary: 'Update phone number' })
  @Patch('phone')
  @UseGuards(UserAuthGuard)
  async updatePhoneNumber(
    @Request() req: AuthRequest,
    @Body() data: UpdatePhoneNumberDto,
  ): Promise<User> {
    // TODO: we need to register the device and session on every request, but it will be heavy on the DB, we should use Redis for these usecases:
    await this.devicesService.registerDevice(req);
    await this.sessionService.registerSession(req);

    await this.authPhoneService.verifyPhoneNumberCode(
      data.verificationId,
      req.appSession.id,
      data.code,
    );
    return await this.usersService.findOne({ id: req.user.appId });
  }
}
