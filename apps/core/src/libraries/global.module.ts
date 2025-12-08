import { Global, Module } from '@nestjs/common';

import { MulterModule } from '@nestjs/platform-express';
import { PollpapaLoggerModule } from '@repo/system/logging/logging.module';
import { InngestModule } from 'nest-inngest';
import { AdminJsModule } from './adminjs/adminjs.module';
import { AwsModule } from './aws/aws.module';
import { AppConfigModule } from './config/app.config.module';
import { AppConfigService } from './config/app.config.service';
import { DbModule } from './db/db.module';
import { EmailModule } from './email/email.module';
import { FirebaseModule } from './firebase/firebase.module';
import { inngest } from './inngest/inngest';
import { InngestModule as AppInngestModule } from './inngest/inngest.module';
import { StreamModule } from './stream/stream.module';
@Global()
@Module({
  imports: [
    AppConfigModule,
    PollpapaLoggerModule,
    DbModule,
    MulterModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: async (config: AppConfigService) => ({
        dest: config.files.uploadFolder,
      }),
    }),
    InngestModule.forRoot({
      inngest,
      path: '/api/inngest',
    }),
    ...(process.env.ADMINJS_ENABLED === 'true' ? [AdminJsModule] : []),
    FirebaseModule,
    AwsModule,
    EmailModule,
    StreamModule,
    AppInngestModule,
  ],
  exports: [AppConfigModule, PollpapaLoggerModule, DbModule],
})
export class GlobalModule {}
