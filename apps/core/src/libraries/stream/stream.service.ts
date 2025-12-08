import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { User } from '@prisma/client';
import { StreamChat } from 'stream-chat';
import { AppConfigService } from '../config/app.config.service';
import { DbService } from '../db/db.service';

@Injectable()
export class StreamService implements OnModuleInit {
  private readonly logger = new Logger(StreamService.name);
  private client: StreamChat;

  constructor(
    private configService: AppConfigService,
    private dbService: DbService,
  ) {
    const apiKey = this.configService.stream.apiKey;
    const apiSecret = this.configService.stream.apiSecret;

    this.client = StreamChat.getInstance(apiKey, apiSecret);
  }

  async onModuleInit() {
    // Optional: Register all existing users when the app starts
    if (
      ['staging', 'integration'].includes(
        process.env.RAILWAY_ENVIRONMENT_NAME,
      ) &&
      !this.configService.stream.simulate
    ) {
      await this.registerExistingUsers();
    }
  }

  /**
   * Register/Update a user with GetStream and update their token in the database
   */
  async upsertUser(user: User, updateAnyway: boolean = false): Promise<User> {
    const hasStreamToken = !!user.streamToken;
    if (hasStreamToken && !updateAnyway) {
      this.logger.log(`User ${user.id} already registered with GetStream`);
      return user;
    }

    try {
      // Upsert the user to Stream
      await this.client.upsertUser({
        id: user.id,
        name: user.name,
        image:
          user.profilePicturePublicId != null
            ? `https://res.cloudinary.com/${this.configService.cloudinary.cloudName}/image/upload/w_1024/${user.profilePicturePublicId}.jpg`
            : null,
        username: user.username,
      });

      if (hasStreamToken) {
        this.logger.log(
          `User ${user.id} already has a Stream token, skipping registration`,
        );
        return user;
      }

      // Create a user token
      const token = this.client.createToken(user.id);

      // Update the user in the database with the new stream token
      return this.dbService.user.update({
        where: { id: user.id },
        data: {
          streamToken: token,
        },
      });
    } catch (error) {
      this.logger.error('Error registering user with GetStream:', error);
      throw error;
    }
  }

  /**
   * Register all existing users from the database to GetStream
   */
  async registerExistingUsers() {
    try {
      // Fetch all users from your database
      const users = await this.dbService.user.findMany({
        where: {
          streamToken: null, // Only register users without a token
        },
        select: {
          id: true,
          name: true,
          username: true,
          profilePicturePublicId: true,
        },
      });

      if (users.length === 0) {
        this.logger.log('No users to register with GetStream');
        return;
      }

      // Register each user with GetStream
      const registrationPromises = users.map((user) =>
        this.upsertUser(user as User),
      );

      await Promise.all(registrationPromises);

      this.logger.log(
        `Successfully registered ${users.length} existing users with GetStream`,
      );
    } catch (error) {
      this.logger.error(
        'Error registering existing users with GetStream:',
        error,
      );
      throw error;
    }
  }

  /**
   * Delete a user from GetStream
   */
  async deleteUser(userId: string) {
    try {
      await this.client.deleteUser(userId, {
        hard_delete: true, // Completely removes the user and their data
      });
      return true;
    } catch (error) {
      this.logger.error('Error deleting user from GetStream:', error);
      throw error;
    }
  }

  /**
   * Block a user in Stream Chat
   * Assumes the block relationship is already handled in the database
   */
  async blockUser(userId: string, targetUserId: string): Promise<void> {
    try {
      // Apply the block in Stream Chat
      // This prevents the blocked user from sending messages to the blocker
      await this.client.blockUser(targetUserId, userId);

      this.logger.log(
        `User ${userId} successfully blocked user ${targetUserId} in Stream`,
      );
    } catch (error) {
      this.logger.error(
        `Error blocking user ${targetUserId} for user ${userId} in Stream:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Unblock a user in Stream Chat
   * Assumes the block relationship is already removed from the database
   */
  async unblockUser(userId: string, targetUserId: string): Promise<void> {
    try {
      // Remove the block in Stream Chat
      await this.client.unBlockUser(targetUserId, userId);

      this.logger.log(
        `User ${userId} successfully unblocked user ${targetUserId} in Stream`,
      );
    } catch (error) {
      this.logger.error(
        `Error unblocking user ${targetUserId} for user ${userId} in Stream:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Sync all existing blocks from database to Stream
   * Useful for initial setup or data migration
   */
  async syncBlocksToStream(): Promise<void> {
    try {
      const allBlocks = await this.dbService.userBlock.findMany({
        select: {
          userId: true,
          targetUserId: true,
        },
      });

      if (allBlocks.length === 0) {
        this.logger.log('No blocks to sync to Stream');
        return;
      }

      // Apply all blocks to Stream
      const blockPromises = allBlocks.map((block) =>
        this.client.blockUser(block.targetUserId, block.userId),
      );

      await Promise.allSettled(blockPromises);

      this.logger.log(
        `Successfully synced ${allBlocks.length} blocks to Stream`,
      );
    } catch (error) {
      this.logger.error('Error syncing blocks to Stream:', error);
      throw error;
    }
  }
}
