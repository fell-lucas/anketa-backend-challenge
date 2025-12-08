import { IsString, MaxLength, MinLength } from 'class-validator';

export class VerifyPinDto {
  @IsString()
  @MinLength(4)
  @MaxLength(12)
  pinCode: string;
}
