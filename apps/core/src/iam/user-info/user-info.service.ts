import { Injectable } from '@nestjs/common';
import { DbService } from 'src/libraries/db/db.service';
import { UpdateProfileInfoDto } from './dto/update-profile-info.dto';

@Injectable()
export class UserInfoService {
  constructor(private db: DbService) {}

  async updateProfileInformation(userId: string, data: UpdateProfileInfoDto) {
    // Filter out undefined values
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined),
    );

    // Check if user profile information exists
    const existingInfo = await this.db.userProfileInformation.findUnique({
      where: { userId },
    });

    let record;
    if (existingInfo) {
      // Update existing record
      record = await this.db.userProfileInformation.update({
        where: { userId },
        data: {
          data: {
            ...(existingInfo.data as Record<string, any>),
            ...filteredData,
          },
        },
      });
    } else {
      // Create new record
      record = await this.db.userProfileInformation.create({
        data: {
          userId,
          data: filteredData,
        },
      });
    }

    return record;
  }

  async getProfileInformation(userId: string) {
    const info = await this.db.userProfileInformation.findUnique({
      where: { userId },
    });

    if (!info) {
      // Return empty data if no record exists
      return { data: {} };
    }

    return info;
  }
}
