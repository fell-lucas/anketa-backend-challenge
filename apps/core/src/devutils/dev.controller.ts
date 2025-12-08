import { Controller, Logger, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { spawn } from 'child_process';

@ApiTags('dev')
@Controller('dev')
export class DevController {
  private readonly logger = new Logger(DevController.name);

  @Post('/reset-db')
  async resetDb(@Res() res: Response) {
    if (
      ['staging', 'integration'].includes(process.env.RAILWAY_ENVIRONMENT_NAME)
    ) {
      this.logger.log('Resetting database');
      // run shell command prisma db push --force-reset --skip-generate
      const proc = spawn('prisma', [
        'migrate',
        'reset',
        '--skip-generate',
        '-f',
      ]);
      proc.stdout.pipe(process.stdout);
      proc.stdout.pipe(res as any);
    } else {
      this.logger.warn('Resetting database not permitted on this environment');
    }
  }
}
