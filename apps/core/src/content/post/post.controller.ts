import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UserAuthGuard } from 'src/iam/auth/guards/user.auth.guard';
import { PostService } from './post.service';

@ApiTags('Posts')
@Controller('posts')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @ApiOperation({ summary: 'List posts (excludes hidden posts)' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  async findMany(@Query('skip') skip?: number, @Query('take') take?: number) {
    return this.postService.findMany({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by ID (returns 404 if hidden)' })
  async findById(@Param('id') id: string) {
    return this.postService.findById(id);
  }
}
