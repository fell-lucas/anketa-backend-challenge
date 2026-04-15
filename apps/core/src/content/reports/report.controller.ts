import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthRequest } from 'src/iam/auth/auth.request';
import { UserAuthGuard } from 'src/iam/auth/guards/user.auth.guard';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportService } from './report.service';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @ApiOperation({ summary: 'Report a user, post, or comment' })
  async createReport(
    @Request() req: AuthRequest,
    @Body() dto: CreateReportDto,
  ) {
    return this.reportService.createReport(req.user.appId, false, dto);
  }
}
