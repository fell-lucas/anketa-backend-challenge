import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EmailTemplate {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  subject: string;

  @ApiPropertyOptional({ type: String })
  textBody?: string;

  @ApiPropertyOptional({ type: String })
  htmlBody?: string;

  @ApiProperty({ isArray: true, type: String })
  variables: string[] = [];

  @ApiPropertyOptional({ type: String })
  description?: string;

  @ApiProperty({ type: Boolean })
  isActive: boolean = true;
}
