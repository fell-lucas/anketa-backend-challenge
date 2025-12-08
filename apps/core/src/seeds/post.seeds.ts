import { Injectable } from '@nestjs/common';
import {
  AnswerType,
  Poll,
  PollOption,
  Post,
  PostStatus,
  PostVisibility,
  PostType as PrismaPostType,
  QuestionType,
} from '@prisma/client';
import { Seeds } from '@repo/system/test/seeds.interface';
import { TEST_USER_1 } from '@repo/system/test/users.fixtures';
import { DbService } from '../libraries/db/db.service';

type PollWithOptions = Poll & { options: PollOption[] };
type PostWithPoll = Post & { polls: PollWithOptions[] };

@Injectable()
export class PostSeeds implements Seeds {
  constructor(private db: DbService) {}

  regularPost: Post;
  postWithPoll: PostWithPoll;
  draftPost: PostWithPoll;
  privatePost: Post;
  publishedPost: PostWithPoll;
  surveyPost: PostWithPoll;
  poll: PollWithOptions;
  pollOptions: PollOption[];

  async seed(): Promise<void> {
    await this.createPosts();
  }

  private async createPost(data: Partial<Post>): Promise<Post> {
    return this.db.post.create({
      data: {
        isAnonymous: false,
        hasSensitiveContent: false,
        type: PrismaPostType.POLL,
        visibility: PostVisibility.PUBLIC,
        name: 'Default Post',
        description: 'Default description',
        hashtags: ['default', 'hashtag'],
        createdByUserId: TEST_USER_1.appId,
        ...data,
      },
      include: {
        media: true,
      },
    });
  }

