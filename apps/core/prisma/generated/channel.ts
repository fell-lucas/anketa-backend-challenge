import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Channel {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: Boolean })
  isEnabled: boolean;

  @ApiPropertyOptional({ type: String })
  iconPublicId?: string;

  @ApiPropertyOptional({ type: String })
  parentChannelId?: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
