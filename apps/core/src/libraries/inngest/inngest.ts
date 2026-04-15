import { EventSchemas, Inngest } from 'inngest';
import { NestInngest } from 'nest-inngest';
import { z } from 'zod';

// This will be used by the service implementations
export const createInngestClient = () => {
  return new Inngest({
    id: 'anketa',
    // https://www.inngest.com/docs/reference/client/create#defining-event-payload-types
    schemas: new EventSchemas().fromZod({
      'minting/mint': {},
      'app/posts.closed': {},
      'app/posts.scheduled': {
        data: z.object({
          postId: z.string(),
        }),
      },
      // Create the post on blockchain:
      'app/posts.blockchain.created': {
        data: z.object({
          postId: z.string(),
        }),
      },
      // Create the user wallet:
      'app/user.created': {
        data: z.object({
          userId: z.string(),
        }),
      },
      // Cast the vote on blockchain:
      'app/votes.blockchain.created': {
        data: z.object({
          voteId: z.string(),
        }),
      },
      'app/notifications.fcm.send': {
        data: z.object({
          notificationId: z.string(),
        }),
      },
      'app/posts-searches.cleanup': {},
      'app/user.scheduled-deletion': {
        data: z.object({
          userId: z.string(),
        }),
      },
      'awarded-tokens/award': {
        data: z.object({
          userCount: z.number(),
        }),
      },
      'app/user.scheduled-unsuspension': {
        data: z.object({
          userId: z.string(),
        }),
      },
      'app/post.scheduled-unhiding': {
        data: z.object({
          postId: z.string(),
        }),
      },
      'app/comment.scheduled-unhiding': {
        data: z.object({
          commentId: z.string(),
        }),
      },
    }),
    // We need to force this for some weird bug on UAT env on AWS:
    isDev: !(process.env['INNGEST_PROD_MODE'] === 'true'),
  });
};

// Used by nest-inngest for function declaration
export const inngest = createInngestClient();

// instantiate and export Inngest helper decorator
export const MintingInngest = NestInngest.from(inngest);
