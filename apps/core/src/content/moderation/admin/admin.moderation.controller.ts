import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/iam/auth/admin/admin.auth.guard';
import { AuthRequest } from 'src/iam/auth/auth.request';
import { CreateModerationActionDto } from '../dto/create-moderation-action.dto';
import { ModerationService } from '../moderation.service';

@ApiTags('Admin - Moderation')
@Controller('brainbox/reported-subjects')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth()
export class AdminModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Post(':id/actions')
  @ApiOperation({ summary: 'Create a moderation action on a reported subject' })
  async createAction(
    @Param('id') id: string,
    @Request() req: AuthRequest,
    @Body() dto: CreateModerationActionDto,
  ) {
    return this.moderationService.createAction(req.user.appId, id, dto);
  }

  @Get(':id/actions')
  @ApiOperation({ summary: 'List moderation actions for a reported subject' })
  async findActions(@Param('id') id: string) {
    return this.moderationService.findActions(id);
  }
}
