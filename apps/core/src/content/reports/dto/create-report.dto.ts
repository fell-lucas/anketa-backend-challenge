import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReportType } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateReportDto {
  @ApiProperty({ enum: ReportType, enumName: 'ReportType' })
  @IsEnum(ReportType)
  type: ReportType;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsUUID()
  postId?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsUUID()
  commentId?: string;
}
