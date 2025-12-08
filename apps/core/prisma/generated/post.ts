import { PostStatus, PostType, PostVisibility } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Post {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ enum: PostStatus, enumName: 'PostStatus' })
  status: PostStatus = PostStatus.DRAFT;

  @ApiProperty({ type: Boolean })
  isAnonymous: boolean;

  @ApiProperty({ type: Boolean })
  hasSensitiveContent: boolean;

  @ApiProperty({ enum: PostType, enumName: 'PostType' })
  type: PostType = PostType.POLL;

  @ApiProperty({ enum: PostVisibility, enumName: 'PostVisibility' })
  visibility: PostVisibility = PostVisibility.PUBLIC;

  @ApiProperty({ type: Boolean })
  restrictAccessToAnalytics: boolean;

  @ApiPropertyOptional({ type: String })
  name?: string;

  @ApiPropertyOptional({ type: String })
  description?: string;

  @ApiPropertyOptional({ type: String })
  transactionHash?: string;

  @ApiPropertyOptional({ type: Date })
  startsAt?: Date;

  @ApiPropertyOptional({ type: Date })
  endsAt?: Date;

  @ApiPropertyOptional({ type: Date })
  hiddenAt?: Date;

  @ApiPropertyOptional({ type: Date })
  hiddenUntil?: Date;

  @ApiPropertyOptional({ type: String })
  hiddenReason?: string;

  @ApiProperty({ type: Number })
  ratingsCount: number;

  @ApiProperty({ type: Number })
  ratingsSum: number;

  @ApiProperty({ type: Number })
  ratingAverage: number;

  @ApiProperty({ isArray: true, type: String })
  hashtags: string[];

  @ApiProperty({ type: Number })
  likesCount: number;

  @ApiProperty({ type: Number })
  commentsCount: number;

  @ApiProperty({ type: Number })
  repostsCount: number;

  @ApiProperty({ type: Number })
  votesCount: number;

  @ApiProperty({ type: String })
  createdByUserId: string;
}
