import { Injectable } from '@nestjs/common';
import {
  AppNotFoundEnum,
  AppNotFoundException,
  UserError,
  UserErrorsEnum,
} from '@repo/system/errors/global.exceptions';
import { DbService } from '../../libraries/db/db.service';
import { GetPlatformVariablesDto } from './dto/get-platform-variables.dto';
import { UpdatePlatformVariableDto } from './dto/update-platform-variable.dto';

@Injectable()
export class PlatformVariableService {
  constructor(private db: DbService) {}

  async getPlatformVariables(filters: GetPlatformVariablesDto) {
    return this.db.platformVariables.findMany({
      where: {
        ...(filters.category && { category: filters.category }),
        ...(filters.name && { name: filters.name }),
      },
      orderBy: [{ category: 'asc' }, { name: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async getPlatformVariable(name: string) {
    const variable = await this.db.platformVariables.findFirst({
      where: { name },
    });

    if (!variable) {
      throw new AppNotFoundException(
        AppNotFoundEnum.PLATFORM_VARIABLE_NOT_FOUND,
      );
    }

    return variable;
  }

  async upsertPlatformVariable(name: string, data: UpdatePlatformVariableDto) {
    if (!name.match(/^[a-z0-9_-]+$/)) {
      throw new UserError(UserErrorsEnum.INVALID_PLATFORM_VARIABLE_NAME);
    }

    const existingVariable = await this.db.platformVariables.findFirst({
      where: { name },
    });

    if (existingVariable) {
      return this.db.platformVariables.update({
        where: { id: existingVariable.id },
        data: {
          category: data.category,
          value: data.value,
        },
      });
    }

    return this.db.platformVariables.create({
      data: {
        name,
        category: data.category,
        value: data.value,
      },
    });
  }
}
