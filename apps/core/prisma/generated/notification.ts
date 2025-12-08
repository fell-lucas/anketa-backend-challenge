import { NotificationType } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Notification {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ enum: NotificationType, enumName: 'NotificationType' })
  type: NotificationType;

  @ApiProperty({ type: Boolean })
  isRead: boolean;

  @ApiProperty({ type: String })
  recipientId: string;

  @ApiPropertyOptional({ type: String })
  senderId?: string;

  @ApiPropertyOptional({ type: String })
  postId?: string;

  @ApiPropertyOptional({ type: String })
  commentId?: string;

  @ApiPropertyOptional({ type: String })
  voteId?: string;

  @ApiPropertyOptional({ type: String })
  followId?: string;

  @ApiPropertyOptional({ type: String })
  likeId?: string;

  @ApiPropertyOptional({ type: Date })
  failedAt?: Date;

  @ApiPropertyOptional({ type: Date })
  fcmSentAt?: Date;
}
