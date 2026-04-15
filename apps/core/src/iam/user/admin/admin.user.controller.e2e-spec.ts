import { expectStatus, TestUtils } from '@repo/system/test/test.utils';
import { TEST_ADMIN_1, TEST_USER_1 } from '@repo/system/test/users.fixtures';
import { AppModule } from '../../../app.module';
import { DbService } from '../../../libraries/db/db.service';
import { UserSeeds } from '../user.seeds';

describe('AdminUserController (e2e)', () => {
  const test = new TestUtils(AppModule)
    .withModuleOverrides(async () => {})
    .withDatabase([UserSeeds]);

  describe('GET /brainbox/users', () => {
    it('should find users with basic filters', async () => {
      const res = await test
        .request(TEST_ADMIN_1)
        .get('/brainbox/users')
        .query({ take: 10 });

      expectStatus(res, 200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('meta');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta).toHaveProperty('total');
      expect(res.body.meta).toHaveProperty('skip');
      expect(res.body.meta).toHaveProperty('take');
    });

    it('should search users by email', async () => {
      const user = await test.get(UserSeeds).user1;

      const res = await test
        .request(TEST_ADMIN_1)
        .get('/brainbox/users')
        .query({ email: user.email, take: 10 });

      expectStatus(res, 200);
      expect(res.body.data.length).toBeGreaterThan(0);

      // Check that returned users contain the search email
      const foundUser = res.body.data.find((u) => u.email === user.email);
      expect(foundUser).toBeDefined();
    });

    it('should search users by username', async () => {
      const user = await test.get(UserSeeds).user1;

      const res = await test
        .request(TEST_ADMIN_1)
        .get('/brainbox/users')
        .query({ username: user.username, take: 10 });

      expectStatus(res, 200);
      expect(res.body.data.length).toBeGreaterThan(0);

      // Check that returned users contain the search username
      const foundUser = res.body.data.find((u) => u.username === user.username);
      expect(foundUser).toBeDefined();
    });

    it('should filter users without wallet', async () => {
      const db = test.get(DbService);

      // Get a user and ensure they don't have a wallet
      const user = await test.get(UserSeeds).user1;
      await db.wallet.deleteMany({
        where: { userId: user.id },
      });

      const res = await test
        .request(TEST_ADMIN_1)
        .get('/brainbox/users')
        .query({ withoutWallet: true, take: 50 });

      expectStatus(res, 200);
      expect(res.body.data.length).toBeGreaterThan(0);

      // Verify that all returned users don't have wallets
      for (const returnedUser of res.body.data) {
        const userWallets = await db.wallet.findMany({
          where: { userId: returnedUser.id },
        });
        expect(userWallets).toHaveLength(0);
      }
    });

    it('should not filter users when withoutWallet is false', async () => {
      const db = test.get(DbService);

      // Create a wallet for a user to ensure we have users with wallets
      const user = await test.get(UserSeeds).user2;
      await db.wallet.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          publicKey: 'test-public-key',
          mnemonic: 'test-mnemonic',
        },
        update: {},
      });

      const res = await test
        .request(TEST_ADMIN_1)
        .get('/brainbox/users')
        .query({ withoutWallet: false, take: 50 });

      expectStatus(res, 200);
      expect(res.body.data.length).toBeGreaterThan(0);

      // Should include users with wallets
      const userWithWallet = res.body.data.find((u) => u.id === user.id);
      expect(userWithWallet).toBeDefined();
    });

    it('should combine withoutWallet filter with other filters', async () => {
      const db = test.get(DbService);

      // Ensure a user doesn't have a wallet
      const user = await test.get(UserSeeds).user1;
      await db.wallet.deleteMany({
        where: { userId: user.id },
      });

      const res = await test
        .request(TEST_ADMIN_1)
        .get('/brainbox/users')
        .query({
          withoutWallet: true,
          searchQuery: user.name.substring(0, 3), // Use part of the name
          take: 10,
        });

      expectStatus(res, 200);

      if (res.body.data.length > 0) {
        // If we found users, they should match both criteria
        for (const returnedUser of res.body.data) {
          // Should not have wallets
          const userWallets = await db.wallet.findMany({
            where: { userId: returnedUser.id },
          });
          expect(userWallets).toHaveLength(0);

          // Should match the search query
          const nameMatch = returnedUser.name
            ?.toLowerCase()
            .includes(user.name.substring(0, 3).toLowerCase());
          const emailMatch = returnedUser.email
            ?.toLowerCase()
            .includes(user.name.substring(0, 3).toLowerCase());
          const usernameMatch = returnedUser.username
            ?.toLowerCase()
            .includes(user.name.substring(0, 3).toLowerCase());
          expect(nameMatch || emailMatch || usernameMatch).toBe(true);
        }
      }
    });

    it('should require admin authentication', async () => {
      const res = await test.request().get('/brainbox/users');
      expectStatus(res, 401);
    });

    it('should deny non-admin users', async () => {
      const res = await test.request(TEST_USER_1).get('/brainbox/users');
      expectStatus(res, 401);
    });
  });
});
