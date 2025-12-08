import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class GetPlatformVariablesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9_-]+$/, {
    message:
      'name must contain only lowercase letters, numbers, underscores and hyphens',
  })
  name?: string;
}
