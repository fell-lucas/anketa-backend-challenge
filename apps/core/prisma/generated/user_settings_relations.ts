import { User } from './user';
import { ApiProperty } from '@nestjs/swagger';

export class UserSettingsRelations {
  @ApiProperty({ type: () => User })
  user: User;
}
