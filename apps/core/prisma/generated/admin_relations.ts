import { Device } from './device';
import { Session } from './session';
import { Report } from './report';
import { ReportedSubjectModeration } from './reported_subject_moderation';
import { ApiProperty } from '@nestjs/swagger';

export class AdminRelations {
  @ApiProperty({ isArray: true, type: () => Device })
  devices: Device[];

  @ApiProperty({ isArray: true, type: () => Session })
  sessions: Session[];

  @ApiProperty({ isArray: true, type: () => Report })
  reports: Report[];

  @ApiProperty({ isArray: true, type: () => ReportedSubjectModeration })
  moderations: ReportedSubjectModeration[];
}
