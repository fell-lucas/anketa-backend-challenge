import { SettingsVisibilityEnum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserSettings {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({
    enum: SettingsVisibilityEnum,
    enumName: 'SettingsVisibilityEnum',
  })
  whoCanSeeVotesOnMyPosts: SettingsVisibilityEnum =
    SettingsVisibilityEnum.EVERYONE;

  @ApiProperty({
    enum: SettingsVisibilityEnum,
    enumName: 'SettingsVisibilityEnum',
  })
  whoCanSeeLikesOnMyPosts: SettingsVisibilityEnum =
    SettingsVisibilityEnum.EVERYONE;

  @ApiProperty({
    enum: SettingsVisibilityEnum,
    enumName: 'SettingsVisibilityEnum',
  })
  whoCanSeeCommentsOnMyPosts: SettingsVisibilityEnum =
    SettingsVisibilityEnum.EVERYONE;

  @ApiProperty({
    enum: SettingsVisibilityEnum,
    enumName: 'SettingsVisibilityEnum',
  })
  whoCanTagMeInPosts: SettingsVisibilityEnum = SettingsVisibilityEnum.EVERYONE;

  @ApiProperty({
    enum: SettingsVisibilityEnum,
    enumName: 'SettingsVisibilityEnum',
  })
  whoCanTagMeInComments: SettingsVisibilityEnum =
    SettingsVisibilityEnum.EVERYONE;

  @ApiProperty({
    enum: SettingsVisibilityEnum,
    enumName: 'SettingsVisibilityEnum',
  })
  whoCanMessageMe: SettingsVisibilityEnum = SettingsVisibilityEnum.EVERYONE;

  @ApiProperty({
    enum: SettingsVisibilityEnum,
    enumName: 'SettingsVisibilityEnum',
  })
  whoCanSeeMyFollowers: SettingsVisibilityEnum =
    SettingsVisibilityEnum.EVERYONE;

  @ApiProperty({
    enum: SettingsVisibilityEnum,
    enumName: 'SettingsVisibilityEnum',
  })
  whoCanSeeMyFollowees: SettingsVisibilityEnum =
    SettingsVisibilityEnum.EVERYONE;

  @ApiProperty({ type: Object })
  emailNotifications: object = { list: [] };

  @ApiProperty({ type: Object })
  pushNotifications: object = { list: [] };

  @ApiProperty({ type: Object })
  disclaimers: object = {};

  @ApiProperty({ type: String })
  userId: string;
}
