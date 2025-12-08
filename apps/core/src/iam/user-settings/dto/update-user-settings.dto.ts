import { ApiPropertyOptional } from '@nestjs/swagger';
import { SettingsVisibilityEnum } from '@prisma/client';
import { IsEnum, IsObject, IsOptional } from 'class-validator';

export class UpdateUserSettingsDto {
  @ApiPropertyOptional({
    enum: SettingsVisibilityEnum,
    description: 'Who can see votes on my posts',
  })
  @IsOptional()
  @IsEnum(SettingsVisibilityEnum)
  whoCanSeeVotesOnMyPosts?: SettingsVisibilityEnum;

  @ApiPropertyOptional({
    enum: SettingsVisibilityEnum,
    description: 'Who can see likes on my posts',
  })
  @IsOptional()
  @IsEnum(SettingsVisibilityEnum)
  whoCanSeeLikesOnMyPosts?: SettingsVisibilityEnum;

  @ApiPropertyOptional({
    enum: SettingsVisibilityEnum,
    description: 'Who can see comments on my posts',
  })
  @IsOptional()
  @IsEnum(SettingsVisibilityEnum)
  whoCanSeeCommentsOnMyPosts?: SettingsVisibilityEnum;

  @ApiPropertyOptional({
    enum: SettingsVisibilityEnum,
    description: 'Who can tag me in posts',
  })
  @IsOptional()
  @IsEnum(SettingsVisibilityEnum)
  whoCanTagMeInPosts?: SettingsVisibilityEnum;

  @ApiPropertyOptional({
    enum: SettingsVisibilityEnum,
    description: 'Who can tag me in comments',
  })
  @IsOptional()
  @IsEnum(SettingsVisibilityEnum)
  whoCanTagMeInComments?: SettingsVisibilityEnum;

  @ApiPropertyOptional({
    enum: SettingsVisibilityEnum,
    description: 'Who can message me',
  })
  @IsOptional()
  @IsEnum(SettingsVisibilityEnum)
  whoCanMessageMe?: SettingsVisibilityEnum;

  @ApiPropertyOptional({
    enum: SettingsVisibilityEnum,
    description: 'Who can see my followers',
  })
  @IsOptional()
  @IsEnum(SettingsVisibilityEnum)
  whoCanSeeMyFollowers?: SettingsVisibilityEnum;

  @ApiPropertyOptional({
    enum: SettingsVisibilityEnum,
    description: 'Who can see my followees',
  })
  @IsOptional()
  @IsEnum(SettingsVisibilityEnum)
  whoCanSeeMyFollowees?: SettingsVisibilityEnum;

  @ApiPropertyOptional({ description: 'Email notification preferences' })
  @IsOptional()
  @IsObject()
  emailNotifications?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Push notification preferences' })
  @IsOptional()
  @IsObject()
  pushNotifications?: Record<string, any>;

  @ApiPropertyOptional({
    description:
      'Disclaimer acceptance status. Set to true to accept a disclaimer (will be stored as timestamp). Cannot overwrite existing disclaimers.',
    example: { post: true, vote: true, signup: false },
  })
  @IsOptional()
  @IsObject()
  disclaimers?: Record<string, boolean>;
}
