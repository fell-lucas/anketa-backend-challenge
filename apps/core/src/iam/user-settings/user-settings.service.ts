import { Injectable } from '@nestjs/common';
import {
  UserError,
  UserErrorsEnum,
} from '@repo/system/errors/global.exceptions';
import { DbService } from 'src/libraries/db/db.service';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';

@Injectable()
export class UserSettingsService {
  constructor(private readonly db: DbService) {}

  async getUserSettings(userId: string) {
    const settings = await this.db.userSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      throw new UserError(UserErrorsEnum.USER_SETTINGS_NOT_FOUND);
    }

    return settings;
  }

  async updateUserSettings(userId: string, data: UpdateUserSettingsDto) {
    // Filter out undefined values
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined),
    );

    // Check if user settings exist
    const existingSettings = await this.db.userSettings.findUnique({
      where: { userId },
    });

    if (!existingSettings) {
      throw new UserError(UserErrorsEnum.USER_SETTINGS_NOT_FOUND);
    }

    // Handle disclaimers separately to prevent overwriting existing ones
    if (data.disclaimers) {
      const currentDisclaimers =
        ((existingSettings as any).disclaimers as Record<string, any>) || {};
      const newDisclaimers = { ...currentDisclaimers };
      const currentDate = new Date().toISOString();

      // Only add disclaimers that don't already exist
      for (const [key, value] of Object.entries(data.disclaimers)) {
        if (value === true && !currentDisclaimers[key]) {
          newDisclaimers[key] = currentDate;
        }
      }

      filteredData.disclaimers = newDisclaimers;
    }

    // Update existing settings
    return this.db.userSettings.update({
      where: { userId },
      data: filteredData,
    });
  }

  async createDefaultUserSettings(userId: string) {
    // Create default settings for a new user
    return this.db.userSettings.create({
      data: {
        userId,
        // All defaults are set in the Prisma schema
      },
    });
  }
}
