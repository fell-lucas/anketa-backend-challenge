import { User } from './user';
import { CircleMembership } from './circle_membership';
import { Post } from './post';
import { ApiProperty } from '@nestjs/swagger';

export class CircleRelations {
  @ApiProperty({ type: () => User })
  createdByUser: User;

  @ApiProperty({ isArray: true, type: () => CircleMembership })
  memberships: CircleMembership[];

  @ApiProperty({ isArray: true, type: () => Post })
  posts: Post[];
}
