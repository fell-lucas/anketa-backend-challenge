import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthRequest } from '../auth/auth.request';
import { UserAuthGuard } from '../auth/guards/user.auth.guard';
import { UpdateProfileInfoDto } from './dto/update-profile-info.dto';
import { UserInfoService } from './user-info.service';

@ApiTags('User Profile Information')
@Controller()
export class UserInfoController {
  constructor(private readonly userInfoService: UserInfoService) {}

  @Post('auth/me/profile-information')
  @ApiOperation({ summary: 'Update profile information for current user' })
  @UseGuards(UserAuthGuard)
  async updateProfileInformation(
    @Req() req: AuthRequest,
    @Body() data: UpdateProfileInfoDto,
  ) {
    return this.userInfoService.updateProfileInformation(req.user.appId, data);
  }

  @Get('auth/me/profile-information')
  @ApiOperation({ summary: 'Get profile information for current user' })
  @UseGuards(UserAuthGuard)
  async getProfileInformation(@Req() req: AuthRequest) {
    return this.userInfoService.getProfileInformation(req.user.appId);
  }
}
