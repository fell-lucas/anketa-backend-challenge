import { expectStatus, TestUtils } from '@repo/system/test/test.utils';
import { TEST_USER_1 } from '@repo/system/test/users.fixtures';
import { PlatformVariableSeeds } from 'src/iam/platform-variable/platform-variable.seeds';
import { ActivityPointsSeeds } from 'src/seeds/activity-points.seeds';
import { ChannelSeeds } from 'src/seeds/channel.seeds';
import { PostSeeds } from 'src/seeds/post.seeds';
import { AppModule } from '../../app.module';
import { UserSeeds } from './user.seeds';

describe('UserPreviewController (e2e)', () => {
  const test = new TestUtils(AppModule).withDatabase([
    UserSeeds,
    PostSeeds,
    ChannelSeeds,
    ActivityPointsSeeds,
    PlatformVariableSeeds,
  ]);

  describe('GET /users/preview/:username', () => {
    it('should return a user preview for a public user', async () => {
      const username = TEST_USER_1.username;
      const response = await test.request().get(`/users/preview/${username}`);

      expectStatus(response, 200);
      expect(response.body).toBeDefined();
      expect(response.body.name).toBe(TEST_USER_1.name);
      expect(response.body.bio).toBeDefined();
      expect(response.body.profilePicture).not.toBeUndefined();
    });

    it('should return 404 for a non-existent user', async () => {
      const nonExistentUsername = 'nonexistentuser';
      const response = await test
        .request()
        .get(`/users/preview/${nonExistentUsername}`);
      expectStatus(response, 404);
    });
  });
});
