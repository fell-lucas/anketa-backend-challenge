import { UserVisibilityEnum } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class User {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  name: string;

  @ApiPropertyOptional({ type: String })
  username?: string;

  @ApiPropertyOptional({
    enum: UserVisibilityEnum,
    enumName: 'UserVisibilityEnum',
  })
  visibility?: UserVisibilityEnum = UserVisibilityEnum.PUBLIC;

  @ApiPropertyOptional({ type: String })
  pinCode?: string;

  @ApiPropertyOptional({ type: String })
  bio?: string;

  @ApiPropertyOptional({ type: String })
  gender?: string;

  @ApiPropertyOptional({ type: Date })
  dateOfBirth?: Date;

  @ApiPropertyOptional({ type: String })
  phoneNumber?: string;

  @ApiPropertyOptional({ type: String })
  email?: string;

  @ApiProperty({ type: Boolean })
  emailVerified: boolean;

  @ApiPropertyOptional({ type: String })
  profilePicturePublicId?: string;

  @ApiPropertyOptional({ type: Number })
  latitude?: number;

  @ApiPropertyOptional({ type: Number })
  longitude?: number;

  @ApiPropertyOptional({ type: String })
  city?: string;

  @ApiPropertyOptional({ type: String })
  country?: string;

  @ApiProperty({ isArray: true, type: String })
  links: string[];

  @ApiPropertyOptional({ type: String })
  firebaseUid?: string;

  @ApiPropertyOptional({ type: String })
  googleUserId?: string;

  @ApiPropertyOptional({ type: String })
  googleToken?: string;

  @ApiPropertyOptional({ type: String })
  appleUserId?: string;

  @ApiPropertyOptional({ type: String })
  appleToken?: string;

  @ApiPropertyOptional({ type: String })
  streamToken?: string;

  @ApiPropertyOptional({ type: String })
  settingId?: string;

  @ApiPropertyOptional({ type: Date })
  lastSeenAt?: Date;

  @ApiPropertyOptional({ type: Date })
  deletedAt?: Date;

  @ApiPropertyOptional({ type: Date })
  willDeleteAt?: Date;

  @ApiPropertyOptional({ type: String })
  deleteReason?: string;

  @ApiPropertyOptional({ type: Date })
  suspendedAt?: Date;

  @ApiPropertyOptional({ type: Date })
  suspendedUntil?: Date;

  @ApiPropertyOptional({ type: String })
  suspensionReason?: string;
}
