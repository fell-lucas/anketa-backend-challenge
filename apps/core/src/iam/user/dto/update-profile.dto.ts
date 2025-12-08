import { UserVisibilityEnum } from '@prisma/client';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsOptional,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { IsString } from 'class-validator';
import { UserGenderEnum } from 'src/iam/user/user.gender.enum';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z][a-z0-9_\.]+[a-z0-9]$/i)
  username?: string;

  @IsOptional()
  @IsEnum(UserGenderEnum)
  gender?: UserGenderEnum;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  profilePictureId?: string;

  @IsOptional()
  @IsEnum(UserVisibilityEnum)
  visibility?: UserVisibilityEnum;

  @IsOptional()
  @IsString()
  @Length(4, 4)
  pinCode?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  links?: string[];

  @IsOptional()
  @IsString()
  fcmToken?: string;
}
