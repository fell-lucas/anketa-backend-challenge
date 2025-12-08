import {
  ModerationActionType,
  ModerationSuspensionLevel,
} from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ModerationAction {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ enum: ModerationActionType, enumName: 'ModerationActionType' })
  type: ModerationActionType;

  @ApiPropertyOptional({ type: String })
  reason?: string;

  @ApiProperty({ type: Boolean })
  isEdit: boolean;

  @ApiProperty({ type: String })
  reportedSubjectId: string;

  @ApiProperty({ type: String })
  moderationId: string;

  @ApiPropertyOptional({ type: String })
  violationCategory?: string;

  @ApiPropertyOptional({ type: String })
  violationSubcategory?: string;

  @ApiPropertyOptional({
    enum: ModerationSuspensionLevel,
    enumName: 'ModerationSuspensionLevel',
  })
  suspensionLevel?: ModerationSuspensionLevel;

  @ApiPropertyOptional({ type: String })
  notes?: string;

  @ApiPropertyOptional({ type: Date })
  suspensionStartsAt?: Date;

  @ApiPropertyOptional({ type: Date })
  suspensionEndsAt?: Date;
}
