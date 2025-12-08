import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class VerifyPhoneNumberDto {
  @IsString()
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;
}

export class VerifyPhoneNumberResponseDto {
  @IsString()
  @IsNotEmpty()
  verificationId: string;
}

export class UpdatePhoneNumberDto {
  @IsString()
  @IsNotEmpty()
  verificationId: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
