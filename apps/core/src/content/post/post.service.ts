import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DbService } from 'src/libraries/db/db.service';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(private readonly dbService: DbService) {}

  async findMany(options: { skip?: number; take?: number }) {
    const { skip = 0, take = 24 } = options;

    // Filter out hidden posts for user-facing endpoints
    const where: Prisma.PostWhereInput = {
      hiddenAt: null,
    };

    const [data, total] = await Promise.all([
      this.dbService.post.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          createdByUser: true,
          _count: { select: { comments: true, likes: true, votes: true } },
        },
      }),
      this.dbService.post.count({ where }),
    ]);

    return { data, meta: { total, skip, take } };
  }

  async findById(id: string) {
    const post = await this.dbService.post.findUnique({
      where: { id },
      include: {
        createdByUser: true,
        _count: { select: { comments: true, likes: true, votes: true } },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // If post is hidden, treat as not found for regular users
    if (post.hiddenAt) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }
}
