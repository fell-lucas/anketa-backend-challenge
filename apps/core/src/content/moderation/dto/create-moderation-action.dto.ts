import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ModerationActionType,
  ModerationSuspensionLevel,
} from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
  ValidateIf,
} from 'class-validator';

export class CreateModerationActionDto {
  @ApiProperty({ enum: ModerationActionType, enumName: 'ModerationActionType' })
  @IsEnum(ModerationActionType)
  type: ModerationActionType;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  violationCategory?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  violationSubcategory?: string;

  @ApiPropertyOptional({
    enum: ModerationSuspensionLevel,
    enumName: 'ModerationSuspensionLevel',
  })
  @ValidateIf((o) =>
    [
      ModerationActionType.SUSPEND_REPORTED_SUBJECT,
      ModerationActionType.SUSPEND_USER,
    ].includes(o.type),
  )
  @IsEnum(ModerationSuspensionLevel)
  suspensionLevel?: ModerationSuspensionLevel;

  @ApiPropertyOptional({ type: String })
  @ValidateIf((o) => o.suspensionLevel === ModerationSuspensionLevel.CUSTOM)
  @IsDateString()
  suspensionStartsAt?: string;

  @ApiPropertyOptional({ type: String })
  @ValidateIf((o) => o.suspensionLevel === ModerationSuspensionLevel.CUSTOM)
  @IsDateString()
  suspensionEndsAt?: string;
}
