import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  AppNotFoundEnum,
  AppNotFoundException,
  AppUnauthorizedException,
  ExceptionUnauthorizedEnum,
  UserError,
} from '@repo/system/errors/global.exceptions';
import { NestInngest } from 'nest-inngest';
import { User } from 'prisma/generated/user';
import { MintingInngest } from 'src/libraries/inngest/inngest';
import { AuthRequest } from '../auth/auth.request';
import { UserAuthGuard } from '../auth/guards/user.auth.guard';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserWithFollowsDto } from './dto/user-with-follows.dto';
import { VerifyPinDto } from './dto/verify-pin.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller()
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly usersService: UserService) {}

  @ApiOperation({
    summary: 'Update the current user profile',
  })
  @Patch('auth/me')
  @UseGuards(UserAuthGuard)
  async updateProfile(
    @Request() req: AuthRequest,
    @Body() data: UpdateProfileDto,
  ): Promise<User> {
    return await this.usersService.update(req.user.appId, data);
  }

  @ApiOperation({
    summary: 'Get paginated list of users',
  })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'sortBy',
    required: true,
    enum: ['name', 'relevance', 'createdAt'],
  })
  @ApiQuery({ name: 'sortOrder', required: true, enum: ['asc', 'desc'] })
  @Get('users')
  @UseGuards(UserAuthGuard)
  async getUsers(
    @Req() req: AuthRequest,
    @Query('cursor') cursor?: string,
    @Query('limit') limit: number = 24,
    @Query('sortBy') sortBy: 'name' | 'relevance' | 'createdAt' = 'name',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
    @Query('name') name?: string,
  ) {
    return await this.usersService.findMany({
      currentUserId: req.user.appId,
      cursor,
      limit,
      sortBy,
      sortOrder,
      name,
    });
  }

  /**
   * Get information about the current user.
   * NB: this is a lightweight endpoint and doesn't return all user stats, use /users/me instead.
   * @deprecated Use /users/me instead
   */
  @ApiOperation({
    summary: 'Get info about current user. DEPRECATED - use /users/me instead',
    deprecated: true,
  })
  @Get('auth/me')
  @UseGuards(UserAuthGuard)
  async getProfile(@Request() req: AuthRequest): Promise<User> {
    if (!req.user?.appId) {
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.USER_NOT_REGISTERED,
      );
    }
    const user = await this.usersService.findOne({ id: req.user.appId });
    if (!user) {
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.MISSING_USER,
      );
    }
    return user;
  }

  @ApiOperation({
    summary: 'Get full user info for the current user',
  })
  @Get('users/me')
  @UseGuards(UserAuthGuard)
  async getCurrentUser(@Req() req: AuthRequest): Promise<UserWithFollowsDto> {
    if (!req.user?.appId) {
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.USER_NOT_REGISTERED,
      );
    }
    const user = await this.usersService.findOneWithStats(
      req.user.appId,
      req.user.appId,
    );
    if (!user) {
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.MISSING_USER,
      );
    }
    return user;
  }

  @ApiOperation({
    summary: 'Get a single user by ID',
  })
  @Get('users/:id')
  @UseGuards(UserAuthGuard)
  async getUser(
    @Req() req: AuthRequest,
    @Param('id') id: string,
  ): Promise<UserWithFollowsDto> {
    const user = await this.usersService.findOneWithStats(id, req.user.appId);
    if (!user) {
      throw new AppNotFoundException(AppNotFoundEnum.USER_NOT_FOUND);
    }
    return user;
  }

  @ApiOperation({
    summary: 'Get a single user by ID',
  })
  @Get('users/username/:username')
  @UseGuards(UserAuthGuard)
  async getUserByUsername(
    @Req() req: AuthRequest,
    @Param('username') username: string,
  ): Promise<UserWithFollowsDto> {
    const user = await this.usersService.findOneByUsernameWithStats(
      username,
      req.user.appId,
    );
    if (!user) {
      throw new AppNotFoundException(AppNotFoundEnum.USER_NOT_FOUND);
    }
    return user;
  }

  @ApiOperation({
    summary: 'Verify the current user pin code',
  })
  @Post('auth/me/verify-pin')
  @HttpCode(200)
  @UseGuards(UserAuthGuard)
  async verifyPin(
    @Request() req: AuthRequest,
    @Body() data: VerifyPinDto,
  ): Promise<{ verified: boolean }> {
    return await this.usersService.verifyPin(req.user.appId, data);
  }

  @ApiOperation({
    summary: 'Schedule deletion of the current user account (45 days)',
  })
  @Delete('users/me')
  @HttpCode(200)
  @UseGuards(UserAuthGuard)
  async deleteCurrentUser(
    @Body() data: DeleteUserDto,
    @Request() req: AuthRequest,
  ): Promise<{ scheduled: boolean; willDeleteAt: Date }> {
    if (!req.user?.appId) {
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.USER_NOT_REGISTERED,
      );
    }
    const result = await this.usersService.scheduleUserDeletion(
      req.user.appId,
      data.deleteReason,
    );
    return { scheduled: true, willDeleteAt: result.willDeleteAt };
  }

  @MintingInngest.Function({
    id: 'user-created-handler',
    retries: 10,
  })
  @MintingInngest.Trigger({
    event: 'app/user.created',
  })
  public async handleUserCreated({
    event,
    step,
  }: NestInngest.context<typeof MintingInngest, 'app/user.created'>) {
    const userId = (event as any).data.userId;
    this.logger.log('Inngest User Created event', userId);

    try {
      const wallet = await this.usersService.createUserWallet(userId);

      // Unblock any posts waiting for the wallet to be created:
      await step.sendEvent('user-wallet-created', {
        name: 'app/user.wallet.created',
        data: { userId },
      });

      this.logger.log('User wallet created', {
        userId,
        publicKey: wallet.publicKey,
      });
    } catch (error) {
      this.logger.error(error, 'Error creating user wallet');
      // NB: UserErrors are expected and shouldn't trigger a retry:
      if (error instanceof UserError) {
        return {
          success: false,
          message: error.message,
        };
      }
      throw error;
    }
  }

  @MintingInngest.Function({
    id: 'user-scheduled-deletion-handler',
    retries: 5,
  })
  @MintingInngest.Trigger({
    event: 'app/user.scheduled-deletion',
  })
  public async handleUserScheduledDeletion({
    event,
  }: NestInngest.context<
    typeof MintingInngest,
    'app/user.scheduled-deletion'
  >) {
    const userId = (event as any).data.userId;
    this.logger.log('Inngest User Scheduled Deletion event', userId);

    try {
      await this.usersService.softDeleteUser(userId);
      this.logger.log('User successfully deleted', { userId });
      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      this.logger.error(error, 'Error deleting user');
      // NB: UserErrors are expected and shouldn't trigger a retry:
      if (error instanceof UserError) {
        return {
          success: false,
          message: error.message,
        };
      }
      throw error;
    }
  }

  @MintingInngest.Function({
    id: 'user-scheduled-unsuspension-handler',
    retries: 5,
  })
  @MintingInngest.Trigger({
    event: 'app/user.scheduled-unsuspension',
  })
  public async handleUserScheduledUnsuspension({
    event,
  }: NestInngest.context<
    typeof MintingInngest,
    'app/user.scheduled-unsuspension'
  >) {
    const userId = (event as any).data.userId;
    this.logger.log('Inngest User Scheduled Unsuspension event', userId);

    try {
      await this.usersService.unsuspendUser(userId);
      this.logger.log('User successfully unsuspended', { userId });
      return {
        success: true,
        message: 'User unsuspended successfully',
      };
    } catch (error) {
      this.logger.error(error, 'Error unsuspending user');
      // NB: UserErrors are expected and shouldn't trigger a retry:
      if (error instanceof UserError) {
        return {
          success: false,
          message: error.message,
        };
      }
      throw error;
    }
  }
}