  async createPosts() {
    // Create a draft post
    this.draftPost = await this.db.post.create({
      data: {
        isAnonymous: false,
        hasSensitiveContent: false,
        type: PrismaPostType.POLL,
        visibility: PostVisibility.PUBLIC,
        name: 'Draft Post',
        description: 'This is a draft post',
        status: PostStatus.DRAFT,
        createdByUserId: TEST_USER_1.appId,
        polls: {
          create: {
            questionType: QuestionType.multipleChoice,
            question: 'What is your favorite color?',
            answerType: AnswerType.text,
            hasMultipleAnswers: false,
            options: {
              create: [
                {
                  title: 'Blue',
                  content: 'Blue is the color of the sky',
                },
                {
                  title: 'Red',
                  content: 'Red is the color of roses',
                },
              ],
            },
          },
        },
      },
      include: {
        polls: {
          include: {
            options: true,
          },
        },
        media: true,
      },
    });

    // Create a private post
    this.privatePost = await this.createPost({
      name: 'Private Post',
      description: 'This is a private post',
      visibility: PostVisibility.PRIVATE,
    });

    // Create a public published post
    this.publishedPost = await this.db.post.create({
      data: {
        isAnonymous: false,
        hasSensitiveContent: false,
        type: PrismaPostType.POLL,
        visibility: PostVisibility.PUBLIC,
        name: 'Published Post',
        description: 'This is a published post',
        status: PostStatus.PUBLISHED,
        createdByUserId: TEST_USER_1.appId,
        polls: {
          create: {
            questionType: QuestionType.multipleChoice,
            question: 'What is your favorite season?',
            answerType: AnswerType.text,
            hasMultipleAnswers: false,
            options: {
              create: [
                {
                  title: 'Spring',
                  content: 'The season of renewal',
                },
                {
                  title: 'Summer',
                  content: 'The season of warmth',
                },
                {
                  title: 'Fall',
                  content: 'The season of colors',
                },
                {
                  title: 'Winter',
                  content: 'The season of snow',
                },
              ],
            },
          },
        },
      },
      include: {
        polls: {
          include: {
            options: true,
          },
        },
        media: true,
      },
    });

    // Create a survey post with multiple polls
    this.surveyPost = await this.db.post.create({
      data: {
        isAnonymous: false,
        hasSensitiveContent: false,
        type: PrismaPostType.SURVEY,
        visibility: PostVisibility.PUBLIC,
        status: PostStatus.PUBLISHED,
        name: 'Customer Satisfaction Survey',
        description: 'Help us improve our services by taking this survey',
        createdByUserId: TEST_USER_1.appId,
        polls: {
          create: [
            {
              questionType: QuestionType.multipleChoice,
              question: 'How satisfied are you with our service?',
              answerType: AnswerType.satisfaction,
              hasMultipleAnswers: false,
              options: {
                create: [
                  {
                    title: 'Very Satisfied',
                    content: 'Exceeded expectations',
                  },
                  {
                    title: 'Satisfied',
                    content: 'Met expectations',
                  },
                  {
                    title: 'Neutral',
                    content: 'Neither satisfied nor dissatisfied',
                  },
                  {
                    title: 'Dissatisfied',
                    content: 'Below expectations',
                  },
                ],
              },
            },
            {
              questionType: QuestionType.openEnded,
              question: 'What improvements would you suggest?',
              answerType: AnswerType.text,
              hasMultipleAnswers: false,
              addOpenEndedOption: true,
              answerCharacterLimit: 500,
            },
            {
              questionType: QuestionType.multipleChoice,
              question: 'Would you recommend our service to others?',
              answerType: AnswerType.agreement,
              hasMultipleAnswers: false,
              options: {
                create: [
                  {
                    title: 'Definitely',
                    content: 'I would strongly recommend',
                  },
                  {
                    title: 'Probably',
                    content: 'I might recommend',
                  },
                  {
                    title: 'Not sure',
                    content: 'I am undecided',
                  },
                  {
                    title: 'Probably not',
                    content: 'I would not recommend',
                  },
                ],
              },
            },
          ],
        },
      },
      include: {
        polls: {
          include: {
            options: true,
          },
        },
        media: true,
      },
    });

    // Create a regular post
    this.regularPost = await this.db.post.create({
      data: {
        isAnonymous: false,
        hasSensitiveContent: false,
        type: PrismaPostType.POLL,
        visibility: PostVisibility.PUBLIC,
        name: 'Regular Test Post',
        description: 'This is a regular test post',
        createdByUserId: TEST_USER_1.appId,
      },
      include: {
        media: true,
      },
    });

    // Create a post with poll
    this.postWithPoll = await this.db.post.create({
      data: {
        isAnonymous: false,
        hasSensitiveContent: false,
        type: PrismaPostType.POLL,
        visibility: PostVisibility.PUBLIC,
        status: PostStatus.PUBLISHED,
        name: 'Poll Test Post',
        description: 'This is a test post with a poll',
        createdByUserId: TEST_USER_1.appId,
        polls: {
          create: {
            questionType: QuestionType.multipleChoice,
            question: 'What is your favorite color?',
            answerType: AnswerType.text,
            hasMultipleAnswers: false,
            options: {
              create: [
                {
                  title: 'Blue',
                  content: 'Blue is the color of the sky',
                },
                {
                  title: 'Red',
                  content: 'Red is the color of roses',
                },
                {
                  title: 'Green',
                  content: 'Green is the color of nature',
                },
              ],
            },
          },
        },
      },
      include: {
        polls: {
          include: {
            options: {
              include: {
                media: true,
              },
            },
          },
        },
        media: true,
      },
    });

    // Create a closed post (with endsAt in the past)
    await this.db.post.create({
      data: {
        isAnonymous: false,
        hasSensitiveContent: false,
        type: PrismaPostType.POLL,
        visibility: PostVisibility.PUBLIC,
        status: PostStatus.PUBLISHED,
        name: 'Closed Poll Post',
        description: 'This is a closed poll that ended in the past',
        createdByUserId: TEST_USER_1.appId,
        endsAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
        polls: {
          create: {
            questionType: QuestionType.multipleChoice,
            question: 'What was your favorite movie of 2023?',
            answerType: AnswerType.text,
            hasMultipleAnswers: false,
            options: {
              create: [
                {
                  title: 'Oppenheimer',
                  content: "Christopher Nolan's biographical thriller",
                },
                {
                  title: 'Barbie',
                  content: "Greta Gerwig's fantasy comedy",
                },
                {
                  title: 'Spider-Man: Across the Spider-Verse',
                  content: 'Animated superhero sequel',
                },
              ],
            },
          },
        },
      },
    });

    // Store the poll and options for easy access in tests
    this.poll = this.postWithPoll.polls[0];
    this.pollOptions = this.poll.options;
  }
}
