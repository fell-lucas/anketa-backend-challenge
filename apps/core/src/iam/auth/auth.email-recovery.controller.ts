import { Body, Controller, HttpCode, Post, Request } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AppUnauthorizedException,
  ExceptionUnauthorizedEnum,
} from '@repo/system/errors/global.exceptions';
import { DeviceService } from '../device/device.service';
import { SessionService } from '../session/session.service';
import { UserService } from '../user/user.service';
import { AuthPhoneService } from './auth.phone.service';
import { AuthRequest } from './auth.request';
import {
  EmailRecoveryResponseDto,
  EmailRecoveryResultDto,
  RequestEmailRecoveryDto,
  VerifyEmailRecoveryOtpDto,
} from './dto/email-recovery.dto';

@Controller('auth/email-recovery')
@ApiTags('Auth')
export class AuthEmailRecoveryController {
  constructor(
    private readonly authPhoneService: AuthPhoneService,
    private readonly devicesService: DeviceService,
    private readonly sessionService: SessionService,
    private readonly usersService: UserService,
  ) {}

  @Post('verify-phone')
  @ApiOperation({ summary: 'Request email recovery using phone number' })
  async requestEmailRecovery(
    @Request() req: AuthRequest,
    @Body() data: RequestEmailRecoveryDto,
  ): Promise<EmailRecoveryResponseDto> {
    // Register device and session for the recovery attempt
    await this.devicesService.registerDevice(req);
    await this.sessionService.registerSession(req);

    // Find user by phone number first
    const user = await this.usersService.findOne({
      phoneNumber: data.phoneNumber,
    });
    if (!user) {
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.PHONE_NUMBER_NOT_FOUND,
      );
    }

    if (!user?.email) {
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.MISSING_EMAIL,
      );
    }

    // Use the existing phone verification service to send OTP
    const verificationId = await this.authPhoneService.verifyPhoneNumber(
      user.id,
      req.appSession.id,
      data.phoneNumber,
    );

    return { verificationId };
  }

  @Post('verify-otp')
  @HttpCode(200)
  @ApiOperation({ summary: 'Verify OTP and recover email' })
  async verifyEmailRecoveryOtp(
    @Request() req: AuthRequest,
    @Body() data: VerifyEmailRecoveryOtpDto,
  ): Promise<EmailRecoveryResultDto> {
    // Register device and session for the verification
    await this.devicesService.registerDevice(req);
    await this.sessionService.registerSession(req);

    // Verify the OTP using existing phone verification service
    const { verified, phoneVerification } =
      await this.authPhoneService.verifyPhoneNumberCode(
        data.verificationId,
        req.appSession.id,
        data.code,
      );

    if (!verified) {
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.PHONE_NUMBER_CODE_NOT_MATCH,
      );
    }

    const user = await this.usersService.findOne({
      id: phoneVerification.userId,
    });

    if (!user) {
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.MISSING_USER,
      );
    }

    if (!user?.email) {
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.MISSING_EMAIL,
      );
    }

    return { email: user.email };
  }
}
