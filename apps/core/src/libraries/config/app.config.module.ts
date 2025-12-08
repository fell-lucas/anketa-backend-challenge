import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CONFIG_SERVICE } from '@repo/system/shared-services/config.service.interface';
import { AppConfigService } from './app.config.service';

const shared = {
  provide: CONFIG_SERVICE,
  useExisting: AppConfigService,
};

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
  ],
  providers: [AppConfigService, shared],
  exports: [AppConfigService],
})
export class AppConfigModule {}
