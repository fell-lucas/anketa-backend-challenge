import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import {
  AnswerType,
  Comment,
  Post,
  PostStatus,
  PostType,
  PostVisibility,
  QuestionType,
} from '@prisma/client';
import { Seeds } from '@repo/system/test/seeds.interface';
import { TEST_USER_1, TEST_USER_2 } from '@repo/system/test/users.fixtures';
import { DbService } from '../libraries/db/db.service';
import { PostSeeds } from './post.seeds';

@Injectable()
export class CommentSeeds implements Seeds {
  constructor(
    private db: DbService,
    private postSeeds: PostSeeds,
  ) {}

  publishedPostComment1: Comment;

  // Store comments for easy access in tests
  topLevelComments: Comment[] = [];
  replyComments: Comment[] = [];
  extendedPosts: Post[] = [];

  async seed(): Promise<void> {
    await this.createComments();
  }

  private async createComment({
    content,
    userId,
    postId,
    parentCommentId,
  }: {
    content: string;
    userId: string;
    postId: string;
    parentCommentId?: string;
  }): Promise<Comment> {
    return this.db.comment.create({
      data: {
        content,
        userId,
        postId,
        parentCommentId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            profilePicturePublicId: true,
          },
        },
        _count: {
          select: {
            replies: true,
            likes: true,
          },
        },
      },
    });
  }

  async createComments() {
    // Create comments for the published post
    this.publishedPostComment1 = await this.createComment({
      content: 'This is a comment on the published post',
      userId: TEST_USER_1.appId,
      postId: this.postSeeds.publishedPost.id,
    });

    const publishedPostComment2 = await this.createComment({
      content: 'Another comment on the published post',
      userId: TEST_USER_2.appId,
      postId: this.postSeeds.publishedPost.id,
    });

    // Create a reply to the first comment
    const publishedPostReply1 = await this.createComment({
      content: 'This is a reply to the first comment',
      userId: TEST_USER_2.appId,
      postId: this.postSeeds.publishedPost.id,
      parentCommentId: this.publishedPostComment1.id,
    });

    // Create comments for the post with poll
    const pollPostComment1 = await this.createComment({
      content: 'I voted for the blue option!',
      userId: TEST_USER_1.appId,
      postId: this.postSeeds.postWithPoll.id,
    });

    const pollPostComment2 = await this.createComment({
      content: 'I prefer the red option',
      userId: TEST_USER_2.appId,
      postId: this.postSeeds.postWithPoll.id,
    });

    // Create a reply to the poll comment
    const pollPostReply1 = await this.createComment({
      content: 'Blue is definitely the best choice',
      userId: TEST_USER_2.appId,
      postId: this.postSeeds.postWithPoll.id,
      parentCommentId: pollPostComment1.id,
    });

    // Store comments for easy access in tests
    this.topLevelComments = [
      this.publishedPostComment1,
      publishedPostComment2,
      pollPostComment1,
      pollPostComment2,
    ];

    this.replyComments = [publishedPostReply1, pollPostReply1];

    // Update post comment counts
    await this.db.post.update({
      where: { id: this.postSeeds.publishedPost.id },
      data: {
        commentsCount: 3, // 2 top-level + 1 reply
      },
    });

    await this.db.post.update({
      where: { id: this.postSeeds.postWithPoll.id },
      data: {
        commentsCount: 3, // 2 top-level + 1 reply
      },
    });
  }

  /**
   * Generate a specified number of posts with comments using faker-js
   * @param num Number of posts to generate
   * @returns Array of generated posts
   */
  async seedExtended(num: number): Promise<Post[]> {
    const users = [TEST_USER_1.appId, TEST_USER_2.appId];
    const posts: Post[] = [];

    // Create posts of different types
    for (let i = 0; i < num; i++) {
      const postType = i % 3; // 0: normal post, 1: post with 1 poll, 2: post with 3 polls

      // Create base post
      const post = await this.db.post.create({
        data: {
          isAnonymous: false,
          hasSensitiveContent: false,
          type: postType === 2 ? PostType.SURVEY : PostType.POLL,
          visibility: PostVisibility.PUBLIC,
          status: PostStatus.PUBLISHED,
          name: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          hashtags: Array.from(
            { length: faker.number.int({ min: 1, max: 5 }) },
            () => faker.word.sample().toLowerCase(),
          ),
          createdByUserId:
            users[faker.number.int({ min: 0, max: users.length - 1 })],
        },
      });

      posts.push(post);

      // Create polls based on post type
      if (postType === 1) {
        // Post with 1 poll
        await this.createPoll(post.id, 1);
      } else if (postType === 2) {
        // Post with 3 polls
        await this.createPoll(post.id, 3);
      }

      // Generate random number of comments (at least 10)
      const commentCount = faker.number.int({ min: 10, max: 20 });
      let totalComments = 0;

      // Create top-level comments
      for (let j = 0; j < commentCount; j++) {
        const comment = await this.createComment({
          content: faker.lorem.paragraph(),
          userId: users[faker.number.int({ min: 0, max: users.length - 1 })],
          postId: post.id,
        });

        totalComments++;

        // Add replies to some comments (50% chance)
        if (faker.datatype.boolean()) {
          const replyCount = faker.number.int({ min: 1, max: 3 });

          for (let k = 0; k < replyCount; k++) {
            await this.createComment({
              content: faker.lorem.paragraph(),
              userId:
                users[faker.number.int({ min: 0, max: users.length - 1 })],
              postId: post.id,
              parentCommentId: comment.id,
            });

            totalComments++;
          }
        }
      }

      // Update post comment count
      await this.db.post.update({
        where: { id: post.id },
        data: {
          commentsCount: totalComments,
        },
      });
    }

    this.extendedPosts = posts;
    return posts;
  }

  /**
   * Helper method to create polls for a post
   * @param postId Post ID to attach polls to
   * @param count Number of polls to create
   */
  private async createPoll(postId: string, count: number): Promise<void> {
    for (let i = 0; i < count; i++) {
      await this.db.poll.create({
        data: {
          questionType: QuestionType.multipleChoice,
          question: faker.lorem.sentence() + '?',
          answerType: AnswerType.text,
          hasMultipleAnswers: faker.datatype.boolean(),
          postId,
          options: {
            create: Array.from(
              { length: faker.number.int({ min: 2, max: 5 }) },
              () => ({
                title: faker.lorem.words(3),
                content: faker.lorem.sentence(),
              }),
            ),
          },
        },
      });
    }
  }
}
