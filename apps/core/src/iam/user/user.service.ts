import { Injectable, Logger } from '@nestjs/common';
import {
  FollowStatus,
  PostStatus,
  PostType,
  Prisma,
  User,
  UserStats,
} from '@prisma/client';
import {
  AppNotFoundEnum,
  AppNotFoundException,
  UserError,
  UserErrorsEnum,
} from '@repo/system/errors/global.exceptions';
import * as bcrypt from 'bcrypt';
import { MediaType } from 'src/content/media/media.type';
import { DbService } from 'src/libraries/db/db.service';
import { EmailService } from 'src/libraries/email/email.service';
import { FirebaseService } from 'src/libraries/firebase/firebase.service';
import { InngestService } from 'src/libraries/inngest/inngest.service';
import { StreamService } from '../../libraries/stream/stream.service';
import { UserJwt } from '../auth/user.jwt';
import { UserSettingsService } from '../user-settings/user-settings.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserWithFollowsDto } from './dto/user-with-follows.dto';
import { VerifyPinDto } from './dto/verify-pin.dto';
import { RESERVED_USERNAMES } from './reserved-usernames.constants';

const USER_STATS_RECOMPUTE_INTERVAL = 5; // minutes

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly dbService: DbService,
    private readonly userSettingsService: UserSettingsService,
    private readonly streamService: StreamService,
    private readonly inngest: InngestService,
    private readonly firebaseService: FirebaseService,
    private readonly emailService: EmailService,
  ) {}

  async registerUser(decodedToken: UserJwt, data: RegisterUserDto) {
    const user = await this.dbService.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
    });

    if (!user) {
      // The user is not on Firebase but on our db with the same email:
      if (decodedToken.email) {
        const emailUser = await this.dbService.user.findUnique({
          where: {
            email: decodedToken.email,
            deletedAt: null, // Only check non-deleted users
          },
        });
        if (emailUser) {
          throw new UserError(UserErrorsEnum.EMAIL_ALREADY_EXISTS);
        }
      }

      const user = await this.upsert(
        {
          email: decodedToken.email,
          emailVerified: decodedToken.email_verified,
          name: decodedToken.name || data.name || '',
          firebaseUid: decodedToken.uid,

          appleToken: data.appleToken,
          appleUserId: data.appleToken,

          googleToken: data.googleToken,
          googleUserId: data.googleUserId,

          phoneNumber: decodedToken.phone_number,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSeenAt: new Date(),
        },
        { firebaseUid: decodedToken.uid },
      );

      // Send welcome email to new users
      if (user.email) {
        try {
          await this.emailService.sendEmail('USER_SIGNUP', user.email, {
            firstName: user.name?.split(' ')[0] || '',
          });
        } catch (error) {
          // Log error but don't fail user creation if email fails
          console.error('Failed to send welcome email:', error);
        }
      }

      return user;
    } else {
      // Check whether the user is suspended
      // INFO: We should probably do this at every access token refresh later
      // when we use stateless access tokens with stateful refresh tokens
      if (user.suspendedAt) {
        throw new AppNotFoundException(AppNotFoundEnum.USER_ACCOUNT_SUSPENDED);
      }

      // Update existing user
      user.lastSeenAt = new Date();
      if (decodedToken.email && !user.email) user.email = decodedToken.email;
      if (decodedToken.email_verified && !user.email) user.emailVerified = true;
      if (decodedToken.name && !user.name) user.name = decodedToken.name;

      if (data.appleToken) {
        user.appleToken = data.appleToken;
        user.appleUserId = data.appleUserId;
      }
      if (data.googleToken) {
        user.googleToken = data.googleToken;
        user.googleUserId = data.googleUserId;
      }
      const registeredUser = await this.upsert(user);
      return registeredUser;
    }
  }

  async changeEmail(decodedToken: UserJwt) {
    const user = await this.dbService.user.findFirst({
      where: { firebaseUid: decodedToken.uid },
    });

    if (!user) {
      throw new AppNotFoundException(AppNotFoundEnum.USER_NOT_FOUND);
    }

    // If email alredy exists:
    const existing = await this.dbService.user.findFirst({
      where: { email: decodedToken.email },
    });
    if (existing) {
      throw new UserError(UserErrorsEnum.EMAIL_ALREADY_EXISTS);
    }

    return await this.dbService.user.update({
      where: { firebaseUid: decodedToken.uid },
      data: {
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
      },
    });
  }

  async findOne(where: Prisma.UserWhereUniqueInput) {
    const user = await this.dbService.user.findUnique({
      where: {
        ...where,
        deletedAt: null, // Exclude soft-deleted users
      },
    });

    if (!user) return null;

    return {
      ...user,
      pinCode: user.pinCode ? '********' : undefined,
    };
  }

  async upsert(
    user: Prisma.UserCreateInput,
    where?: Prisma.UserWhereUniqueInput,
  ) {
    where = where || { id: user.id };

    // Check if user exists before upserting
    const existingUser = await this.dbService.user.findUnique({
      where,
    });

    let result = await this.dbService.user.upsert({
      where,
      update: user,
      create: user,
    });

    // If user didn't exist before, create default settings and profile info
    if (!existingUser) {
      // Create default user settings using the service
      await this.userSettingsService.createDefaultUserSettings(result.id);

      // Create empty user profile information
      await this.dbService.userProfileInformation.create({
        data: {
          userId: result.id,
          data: {},
        },
      });

      // Create empty user stats
      await this.dbService.userStats.create({
        data: {
          id: result.id,
        },
      });

      // Create upstream user
      result = await this.streamService.upsertUser(result);

      await this.inngest.sendEvent('app/user.created', {
        userId: result.id,
      });
    }

    // Hide pin:
    result.pinCode = result.pinCode ? '********' : undefined;

    return result;
  }

  async userHasWallet(userId: string) {
    const wallet = await this.dbService.wallet.findUnique({
      where: { userId },
    });
    return !!wallet;
  }

  /**
   * Create wallet job, NB: must be idempotent
   */
  async createUserWallet(userId: string) {
    const existingWallet = await this.dbService.wallet.findUnique({
      where: { userId },
    });
    if (existingWallet) {
      return existingWallet;
    }

    // Create crypto wallet:
    const mnemonic = 'aa';
    const accounts = [{ pubkey: 'bb' }];

    await this.dbService.wallet.create({
      data: {
        userId: userId,
        mnemonic,
        publicKey: Buffer.from(accounts[0].pubkey).toString('hex'),
      },
    });

    return {
      mnemonic,
      publicKey: Buffer.from(accounts[0].pubkey).toString('hex'),
    };
  }

  async update(id: string, data: UpdateProfileDto) {
    const user = await this.dbService.user.findUniqueOrThrow({ where: { id } });
    if (data.name) user.name = data.name;
    if (data.username) {
      data.username = data.username.toLowerCase();
      if (data.username.match(/\.{2}/) || data.username.match(/_{2}/)) {
        throw new UserError(UserErrorsEnum.USERNAME_INVALID);
      }
      if (RESERVED_USERNAMES.includes(data.username)) {
        throw new UserError(UserErrorsEnum.USERNAME_INVALID);
      }
      const username = await this.dbService.user.findUnique({
        where: {
          username: data.username,
          deletedAt: null, // Only check non-deleted users
        },
      });
      if (username && username.id != id) {
        throw new UserError(UserErrorsEnum.USERNAME_ALREADY_EXISTS);
      }
      user.username = data.username;
    }
    if (data.gender) user.gender = data.gender;
    if (data.bio) user.bio = data.bio;
    if (data.dateOfBirth) user.dateOfBirth = data.dateOfBirth;
    if (data.city) user.city = data.city;
    if (data.country) user.country = data.country;
    if (!!data.latitude != !!data.longitude) {
      throw new UserError(UserErrorsEnum.ONLY_ONE_LATITUDE_LONGITUDE);
    }
    if (data.latitude) user.latitude = data.latitude;
    if (data.longitude) user.longitude = data.longitude;
    if (data.profilePictureId) {
      const media = await this.dbService.media.findUniqueOrThrow({
        where: {
          publicId: data.profilePictureId,
          type: MediaType.UserImage,
          userId: user.id,
        },
      });
      if (!media) {
        throw new UserError(UserErrorsEnum.MEDIA_NOT_FOUND);
      }
      user.profilePicturePublicId = media.publicId;
    }
    if (data.visibility) user.visibility = data.visibility;
    if (data.pinCode) user.pinCode = await bcrypt.hash(data.pinCode, 10);
    if (data.links) user.links = data.links;

    const result = await this.upsert(user);

    await this.streamService.upsertUser(result, true);

    result.pinCode = result.pinCode ? '********' : undefined;
    return result;
  }

  async verifyPin(userId: string, data: VerifyPinDto) {
    const user = await this.dbService.user.findUniqueOrThrow({
      where: { id: userId },
    });
    if (!user.pinCode) throw new UserError(UserErrorsEnum.PIN_CODE_NOT_SET);
    if (await bcrypt.compare(data.pinCode, user.pinCode)) {
      return { verified: true };
    }
    return { verified: false };
  }

  async scheduleUserDeletion(userId: string, deleteReason: string) {
    const user = await this.dbService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppNotFoundException(AppNotFoundEnum.USER_NOT_FOUND);
    }

    // Calculate deletion date (45 days from now)
    const willDeleteAt = new Date();
    willDeleteAt.setDate(willDeleteAt.getDate() + 45);

    // Update user with scheduled deletion date
    await this.dbService.user.update({
      where: { id: userId },
      data: {
        willDeleteAt,
        deleteReason,
      },
    });

    // Schedule the Inngest task for deletion
    await this.inngest.sendEvent(
      'app/user.scheduled-deletion',
      {
        userId,
      },
      willDeleteAt,
      `user-deletion-${userId}`,
    );

    return { willDeleteAt };
  }

  async unscheduleUserDeletion(userId: string) {
    const user = await this.dbService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppNotFoundException(AppNotFoundEnum.USER_NOT_FOUND);
    }

    // Only unschedule if the user has a scheduled deletion
    if (!user.willDeleteAt) {
      return false;
    }

    // Clear the scheduled deletion date
    await this.dbService.user.update({
      where: { id: userId },
      data: {
        willDeleteAt: null,
        deleteReason: null,
      },
    });

    return true;
  }

  async softDeleteUser(userId: string) {
    const user = await this.dbService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppNotFoundException(AppNotFoundEnum.USER_NOT_FOUND);
    }

    if (!user.willDeleteAt) {
      return;
    }

    // Delete user from Firebase Auth first (before anonymizing firebaseUid)
    if (user.firebaseUid) {
      await this.firebaseService.deleteUser(user.firebaseUid);
    }

    // Generate a random number for the anonymized name
    const randomNumber = Math.floor(Math.random() * 1000000);

    // Soft delete and anonymize the user
    await this.dbService.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
        willDeleteAt: null, // Clear the scheduled deletion date
        // Anonymize personal data
        email: null,
        username: null,
        phoneNumber: null,
        firebaseUid: null,
        // Remove sensitive data
        pinCode: null,
        // Change name to anonymous
        name: `User${randomNumber}`,
        // Clear other personal info
        bio: null,
        city: null,
        country: null,
        latitude: null,
        longitude: null,
        links: [],
        profilePicturePublicId: null,
        // Clear auth tokens
        googleUserId: null,
        googleToken: null,
        appleUserId: null,
        appleToken: null,
        streamToken: null,
      },
    });
    if (user.email) {
      await this.emailService.sendEmail('USER_DELETED', user.email, {
        firstName: user.name || 'User',
      });
    }
  }

  async usernameTaken(username: string) {
    const user = await this.dbService.user.findUnique({
      where: {
        username,
        deletedAt: null,
      },
    });
    return !!user;
  }

  async findMany({
    currentUserId,
    cursor,
    limit = 24,
    sortBy = 'name',
    sortOrder = 'asc',
    name,
  }: {
    currentUserId: string;
    cursor?: string;
    limit?: number;
    sortBy: 'name' | 'relevance' | 'createdAt';
    sortOrder: 'asc' | 'desc';
    name?: string;
  }): Promise<{ users: UserWithFollowsDto[]; nextCursor: string | null }> {
    const take = Math.min(limit || 24, 100); // Cap at 100 items per request

    const parsedCursor = this.parseCursor(cursor);

    // NB: relevance is not implemented yet
    const orderBy: Prisma.UserOrderByWithRelationInput[] = [];
    if (sortBy === 'name' || sortBy === 'relevance') {
      orderBy.push({ name: sortOrder });
      orderBy.push({ id: sortOrder }); // Secondary sort by id for edge cases where many users have the same name
    } else {
      orderBy.push({ id: sortOrder }); // For createdAt, we use id which is UUID v4 that is sortable
    }

    const where: Prisma.UserWhereInput = {
      id: { not: currentUserId }, // Exclude current user
      deletedAt: null,
      suspendedAt: null,
      // Apply name filter (search) if provided
      ...(name
        ? {
            OR: [
              {
                name: {
                  contains: name,
                  mode: 'insensitive',
                },
              },
              {
                username: {
                  contains: name,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
      // Exclude users with reserved usernames, and empty usernames.
      AND: [{ username: { not: null } }, { username: { not: '' } }],
      // Exclude users who are blocked by the current user
      blockedBy: {
        none: {
          userId: currentUserId,
        },
      },
    };

    const users = await this.dbService.user.findMany({
      where,
      take: take + 1,
      skip: parsedCursor ? 1 : 0,
      cursor: parsedCursor ? { id: parsedCursor.id } : undefined,
      orderBy,
      select: this.getUserSelect(currentUserId),
    });

    const nextCursor = this.createCursor(
      users,
      take,
      sortBy === 'name' || sortBy === 'relevance',
    );

    return {
      users: users.slice(0, take).map(this.formatUser),
      nextCursor,
    };
  }

  private parseCursor(
    cursor?: string,
  ): { id: string; name?: string } | undefined {
    if (!cursor) return undefined;
    try {
      const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
      return JSON.parse(decoded);
    } catch (e) {
      return undefined;
    }
  }

  private createCursor(
    users: { id: string; name: string }[],
    take: number,
    includeName: boolean,
  ): string | null {
    if (users.length === 0) return null;
    // NB: if we fetch one more user than the take, we don't have a next page
    if (users.length <= take) return null;

    const last = Math.min(take - 1, users.length - 1);
    const user = users[last];
    const cursor = includeName
      ? { id: user.id, name: user.name }
      : { id: user.id };
    return Buffer.from(JSON.stringify(cursor))
      .toString('base64')
      .replace(/=+$/, '');
  }

  async findOneWithStats(id: string, currentUserId: string) {
    const user = await this.dbService.user.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        ...this.getUserProfileSelect(currentUserId),
        ...(currentUserId === id && {
          pinCode: true,
          email: true,
          emailVerified: true,
          phoneNumber: true,
          latitude: true,
          longitude: true,
          city: true,
          country: true,
          firebaseUid: true,
          streamToken: true,
        }),
        wallets: {
          take: 1,
          select: {
            balance: true,
          },
        },
      },
    });

    if (!user) return null;

    user.userStats = await this.getUserStats(user);
    return this.formatUser(user);
  }

  async findOneByUsernameWithStats(username: string, currentUserId: string) {
    username = username.toLowerCase().trim();
    const user = await this.dbService.user.findUnique({
      where: {
        username,
        deletedAt: null,
      },
      select: {
        ...this.getUserProfileSelect(currentUserId),
        wallets: {
          take: 1,
          select: {
            balance: true,
          },
        },
      },
    });

    if (!user) return null;

    user.userStats = await this.getUserStats(user);
    user.pinCode = user.pinCode ? '********' : undefined;
    return this.formatUser(user);
  }

  async getUserPreviewByUsername(username: string) {
    const user = await this.dbService.user.findUnique({
      where: { username, deletedAt: null },
      select: {
        name: true,
        bio: true,
        profilePicture: {
          select: {
            format: true,
            type: true,
            secureUrl: true,
            assetType: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppNotFoundException(AppNotFoundEnum.USER_NOT_FOUND);
    }

    return user;
  }

  private async getUserStats(user: User & { userStats: UserStats }) {
    // Recompute only every X minutes:
    if (
      user.userStats.updatedAt >
      new Date(Date.now() - USER_STATS_RECOMPUTE_INTERVAL * 60 * 1000)
    ) {
      return user.userStats;
    }

    // Recompute user stats:
    const id = user.id;

    // Define all queries as separate promises
    const circlesCountPromise = this.dbService.circleMembership.count({
      where: { userId: id },
    });

    const postStatsPromise = this.dbService.post.groupBy({
      by: ['type', 'status'],
      where: { createdByUserId: id },
      _count: true,
    });

    const likedPostsCountPromise = this.dbService.like.count({
      where: { userId: id },
    });

    const repostedPostsCountPromise = this.dbService.repost.count({
      where: { userId: id },
    });

    const commentsCountPromise = this.dbService.comment.count({
      where: { userId: id },
    });

    // Execute all queries in parallel
    const [
      circlesCount,
      postStats,
      likedPostsCount,
      repostedPostsCount,
      commentsCount,
    ] = await Promise.all([
      circlesCountPromise,
      postStatsPromise,
      likedPostsCountPromise,
      repostedPostsCountPromise,
      commentsCountPromise,
    ]);

    // Process post stats
    const postStatsMap = postStats.reduce(
      (acc, stat) => {
        const key = `${stat.type}_${stat.status}`;
        acc[key] = stat._count;
        return acc;
      },
      {} as Record<string, number>,
    );

    const publishedPollPostsCount =
      postStatsMap[`${PostType.POLL}_${PostStatus.PUBLISHED}`] || 0;
    const publishedSurveyPostsCount =
      postStatsMap[`${PostType.SURVEY}_${PostStatus.PUBLISHED}`] || 0;
    const publishedPostsCount =
      publishedPollPostsCount + publishedSurveyPostsCount;

    const draftPostsCount =
      postStatsMap[`${PostType.POLL}_${PostStatus.DRAFT}`] ||
      0 + postStatsMap[`${PostType.SURVEY}_${PostStatus.DRAFT}`] ||
      0;

    // TODO: Implement these when needed
    const scheduledPostsCount = 0;
    const purchasedPostsCount = 0;

    const feedPostsCount = likedPostsCount + repostedPostsCount + commentsCount;

    // Update user stats:
    return await this.dbService.userStats.update({
      where: { id },
      data: {
        circlesCount,
        publishedPostsCount,
        publishedPollPostsCount,
        publishedSurveyPostsCount,
        draftPostsCount,
        scheduledPostsCount,
        purchasedPostsCount,
        likedPostsCount,
        repostedPostsCount,
        feedPostsCount,
        updatedAt: new Date(),
      },
    });
  }

  private getUserProfileSelect(currentUserId: string): Prisma.UserSelect {
    return {
      id: true,
      name: true,
      username: true,
      bio: true,
      gender: true,
      dateOfBirth: true,
      city: true,
      country: true,
      profilePicturePublicId: true,
      visibility: true,
      createdAt: true,
      userStats: true,
      links: true,
      followers: {
        where: {
          followerId: currentUserId,
          status: { in: [FollowStatus.APPROVED, FollowStatus.PENDING] },
        },
        select: {
          id: true,
          status: true,
        },
      },
      following: {
        where: {
          followeeId: currentUserId,
          status: { in: [FollowStatus.APPROVED, FollowStatus.PENDING] },
        },
        select: {
          id: true,
          status: true,
        },
      },
      blockedBy: {
        where: {
          userId: currentUserId,
        },
        select: {
          id: true,
        },
      },
      blocking: {
        where: {
          targetUserId: currentUserId,
        },
        select: {
          id: true,
        },
      },
    };
  }

  public getUserSelect(currentUserId: string): Prisma.UserSelect {
    return {
      id: true,
      name: true,
      username: true,
      profilePicturePublicId: true,
      createdAt: true,
      userStats: true,
      visibility: true,
      followers: {
        where: {
          followerId: currentUserId,
          status: { in: [FollowStatus.APPROVED, FollowStatus.PENDING] },
        },
        select: {
          id: true,
          status: true,
        },
      },
      following: {
        where: {
          followeeId: currentUserId,
          status: { in: [FollowStatus.APPROVED, FollowStatus.PENDING] },
        },
        select: {
          id: true,
          status: true,
        },
      },
    };
  }

  public formatUser(user: {
    followers: { id: string; status: FollowStatus }[];
    following: { id: string; status: FollowStatus }[];
    [key: string]: any;
  }): UserWithFollowsDto {
    const userFiltered = {
      ...(user as unknown as User & { userStats: UserStats }),
      followers: undefined,
      following: undefined,
    };

    return {
      ...userFiltered,
      pinCode: user.pinCode ? '********' : undefined,
      userStats: user.userStats,
      walletBalance: user.wallets?.[0]?.balance || 0,
      followedByCurrentUser: user.followers?.[0],
      followsCurrentUser: user.following?.[0],
      isBlockedByCurrentUser: user.blockedBy?.length > 0,
      hasBlockedCurrentUser: user.blocking?.length > 0,
    };
  }

  public async suspendUser(
    userId: string,
    {
      suspendedAt,
      suspendedUntil,
      suspensionReason,
      tx,
    }: {
      suspendedAt: Date;
      suspendedUntil?: Date;
      suspensionReason?: string;
      tx?: Prisma.TransactionClient;
    },
  ) {
    const db = tx || this.dbService;
    await db.user.update({
      where: { id: userId },
      data: {
        suspendedAt,
        suspendedUntil,
        suspensionReason,
      },
    });

    // Schedule unsuspension using Inngest
    if (suspendedUntil) {
      await this.inngest.sendEvent(
        'app/user.scheduled-unsuspension',
        {
          userId,
        },
        suspendedUntil,
        `user-unsuspension-${userId}`,
      );
    }

    // TODO: Send notification email to user about suspension. Include reason if provided
    this.logger.debug(
      `User ${userId} suspended until ${suspendedUntil} for reason: ${suspensionReason}`,
    );
  }

  public async unsuspendUser(
    userId: string,
    {
      tx,
    }: {
      tx?: Prisma.TransactionClient;
    } = {},
  ) {
    const db = tx || this.dbService;
    await db.user.update({
      where: { id: userId },
      data: {
        suspendedAt: null,
        suspendedUntil: null,
        suspensionReason: null,
      },
    });

    // TODO: Send notification email to user about unsuspension
    this.logger.debug(`User ${userId} unsuspended`);
  }
}
