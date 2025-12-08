import { Module } from '@nestjs/common';
import { UserInfoController } from './user-info.controller';
import { UserInfoSeeds } from './user-info.seeds';
import { UserInfoService } from './user-info.service';

@Module({
  controllers: [UserInfoController],
  providers: [UserInfoService, UserInfoSeeds],
  exports: [UserInfoService, UserInfoSeeds],
})
export class UserInfoModule {}
