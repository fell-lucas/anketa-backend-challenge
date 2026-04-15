import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ReportedSubjectModerationStatus,
  ReportedSubjectType,
} from '@prisma/client';
import { IsEnum, IsOptional, IsInt, Min, Max, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class FindReportedSubjectsDto {
  @ApiPropertyOptional({ enum: ReportedSubjectType })
  @IsOptional()
  @IsEnum(ReportedSubjectType)
  type?: ReportedSubjectType;

  @ApiPropertyOptional({ enum: ReportedSubjectModerationStatus })
  @IsOptional()
  @IsEnum(ReportedSubjectModerationStatus)
  moderationStatus?: ReportedSubjectModerationStatus;

  @ApiPropertyOptional({ type: Number, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number = 0;

  @ApiPropertyOptional({ type: Number, default: 24 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  take?: number = 24;
}

export class FindReportsDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsUUID()
  reportedSubjectId?: string;

  @ApiPropertyOptional({ type: Number, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number = 0;

  @ApiPropertyOptional({ type: Number, default: 24 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  take?: number = 24;
}
