import { ApiProperty } from '@nestjs/swagger';

export class Settings {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  privacyVoteVisibility: string;

  @ApiProperty({ type: String })
  privacyTaggingVisibility: string;

  @ApiProperty({ type: String })
  userId: string;
}
