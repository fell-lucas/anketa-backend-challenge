import { Channel } from './channel';
import { Post } from './post';
import { User } from './user';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class ChannelRelations {
  @ApiPropertyOptional({ type: () => Channel })
  parentChannel?: Channel;

  @ApiProperty({ isArray: true, type: () => Post })
  posts: Post[];

  @ApiProperty({ isArray: true, type: () => Channel })
  subChannels: Channel[];

  @ApiProperty({ isArray: true, type: () => User })
  users: User[];
}
