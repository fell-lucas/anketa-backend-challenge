import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  AppUnauthorizedException,
  ExceptionUnauthorizedEnum,
} from '@repo/system/errors/global.exceptions';
import { Request } from 'express';
import { AppConfigService } from '../../../libraries/config/app.config.service';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  private logger = new Logger(ApiKeyAuthGuard.name);

  constructor(private readonly configService: AppConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [req] = context.getArgs();
    const apiKey = this.extractApiKeyFromHeader(req);

    if (!apiKey) {
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.MISSING_ACCESS_TOKEN,
      );
    }

    const configuredApiKey = this.configService.integrations.apiKey;

    if (!configuredApiKey) {
      this.logger.error('API key not configured in environment');
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.INVALID_ACCESS_TOKEN,
      );
    }

    if (apiKey !== configuredApiKey) {
      this.logger.warn('Invalid API key provided');
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.INVALID_ACCESS_TOKEN,
      );
    }

    return true;
  }

  private extractApiKeyFromHeader(request: Request): string | undefined {
    const [type, key] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? key : undefined;
  }
}
