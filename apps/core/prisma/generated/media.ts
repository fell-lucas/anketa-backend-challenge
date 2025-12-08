import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Media {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  displayName: string;

  @ApiProperty({ type: String })
  publicId: string;

  @ApiProperty({ type: String })
  type: string;

  @ApiPropertyOptional({ type: String })
  assetType?: string;

  @ApiPropertyOptional({ type: String })
  format?: string;

  @ApiProperty({ type: String })
  secureUrl: string;

  @ApiPropertyOptional({ type: String })
  altText?: string;

  @ApiPropertyOptional({ type: String })
  description?: string;

  @ApiPropertyOptional({ type: Number })
  sizeInBytes?: number;

  @ApiPropertyOptional({ type: Number })
  width?: number;

  @ApiPropertyOptional({ type: Number })
  height?: number;

  @ApiPropertyOptional({ type: Number })
  duration?: number;

  @ApiPropertyOptional({ type: Object })
  metadata?: object;

  @ApiProperty({ type: String })
  userId: string;
}
