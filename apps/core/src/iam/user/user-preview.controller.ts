import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('users/preview')
export class UserPreviewController {
  constructor(private readonly userService: UserService) {}

  @Get('/:username')
  @ApiOperation({ summary: 'Get user preview by username' })
  getUserPreview(@Param('username') username: string) {
    return this.userService.getUserPreviewByUsername(username);
  }
}
