import { IsOptional, IsString } from 'class-validator';

export class RegisterDeviceDto {
  @IsString()
  @IsOptional()
  fcmToken?: string;
}
