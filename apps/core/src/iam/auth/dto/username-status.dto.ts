import { IsBoolean } from 'class-validator';

export class UsernameStatusDto {
  @IsBoolean()
  taken: boolean;
}
