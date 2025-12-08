import { ApiProperty } from '@nestjs/swagger';

export class ReportedSubjectModeration {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  reportedSubjectId: string;

  @ApiProperty({ type: String })
  moderatorId: string;
}
