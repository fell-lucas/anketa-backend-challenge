import {
  DirectSecp256k1HdWallet,
  makeCosmoshubPath,
} from '@cosmjs/proto-signing';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Seeds } from '@repo/system/test/seeds.interface';
import {
  TEST_USER_1,
  TEST_USER_2,
  TEST_USER_3,
  TEST_USER_4,
  TEST_USER_5,
  TEST_USER_6,
} from '@repo/system/test/users.fixtures';
import * as bcrypt from 'bcrypt';
import { DbService } from '../../libraries/db/db.service';
import { snakeCase } from 'lodash';

@Injectable()
export class UserSeeds implements Seeds {
  constructor(private db: DbService) {}

  static testPinCode = '1234';

  user1: User;
  user2: User;
  user3: User;
  user4: User;
  user5: User;
  user6: User;

  async seed(): Promise<void> {
    await this.createUsers();
  }

  async createUsers() {
    this.user1 = await this.db.user.create({
      data: {
        id: TEST_USER_1.appId,
        username: TEST_USER_1.username,
        phoneNumber: TEST_USER_1.phoneNumber,
        name: TEST_USER_1.name,
        email: TEST_USER_1.email,
        firebaseUid: TEST_USER_1.uid,
        pinCode: await bcrypt.hash(UserSeeds.testPinCode, 10),
        gender: 'male',
        dateOfBirth: new Date('1999-05-15'), // 25 years old (25-34 bracket)
      },
    });
    await this.db.userStats.create({
      data: {
        id: TEST_USER_1.appId,
      },
    });

    this.user2 = await this.db.user.create({
      data: {
        id: TEST_USER_2.appId,
        username: TEST_USER_2.username,
        name: TEST_USER_2.name,
        email: TEST_USER_2.email,
        firebaseUid: TEST_USER_2.uid,
        gender: 'female',
        dateOfBirth: new Date('1988-08-22'), // 36 years old (35-44 bracket)
      },
    });
    await this.db.userStats.create({
      data: {
        id: TEST_USER_2.appId,
      },
    });

    this.user3 = await this.db.user.create({
      data: {
        id: TEST_USER_3.appId,
        username: TEST_USER_3.username,
        name: TEST_USER_3.name,
        email: TEST_USER_3.email,
        firebaseUid: TEST_USER_3.uid,
        gender: 'non_binary',
        dateOfBirth: new Date('1978-12-03'), // 46 years old (45-54 bracket)
      },
    });
    await this.db.userStats.create({
      data: {
        id: TEST_USER_3.appId,
      },
    });

    // Dev users:
    const devUser = await this.db.user.create({
      data: {
        id: '33333333-3333-3333-3333-999999999992',
        username: 'marco',
        name: 'Marco',
        phoneNumber: '+351911573494',
        email: 'marco@pollpapa.com',
        firebaseUid: 'LYWdP32qF3bOGvJUv9kgExtUq9h2',
      },
    });
    await this.db.userStats.create({
      data: {
        id: '33333333-3333-3333-3333-999999999992',
      },
    });

    // Generate 20 random users
    const randomUsers = Array.from({ length: 20 }, () => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const username = snakeCase(
        faker.internet.displayName({ firstName, lastName }).toLowerCase(),
      );

      return {
        id: faker.string.uuid(),
        username,
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName }),
        phoneNumber: faker.helpers.fromRegExp('+[0-9]{11}'),
        bio: faker.lorem.sentence(),
        firebaseUid: faker.string.alphanumeric(28),
        city: faker.location.city(),
        country: faker.location.country(),
        latitude: Number(faker.location.latitude()),
        longitude: Number(faker.location.longitude()),
        dateOfBirth: faker.date.past({ years: 30 }),
      };
    });

    await this.db.user.createMany({
      data: randomUsers,
    });
    await this.db.userStats.createMany({
      data: randomUsers.map((user) => ({
        id: user.id,
      })),
    });

    // Create wallets for all users
    const allUsers = [this.user1, this.user2, this.user3, devUser];
    for (const user of allUsers) {
      const wallet = await DirectSecp256k1HdWallet.generate(24, {
        hdPaths: [0, 1, 2, 3, 4, 5].map(makeCosmoshubPath),
        prefix: 'anketa',
      });
      await this.db.wallet.create({
        data: {
          publicKey: '',
          mnemonic: wallet.mnemonic,
          userId: user.id,
        },
      });
    }
  }

  public async createUser(user: Partial<User> & { id?: string }) {
    const newUser = await this.db.user.create({
      data: {
        pinCode: await bcrypt.hash(UserSeeds.testPinCode, 10),
        ...(user as User),
      },
    });

    await this.db.userStats.create({
      data: {
        id: newUser.id,
      },
    });

    const wallet = await DirectSecp256k1HdWallet.generate(24, {
      hdPaths: [0, 1, 2, 3, 4, 5].map(makeCosmoshubPath),
      prefix: 'anketa',
    });
    await this.db.wallet.create({
      data: {
        publicKey: '',
        mnemonic: wallet.mnemonic,
        userId: newUser.id,
      },
    });

    return newUser;
  }

  /**
   * Creates extra test users (TEST_USER_4 and TEST_USER_5) for tests that need more than 3 users.
   * Should be called in beforeEach for tests that need these additional users.
   */
  async createExtraUsers() {
    this.user4 = await this.db.user.create({
      data: {
        id: TEST_USER_4.appId,
        username: TEST_USER_4.username,
        name: TEST_USER_4.name,
        email: TEST_USER_4.email,
        firebaseUid: TEST_USER_4.uid,
        gender: 'male',
        dateOfBirth: new Date('1995-03-10'), // 29 years old
      },
    });
    await this.db.userStats.create({
      data: {
        id: TEST_USER_4.appId,
      },
    });

    this.user5 = await this.db.user.create({
      data: {
        id: TEST_USER_5.appId,
        username: TEST_USER_5.username,
        name: TEST_USER_5.name,
        email: TEST_USER_5.email,
        firebaseUid: TEST_USER_5.uid,
        gender: 'female',
        dateOfBirth: new Date('1992-07-18'), // 32 years old
      },
    });
    await this.db.userStats.create({
      data: {
        id: TEST_USER_5.appId,
      },
    });

    this.user6 = await this.db.user.create({
      data: {
        id: TEST_USER_6.appId,
        username: TEST_USER_6.username,
        name: TEST_USER_6.name,
        email: TEST_USER_6.email,
        firebaseUid: TEST_USER_6.uid,
        gender: 'male',
        dateOfBirth: new Date('1990-11-25'), // 34 years old
      },
    });

    // Create wallets for the extra users
    const extraUsers = [this.user4, this.user5, this.user6];
    for (const user of extraUsers) {
      const wallet = await DirectSecp256k1HdWallet.generate(24, {
        hdPaths: [0, 1, 2, 3, 4, 5].map(makeCosmoshubPath),
        prefix: 'anketa',
      });
      await this.db.wallet.create({
        data: {
          publicKey: '',
          mnemonic: wallet.mnemonic,
          userId: user.id,
        },
      });
    }
  }
}
