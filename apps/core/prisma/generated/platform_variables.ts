import { ApiProperty } from '@nestjs/swagger';

export class PlatformVariables {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  category: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  value: string;
}
