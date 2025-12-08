import { User } from './user';
import { ApiProperty } from '@nestjs/swagger';

export class UserAwardedTokensRelations {
  @ApiProperty({ type: () => User })
  user: User;
}
