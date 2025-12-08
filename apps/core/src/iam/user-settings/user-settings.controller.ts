import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthRequest } from '../auth/auth.request';
import { UserAuthGuard } from '../auth/guards/user.auth.guard';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';
import { UserSettingsService } from './user-settings.service';

@ApiTags('User Settings')
@Controller()
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @Get('auth/me/settings')
  @ApiOperation({ summary: 'Get settings for current user' })
  @UseGuards(UserAuthGuard)
  async getUserSettings(@Req() req: AuthRequest) {
    return this.userSettingsService.getUserSettings(req.user.appId);
  }

  @Post('auth/me/settings')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update settings for current user' })
  @UseGuards(UserAuthGuard)
  async updateUserSettings(
    @Req() req: AuthRequest,
    @Body() data: UpdateUserSettingsDto,
  ) {
    return this.userSettingsService.updateUserSettings(req.user.appId, data);
  }
}
