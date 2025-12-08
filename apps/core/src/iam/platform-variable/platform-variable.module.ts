import { Module } from '@nestjs/common';
import { PlatformVariableController } from './platform-variable.controller';
import { PlatformVariableSeeds } from './platform-variable.seeds';
import { PlatformVariableService } from './platform-variable.service';
import { AdminPlatformVariableModule } from './admin/admin.platform-variable.module';

@Module({
  imports: [AdminPlatformVariableModule, AdminPlatformVariableModule],
  controllers: [PlatformVariableController],
  providers: [PlatformVariableService, PlatformVariableSeeds],
  exports: [PlatformVariableService, PlatformVariableSeeds],
})
export class PlatformVariableModule {}
