import { PrismaClient } from '@prisma/client';
import { AdminSeeds } from '../src/iam/admin/admin.seeds';
import { DeviceSeeds } from '../src/iam/device/device.seeds';
import { PlatformVariableSeeds } from '../src/iam/platform-variable/platform-variable.seeds';
import { SessionSeeds } from '../src/iam/session/session.seeds';
import { UserSeeds } from '../src/iam/user/user.seeds';
import { DbService } from '../src/libraries/db/db.service';
import { EmailSeeds } from '../src/libraries/email/email.seeds';
import { ActivityPointsSeeds } from '../src/seeds/activity-points.seeds';
import { ChannelSeeds } from '../src/seeds/channel.seeds';
import { CommentSeeds } from '../src/seeds/comment.seeds';
import { PostSeeds } from '../src/seeds/post.seeds';

const prisma = new PrismaClient();

async function main() {
  const seedClasses = [
    UserSeeds,
    AdminSeeds,
    PostSeeds,
    SessionSeeds,
    DeviceSeeds,
    ActivityPointsSeeds,
    PlatformVariableSeeds,
    EmailSeeds,
  ];

  for (const SeedClass of seedClasses) {
    const seedInstance = new SeedClass(prisma as DbService);
    await seedInstance.seed();

    if (seedInstance instanceof PostSeeds) {
      const commentSeeds = new CommentSeeds(prisma as DbService, seedInstance);
      const channelSeeds = new ChannelSeeds(prisma as DbService);
      if (process.env.SEEDS_EXTENDED == 'true') {
        console.log('## Seeding extended data');
        await commentSeeds.seedExtended(32);
        await channelSeeds.seedExtended();
      } else {
        await commentSeeds.seed();
        await channelSeeds.seed();
      }
    }
  }
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
