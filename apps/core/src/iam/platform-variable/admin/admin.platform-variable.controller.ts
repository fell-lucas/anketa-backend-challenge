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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { AdminPlatformVariableService } from './admin.platform-variable.service';
import { AdminFindPlatformVariablesDto } from './dto/admin.find-platform-variables.dto';
import { AdminAuthGuard } from '../../auth/admin/admin.auth.guard';
import { PlatformVariables } from '../../../../prisma/generated/platform_variables';

@ApiTags('Admin - Platform Variables')
@Controller('brainbox/platform-variables')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth()
export class AdminPlatformVariableController {
  constructor(
    private readonly adminPlatformVariableService: AdminPlatformVariableService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Find many platform variables with pagination and filters',
    description:
      'Retrieve a paginated list of platform variables with optional filtering by name, category, and search',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved platform variables',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/PlatformVariables' },
        },
        meta: {
          type: 'object',
          properties: {
            total: {
              type: 'number',
              description: 'Total number of platform variables',
            },
            skip: {
              type: 'number',
              description: 'Number of platform variables skipped',
            },
            take: {
              type: 'number',
              description: 'Number of platform variables returned',
            },
          },
          required: ['total', 'skip', 'take'],
        },
      },
      required: ['data', 'meta'],
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findMany(@Query() dto: AdminFindPlatformVariablesDto): Promise<{
    data: PlatformVariables[];
    meta: {
      total: number;
      skip: number;
      take: number;
    };
  }> {
    return this.adminPlatformVariableService.findMany(dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find one platform variable by ID',
    description:
      'Retrieve detailed information about a specific platform variable',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Platform variable UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved platform variable',
    type: PlatformVariables,
  })
  @ApiResponse({ status: 404, description: 'Platform variable not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(@Param('id') id: string): Promise<PlatformVariables> {
    return this.adminPlatformVariableService.findOneById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new platform variable',
    description: 'Create a new platform variable with the provided data',
  })
  @ApiBody({
    description: 'Platform variable creation data',
    schema: {
      type: 'object',
      required: ['category', 'name', 'value'],
      properties: {
        category: {
          type: 'string',
          description: 'Category of the platform variable',
          example: 'email',
        },
        name: {
          type: 'string',
          description: 'Unique name of the platform variable',
          example: 'smtp_host',
        },
        value: {
          type: 'string',
          description: 'Value of the platform variable',
          example: 'smtp.example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Platform variable created successfully',
    type: PlatformVariables,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() data: Prisma.PlatformVariablesCreateInput,
  ): Promise<PlatformVariables> {
    return this.adminPlatformVariableService.create(data);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a platform variable',
    description: 'Update an existing platform variable with the provided data',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Platform variable UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    description: 'Platform variable update data',
    schema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Category of the platform variable',
          example: 'notification',
        },
        name: {
          type: 'string',
          description: 'Unique name of the platform variable',
          example: 'smtp_port',
        },
        value: {
          type: 'string',
          description: 'Value of the platform variable',
          example: '587',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Platform variable updated successfully',
    type: PlatformVariables,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Platform variable not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @Param('id') id: string,
    @Body() data: Prisma.PlatformVariablesUpdateInput,
  ): Promise<PlatformVariables> {
    return this.adminPlatformVariableService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a platform variable',
    description: 'Delete a platform variable by its ID',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Platform variable UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Platform variable deleted successfully',
    type: PlatformVariables,
  })
  @ApiResponse({ status: 404, description: 'Platform variable not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(@Param('id') id: string): Promise<PlatformVariables> {
    return this.adminPlatformVariableService.delete(id);
  }
}
