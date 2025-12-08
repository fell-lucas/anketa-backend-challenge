import { User } from './user';
import { Admin } from './admin';
import { Session } from './session';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class DeviceRelations {
  @ApiPropertyOptional({ type: () => User })
  user?: User;

  @ApiPropertyOptional({ type: () => Admin })
  admin?: Admin;

  @ApiProperty({ isArray: true, type: () => Session })
  sessions: Session[];
}
