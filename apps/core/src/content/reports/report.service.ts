import { BadRequestException, ConflictException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ReportedSubjectModerationStatus, ReportedSubjectType, Prisma } from '@prisma/client';
import { DbService } from 'src/libraries/db/db.service';
import { CreateReportDto } from './dto/create-report.dto';
import { FindReportedSubjectsDto, FindReportsDto } from './dto/find-reports.dto';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  constructor(private readonly dbService: DbService) {}

  async createReport(
    reporterId: string,
    isAdmin: boolean,
    dto: CreateReportDto,
  ) {
    // Validate exactly one subject ID is provided
    const subjectIds = [dto.userId, dto.postId, dto.commentId].filter(Boolean);
    if (subjectIds.length !== 1) {
      throw new BadRequestException(
        'Exactly one of userId, postId, or commentId must be provided',
      );
    }

    // Determine subject type
    let subjectType: ReportedSubjectType;
    let subjectEntityId: string;

    if (dto.userId) {
      subjectType = ReportedSubjectType.USER;
      subjectEntityId = dto.userId;

      // Validate target user exists
      const targetUser = await this.dbService.user.findUnique({
        where: { id: dto.userId },
      });
      if (!targetUser) throw new NotFoundException('User not found');

      // Prevent self-reporting
      if (!isAdmin && dto.userId === reporterId) {
        throw new ForbiddenException('You cannot report yourself');
      }
    } else if (dto.postId) {
      subjectType = ReportedSubjectType.POST;
      subjectEntityId = dto.postId;

      const post = await this.dbService.post.findUnique({
        where: { id: dto.postId },
      });
      if (!post) throw new NotFoundException('Post not found');

      // Prevent self-reporting (post author)
      if (!isAdmin && post.createdByUserId === reporterId) {
        throw new ForbiddenException('You cannot report your own post');
      }
    } else {
      subjectType = ReportedSubjectType.COMMENT;
      subjectEntityId = dto.commentId!;

      const comment = await this.dbService.comment.findUnique({
        where: { id: dto.commentId },
      });
      if (!comment) throw new NotFoundException('Comment not found');

      // Prevent self-reporting (comment author)
      if (!isAdmin && comment.userId === reporterId) {
        throw new ForbiddenException('You cannot report your own comment');
      }
    }

    // Find or create ReportedSubject
    const subjectWhere: Prisma.ReportedSubjectWhereInput = {
      type: subjectType,
      ...(subjectType === ReportedSubjectType.USER && { userId: subjectEntityId }),
      ...(subjectType === ReportedSubjectType.POST && { postId: subjectEntityId }),
      ...(subjectType === ReportedSubjectType.COMMENT && { commentId: subjectEntityId }),
    };

    let reportedSubject = await this.dbService.reportedSubject.findFirst({
      where: subjectWhere,
    });

    if (!reportedSubject) {
      reportedSubject = await this.dbService.reportedSubject.create({
        data: {
          type: subjectType,
          moderationStatus: ReportedSubjectModerationStatus.PENDING_REVIEW,
          ...(subjectType === ReportedSubjectType.USER && { userId: subjectEntityId }),
          ...(subjectType === ReportedSubjectType.POST && { postId: subjectEntityId }),
          ...(subjectType === ReportedSubjectType.COMMENT && { commentId: subjectEntityId }),
          reportsCount: 0,
        },
      });
    }

    // Check for duplicate report from same reporter on same subject
    const existingReport = await this.dbService.report.findFirst({
      where: {
        reportedSubjectId: reportedSubject.id,
        ...(isAdmin ? { adminId: reporterId } : { userId: reporterId }),
      },
    });

    if (existingReport) {
      throw new ConflictException('You have already reported this subject');
    }

    // Create Report and increment reportsCount in a transaction
    const [report] = await this.dbService.$transaction([
      this.dbService.report.create({
        data: {
          type: dto.type,
          message: dto.message,
          reportedSubjectId: reportedSubject.id,
          ...(isAdmin ? { adminId: reporterId } : { userId: reporterId }),
        },
      }),
      this.dbService.reportedSubject.update({
        where: { id: reportedSubject.id },
        data: {
          reportsCount: { increment: 1 },
          // Reopen if resolved and new report comes in
          ...(reportedSubject.moderationStatus === ReportedSubjectModerationStatus.RESOLVED
            ? { moderationStatus: ReportedSubjectModerationStatus.PENDING_REVIEW }
            : {}),
        },
      }),
    ]);

    return report;
  }

  async findReportedSubjects(dto: FindReportedSubjectsDto) {
    const where: Prisma.ReportedSubjectWhereInput = {};
    if (dto.type) where.type = dto.type;
    if (dto.moderationStatus) where.moderationStatus = dto.moderationStatus;

    const [data, total] = await Promise.all([
      this.dbService.reportedSubject.findMany({
        where,
        skip: dto.skip,
        take: dto.take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          post: true,
          comment: true,
          _count: { select: { reports: true, moderationActions: true } },
        },
      }),
      this.dbService.reportedSubject.count({ where }),
    ]);

    return { data, meta: { total, skip: dto.skip, take: dto.take } };
  }

  async findReportedSubjectById(id: string) {
    const subject = await this.dbService.reportedSubject.findUnique({
      where: { id },
      include: {
        user: true,
        post: true,
        comment: true,
        reports: {
          orderBy: { createdAt: 'desc' },
          include: { user: true, admin: true },
        },
        moderationActions: {
          orderBy: { createdAt: 'desc' },
        },
        activeModeration: { include: { moderator: true } },
        latestModerationAction: true,
      },
    });

    if (!subject) throw new NotFoundException('Reported subject not found');
    return subject;
  }

  async findReports(dto: FindReportsDto) {
    const where: Prisma.ReportWhereInput = {};
    if (dto.reportedSubjectId) where.reportedSubjectId = dto.reportedSubjectId;

    const [data, total] = await Promise.all([
      this.dbService.report.findMany({
        where,
        skip: dto.skip,
        take: dto.take,
        orderBy: { createdAt: 'desc' },
        include: { user: true, admin: true, reportedSubject: true },
      }),
      this.dbService.report.count({ where }),
    ]);

    return { data, meta: { total, skip: dto.skip, take: dto.take } };
  }

  async findReportById(id: string) {
    const report = await this.dbService.report.findUnique({
      where: { id },
      include: { user: true, admin: true, reportedSubject: true },
    });

    if (!report) throw new NotFoundException('Report not found');
    return report;
  }
}
