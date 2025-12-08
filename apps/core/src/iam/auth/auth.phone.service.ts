import { Injectable, Logger } from '@nestjs/common';
import {
  AppUnauthorizedException,
  ExceptionUnauthorizedEnum,
  UserError,
  UserErrorsEnum,
} from '@repo/system/errors/global.exceptions';
import ms from 'ms';
import { AwsService } from 'src/libraries/aws/aws.service';
import { AppConfigService } from 'src/libraries/config/app.config.service';
import { DbService } from 'src/libraries/db/db.service';
import { UserService } from '../user/user.service';
export enum PhoneVerificationAttemptStatusEnum {
  PENDING = 'pending',
  VERIFIED = 'verified',
}

@Injectable()
export class AuthPhoneService {
  private readonly logger = new Logger(AuthPhoneService.name);

  constructor(
    private readonly awsService: AwsService,
    private readonly db: DbService,
    private readonly userService: UserService,
    private readonly configService: AppConfigService,
  ) {}

  get demoAccountAppId() {
    return this.configService.auth.demoAccountAppId;
  }

  async verifyPhoneNumber(
    userAppId: string,
    sessionId: string,
    phoneNumber: string,
  ) {
    phoneNumber = phoneNumber.trim();

    const user = await this.userService.findOne({ id: userAppId });

    if (!user) {
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.MISSING_USER,
      );
    }

    const existingPhone = await this.db.user.findUnique({
      where: { phoneNumber },
    });
    if (existingPhone && existingPhone.id !== userAppId) {
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.PHONE_NUMBER_ALREADY_BELONGS_TO_USER,
      );
    }

    const existingPhoneVerificationAttempt =
      await this.db.phoneVerificationAttempt.findFirst({
        where: {
          phone: phoneNumber,
          createdAt: {
            gt: new Date(
              Date.now() -
                parseInt(
                  ms(this.configService.auth.phoneVerificationRetryInterval),
                ),
            ),
          },
        },
      });

    if (existingPhoneVerificationAttempt) {
      throw new UserError(UserErrorsEnum.PHONE_NUMBER_WAITING_FOR_RETRY);
    }

    const existingPhoneVerificationAttemptsToday =
      await this.db.phoneVerificationAttempt.count({
        where: {
          phone: phoneNumber,
          createdAt: {
            gte: new Date(Date.now() - ms('1d')),
          },
        },
      });

    if (
      existingPhoneVerificationAttemptsToday >=
      this.configService.auth.phoneVerificationMaxAttemptsInDay
    ) {
      throw new UserError(UserErrorsEnum.PHONE_NUMBER_TOO_MANY_ATTEMPTS);
    }

    let code = this.generateCode();

    if (this.demoAccountAppId === userAppId) {
      this.logger.warn(
        '⚠️ WARNING!! Simulating OTP with 0000 for DEMO Account!',
      );
      code = '0000';
    }

    const callResult = await this.awsService.sendSMS(
      phoneNumber,
      this.smsTemplate(code),
    );

    const phoneVerification = await this.db.phoneVerificationAttempt.create({
      data: {
        snsMessageId: callResult.MessageId,
        otp: code,
        user: { connect: { id: user.id } },
        phone: phoneNumber,
        session: { connect: { id: sessionId } },
        status: PhoneVerificationAttemptStatusEnum.PENDING,
        createdAt: new Date(),
        expiresAt: new Date(
          Date.now() +
            ms(this.configService.auth.phoneVerificationAttemptExpiration),
        ),
        updatedAt: new Date(),
      },
    });
    return phoneVerification.id;
  }

  async verifyPhoneNumberCode(
    phoneVerificationId: string,
    sessionId: string,
    code: string,
  ) {
    const phoneVerification = await this.db.phoneVerificationAttempt.findUnique(
      {
        where: { id: phoneVerificationId },
      },
    );

    if (!phoneVerification) {
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.PHONE_NUMBER_VERIFICATION_NOT_FOUND,
      );
    }

    if (phoneVerification.expiresAt < new Date()) {
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.PHONE_NUMBER_EXPIRED,
      );
    }

    if (
      phoneVerification.status !== PhoneVerificationAttemptStatusEnum.PENDING
    ) {
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.PHONE_NUMBER_ALREADY_VERIFIED,
      );
    }

    if (phoneVerification.sessionId !== sessionId) {
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.PHONE_NUMBER_NOT_BELONGS_TO_SESSION,
      );
    }

    if (phoneVerification.otp.trim() !== code.trim()) {
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.PHONE_NUMBER_CODE_NOT_MATCH,
      );
    }

    await this.db.$transaction(async (tx) => {
      await tx.phoneVerificationAttempt.update({
        where: { id: phoneVerificationId },
        data: { status: PhoneVerificationAttemptStatusEnum.VERIFIED },
      });

      const existingPhone = await tx.user.findUnique({
        where: { phoneNumber: phoneVerification.phone },
      });
      if (existingPhone && existingPhone.id !== phoneVerification.userId) {
        throw new AppUnauthorizedException(
          ExceptionUnauthorizedEnum.PHONE_NUMBER_ALREADY_BELONGS_TO_USER,
        );
      }

      await tx.user.update({
        where: { id: phoneVerification.userId },
        data: { phoneNumber: phoneVerification.phone },
      });
    });
    return {
      verified: true,
      phoneVerification,
    };
  }

  protected generateCode() {
    if (this.configService.auth.simulateOtp) {
      this.logger.warn('WARNING!! Simulating OTP with 0000');
      return '0000';
    }
    return Math.floor(1000 + Math.random() * 9000)
      .toString()
      .trim();
  }

  protected smsTemplate(code: string) {
    return `Your verification code is ${code}`;
  }
}
