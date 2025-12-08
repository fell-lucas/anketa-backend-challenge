import { ReportType } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Report {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ enum: ReportType, enumName: 'ReportType' })
  type: ReportType;

  @ApiPropertyOptional({ type: String })
  message?: string;

  @ApiProperty({ type: Boolean })
  hasBeenReviewed: boolean;

  @ApiProperty({ type: String })
  reportedSubjectId: string;

  @ApiPropertyOptional({ type: String })
  userId?: string;

  @ApiPropertyOptional({ type: String })
  adminId?: string;
}
