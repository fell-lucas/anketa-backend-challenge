import { ReportedSubject } from './reported_subject';
import { ReportedSubjectModeration } from './reported_subject_moderation';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ModerationActionRelations {
  @ApiProperty({ type: () => ReportedSubject })
  reportedSubject: ReportedSubject;

  @ApiProperty({ type: () => ReportedSubjectModeration })
  moderation: ReportedSubjectModeration;

  @ApiPropertyOptional({ type: () => ReportedSubject })
  latestForReportedSubject?: ReportedSubject;
}
