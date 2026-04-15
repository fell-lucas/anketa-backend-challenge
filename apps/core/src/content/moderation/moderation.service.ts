import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import {
  ModerationActionType,
  ModerationSuspensionLevel,
  ReportedSubjectModerationStatus,
  ReportedSubjectType,
} from '@prisma/client';
import { DbService } from 'src/libraries/db/db.service';
import { CreateModerationActionDto } from './dto/create-moderation-action.dto';

// Valid state transitions
const ALLOWED_ACTIONS: Record<
  ReportedSubjectModerationStatus,
  ModerationActionType[]
> = {
  [ReportedSubjectModerationStatus.PENDING_REVIEW]: [
    ModerationActionType.ESCALATE,
    ModerationActionType.DISMISS,
    ModerationActionType.MARK_AS_SENSITIVE,
    ModerationActionType.MARK_AS_NOT_SENSITIVE,
    ModerationActionType.SUSPEND_REPORTED_SUBJECT,
    ModerationActionType.SUSPEND_USER,
  ],
  [ReportedSubjectModerationStatus.ESCALATED]: [
    ModerationActionType.DISMISS,
    ModerationActionType.MARK_AS_SENSITIVE,
    ModerationActionType.MARK_AS_NOT_SENSITIVE,
    ModerationActionType.SUSPEND_REPORTED_SUBJECT,
    ModerationActionType.SUSPEND_USER,
    ModerationActionType.UNSUSPEND_REPORTED_SUBJECT,
    ModerationActionType.UNSUSPEND_USER,
    ModerationActionType.REOPEN,
  ],
  [ReportedSubjectModerationStatus.UNDER_REVIEW]: [
    ModerationActionType.DISMISS,
    ModerationActionType.MARK_AS_SENSITIVE,
    ModerationActionType.MARK_AS_NOT_SENSITIVE,
    ModerationActionType.SUSPEND_REPORTED_SUBJECT,
    ModerationActionType.SUSPEND_USER,
    ModerationActionType.UNSUSPEND_REPORTED_SUBJECT,
    ModerationActionType.UNSUSPEND_USER,
    ModerationActionType.REOPEN,
  ],
  [ReportedSubjectModerationStatus.PENDING_APPEAL]: [
    ModerationActionType.ESCALATE,
    ModerationActionType.DISMISS,
    ModerationActionType.SUSPEND_REPORTED_SUBJECT,
    ModerationActionType.SUSPEND_USER,
    ModerationActionType.UNSUSPEND_REPORTED_SUBJECT,
    ModerationActionType.UNSUSPEND_USER,
  ],
  [ReportedSubjectModerationStatus.RESOLVED]: [ModerationActionType.REOPEN],
};

@Injectable()
export class ModerationService {
  private readonly logger = new Logger(ModerationService.name);

  constructor(private readonly dbService: DbService) {}

