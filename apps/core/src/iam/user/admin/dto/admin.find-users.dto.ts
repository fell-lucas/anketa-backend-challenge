import { UserVisibilityEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class AdminFindUsersDto {
  @IsOptional()
  @IsString()
  searchQuery?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEnum(UserVisibilityEnum)
  visibility?: UserVisibilityEnum;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  withoutWallet?: boolean;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  take?: number = 24;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  skip?: number = 0;

  @IsOptional()
  @IsString()
  sortBy?: 'name' | 'email' | 'createdAt' | 'updatedAt' | 'lastSeenAt' =
    'updatedAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
