import { UserErrorsEnum } from '@repo/system/errors/global.exceptions';
import { expectStatus, TestUtils } from '@repo/system/test/test.utils';
import { TEST_USER_1, TEST_USER_2 } from '@repo/system/test/users.fixtures';
import { AwsService } from 'src/libraries/aws/aws.service';
import { AwsTestService } from 'src/libraries/aws/aws.test.service';
import { EmailSeeds } from 'src/libraries/email/email.seeds';
import { InngestService } from 'src/libraries/inngest/inngest.service';
import { ActivityPointsSeeds } from 'src/seeds/activity-points.seeds';
import { AppModule } from '../../app.module';
import { DbService } from '../../libraries/db/db.service';
import { InngestTestService } from '../../libraries/inngest/inngest.test.service';
import { UserGenderEnum } from './user.gender.enum';
import { UserSeeds } from './user.seeds';

describe('UserController (e2e)', () => {
  const test = new TestUtils(AppModule)
    .withModuleOverrides(async () => {})
    .withDatabase([UserSeeds, ActivityPointsSeeds, EmailSeeds]);

  describe('me (GET)', () => {
    it('authorized', async () => {
      const res = await test.request(TEST_USER_1).get('/users/me');
      expectStatus(res, 200);
      const user = await test.get(UserSeeds).user1;
      user.createdAt = user.updatedAt = expect.any(String);
      expect(res.body).toMatchObject({
        id: user.id,
        firebaseUid: user.firebaseUid,
        dateOfBirth: expect.any(String),
        pinCode: '********',
      });
    });

    it('unauthorized', async () => {
      const res = await test.request().get('/users/me');
      expectStatus(res, 401);
    });

    //TODO: we have a flaky test here, sometimes it fails with a 500 No User found
    /* it('user not registered', async () => {
      const res = await test.request(TEST_USER_NOT_REGISTERED).get('/users/me');
      expectStatus(res, 401);
      
      expect(res.body).toMatchObject({
        message: ExceptionUnauthorizedEnum.USER_NOT_REGISTERED,
      });
    }); */
  });

  describe('me (PATCH)', () => {
    it('change bio', async () => {
      const res = await test.request(TEST_USER_1).patch('/auth/me').send({
        bio: 'Custom bio',
      });
      expectStatus(res, 200);
      expect(res.body).toMatchObject({
        bio: 'Custom bio',
      });
    });

    it('change date of birth', async () => {
      const res = await test
        .request(TEST_USER_1)
        .patch('/auth/me')
        .send({
          dateOfBirth: new Date('1990-01-01'),
        });
      expectStatus(res, 200);
      expect(res.body).toMatchObject({
        dateOfBirth: new Date('1990-01-01').toISOString(),
      });
    });

    it('username available', async () => {
      const res = await test.request(TEST_USER_1).patch('/auth/me').send({
        username: 'custom',
        name: 'Custom',
        gender: UserGenderEnum.MALE,
        bio: 'Custom bio',
      });
      expectStatus(res, 200);
      expect(res.body).toMatchObject({
        username: 'custom',
        name: 'Custom',
        gender: UserGenderEnum.MALE,
        bio: 'Custom bio',
      });
    });

    it('username from the same user', async () => {
      const res = await test.request(TEST_USER_1).patch('/auth/me').send({
        username: TEST_USER_1.username,
      });
      expectStatus(res, 200);
      expect(res.body).toMatchObject({
        username: TEST_USER_1.username,
      });
    });

    it('username not available', async () => {
      const res = await test.request(TEST_USER_1).patch('/auth/me').send({
        username: TEST_USER_2.username,
      });
      expectStatus(res, 400);
      expect(res.body).toMatchObject({
        message: UserErrorsEnum.USERNAME_ALREADY_EXISTS,
      });
    });

    it('change city', async () => {
      const res = await test.request(TEST_USER_1).patch('/auth/me').send({
        city: 'Rome',
      });
      expectStatus(res, 200);
      expect(res.body).toMatchObject({
        city: 'Rome',
      });
    });

    it('change latitude and longitude', async () => {
      const res = await test.request(TEST_USER_1).patch('/auth/me').send({
        latitude: 41.9028,
        longitude: 12.4964,
      });
      expectStatus(res, 200);
    });

    it('change profile links', async () => {
      const res = await test
        .request(TEST_USER_1)
        .patch('/auth/me')
        .send({
          links: ['https://www.google.com', 'https://www.facebook.com'],
        });
      expectStatus(res, 200);
      expect(res.body.links).toEqual([
        'https://www.google.com',
        'https://www.facebook.com',
      ]);
    });

    it.each([
      '_invalid',
      'invalid_',
      'inva__lid',
      '.invalid',
      'invalid.',
      'inval..id',
      'inva+lid',
      ' invalid',
      'admin',
    ])('invalid username: %s', async (username) => {
      const res = await test.request(TEST_USER_1).patch('/auth/me').send({
        username,
      });
      expectStatus(res, 400);
    });

    it('should set profile to private when visibility is false', async () => {
      const res = await test.request(TEST_USER_1).patch('/auth/me').send({
        visibility: 'PRIVATE',
      });
      expectStatus(res, 200);
      expect(res.body).toMatchObject({
        visibility: 'PRIVATE',
      });
    });
  });

  describe('GET /users', () => {
    it('should paginate users with limit 10', async () => {
      const firstPage = await test
        .request(TEST_USER_1)
        .get('/users')
        .query({ limit: 10, sortBy: 'name', sortOrder: 'asc' });

      expectStatus(firstPage, 200);
      expect(firstPage.body.users).toHaveLength(10);
      expect(firstPage.body.nextCursor).toBeDefined();

      // Get next page using the cursor
      const secondPage = await test.request(TEST_USER_1).get('/users').query({
        limit: 10,
        cursor: firstPage.body.nextCursor,
        sortBy: 'name',
        sortOrder: 'asc',
      });

      expectStatus(secondPage, 200);
      expect(secondPage.body.users).toHaveLength(10);
      expect(secondPage.body.users).not.toEqual(firstPage.body.users);

      // Verify no duplicate users between pages
      const firstPageIds = firstPage.body.users.map((u) => u.id);
      const secondPageIds = secondPage.body.users.map((u) => u.id);
      const intersection = firstPageIds.filter((id) =>
        secondPageIds.includes(id),
      );
      expect(intersection).toHaveLength(0);
    });

    it('should search users by name', async () => {
      const user = await test.get(UserSeeds).user1;

      const res = await test
        .request(TEST_USER_2) //NB: search exclude current user
        .get('/users')
        .query({ name: user.name, limit: 10 });

      expectStatus(res, 200);
      expect(res.body.users.length).toBeGreaterThan(0);

      // Check that all returned users have the search term in their name or username
      for (const returnedUser of res.body.users) {
        const nameMatch = returnedUser.name
          ?.toLowerCase()
          .includes(user.name.toLowerCase());
        const usernameMatch = returnedUser.username
          ?.toLowerCase()
          .includes(user.name.toLowerCase());
        expect(nameMatch || usernameMatch).toBe(true);
      }
    });

    it('should search users by username', async () => {
      const user = await test.get(UserSeeds).user2;

      // Ensure user has a username to search for
      if (!user.username) {
        await test.get(DbService).user.update({
          where: { id: user.id },
          data: { username: 'testuser2' },
        });
        user.username = 'testuser2';
      }

      const res = await test
        .request(TEST_USER_1) // NB: search from another user
        .get('/users')
        .query({ name: user.username, limit: 10 });

      expectStatus(res, 200);
      expect(res.body.users.length).toBeGreaterThan(0);

      // Check that at least one returned user matches the username search
      const foundUser = res.body.users.find(
        (u) =>
          u.username?.toLowerCase().includes(user.username.toLowerCase()) ||
          u.name?.toLowerCase().includes(user.username.toLowerCase()),
      );
      expect(foundUser).toBeDefined();
    });

    it('should return empty results for non-existent search term', async () => {
      const res = await test
        .request(TEST_USER_2)
        .get('/users')
        .query({ name: 'nonexistentusername12345', limit: 10 });

      expectStatus(res, 200);
      expect(res.body.users).toHaveLength(0);
      expect(res.body.nextCursor).toBeNull();
    });

    it('should perform case-insensitive search', async () => {
      const user = await test.get(UserSeeds).user1;

      const res = await test
        .request(TEST_USER_2)
        .get('/users')
        .query({ name: user.name.toUpperCase(), limit: 10 });

      expectStatus(res, 200);
      expect(res.body.users.length).toBeGreaterThan(0);

      // Check that the search found users despite different case
      const foundUser = res.body.users.find(
        (u) => u.name?.toLowerCase() === user.name.toLowerCase(),
      );
      expect(foundUser).toBeDefined();
    });

    it('should exclude current user', async () => {
      const user = await test.get(UserSeeds).user1;

      const res = await test.request(TEST_USER_1).get('/users');

      expectStatus(res, 200);
      expect(res.body.users.length).toBeGreaterThan(0);
      expect(res.body.users.map((u) => u.id)).not.toContain(user.id);
    });

    it('should require authentication', async () => {
      const res = await test.request().get('/users');
      expectStatus(res, 401);
    });

    it('should return all users without cursor when limit matches total users', async () => {
      // Get total user count from database
      const db = test.get(DbService);
      const totalUsers = await db.user.count();

      const res = await test.request(TEST_USER_1).get('/users').query({
        limit: totalUsers,
        sortBy: 'name',
        sortOrder: 'asc',
      });

      expectStatus(res, 200);
      expect(res.body.users).toHaveLength(totalUsers - 1); // NB: exclude current user
      expect(res.body.nextCursor).toBeNull();
    });
  });

  describe('GET /users/:id', () => {
    it('should return user details', async () => {
      const user = await test.get(UserSeeds).user2;
      const res = await test.request(TEST_USER_1).get(`/users/${user.id}`);

      expectStatus(res, 200);
      expect(res.body).toMatchObject({
        id: user.id,
        name: user.name,
        username: user.username,
        userStats: {
          followersCount: 0,
          followeesCount: 0,
          circlesCount: 0,
          publishedPostsCount: 0,
          publishedPollPostsCount: 0,
          publishedSurveyPostsCount: 0,
          draftPostsCount: 0,
          scheduledPostsCount: 0,
          purchasedPostsCount: 0,
          likedPostsCount: 0,
          repostedPostsCount: 0,
          feedPostsCount: 0,
        },
      });
    });

    it('should return 404 for non-existent user', async () => {
      const res = await test
        .request(TEST_USER_1)
        .get('/users/22222222-2222-2222-2222-222222222229');
      expectStatus(res, 404);
    });

    it('should require authentication', async () => {
      const user = await test.get(UserSeeds).user1;
      const res = await test.request().get(`/users/${user.id}`);
      expectStatus(res, 401);
    });
  });

  describe('GET /users/username/:username', () => {
    it('should return user details', async () => {
      const user = await test.get(UserSeeds).user2;
      const res = await test
        .request(TEST_USER_1)
        .get(`/users/username/${user.username}`);

      expectStatus(res, 200);
      expect(res.body).toMatchObject({
        id: user.id,
        name: user.name,
        username: user.username,
        userStats: {
          followersCount: 0,
          followeesCount: 0,
          circlesCount: 0,
          publishedPostsCount: 0,
          publishedPollPostsCount: 0,
          publishedSurveyPostsCount: 0,
          draftPostsCount: 0,
          scheduledPostsCount: 0,
          purchasedPostsCount: 0,
          likedPostsCount: 0,
          repostedPostsCount: 0,
          feedPostsCount: 0,
        },
      });
    });
  });

  describe('GET /users/me', () => {
    it('should return user details with pinCode', async () => {
      const res = await test.request(TEST_USER_1).get('/users/me');
      expectStatus(res, 200);
      expect(res.body.pinCode).toBe('********');
    });
  });

  describe('DELETE /users/me', () => {
    it('should schedule user deletion for 45 days from now', async () => {
      const db = test.get(DbService);

      // First, verify the user exists and has data
      const userBefore = await db.user.findUnique({
        where: { id: TEST_USER_1.appId },
      });
      expect(userBefore).toBeDefined();
      expect(userBefore.deletedAt).toBeNull();
      expect(userBefore.willDeleteAt).toBeNull();
      expect(userBefore.email).toBeDefined();
      expect(userBefore.firebaseUid).toBeDefined();

      // Schedule deletion
      const res = await test.request(TEST_USER_1).delete('/users/me').send({
        deleteReason: 'Test delete reason',
      });
      expectStatus(res, 200);
      expect(res.body).toMatchObject({
        scheduled: true,
        willDeleteAt: expect.any(String),
      });

      // Verify user is scheduled for deletion but not yet deleted
      const userAfter = await db.user.findUnique({
        where: { id: TEST_USER_1.appId },
      });
      expect(userAfter).toBeDefined();
      expect(userAfter.deletedAt).toBeNull(); // Not deleted yet
      expect(userAfter.willDeleteAt).not.toBeNull();
      expect(userAfter.willDeleteAt).toBeInstanceOf(Date);
      expect(userAfter.deleteReason).toBe('Test delete reason');

      // Verify scheduled deletion date is approximately 45 days from now
      const now = new Date();
      const scheduledDate = userAfter.willDeleteAt;
      const daysDifference = Math.floor(
        (scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      expect(daysDifference).toBeGreaterThanOrEqual(44);
      expect(daysDifference).toBeLessThanOrEqual(45);

      // Verify user data is still intact (not anonymized yet)
      expect(userAfter.email).toEqual(userBefore.email);
      expect(userAfter.username).toEqual(userBefore.username);
      expect(userAfter.phoneNumber).toEqual(userBefore.phoneNumber);
      expect(userAfter.firebaseUid).toEqual(userBefore.firebaseUid);
      expect(userAfter.name).toEqual(userBefore.name);
      expect(userAfter.bio).toEqual(userBefore.bio);
      expect(userAfter.city).toEqual(userBefore.city);
      expect(userAfter.country).toEqual(userBefore.country);
    });

    it('should still return user in profile lookups after scheduling deletion', async () => {
      // Schedule deletion
      const deleteRes = await test
        .request(TEST_USER_1)
        .delete('/users/me')
        .send({
          deleteReason: 'Test delete reason',
        });
      expectStatus(deleteRes, 200);

      // Try to get the user profile - should still work since user is not deleted yet
      const profileRes = await test
        .request(TEST_USER_2)
        .get(`/users/${TEST_USER_1.appId}`);
      expectStatus(profileRes, 200);
      expect(profileRes.body.id).toBe(TEST_USER_1.appId);
    });

    it('should still return user in user searches after scheduling deletion', async () => {
      const userBefore = await test.get(UserSeeds).user1;

      // Schedule deletion
      const deleteRes = await test
        .request(TEST_USER_1)
        .delete('/users/me')
        .send({
          deleteReason: 'Test delete reason',
        });
      expectStatus(deleteRes, 200);

      // Search for users - scheduled user should still appear
      const searchRes = await test
        .request(TEST_USER_2)
        .get('/users')
        .query({ name: userBefore.name, limit: 10 });
      expectStatus(searchRes, 200);

      // Verify scheduled user is still in search results
      const userIds = searchRes.body.users.map((u) => u.id);
      expect(userIds).toContain(TEST_USER_1.appId);
    });

    it('should not allow username reuse after scheduling deletion (username still taken)', async () => {
      // Set a username for the user first
      await test.request(TEST_USER_1).patch('/auth/me').send({
        username: 'testusername123',
      });

      // Schedule deletion
      const deleteRes = await test
        .request(TEST_USER_1)
        .delete('/users/me')
        .send({
          deleteReason: 'Test delete reason',
        });
      expectStatus(deleteRes, 200);

      // Try to use the same username with another user - should fail since user is not deleted yet
      const usernameRes = await test
        .request(TEST_USER_2)
        .patch('/auth/me')
        .send({
          username: 'testusername123',
        });
      expectStatus(usernameRes, 400);
      expect(usernameRes.body.message).toBe(
        UserErrorsEnum.USERNAME_ALREADY_EXISTS,
      );
    });

    it('should not allow email reuse after scheduling deletion (email still taken)', async () => {
      const db = test.get(DbService);
      const originalEmail = 'test.email@example.com';

      // Set email for the user
      await db.user.update({
        where: { id: TEST_USER_1.appId },
        data: { email: originalEmail },
      });

      // Schedule deletion
      const deleteRes = await test
        .request(TEST_USER_1)
        .delete('/users/me')
        .send({
          deleteReason: 'Test delete reason',
        });
      expectStatus(deleteRes, 200);

      // Try to create a new user with the same email - should fail since user is not deleted yet
      try {
        await db.user.create({
          data: {
            name: 'New User',
            email: originalEmail,
            firebaseUid: 'new-firebase-uid',
          },
        });
        // If we get here, the test should fail
        expect(true).toBe(false);
      } catch (error) {
        // Expect a unique constraint error
        expect(error.code).toBe('P2002');
      }
    });

    it('should require authentication', async () => {
      const res = await test.request().delete('/users/me').send({
        deleteReason: 'Test delete reason',
      });
      expectStatus(res, 401);
    });

    it('should handle user not registered', async () => {
      // Create a request with an auth token but no corresponding user in our system
      const fakeUserRequest = {
        ...TEST_USER_1,
        token: 'token_user_not_registered',
        appId: '99999999-9999-9999-9999-999999999999', // Non-existent user ID
      };

      const res = await test.request(fakeUserRequest).delete('/users/me').send({
        deleteReason: 'Test delete reason',
      });
      expectStatus(res, 401);
    });

    it('should unschedule deletion when user logs in', async () => {
      const db = test.get(DbService);

      // First schedule deletion
      const deleteRes = await test
        .request(TEST_USER_1)
        .delete('/users/me')
        .send({
          deleteReason: 'Test delete reason',
        });
      expectStatus(deleteRes, 200);

      // Verify user is scheduled for deletion
      let user = await db.user.findUnique({
        where: { id: TEST_USER_1.appId },
      });
      expect(user.willDeleteAt).not.toBeNull();

      // Simulate user login (this should unschedule deletion)
      const loginRes = await test.request(TEST_USER_1).post('/auth/login');
      expectStatus(loginRes, 201);

      // Verify user deletion is unscheduled
      user = await db.user.findUnique({
        where: { id: TEST_USER_1.appId },
      });
      expect(user.willDeleteAt).toBeNull();
    });

    it('should actually delete and anonymize user when deferred events are executed', async () => {
      const db = test.get(DbService);

      // First, verify the user exists and has data
      const userBefore = await db.user.findUnique({
        where: { id: TEST_USER_1.appId },
      });
      expect(userBefore).toBeDefined();
      expect(userBefore.deletedAt).toBeNull();
      expect(userBefore.willDeleteAt).toBeNull();
      expect(userBefore.email).toBeDefined();
      expect(userBefore.firebaseUid).toBeDefined();

      // Schedule deletion
      const deleteRes = await test
        .request(TEST_USER_1)
        .delete('/users/me')
        .send({
          deleteReason: 'Test delete reason',
        });
      expectStatus(deleteRes, 200);

      // Verify user is scheduled for deletion but not yet deleted
      const userAfterScheduling = await db.user.findUnique({
        where: { id: TEST_USER_1.appId },
      });
      expect(userAfterScheduling.deletedAt).toBeNull();
      expect(userAfterScheduling.willDeleteAt).not.toBeNull();
      expect(userAfterScheduling.email).toEqual(userBefore.email);
      expect(userAfterScheduling.name).toEqual(userBefore.name);

      // Execute deferred events to simulate the scheduled deletion
      await await (
        test.get(InngestService) as any as InngestTestService
      ).executeDeferredEvents();

      // Verify user is now actually deleted and anonymized
      const userAfterDeletion = await db.user.findUnique({
        where: { id: TEST_USER_1.appId },
      });
      expect(userAfterDeletion).toBeDefined();
      expect(userAfterDeletion.deletedAt).not.toBeNull();
      expect(userAfterDeletion.deletedAt).toBeInstanceOf(Date);
      expect(userAfterDeletion.willDeleteAt).toBeNull(); // Cleared after deletion

      // Verify anonymization
      expect(userAfterDeletion.email).toBeNull();
      expect(userAfterDeletion.username).toBeNull();
      expect(userAfterDeletion.phoneNumber).toBeNull();
      expect(userAfterDeletion.firebaseUid).toBeNull();
      expect(userAfterDeletion.pinCode).toBeNull();
      expect(userAfterDeletion.bio).toBeNull();
      expect(userAfterDeletion.city).toBeNull();
      expect(userAfterDeletion.country).toBeNull();
      expect(userAfterDeletion.latitude).toBeNull();
      expect(userAfterDeletion.longitude).toBeNull();
      expect(userAfterDeletion.links).toEqual([]);
      expect(userAfterDeletion.profilePicturePublicId).toBeNull();
      expect(userAfterDeletion.googleUserId).toBeNull();
      expect(userAfterDeletion.googleToken).toBeNull();
      expect(userAfterDeletion.appleUserId).toBeNull();
      expect(userAfterDeletion.appleToken).toBeNull();
      expect(userAfterDeletion.streamToken).toBeNull();

      // Verify name is anonymized with pattern "UserXXXXXX"
      expect(userAfterDeletion.name).toMatch(/^User\d+$/);
      expect(userAfterDeletion.name).not.toEqual(userBefore.name);

      // Should send email notification
      const awsService = test.get(AwsService) as any as AwsTestService;
      expect(awsService.sentEmails).toHaveLength(1);
      expect(awsService.sentEmails[0]).toMatchObject({
        to: userBefore.email,
        subject: 'Your account has been deleted',
      });
    });
  });
});
