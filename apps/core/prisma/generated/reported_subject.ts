import {
  ReportedSubjectType,
  ReportedSubjectModerationStatus,
} from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReportedSubject {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ enum: ReportedSubjectType, enumName: 'ReportedSubjectType' })
  type: ReportedSubjectType;

  @ApiProperty({
    enum: ReportedSubjectModerationStatus,
    enumName: 'ReportedSubjectModerationStatus',
  })
  moderationStatus: ReportedSubjectModerationStatus;

  @ApiPropertyOptional({ type: Date })
  moderationStatusChangedAt?: Date;

  @ApiPropertyOptional({ type: String })
  userId?: string;

  @ApiPropertyOptional({ type: String })
  postId?: string;

  @ApiPropertyOptional({ type: String })
  commentId?: string;

  @ApiPropertyOptional({ type: String })
  activeModerationId?: string;

  @ApiPropertyOptional({ type: String })
  latestModerationActionId?: string;

  @ApiProperty({ type: Number })
  reportsCount: number;
}
