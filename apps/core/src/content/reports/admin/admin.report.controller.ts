import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthRequest } from 'src/iam/auth/auth.request';
import { AdminAuthGuard } from 'src/iam/auth/admin/admin.auth.guard';
import { CreateReportDto } from '../dto/create-report.dto';
import { FindReportsDto } from '../dto/find-reports.dto';
import { ReportService } from '../report.service';

@ApiTags('Admin - Reports')
@Controller('brainbox/reports')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth()
export class AdminReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @ApiOperation({ summary: 'Create a report as admin' })
  async createReport(
    @Request() req: AuthRequest,
    @Body() dto: CreateReportDto,
  ) {
    return this.reportService.createReport(req.user.appId, true, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List reports with filters' })
  async findReports(@Query() dto: FindReportsDto) {
    return this.reportService.findReports(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single report by ID' })
  async findReport(@Param('id') id: string) {
    return this.reportService.findReportById(id);
  }
}
