import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/iam/auth/admin/admin.auth.guard';
import { FindReportedSubjectsDto } from '../dto/find-reports.dto';
import { ReportService } from '../report.service';

@ApiTags('Admin - Reported Subjects')
@Controller('brainbox/reported-subjects')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth()
export class AdminReportedSubjectController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  @ApiOperation({ summary: 'List reported subjects with filters' })
  async findReportedSubjects(@Query() dto: FindReportedSubjectsDto) {
    return this.reportService.findReportedSubjects(dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a reported subject with all reports and moderation actions',
  })
  async findReportedSubject(@Param('id') id: string) {
    return this.reportService.findReportedSubjectById(id);
  }
}
