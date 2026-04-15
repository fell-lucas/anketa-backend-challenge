import { User } from './user';
import { Post } from './post';
import { Comment } from './comment';
import { Like } from './like';
import { Notification } from './notification';
import { ReportedSubject } from './reported_subject';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CommentRelations {
  @ApiProperty({ type: () => User })
  user: User;

  @ApiProperty({ type: () => Post })
  post: Post;

  @ApiPropertyOptional({ type: () => Comment })
  parentComment?: Comment;

  @ApiProperty({ isArray: true, type: () => Comment })
  replies: Comment[];

  @ApiProperty({ isArray: true, type: () => Like })
  likes: Like[];

  @ApiProperty({ isArray: true, type: () => Notification })
  notifications: Notification[];

  @ApiProperty({ isArray: true, type: () => ReportedSubject })
  reportedSubjects: ReportedSubject[];
}
