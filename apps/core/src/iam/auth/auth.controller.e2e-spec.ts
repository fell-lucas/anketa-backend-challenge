import { UserErrorsEnum } from '@repo/system/errors/global.exceptions';
import { expectStatus, TestUtils } from '@repo/system/test/test.utils';
import {
  TEST_USER_1,
  TEST_USER_1_BUT_CHANGED_EMAIL,
  TEST_USER_1_NOT_REGISTERED_BUT_SAME_EMAIL,
  TEST_USER_2,
  TEST_USER_2_BUT_CHANGED_EMAIL_CONFLICT,
  TEST_USER_3,
  TEST_USER_NOT_REGISTERED,
} from '@repo/system/test/users.fixtures';
import { AwsTestService } from 'src/libraries/aws/aws.test.service';
import { AppModule } from '../../app.module';
import { AwsService } from '../../libraries/aws/aws.service';
import { EmailSeeds } from '../../libraries/email/email.seeds';
import { ActivityPointsSeeds } from '../../seeds/activity-points.seeds';
import { UserSeeds } from '../user/user.seeds';
import { AuthPhoneService } from './auth.phone.service';

const OTP_MOCK_CODE = '1234';
class MockAuthPhoneService extends AuthPhoneService {
  protected generateCode(): string {
    return OTP_MOCK_CODE;
  }

  get demoAccountAppId() {
    return TEST_USER_3.appId;
  }
}

