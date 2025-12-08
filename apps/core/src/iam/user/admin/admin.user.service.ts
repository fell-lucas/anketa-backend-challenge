import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { DbService } from 'src/libraries/db/db.service';
import { AdminFindUsersDto } from './dto/admin.find-users.dto';

@Injectable()
export class AdminUserService {
  constructor(private readonly dbService: DbService) {}

  async findMany(dto: AdminFindUsersDto) {
    const {
      searchQuery,
      email,
      username,
      visibility,
      withoutWallet,
      take = 24,
      skip = 0,
      sortBy = 'updatedAt',
      sortOrder = 'desc',
    } = dto;

    // Build where conditions
    const where: Prisma.UserWhereInput = {};

    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { email: { contains: searchQuery, mode: 'insensitive' } },
        { username: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    if (email) {
      where.email = { contains: email, mode: 'insensitive' };
    }

    if (username) {
      where.username = { contains: username, mode: 'insensitive' };
    }

    if (visibility) {
      where.visibility = visibility;
    }

    if (withoutWallet) {
      where.wallets = { none: {} };
    }

    // Build order by
    const orderBy: Prisma.UserOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    // Execute query with count
    const [users, total] = await Promise.all([
      this.dbService.user.findMany({
        where,
        take,
        skip,
        orderBy,
        include: {
          profilePicture: true,
          userSettings: true,
          _count: {
            select: {
              posts: true,
              comments: true,
              followers: true,
              following: true,
            },
          },
        },
      }),
      this.dbService.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        skip,
        take,
      },
    };
  }

  async findOne(where: Prisma.UserWhereUniqueInput) {
    const user = await this.dbService.user.findUnique({
      where,
      include: {
        profilePicture: true,
        userSettings: true,
        wallets: true,
        userProfileInformation: true,
        _count: {
          select: {
            posts: true,
            comments: true,
            followers: true,
            following: true,
            likes: true,
            reposts: true,
            votes: true,
            bookmarks: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async findOneById(id: string) {
    return this.findOne({ id });
  }

  async create(data: Prisma.UserCreateInput) {
    // Hash password/pin if provided
    if (data.pinCode) {
      data.pinCode = await bcrypt.hash(data.pinCode, 10);
    }

    // Create user
    const user = await this.dbService.user.create({
      data,
    });

    // Create default user settings
    await this.dbService.userSettings.create({
      data: {
        userId: user.id,
      },
    });

    // Create empty user profile information
    await this.dbService.userProfileInformation.create({
      data: {
        userId: user.id,
        data: {},
      },
    });

    return user;
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    // Hash pinCode if provided
    if (data.pinCode && typeof data.pinCode === 'string') {
      data.pinCode = await bcrypt.hash(data.pinCode, 10);
    }

    // Check if user exists
    const exists = await this.dbService.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Update user
    return this.dbService.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    // Check if user exists
    const user = await this.dbService.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Delete related records first (can be customized based on your cascade requirements)

    // Delete the user
    return this.dbService.user.delete({
      where: { id },
    });
  }
}
