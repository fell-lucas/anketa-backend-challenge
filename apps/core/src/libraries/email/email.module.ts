import { Global, Module } from '@nestjs/common';
import { AwsModule } from '../../libraries/aws/aws.module';
import { DbModule } from '../../libraries/db/db.module';
import { EmailSeeds } from './email.seeds';
import { EmailService } from './email.service';

@Global()
@Module({
  imports: [AwsModule, DbModule],
  providers: [EmailService, EmailSeeds],
  exports: [EmailService, EmailSeeds],
})
export class EmailModule {}
