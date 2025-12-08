import { expectStatus, TestUtils } from '@repo/system/test/test.utils';
import { TEST_USER_1, TEST_USER_2 } from '@repo/system/test/users.fixtures';
import { AppModule } from '../../app.module';
import { UserSeeds } from '../user/user.seeds';
import { UserInfoSeeds } from './user-info.seeds';

describe('UserInfoController (e2e)', () => {
  const test = new TestUtils(AppModule).withDatabase([
    UserSeeds,
    UserInfoSeeds,
  ]);

  describe('POST /auth/me/profile-information', () => {
    it('should update profile information for current user', async () => {
      const profileData = {
        maritalStatus: 'MARRIED',
        education: 'BACHELORS',
        industry: 'Technology',
        profession: 'Software Engineer',
        religion: 'Agnostic',
        politicalAffiliation: 'Independent',
      };

      const res = await test
        .request(TEST_USER_1)
        .post('/auth/me/profile-information')
        .send(profileData);

      expectStatus(res, 201);
      expect(res.body).toEqual(
        expect.objectContaining({
          userId: TEST_USER_1.appId,
          data: expect.objectContaining(profileData),
        }),
      );
    });

    it('should update only provided fields', async () => {
      // First set initial data
      const initialData = {
        maritalStatus: 'SINGLE',
        education: 'MASTERS',
        industry: 'Healthcare',
      };

      await test
        .request(TEST_USER_1)
        .post('/auth/me/profile-information')
        .send(initialData);

      // Then update only some fields
      const updateData = {
        maritalStatus: 'MARRIED',
        religion: 'Buddhism',
      };

      const res = await test
        .request(TEST_USER_1)
        .post('/auth/me/profile-information')
        .send(updateData);

      expectStatus(res, 201);
      expect(res.body.data).toEqual(
        expect.objectContaining({
          ...initialData,
          ...updateData,
        }),
      );
    });

    it('should fail with invalid data', async () => {
      const invalidData = {
        industry: 'A'.repeat(51), // Exceeds max length of 50
      };

      const res = await test
        .request(TEST_USER_1)
        .post('/auth/me/profile-information')
        .send(invalidData);

      expectStatus(res, 400);
    });

    it('should fail without auth token', async () => {
      const res = await test
        .request()
        .post('/auth/me/profile-information')
        .send({});

      expectStatus(res, 401);
    });
  });

  describe('GET /auth/me/profile-information', () => {
    it('should get profile information for current user', async () => {
      // Use the seeded data for verification
      const res = await test
        .request(TEST_USER_1)
        .get('/auth/me/profile-information');

      expectStatus(res, 200);
      expect(res.body).toEqual(
        expect.objectContaining({
          userId: TEST_USER_1.appId,
          data: expect.objectContaining({
            maritalStatus: 'MARRIED',
            education: 'BACHELORS',
            industry: 'Technology',
            profession: 'Software Engineer',
          }),
        }),
      );
    });

    it('should get different profile information for another user', async () => {
      const res = await test
        .request(TEST_USER_2)
        .get('/auth/me/profile-information');

      expectStatus(res, 200);
      expect(res.body).toEqual(
        expect.objectContaining({
          userId: TEST_USER_2.appId,
          data: expect.objectContaining({
            maritalStatus: 'SINGLE',
            education: 'MASTERS',
            industry: 'Healthcare',
            profession: 'Doctor',
          }),
        }),
      );
    });

    it('should return empty data if no profile information exists', async () => {
      // First delete any existing profile info from database
      await test.prismaService.userProfileInformation.deleteMany({
        where: { userId: TEST_USER_1.appId },
      });

      const res = await test
        .request(TEST_USER_1)
        .get('/auth/me/profile-information');

      expectStatus(res, 200);
      expect(res.body.data).toEqual({});
    });

    it('should fail without auth token', async () => {
      const res = await test.request().get('/auth/me/profile-information');

      expectStatus(res, 401);
    });
  });
});
