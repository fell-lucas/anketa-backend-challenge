import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';

export class CheckSignupDto {
  @ApiProperty({
    description: 'Email address to check if signup is allowed',
    example: 'user@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;
}

export class CheckSignupResponseDto {
  @ApiProperty({
    description: 'Whether signup is allowed for the provided email',
    example: true,
  })
  allowed: boolean;

  @ApiProperty({
    description: 'Reason why signup is not allowed',
    example: 'Waiting for founder to sign up first',
    required: false,
  })
  reason?: string;
}
