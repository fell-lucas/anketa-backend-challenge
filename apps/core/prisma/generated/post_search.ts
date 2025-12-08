import { ApiProperty } from '@nestjs/swagger';

export class PostSearch {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: String })
  searchQuery: string;

  @ApiProperty({ type: Object })
  searchFilters: object = {};

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
