import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DbService } from 'src/libraries/db/db.service';
import { AdminFindPlatformVariablesDto } from './dto/admin.find-platform-variables.dto';

/**
 * Service for managing platform variables in the admin panel.
 * Provides CRUD operations and advanced filtering for platform variable management.
 */
@Injectable()
export class AdminPlatformVariableService {
  constructor(private readonly dbService: DbService) {}

  /**
   * Builds where conditions for platform variable queries based on provided filters.
   *
   * @param dto - Optional filter criteria from AdminFindActivityTypesDto
   * @returns Prisma where input object for platform variable queries
   */
  private buildPlatformVariableWhere(
    dto?: AdminFindPlatformVariablesDto,
  ): Prisma.PlatformVariablesWhereInput {
    if (!dto) return {};

    const { searchQuery, category } = dto;
    const where: Prisma.PlatformVariablesWhereInput = {};

    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { category: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = { contains: category, mode: 'insensitive' };
    }

    return where;
  }

  /**
   * Retrieves a paginated list of platform variables with optional filtering and sorting.
   *
   * @param dto - Filter, pagination, and sorting parameters
   * @returns Promise resolving to paginated platform variable results with metadata
   */
  async findMany(dto: AdminFindPlatformVariablesDto) {
    const {
      take = 24,
      skip = 0,
      sortBy = 'updatedAt',
      sortOrder = 'desc',
    } = dto;

    const where = this.buildPlatformVariableWhere(dto);

    // Build order by
    const orderBy: Prisma.PlatformVariablesOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    // Execute query with count
    const [platformVariables, total] = await Promise.all([
      this.dbService.platformVariables.findMany({
        where,
        take,
        skip,
        orderBy,
      }),
      this.dbService.platformVariables.count({ where }),
    ]);

    return {
      data: platformVariables,
      meta: {
        total,
        skip,
        take,
      },
    };
  }

  /**
   * Retrieves a single platform variable by unique identifier.
   *
   * @param where - Unique identifier for the platform variable
   * @returns Promise resolving to the platform variable
   * @throws NotFoundException when platform variable is not found
   */
  async findOne(where: Prisma.PlatformVariablesWhereUniqueInput) {
    const platformVariable = await this.dbService.platformVariables.findUnique({
      where,
    });

    if (!platformVariable) {
      throw new NotFoundException(`Platform variable not found`);
    }

    return platformVariable;
  }

  /**
   * Retrieves a single platform variable by its ID.
   *
   * @param id - The unique identifier of the platform variable
   * @returns Promise resolving to the platform variable
   * @throws NotFoundException when platform variable with the specified ID is not found
   */
  async findOneById(id: string) {
    return this.findOne({ id });
  }

  /**
   * Creates a new platform variable with the provided data.
   *
   * @param data - Platform variable creation data conforming to Prisma schema
   * @returns Promise resolving to the newly created platform variable
   */
  async create(data: Prisma.PlatformVariablesCreateInput) {
    // Create platform variable
    return await this.dbService.platformVariables.create({
      data,
    });
  }

  /**
   * Updates an existing platform variable with the provided data.
   *
   * @param id - The unique identifier of the platform variable to update
   * @param data - Partial platform variable data for updating
   * @returns Promise resolving to the updated platform variable
   * @throws NotFoundException when platform variable with the specified ID is not found
   */
  async update(id: string, data: Prisma.PlatformVariablesUpdateInput) {
    // Check if platform variable exists
    const exists = await this.dbService.platformVariables.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      throw new NotFoundException(`Platform variable with ID ${id} not found`);
    }

    // Update platform variable
    return this.dbService.platformVariables.update({
      where: { id },
      data,
    });
  }

  /**
   * Deletes a platform variable by its ID.
   *
   * @param id - The unique identifier of the platform variable to delete
   * @returns Promise resolving to the deleted platform variable
   * @throws NotFoundException when platform variable with the specified ID is not found
   */
  async delete(id: string) {
    // Check if platform variable exists
    const platformVariable = await this.dbService.platformVariables.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!platformVariable) {
      throw new NotFoundException(`Platform variable with ID ${id} not found`);
    }

    // Delete the platform variable
    return this.dbService.platformVariables.delete({
      where: { id },
    });
  }
}
