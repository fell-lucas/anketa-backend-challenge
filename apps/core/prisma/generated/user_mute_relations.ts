import { User } from './user';
import { ApiProperty } from '@nestjs/swagger';

export class UserMuteRelations {
  @ApiProperty({ type: () => User })
  user: User;

  @ApiProperty({ type: () => User })
  targetUser: User;
}
