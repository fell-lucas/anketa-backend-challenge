import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DbService } from 'src/libraries/db/db.service';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);

  constructor(private readonly dbService: DbService) {}

  async findByPostId(postId: string, options: { skip?: number; take?: number }) {
    const { skip = 0, take = 24 } = options;

    // Verify post exists and is not hidden
    const post = await this.dbService.post.findUnique({ where: { id: postId } });
    if (!post || post.hiddenAt) {
      throw new NotFoundException('Post not found');
    }

    // Filter out hidden comments
    const where: Prisma.CommentWhereInput = {
      postId,
      hiddenAt: null,
    };

    const [data, total] = await Promise.all([
      this.dbService.comment.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { user: true },
      }),
      this.dbService.comment.count({ where }),
    ]);

    return { data, meta: { total, skip, take } };
  }
}
