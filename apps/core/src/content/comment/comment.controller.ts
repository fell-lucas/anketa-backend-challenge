import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from 'src/iam/auth/guards/user.auth.guard';
import { CommentService } from './comment.service';

@ApiTags('Comments')
@Controller('posts/:postId/comments')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @ApiOperation({ summary: 'List comments for a post (excludes hidden comments)' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  async findByPostId(
    @Param('postId') postId: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.commentService.findByPostId(postId, {
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
    });
  }
}
