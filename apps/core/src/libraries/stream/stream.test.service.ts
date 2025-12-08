import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { User } from '@prisma/client';
import * as crypto from 'crypto';
import { AppConfigService } from '../config/app.config.service';

interface MockStreamUser {
  id: string;
  name: string;
  image: string | null;
  username: string | null;
}

/**
 * This service provides a testing implementation of StreamService
 * that mimics the behavior of the GetStream API without making actual API calls.
 */
@Injectable()
export class StreamTestService implements OnModuleInit {
  private readonly logger = new Logger(StreamTestService.name);
  private mockUsers: Map<string, MockStreamUser> = new Map();
  private mockClient: any;

  constructor(private configService: AppConfigService) {
    if (!['development', 'test'].includes(process.env.NODE_ENV)) {
      throw new Error(
        'StreamTestService is only available in development or test environments',
      );
    }
    this.logger.log('🚧 Simulating Stream API');

    // Initialize the mock client
    this.mockClient = this.createMockClient();
  }

  async onModuleInit() {
    this.logger.log('StreamTestService initialized');
  }

  /**
   * Register a user with mock Stream service and return the updated user
   */
  async upsertUser(user: User): Promise<User> {
    try {
      // Create a mock token
      const token = this.mockClient.createToken(user.id);

      // Store mock user data
      this.mockUsers.set(user.id, {
        id: user.id,
        name: user.name,
        image: user.profilePicturePublicId
          ? `https://res.cloudinary.com/${this.configService.cloudinary.cloudName}/image/upload/w_1024/${user.profilePicturePublicId}`
          : null,
        username: user.username,
      });

      // Log the operation
      this.logger.log(`Mock Stream: User ${user.id} registered/updated`);

      // Return a copy of the user with the token
      return {
        ...user,
        streamToken: token,
      };
    } catch (error) {
      this.logger.error('Error registering user with mock Stream:', error);
      throw error;
    }
  }

  /**
   * Register all existing users - this is a no-op in the test service
   */
  async registerExistingUsers() {
    this.logger.log(
      'Mock Stream: registerExistingUsers called (no-op in test service)',
    );
    return Promise.resolve();
  }

  /**
   * Delete a user from mock Stream
   */
  async deleteUser(userId: string) {
    try {
      if (this.mockUsers.has(userId)) {
        this.mockUsers.delete(userId);
        this.logger.log(`Mock Stream: User ${userId} deleted`);
        return true;
      }
      this.logger.log(`Mock Stream: User ${userId} not found for deletion`);
      return false;
    } catch (error) {
      this.logger.error('Error deleting user from mock Stream:', error);
      throw error;
    }
  }

  /**
   * Create a mock token for a user
   */
  private createToken(userId: string): string {
    return `mock-stream-token-${userId}-${crypto.randomBytes(8).toString('hex')}`;
  }

  /**
   * Create a mock client that mimics the StreamChat instance
   */
  private createMockClient() {
    return {
      // Mimic the createToken method
      createToken: (userId: string) => this.createToken(userId),

      // Mimic the upsertUser method
      upsertUser: (userData: any) => {
        this.mockUsers.set(userData.id, userData);
        return Promise.resolve();
      },

      // Mimic the deleteUser method
      deleteUser: (userId: string, options: any) => {
        if (this.mockUsers.has(userId)) {
          this.mockUsers.delete(userId);
          return Promise.resolve({ user: { id: userId } });
        }
        return Promise.resolve({ user: null });
      },
    };
  }

  public blockUser(userId: string, targetUserId: string) {
    this.mockUsers.set(targetUserId, {
      id: targetUserId,
      name: 'Blocked User',
      image: null,
      username: 'blocked_user',
    });
  }

  public unblockUser(userId: string, targetUserId: string) {
    this.mockUsers.delete(targetUserId);
  }
}
