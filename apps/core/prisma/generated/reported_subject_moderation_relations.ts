import { ReportedSubject } from './reported_subject';
import { Admin } from './admin';
import { ModerationAction } from './moderation_action';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReportedSubjectModerationRelations {
  @ApiProperty({ type: () => ReportedSubject })
  reportedSubject: ReportedSubject;

  @ApiProperty({ type: () => Admin })
  moderator: Admin;

  @ApiProperty({ isArray: true, type: () => ModerationAction })
  moderationActions: ModerationAction[];

  @ApiPropertyOptional({ type: () => ReportedSubject })
  activeForReportedSubject?: ReportedSubject;
}