describe('AuthController (e2e)', () => {
  const test = new TestUtils(AppModule)
    .withModuleOverrides(async (module) => {
      module.overrideProvider(AuthPhoneService).useClass(MockAuthPhoneService);
    })
    .withDatabase([UserSeeds, ActivityPointsSeeds, EmailSeeds]);

  it('/ (GET)', () => {
    return test.request().get('/').expect(404);
  });

  describe('/me (GET)', () => {
    it('should return user details with pinCode', async () => {
      const res = await test.request(TEST_USER_1).get('/users/me');
      expectStatus(res, 200);
      expect(res.body.pinCode).toBe('********');
    });
  });

  describe('/me (POST)', () => {
    it('not registered', async () => {
      const res = await test
        .request(TEST_USER_NOT_REGISTERED)
        .post('/auth/me')
        .send({});

      expect(res.status).toBe(201);
      const user = await test.get(UserSeeds).user1;
      user.createdAt = user.updatedAt = user.lastSeenAt = expect.any(String);
      expect(res.body).toMatchObject({
        email: TEST_USER_NOT_REGISTERED.email,
        name: TEST_USER_NOT_REGISTERED.name,
        id: expect.any(String),
        username: null,
      });

      // Check that welcome email was sent
      const awsService = test.get(AwsService) as any as AwsTestService;
      expect(awsService.sentEmails).toHaveLength(1);
      expect(awsService.sentEmails[0]).toMatchObject({
        to: TEST_USER_NOT_REGISTERED.email,
        subject: `Welcome to Anketa - Glad You're Here`,
      });
      expect(awsService.sentEmails[0].htmlBody).toContain("Glad You're Here");
    });

    it('already registered', async () => {
      const res = await test.request(TEST_USER_1).post('/auth/me').send({});

      expect(res.status).toBe(201);
      const user = await test.get(UserSeeds).user1;
      user.createdAt = user.updatedAt = user.lastSeenAt = expect.any(String);
      expect(res.body).toMatchObject({
        ...user,
        dateOfBirth: user.dateOfBirth.toISOString(),
        pinCode: '********',
      });
    });

    it('not registered but same email', async () => {
      const res = await test
        .request(TEST_USER_1_NOT_REGISTERED_BUT_SAME_EMAIL)
        .post('/auth/me')
        .send({});
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        message: UserErrorsEnum.EMAIL_ALREADY_EXISTS,
      });
    });
  });

  describe('/username/:username/status', () => {
    it('available', async () => {
      const res = await test
        .request(TEST_USER_1)
        .get('/auth/username/anavailableusername/status');
      expectStatus(res, 200);
      expect(res.body).toMatchObject({ taken: false });
    });

    it('not available', async () => {
      const res = await test
        .request(TEST_USER_1)
        .get(`/auth/username/${TEST_USER_2.username}/status`);
      expectStatus(res, 200);
      expect(res.body).toMatchObject({ taken: true });
    });
  });

  describe('phone/verify', () => {
    const phoneNumber = '+393289229553';
    it('verify phone number', async () => {
      const res = await test
        .request(TEST_USER_1)
        .post('/auth/phone/verify')
        .send({
          phoneNumber,
        });
      expectStatus(res, 201);
      expect(res.body).toMatchObject({
        verificationId: expect.any(String),
      });

      const res2 = await test.request(TEST_USER_1).patch('/auth/phone').send({
        verificationId: res.body.verificationId,
        code: OTP_MOCK_CODE,
      });
      expect(res2.status).toBe(200);
      expect(res2.body).toMatchObject({
        email: TEST_USER_1.email,
        phoneNumber,
      });
    });

    it('verify phone number with demo account (uses 0000 code)', async () => {
      const demoPhoneNumber = '+393289229554';
      const res = await test
        .request(TEST_USER_3)
        .post('/auth/phone/verify')
        .send({
          phoneNumber: demoPhoneNumber,
        });
      expectStatus(res, 201);
      expect(res.body).toMatchObject({
        verificationId: expect.any(String),
      });

      const res2 = await test.request(TEST_USER_3).patch('/auth/phone').send({
        verificationId: res.body.verificationId,
        code: '0000', // Demo account uses 0000 instead of the mock code
      });
      expect(res2.status).toBe(200);
      expect(res2.body).toMatchObject({
        email: TEST_USER_3.email,
        phoneNumber: demoPhoneNumber,
      });
    });
  });

  describe('/auth/email (PATCH)', () => {
    it('should successfully change email', async () => {
      const res = await test
        .request(TEST_USER_1_BUT_CHANGED_EMAIL)
        .patch('/auth/email')
        .send();

      expectStatus(res, 200);
      expect(res.body).toMatchObject({
        id: expect.any(String),
        email: TEST_USER_1_BUT_CHANGED_EMAIL.email,
      });
    });

    it('should fail without authorization token', async () => {
      const res = await test.request().patch('/auth/email').send();

      expectStatus(res, 401);
    });

    it('should fail if user does not exist', async () => {
      const res = await test
        .request(TEST_USER_NOT_REGISTERED)
        .patch('/auth/email')
        .send();

      expectStatus(res, 404);
    });

    it('should fail if email already exists', async () => {
      const res = await test
        .request(TEST_USER_2_BUT_CHANGED_EMAIL_CONFLICT)
        .patch('/auth/email')
        .send();

      expectStatus(res, 400);
      expect(res.body).toMatchObject({
        message: UserErrorsEnum.EMAIL_ALREADY_EXISTS,
      });
    });
  });

  describe('/sign-up/check (POST)', () => {
    it('should allow signup in any environment which is not production', async () => {
      const res = await test.request().post('/auth/sign-up/check').send({
        email: TEST_USER_1.email,
      });
      expectStatus(res, 201);
      expect(res.body).toMatchObject({
        allowed: true,
      });
    });
  });

  describe('/login (POST)', () => {
    it('should successfully record login and assign daily active user points', async () => {
      const res = await test.request(TEST_USER_1).post('/auth/login').send();

      expectStatus(res, 201);
      expect(res.body).toMatchObject({
        success: true,
      });
    });

    it('should handle multiple login calls on the same day', async () => {
      // First login call
      const res1 = await test.request(TEST_USER_2).post('/auth/login').send();
      expectStatus(res1, 201);
      expect(res1.body).toMatchObject({
        success: true,
      });

      // Second login call on the same day
      const res2 = await test.request(TEST_USER_2).post('/auth/login').send();
      expectStatus(res2, 201);
      expect(res2.body).toMatchObject({
        success: true,
      });
    });
  });
});
