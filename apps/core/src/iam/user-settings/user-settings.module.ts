import { Module } from '@nestjs/common';
import { UserSettingsController } from './user-settings.controller';
import { UserSettingsSeeds } from './user-settings.seeds';
import { UserSettingsService } from './user-settings.service';

@Module({
  controllers: [UserSettingsController],
  providers: [UserSettingsService, UserSettingsSeeds],
  exports: [UserSettingsService, UserSettingsSeeds],
})
export class UserSettingsModule {}
