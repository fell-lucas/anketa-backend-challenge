import { User } from './user';
import { ApiProperty } from '@nestjs/swagger';

export class CheckmarkRelations {
  @ApiProperty({ type: () => User })
  user: User;
}
