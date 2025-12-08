import { Module } from '@nestjs/common';
import { DbModule } from 'src/libraries/db/db.module';
import { AdminPlatformVariableService } from './admin.platform-variable.service';
import { AdminPlatformVariableController } from './admin.platform-variable.controller';

@Module({
  imports: [DbModule],
  providers: [AdminPlatformVariableService],
  controllers: [AdminPlatformVariableController],
  exports: [AdminPlatformVariableService],
})
export class AdminPlatformVariableModule {}
