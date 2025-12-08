import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class RequestEmailRecoveryDto {
  @IsString()
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;
}

export class VerifyEmailRecoveryOtpDto {
  @IsString()
  @IsNotEmpty()
  verificationId: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}

export class EmailRecoveryResponseDto {
  @IsString()
  @IsNotEmpty()
  verificationId: string;
}

export class EmailRecoveryResultDto {
  @IsString()
  @IsNotEmpty()
  email: string;
}
