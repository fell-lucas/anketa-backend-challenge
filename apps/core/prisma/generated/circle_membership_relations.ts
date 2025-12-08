import { Circle } from './circle';
import { User } from './user';
import { ApiProperty } from '@nestjs/swagger';

export class CircleMembershipRelations {
  @ApiProperty({ type: () => Circle })
  circle: Circle;

  @ApiProperty({ type: () => User })
  user: User;
}
