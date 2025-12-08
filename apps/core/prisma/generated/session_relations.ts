import { Device } from './device';
import { User } from './user';
import { Admin } from './admin';
import { PhoneVerificationAttempt } from './phone_verification_attempt';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SessionRelations {
  @ApiProperty({ type: () => Device })
  device: Device;

  @ApiPropertyOptional({ type: () => User })
  user?: User;

  @ApiPropertyOptional({ type: () => Admin })
  admin?: Admin;

  @ApiProperty({ isArray: true, type: () => PhoneVerificationAttempt })
  phoneVerificationAttempts: PhoneVerificationAttempt[];
}