  async createAction(
    adminId: string,
    reportedSubjectId: string,
    dto: CreateModerationActionDto,
  ) {
    // 1. Validate reported subject exists
    const subject = await this.dbService.reportedSubject.findUnique({
      where: { id: reportedSubjectId },
      include: { post: true, comment: true },
    });
    if (!subject) {
      throw new NotFoundException('Reported subject not found');
    }

    // 2. Validate state transition
    const allowed = ALLOWED_ACTIONS[subject.moderationStatus];
    if (!allowed.includes(dto.type)) {
      throw new UnprocessableEntityException(
        `Action '${dto.type}' is not allowed when status is '${subject.moderationStatus}'`,
      );
    }

    // 3. Action-specific validation
    if (
      (dto.type === ModerationActionType.MARK_AS_SENSITIVE ||
        dto.type === ModerationActionType.MARK_AS_NOT_SENSITIVE) &&
      subject.type !== ReportedSubjectType.POST
    ) {
      throw new BadRequestException(
        'MARK_AS_SENSITIVE / MARK_AS_NOT_SENSITIVE actions are only valid for POST type subjects',
      );
    }

    // 4. Find-or-create moderation assignment
    let moderation = await this.dbService.reportedSubjectModeration.findFirst({
      where: {
        reportedSubjectId: subject.id,
        moderatorId: adminId,
      },
    });

    if (!moderation) {
      moderation = await this.dbService.reportedSubjectModeration.create({
        data: {
          reportedSubjectId: subject.id,
          moderatorId: adminId,
        },
      });
    }

    // 5. Determine new moderation status
    const newStatus = this.getNewStatus(dto.type);

    // 6. Build side effect operations
    const sideEffects = await this.buildSideEffects(subject, dto);

    // 7. Execute everything in a transaction
    const result = await this.dbService.$transaction(async (tx) => {
      // Create the moderation action
      const action = await tx.moderationAction.create({
        data: {
          type: dto.type,
          reason: dto.reason,
          notes: dto.notes,
          reportedSubjectId: subject.id,
          moderationId: moderation.id,
          violationCategory: dto.violationCategory,
          violationSubcategory: dto.violationSubcategory,
          suspensionLevel: dto.suspensionLevel,
          suspensionStartsAt: dto.suspensionStartsAt
            ? new Date(dto.suspensionStartsAt)
            : undefined,
          suspensionEndsAt: dto.suspensionEndsAt
            ? new Date(dto.suspensionEndsAt)
            : undefined,
        },
      });

      // Update the reported subject
      await tx.reportedSubject.update({
        where: { id: subject.id },
        data: {
          moderationStatus: newStatus,
          moderationStatusChangedAt: new Date(),
          latestModerationActionId: action.id,
          activeModerationId: moderation.id,
        },
      });

      // Execute side effects
      for (const effect of sideEffects) {
        await effect(tx);
      }

      // Mark all reports as reviewed when the subject is resolved
      if (newStatus === ReportedSubjectModerationStatus.RESOLVED) {
        await tx.report.updateMany({
          where: { reportedSubjectId: subject.id },
          data: { hasBeenReviewed: true },
        });
      }

      return action;
    });

    return result;
  }

  async findActions(reportedSubjectId: string) {
    const subject = await this.dbService.reportedSubject.findUnique({
      where: { id: reportedSubjectId },
    });
    if (!subject) {
      throw new NotFoundException('Reported subject not found');
    }

    return this.dbService.moderationAction.findMany({
      where: { reportedSubjectId },
      orderBy: { createdAt: 'desc' },
      include: {
        moderation: { include: { moderator: true } },
      },
    });
  }

  private getNewStatus(
    actionType: ModerationActionType,
  ): ReportedSubjectModerationStatus {
    switch (actionType) {
      case ModerationActionType.ESCALATE:
        return ReportedSubjectModerationStatus.ESCALATED;
      case ModerationActionType.REOPEN:
        return ReportedSubjectModerationStatus.PENDING_REVIEW;
      case ModerationActionType.DISMISS:
      case ModerationActionType.MARK_AS_SENSITIVE:
      case ModerationActionType.MARK_AS_NOT_SENSITIVE:
      case ModerationActionType.SUSPEND_REPORTED_SUBJECT:
      case ModerationActionType.SUSPEND_USER:
      case ModerationActionType.UNSUSPEND_REPORTED_SUBJECT:
      case ModerationActionType.UNSUSPEND_USER:
        return ReportedSubjectModerationStatus.RESOLVED;
    }
  }

