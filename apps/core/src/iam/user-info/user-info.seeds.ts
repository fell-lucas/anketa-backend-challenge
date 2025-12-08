import { Injectable } from '@nestjs/common';
import { UserProfileInformation } from '@prisma/client';
import { Seeds } from '@repo/system/test/seeds.interface';
import { TEST_USER_1, TEST_USER_2 } from '@repo/system/test/users.fixtures';
import { DbService } from '../../libraries/db/db.service';

@Injectable()
export class UserInfoSeeds implements Seeds {
  constructor(private db: DbService) {}

  user1ProfileInfo: UserProfileInformation;
  user2ProfileInfo: UserProfileInformation;

  async seed(): Promise<void> {
    await this.createUserProfileInformation();
  }

  async createUserProfileInformation() {
    // Profile data for user1
    const user1ProfileData = {
      maritalStatus: 'MARRIED',
      education: 'BACHELORS',
      industry: 'Technology',
      profession: 'Software Engineer',
      religion: 'Christianity',
      politicalAffiliation: 'Independent',
      race: 'Caucasian',
      ethnicity: 'European',
      familySize: '4People',
      housing: 'Owned',
      averageMonthlyIncome: '5000-10000',
      householdIncomeInUSD: '100000-150000',
      serviceInTheMilitary: 'No',
      partnerServiceInTheMilitary: 'No',
      disabilityOrImpairment: 'None',
    };

    // Create profile information for user1
    this.user1ProfileInfo = await this.db.userProfileInformation.upsert({
      where: { userId: TEST_USER_1.appId },
      update: {
        data: user1ProfileData,
      },
      create: {
        userId: TEST_USER_1.appId,
        data: user1ProfileData,
      },
    });

    // Profile data for user2
    const user2ProfileData = {
      maritalStatus: 'SINGLE',
      education: 'MASTERS',
      industry: 'Healthcare',
      profession: 'Doctor',
      religion: 'Buddhism',
      politicalAffiliation: 'Liberal',
      race: 'Asian',
      ethnicity: 'East Asian',
      familySize: '1Person',
      housing: 'Rented',
      averageMonthlyIncome: '10000-15000',
      householdIncomeInUSD: '150000-200000',
      serviceInTheMilitary: 'Yes',
      partnerServiceInTheMilitary: 'N/A',
      disabilityOrImpairment: 'None',
    };

    // Create profile information for user2
    this.user2ProfileInfo = await this.db.userProfileInformation.upsert({
      where: { userId: TEST_USER_2.appId },
      update: {
        data: user2ProfileData,
      },
      create: {
        userId: TEST_USER_2.appId,
        data: user2ProfileData,
      },
    });
  }
}
