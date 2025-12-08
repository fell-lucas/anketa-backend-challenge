import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserStats {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: Number })
  points: number;

  @ApiProperty({ type: Number })
  totalPoints: number;

  @ApiPropertyOptional({ type: Date })
  lastTokenWin?: Date;

  @ApiProperty({ type: Number })
  followersCount: number;

  @ApiProperty({ type: Number })
  followeesCount: number;

  @ApiProperty({ type: Number })
  circlesCount: number;

  @ApiProperty({ type: Number })
  publishedPostsCount: number;

  @ApiProperty({ type: Number })
  publishedPollPostsCount: number;

  @ApiProperty({ type: Number })
  publishedSurveyPostsCount: number;

  @ApiProperty({ type: Number })
  draftPostsCount: number;

  @ApiProperty({ type: Number })
  scheduledPostsCount: number;

  @ApiProperty({ type: Number })
  feedPostsCount: number;

  @ApiProperty({ type: Number })
  purchasedPostsCount: number;

  @ApiProperty({ type: Number })
  likedPostsCount: number;

  @ApiProperty({ type: Number })
  repostedPostsCount: number;

  @ApiProperty({ type: Number })
  bookmarkedPostsCount: number;

  @ApiProperty({ type: Number })
  votedPostsCount: number;

  @ApiProperty({ type: Object })
  channelsPoints: object = {};
}
