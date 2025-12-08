import { Module } from '@nestjs/common';
import { ActivityPointsSeeds } from './activity-points.seeds';
import { ChannelSeeds } from './channel.seeds';
import { CommentSeeds } from './comment.seeds';
import { PostSeeds } from './post.seeds';

@Module({
  imports: [],
  providers: [ActivityPointsSeeds, ChannelSeeds, CommentSeeds, PostSeeds],
  exports: [ActivityPointsSeeds, ChannelSeeds, CommentSeeds, PostSeeds],
})
export class SeedsModule {}
