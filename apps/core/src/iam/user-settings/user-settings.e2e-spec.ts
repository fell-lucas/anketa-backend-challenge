import { SettingsVisibilityEnum } from '@prisma/client';
import { expectStatus, TestUtils } from '@repo/system/test/test.utils';
import { TEST_USER_1, TEST_USER_2 } from '@repo/system/test/users.fixtures';
import { AppModule } from '../../app.module';
import { UserSeeds } from '../user/user.seeds';
import { UserSettingsSeeds } from './user-settings.seeds';

describe('UserSettingsController (e2e)', () => {
  const test = new TestUtils(AppModule).withDatabase([
    UserSeeds,
    UserSettingsSeeds,
  ]);

  describe('GET /auth/me/settings', () => {
    it('should get settings for current user', async () => {
      const res = await test.request(TEST_USER_1).get('/auth/me/settings');

      expectStatus(res, 200);
      expect(res.body).toEqual(
        expect.objectContaining({
          userId: TEST_USER_1.appId,
          whoCanSeeVotesOnMyPosts: SettingsVisibilityEnum.EVERYONE,
          whoCanSeeLikesOnMyPosts: SettingsVisibilityEnum.EVERYONE,
          whoCanSeeCommentsOnMyPosts: SettingsVisibilityEnum.EVERYONE,
          whoCanTagMeInPosts: SettingsVisibilityEnum.EVERYONE,
          whoCanTagMeInComments: SettingsVisibilityEnum.EVERYONE,
          whoCanMessageMe: SettingsVisibilityEnum.EVERYONE,
          whoCanSeeMyFollowers: SettingsVisibilityEnum.EVERYONE,
          whoCanSeeMyFollowees: SettingsVisibilityEnum.EVERYONE,
        }),
      );
    });

    it('should fail without auth token', async () => {
      const res = await test.request().get('/auth/me/settings');

      expectStatus(res, 401);
    });
  });

  describe('POST /auth/me/settings', () => {
    it('should update settings for current user', async () => {
      const updateData = {
        whoCanSeeVotesOnMyPosts: SettingsVisibilityEnum.FOLLOWERS,
        whoCanSeeLikesOnMyPosts: SettingsVisibilityEnum.FOLLOWERS,
        whoCanSeeCommentsOnMyPosts: SettingsVisibilityEnum.FOLLOWERS,
      };

      const res = await test
        .request(TEST_USER_1)
        .post('/auth/me/settings')
        .send(updateData);

      expectStatus(res, 200);
      expect(res.body).toEqual(
        expect.objectContaining({
          userId: TEST_USER_1.appId,
          ...updateData,
          whoCanTagMeInPosts: SettingsVisibilityEnum.EVERYONE,
          whoCanTagMeInComments: SettingsVisibilityEnum.EVERYONE,
          whoCanMessageMe: SettingsVisibilityEnum.EVERYONE,
          whoCanSeeMyFollowers: SettingsVisibilityEnum.EVERYONE,
          whoCanSeeMyFollowees: SettingsVisibilityEnum.EVERYONE,
        }),
      );
    });

    it('should update notification preferences', async () => {
      const updateData = {
        emailNotifications: { list: ['comments', 'likes'] },
        pushNotifications: { list: ['follows', 'messages'] },
      };

      const res = await test
        .request(TEST_USER_1)
        .post('/auth/me/settings')
        .send(updateData);

      expectStatus(res, 200);
      expect(res.body).toEqual(
        expect.objectContaining({
          userId: TEST_USER_1.appId,
          emailNotifications: updateData.emailNotifications,
          pushNotifications: updateData.pushNotifications,
        }),
      );
    });

    it('should update only provided fields', async () => {
      // First set initial data
      const initialData = {
        whoCanSeeVotesOnMyPosts: SettingsVisibilityEnum.FOLLOWERS,
        whoCanSeeLikesOnMyPosts: SettingsVisibilityEnum.FOLLOWERS,
      };

      await test
        .request(TEST_USER_1)
        .post('/auth/me/settings')
        .send(initialData);

      // Then update only some fields
      const updateData = {
        whoCanSeeVotesOnMyPosts: SettingsVisibilityEnum.NONE,
        whoCanMessageMe: SettingsVisibilityEnum.NONE,
      };

      const res = await test
        .request(TEST_USER_1)
        .post('/auth/me/settings')
        .send(updateData);

      expectStatus(res, 200);
      expect(res.body).toEqual(
        expect.objectContaining({
          whoCanSeeVotesOnMyPosts: SettingsVisibilityEnum.NONE,
          whoCanSeeLikesOnMyPosts: SettingsVisibilityEnum.FOLLOWERS,
          whoCanMessageMe: SettingsVisibilityEnum.NONE,
        }),
      );
    });

    it('should fail with invalid enum value', async () => {
      const invalidData = {
        whoCanSeeVotesOnMyPosts: 'INVALID_VALUE',
      };

      const res = await test
        .request(TEST_USER_1)
        .post('/auth/me/settings')
        .send(invalidData);

      expectStatus(res, 400);
    });

    it('should fail without auth token', async () => {
      const res = await test.request().post('/auth/me/settings').send({});

      expectStatus(res, 401);
    });

    it('should set and read disclaimers with timestamps', async () => {
      // Set disclaimers
      const disclaimerData = {
        disclaimers: {
          post: true,
          vote: true,
          signup: false,
        },
      };

      const setRes = await test
        .request(TEST_USER_1)
        .post('/auth/me/settings')
        .send(disclaimerData);

      expectStatus(setRes, 200);
      expect(setRes.body.disclaimers).toEqual(
        expect.objectContaining({
          post: expect.any(String), // Should be a timestamp
          vote: expect.any(String), // Should be a timestamp
        }),
      );
      expect(setRes.body.disclaimers.signup).toBeUndefined(); // false values should not be stored

      // Verify timestamps are valid ISO strings
      expect(new Date(setRes.body.disclaimers.post).toISOString()).toBe(
        setRes.body.disclaimers.post,
      );
      expect(new Date(setRes.body.disclaimers.vote).toISOString()).toBe(
        setRes.body.disclaimers.vote,
      );

      // Read back the settings
      const getRes = await test.request(TEST_USER_1).get('/auth/me/settings');
      expectStatus(getRes, 200);
      expect(getRes.body.disclaimers).toEqual(setRes.body.disclaimers);
    });

    it('should not overwrite existing disclaimers', async () => {
      // First, set a disclaimer
      const firstDisclaimer = {
        disclaimers: {
          post: true,
        },
      };

      const firstRes = await test
        .request(TEST_USER_1)
        .post('/auth/me/settings')
        .send(firstDisclaimer);

      expectStatus(firstRes, 200);
      const originalTimestamp = firstRes.body.disclaimers.post;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Try to set the same disclaimer again
      const secondDisclaimer = {
        disclaimers: {
          post: true,
          vote: true,
        },
      };

      const secondRes = await test
        .request(TEST_USER_1)
        .post('/auth/me/settings')
        .send(secondDisclaimer);

      expectStatus(secondRes, 200);

      // Original disclaimer should not be overwritten
      expect(secondRes.body.disclaimers.post).toBe(originalTimestamp);
      // New disclaimer should be added
      expect(secondRes.body.disclaimers.vote).toBeDefined();
      expect(secondRes.body.disclaimers.vote).not.toBe(originalTimestamp);
    });
  });

  describe('Different users have different settings', () => {
    it('should have different settings for different users', async () => {
      // Update settings for user 1
      const user1Settings = {
        whoCanSeeVotesOnMyPosts: SettingsVisibilityEnum.NONE,
        whoCanSeeLikesOnMyPosts: SettingsVisibilityEnum.NONE,
      };

      await test
        .request(TEST_USER_1)
        .post('/auth/me/settings')
        .send(user1Settings);

      // Update settings for user 2
      const user2Settings = {
        whoCanSeeVotesOnMyPosts: SettingsVisibilityEnum.FOLLOWERS,
        whoCanSeeLikesOnMyPosts: SettingsVisibilityEnum.FOLLOWERS,
      };

      await test
        .request(TEST_USER_2)
        .post('/auth/me/settings')
        .send(user2Settings);

      // Get settings for user 1
      const res1 = await test.request(TEST_USER_1).get('/auth/me/settings');
      expectStatus(res1, 200);
      expect(res1.body).toEqual(expect.objectContaining(user1Settings));

      // Get settings for user 2
      const res2 = await test.request(TEST_USER_2).get('/auth/me/settings');
      expectStatus(res2, 200);
      expect(res2.body).toEqual(expect.objectContaining(user2Settings));
    });
  });
});
