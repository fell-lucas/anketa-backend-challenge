import { Module } from '@nestjs/common';
import { DbModule } from 'src/libraries/db/db.module';
import { AdminUserService } from './admin.user.service';
import { AdminUserController } from './admin.user.controller';

@Module({
  imports: [DbModule],
  providers: [AdminUserService],
  controllers: [AdminUserController],
  exports: [AdminUserService],
})
export class AdminUserModule {}
