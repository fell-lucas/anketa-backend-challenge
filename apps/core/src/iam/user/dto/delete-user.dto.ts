import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class DeleteUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  deleteReason?: string;
}
