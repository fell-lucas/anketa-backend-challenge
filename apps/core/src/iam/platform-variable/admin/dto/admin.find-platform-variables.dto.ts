import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AdminFindPlatformVariablesDto {
  @ApiPropertyOptional({
    description:
      'Search query to filter platform variables by name or category',
    example: 'notification',
  })
  @IsOptional()
  @IsString()
  searchQuery?: string;

  @ApiPropertyOptional({
    description: 'Filter platform variables by category',
    example: 'email',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Number of platform variables to return',
    minimum: 1,
    maximum: 100,
    default: 24,
    example: 24,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  take?: number = 24;

  @ApiPropertyOptional({
    description: 'Number of platform variables to skip for pagination',
    minimum: 0,
    default: 0,
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  skip?: number = 0;

  @ApiPropertyOptional({
    description: 'Field to sort platform variables by',
    enum: ['createdAt', 'updatedAt', 'name', 'category'],
    default: 'updatedAt',
    example: 'updatedAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'category' = 'updatedAt';

  @ApiPropertyOptional({
    description: 'Sort order for the results',
    enum: ['asc', 'desc'],
    default: 'desc',
    example: 'desc',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
