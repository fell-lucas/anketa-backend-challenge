import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { AdminUserService } from './admin.user.service';
import { AdminFindUsersDto } from './dto/admin.find-users.dto';
import { AdminAuthGuard } from '../../auth/admin/admin.auth.guard';

@ApiTags('Admin - Users')
@Controller('brainbox/users')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth()
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Get()
  @ApiOperation({ summary: 'Find many users with pagination and filters' })
  async findMany(@Query() dto: AdminFindUsersDto) {
    return this.adminUserService.findMany(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one user by ID' })
  async findOne(@Param('id') id: string) {
    return this.adminUserService.findOneById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  async create(@Body() data: Prisma.UserCreateInput) {
    return this.adminUserService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  async update(@Param('id') id: string, @Body() data: Prisma.UserUpdateInput) {
    return this.adminUserService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  async delete(@Param('id') id: string) {
    return this.adminUserService.delete(id);
  }
}
