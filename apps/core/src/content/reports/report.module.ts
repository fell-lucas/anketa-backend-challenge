import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { AdminReportController } from './admin/admin.report.controller';
import { AdminReportedSubjectController } from './admin/admin.reported-subject.controller';
import { ReportService } from './report.service';

@Module({
  controllers: [
    ReportController,
    AdminReportController,
    AdminReportedSubjectController,
  ],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
