import { UserErrorsEnum } from '@repo/system/errors/global.exceptions';
import { expectStatus, TestUtils } from '@repo/system/test/test.utils';
import { TEST_USER_1 } from '@repo/system/test/users.fixtures';
import { AppModule } from '../../app.module';
import { DbService } from '../../libraries/db/db.service';
import { UserSeeds } from './user.seeds';

describe('User PIN Verification (e2e)', () => {
  const test = new TestUtils(AppModule).withDatabase([UserSeeds]);

  describe('POST /auth/me/verify-pin', () => {
    it('should verify a correct PIN code', async () => {
      const res = await test
        .request(TEST_USER_1)
        .post('/auth/me/verify-pin')
        .send({ pinCode: UserSeeds.testPinCode });

      expectStatus(res, 200);
      expect(res.body).toMatchObject({ verified: true });
    });

    it('should reject an incorrect PIN code', async () => {
      const res = await test
        .request(TEST_USER_1)
        .post('/auth/me/verify-pin')
        .send({ pinCode: 'wrong-pin' });

      expectStatus(res, 200);
      expect(res.body).toMatchObject({ verified: false });
    });

    it('should reject if PIN code is not set', async () => {
      // Remove the PIN code for the test user
      const db = test.get(DbService);
      await db.user.update({
        where: { id: TEST_USER_1.appId },
        data: { pinCode: null },
      });

      const res = await test
        .request(TEST_USER_1)
        .post('/auth/me/verify-pin')
        .send({ pinCode: UserSeeds.testPinCode });

      expectStatus(res, 400);
      expect(res.body).toMatchObject({
        message: UserErrorsEnum.PIN_CODE_NOT_SET,
      });
    });

    it('should require authentication', async () => {
      const res = await test
        .request()
        .post('/auth/me/verify-pin')
        .send({ pinCode: UserSeeds.testPinCode });

      expectStatus(res, 401);
    });

    it('should validate PIN code format', async () => {
      // Test with PIN code that's too short
      const shortPinRes = await test
        .request(TEST_USER_1)
        .post('/auth/me/verify-pin')
        .send({ pinCode: '123' });

      expectStatus(shortPinRes, 400);
      expect(shortPinRes.body.message[0].message).toContain('pinCode');

      // Test with PIN code that's too long
      const longPinRes = await test
        .request(TEST_USER_1)
        .post('/auth/me/verify-pin')
        .send({ pinCode: '1234567890123' });

      expectStatus(longPinRes, 400);
      expect(longPinRes.body.message[0].message).toContain('pinCode');

      // Test with non-string PIN code
      const nonStringPinRes = await test
        .request(TEST_USER_1)
        .post('/auth/me/verify-pin')
        .send({ pinCode: 123456 });

      expectStatus(nonStringPinRes, 400);
      expect(nonStringPinRes.body.message[0].message).toContain('pinCode');
    });
  });

  describe('PATCH /auth/me (setting PIN code)', () => {
    it('should set a new PIN code', async () => {
      const newPinCode = '9999';

      // Set the new PIN code
      const updateRes = await test
        .request(TEST_USER_1)
        .patch('/auth/me')
        .send({ pinCode: newPinCode });

      expectStatus(updateRes, 200);

      // Verify the new PIN code works
      const verifyRes = await test
        .request(TEST_USER_1)
        .post('/auth/me/verify-pin')
        .send({ pinCode: newPinCode });

      expectStatus(verifyRes, 200);
      expect(verifyRes.body).toMatchObject({ verified: true });

      // Verify the old PIN code no longer works
      const oldPinRes = await test
        .request(TEST_USER_1)
        .post('/auth/me/verify-pin')
        .send({ pinCode: UserSeeds.testPinCode });

      expectStatus(oldPinRes, 200);
      expect(oldPinRes.body).toMatchObject({ verified: false });
    });
  });
});
