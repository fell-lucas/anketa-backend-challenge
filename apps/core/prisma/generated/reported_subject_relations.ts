import { User } from './user';
import { Post } from './post';
import { Comment } from './comment';
import { Report } from './report';
import { ReportedSubjectModeration } from './reported_subject_moderation';
import { ModerationAction } from './moderation_action';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class ReportedSubjectRelations {
  @ApiPropertyOptional({ type: () => User })
  user?: User;

  @ApiPropertyOptional({ type: () => Post })
  post?: Post;

  @ApiPropertyOptional({ type: () => Comment })
  comment?: Comment;

  @ApiProperty({ isArray: true, type: () => Report })
  reports: Report[];

  @ApiProperty({ isArray: true, type: () => ReportedSubjectModeration })
  moderations: ReportedSubjectModeration[];

  @ApiProperty({ isArray: true, type: () => ModerationAction })
  moderationActions: ModerationAction[];

  @ApiPropertyOptional({ type: () => ReportedSubjectModeration })
  activeModeration?: ReportedSubjectModeration;

  @ApiPropertyOptional({ type: () => ModerationAction })
  activeModerationAction?: ModerationAction;
}
