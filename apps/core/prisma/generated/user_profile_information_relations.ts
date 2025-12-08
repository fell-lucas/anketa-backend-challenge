import { User } from './user';
import { ApiProperty } from '@nestjs/swagger';

export class UserProfileInformationRelations {
  @ApiProperty({ type: () => User })
  user: User;
}