  private async buildSideEffects(
    subject: any,
    dto: CreateModerationActionDto,
  ): Promise<Array<(tx: any) => Promise<void>>> {
    const effects: Array<(tx: any) => Promise<void>> = [];
    const reason = dto.reason || 'Moderation action';

    switch (dto.type) {
      case ModerationActionType.MARK_AS_SENSITIVE:
        effects.push(async (tx) => {
          await tx.post.update({
            where: { id: subject.postId },
            data: { hasSensitiveContent: true },
          });
        });
        break;

      case ModerationActionType.MARK_AS_NOT_SENSITIVE:
        effects.push(async (tx) => {
          await tx.post.update({
            where: { id: subject.postId },
            data: { hasSensitiveContent: false },
          });
        });
        break;

      case ModerationActionType.SUSPEND_REPORTED_SUBJECT: {
        const suspensionEnd = this.computeSuspensionEnd(
          dto.suspensionLevel,
          dto.suspensionEndsAt,
        );

        if (subject.type === ReportedSubjectType.POST) {
          effects.push(async (tx) => {
            await tx.post.update({
              where: { id: subject.postId },
              data: {
                hiddenAt: new Date(),
                hiddenUntil: suspensionEnd,
                hiddenReason: reason,
              },
            });
          });
        } else if (subject.type === ReportedSubjectType.COMMENT) {
          effects.push(async (tx) => {
            await tx.comment.update({
              where: { id: subject.commentId },
              data: {
                hiddenAt: new Date(),
                hiddenUntil: suspensionEnd,
                hiddenReason: reason,
              },
            });
          });
        } else if (subject.type === ReportedSubjectType.USER) {
          effects.push(async (tx) => {
            await tx.user.update({
              where: { id: subject.userId },
              data: {
                suspendedAt: new Date(),
                suspendedUntil: suspensionEnd,
                suspensionReason: reason,
              },
            });
          });
        }
        break;
      }

      case ModerationActionType.SUSPEND_USER: {
        const suspensionEnd = this.computeSuspensionEnd(
          dto.suspensionLevel,
          dto.suspensionEndsAt,
        );
        let targetUserId: string | null = null;

        if (subject.type === ReportedSubjectType.USER) {
          targetUserId = subject.userId;
        } else if (subject.type === ReportedSubjectType.POST && subject.post) {
          targetUserId = subject.post.createdByUserId;
        } else if (
          subject.type === ReportedSubjectType.COMMENT &&
          subject.comment
        ) {
          targetUserId = subject.comment.userId;
        }

        if (targetUserId) {
          effects.push(async (tx) => {
            await tx.user.update({
              where: { id: targetUserId },
              data: {
                suspendedAt: new Date(),
                suspendedUntil: suspensionEnd,
                suspensionReason: reason,
              },
            });
          });
        }
        break;
      }

      case ModerationActionType.UNSUSPEND_REPORTED_SUBJECT: {
        if (subject.type === ReportedSubjectType.POST) {
          effects.push(async (tx) => {
            await tx.post.update({
              where: { id: subject.postId },
              data: { hiddenAt: null, hiddenUntil: null, hiddenReason: null },
            });
          });
        } else if (subject.type === ReportedSubjectType.COMMENT) {
          effects.push(async (tx) => {
            await tx.comment.update({
              where: { id: subject.commentId },
              data: { hiddenAt: null, hiddenUntil: null, hiddenReason: null },
            });
          });
        } else if (subject.type === ReportedSubjectType.USER) {
          effects.push(async (tx) => {
            await tx.user.update({
              where: { id: subject.userId },
              data: {
                suspendedAt: null,
                suspendedUntil: null,
                suspensionReason: null,
              },
            });
          });
        }
        break;
      }

      case ModerationActionType.UNSUSPEND_USER: {
        let targetUserId: string | null = null;

        if (subject.type === ReportedSubjectType.USER) {
          targetUserId = subject.userId;
        } else if (subject.type === ReportedSubjectType.POST && subject.post) {
          targetUserId = subject.post.createdByUserId;
        } else if (
          subject.type === ReportedSubjectType.COMMENT &&
          subject.comment
        ) {
          targetUserId = subject.comment.userId;
        }

        if (targetUserId) {
          effects.push(async (tx) => {
            await tx.user.update({
              where: { id: targetUserId },
              data: {
                suspendedAt: null,
                suspendedUntil: null,
                suspensionReason: null,
              },
            });
          });
        }
        break;
      }

      // ESCALATE, DISMISS, REOPEN have no content side effects
      // (DISMISS marks reports reviewed, handled in the main transaction)
    }

    return effects;
  }

  private computeSuspensionEnd(
    level?: ModerationSuspensionLevel,
    customEnd?: string,
  ): Date | null {
    if (!level || level === ModerationSuspensionLevel.WARNING) {
      return null;
    }

    const now = new Date();

    switch (level) {
      case ModerationSuspensionLevel.TEMPORARY_1_DAY:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case ModerationSuspensionLevel.TEMPORARY_2_DAYS:
        return new Date(now.getTime() + 48 * 60 * 60 * 1000);
      case ModerationSuspensionLevel.TEMPORARY_7_DAYS:
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case ModerationSuspensionLevel.PERMANENT:
        return new Date('9999-12-31T23:59:59.999Z');
      case ModerationSuspensionLevel.CUSTOM:
        return customEnd ? new Date(customEnd) : null;
    }
  }
}
