import { Global, Module } from '@nestjs/common';

import { DB_SERVICE } from '@repo/system/shared-services/db.service.interface';
import { DbService } from './db.service';

// This allows to inject the DB service from packages/* libraries:
const shared = {
  provide: DB_SERVICE,
  useExisting: DbService,
};

@Global()
@Module({
  providers: [DbService, shared],
  exports: [DbService],
})
export class DbModule {}
