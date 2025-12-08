import { Device } from './device';
import { Session } from './session';
import { ApiProperty } from '@nestjs/swagger';

export class AdminRelations {
  @ApiProperty({ isArray: true, type: () => Device })
  devices: Device[];

  @ApiProperty({ isArray: true, type: () => Session })
  sessions: Session[];
}
