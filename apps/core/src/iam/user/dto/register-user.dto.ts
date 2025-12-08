import { IsOptional, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsOptional()
  appleToken?: string;

  @IsString()
  @IsOptional()
  appleUserId?: string;

  @IsString()
  @IsOptional()
  googleToken?: string;

  @IsString()
  @IsOptional()
  googleUserId?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
