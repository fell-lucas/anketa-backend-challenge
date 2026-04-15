import { Media } from './media';
import { User } from './user';
import { Channel } from './channel';
import { Circle } from './circle';
import { Comment } from './comment';
import { Like } from './like';
import { Poll } from './poll';
import { Repost } from './repost';
import { PostMute } from './post_mute';
import { Vote } from './vote';
import { PostSection } from './post_section';
import { PostBookmark } from './post_bookmark';
import { Notification } from './notification';
import { AIPostSummary } from './ai_post_summary';
import { PostRating } from './post_rating';
import { ReportedSubject } from './reported_subject';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PostRelations {
  @ApiProperty({ isArray: true, type: () => Media })
  media: Media[];

  @ApiProperty({ type: () => User })
  createdByUser: User;

  @ApiProperty({ isArray: true, type: () => Channel })
  channels: Channel[];

  @ApiProperty({ isArray: true, type: () => Circle })
  circles: Circle[];

  @ApiProperty({ isArray: true, type: () => Comment })
  comments: Comment[];

  @ApiProperty({ isArray: true, type: () => Like })
  likes: Like[];

  @ApiProperty({ isArray: true, type: () => Poll })
  polls: Poll[];

  @ApiProperty({ isArray: true, type: () => Repost })
  reposts: Repost[];

  @ApiProperty({ isArray: true, type: () => PostMute })
  postMutes: PostMute[];

  @ApiProperty({ isArray: true, type: () => Vote })
  votes: Vote[];

  @ApiProperty({ isArray: true, type: () => PostSection })
  sections: PostSection[];

  @ApiProperty({ isArray: true, type: () => PostBookmark })
  bookmarks: PostBookmark[];

  @ApiProperty({ isArray: true, type: () => Notification })
  notifications: Notification[];

  @ApiPropertyOptional({ type: () => AIPostSummary })
  aiSummary?: AIPostSummary;

  @ApiProperty({ isArray: true, type: () => PostRating })
  postRatings: PostRating[];

  @ApiProperty({ isArray: true, type: () => ReportedSubject })
  reportedSubjects: ReportedSubject[];
}
