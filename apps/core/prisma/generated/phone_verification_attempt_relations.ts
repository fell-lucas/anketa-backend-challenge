import { Session } from './session';
import { User } from './user';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class PhoneVerificationAttemptRelations {
  @ApiPropertyOptional({ type: () => Session })
  session?: Session;

  @ApiProperty({ type: () => User })
  user: User;
}
