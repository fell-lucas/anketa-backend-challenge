import { PrismaClient } from '@prisma/client';
import { ChannelSeeds } from '../src/seeds/channel.seeds';
import { DbService } from '../src/libraries/db/db.service';
import { ActivityPointsSeeds } from '../src/seeds/activity-points.seeds';

const prisma = new PrismaClient();

/**
 * Seeds dynamic data that may change frequently and needs to be
 * refreshed on each deployment. This includes channels, activity
 * points, and other configurable platform data that can be updated
 * without requiring database migrations.
 *
 * Runs automatically on production startup (pnpm start:prod).
 */
async function main() {
  await new ChannelSeeds(prisma as DbService).seedExtended();
  await new ActivityPointsSeeds(prisma as DbService).seed();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
