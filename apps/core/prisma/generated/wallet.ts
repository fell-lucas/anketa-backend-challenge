import { ApiProperty } from '@nestjs/swagger';

export class Wallet {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  publicKey: string;

  @ApiProperty({ type: String })
  mnemonic: string;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: Number })
  balance: number;
}
