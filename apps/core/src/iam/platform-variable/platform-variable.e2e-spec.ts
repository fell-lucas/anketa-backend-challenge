/// <reference types="jest" />
import { TestUtils, expectStatus } from '@repo/system/test/test.utils';
import { TEST_USER_1 } from '@repo/system/test/users.fixtures';
import { AppModule } from '../../app.module';
import { AdminSeeds } from '../admin/admin.seeds';
import { PlatformVariableSeeds } from './platform-variable.seeds';

describe('PlatformVariableController (e2e)', () => {
  const test = new TestUtils(AppModule).withDatabase([
    AdminSeeds,
    PlatformVariableSeeds,
  ]);

  describe('GET /platform-variables', () => {
    it('should return all platform variables for authenticated user', async () => {
      const res = await test.request(TEST_USER_1).get('/platform-variables');
      expectStatus(res, 200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'app_version',
            category: 'app',
            value: '1.0.0',
            id: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ]),
      );
    });
  });

  describe('GET /platform-variables/:name', () => {
    it('should return a single platform variable by name for authenticated user', async () => {
      const res = await test
        .request(TEST_USER_1)
        .get('/platform-variables/app_version');
      expectStatus(res, 200);
      expect(res.body).toEqual(
        expect.objectContaining({
          name: 'app_version',
          category: 'app',
          value: '1.0.0',
          id: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
    });
  });
});
