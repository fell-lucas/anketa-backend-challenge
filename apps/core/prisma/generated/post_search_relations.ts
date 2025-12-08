import { User } from './user';
import { ApiProperty } from '@nestjs/swagger';

export class PostSearchRelations {
  @ApiProperty({ type: () => User })
  user: User;
}
