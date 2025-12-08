import { User } from './user';
import { ApiProperty } from '@nestjs/swagger';

export class WalletRelations {
  @ApiProperty({ type: () => User })
  user: User;
}
