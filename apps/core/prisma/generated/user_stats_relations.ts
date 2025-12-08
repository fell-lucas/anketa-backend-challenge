import { User } from './user';
import { ApiProperty } from '@nestjs/swagger';

export class UserStatsRelations {
  @ApiProperty({ type: () => User })
  user: User;
}
