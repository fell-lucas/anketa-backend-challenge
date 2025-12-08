import { ReportedSubject } from './reported_subject';
import { User } from './user';
import { Admin } from './admin';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReportRelations {
  @ApiProperty({ type: () => ReportedSubject })
  reportedSubject: ReportedSubject;

  @ApiPropertyOptional({ type: () => User })
  user?: User;

  @ApiPropertyOptional({ type: () => Admin })
  admin?: Admin;
}
