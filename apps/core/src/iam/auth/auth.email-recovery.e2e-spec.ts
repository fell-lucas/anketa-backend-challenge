import { ExceptionUnauthorizedEnum } from '@repo/system/errors/global.exceptions';
import { expectStatus, TestUtils } from '@repo/system/test/test.utils';
import { TEST_USER_1 } from '@repo/system/test/users.fixtures';
import { AppModule } from '../../app.module';
import { UserSeeds } from '../user/user.seeds';
import { AuthPhoneService } from './auth.phone.service';

const OTP_MOCK_CODE = '1234';
class MockAuthPhoneService extends AuthPhoneService {
  protected generateCode(): string {
    return OTP_MOCK_CODE;
  }
}

describe('AuthEmailRecoveryController (e2e)', () => {
  const test = new TestUtils(AppModule)
    .withModuleOverrides(async (module) => {
      module.overrideProvider(AuthPhoneService).useClass(MockAuthPhoneService);
    })
    .withDatabase([UserSeeds]);

  describe('auth/email-recovery/verify-phone', () => {
    const phoneNumber = TEST_USER_1.phoneNumber;
    it('verify phone number', async () => {
      const res = await test
        .request()
        .post('/auth/email-recovery/verify-phone')
        .send({
          phoneNumber,
        });
      expectStatus(res, 201);
      expect(res.body).toMatchObject({
        verificationId: expect.any(String),
      });

      const res2 = await test
        .request()
        .post('/auth/email-recovery/verify-otp')
        .send({
          verificationId: res.body.verificationId,
          code: OTP_MOCK_CODE,
        });
      expectStatus(res2, 200);
      expect(res2.body).toMatchObject({
        email: TEST_USER_1.email,
      });
    });

    it('verify phone with not registered phone number', async () => {
      const res = await test
        .request()
        .post('/auth/email-recovery/verify-phone')
        .send({
          phoneNumber: '+393289229000',
        });

      expectStatus(res, 401);
      expect(res.body.message).toBe(
        ExceptionUnauthorizedEnum.PHONE_NUMBER_NOT_FOUND,
      );
    });
  });
});
