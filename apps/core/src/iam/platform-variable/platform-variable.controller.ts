import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from '../../iam/auth/guards/user.auth.guard';
import { GetPlatformVariablesDto } from './dto/get-platform-variables.dto';
import { PlatformVariableService } from './platform-variable.service';

@UseGuards(UserAuthGuard)
@ApiTags('Platform Variables')
@Controller('platform-variables')
export class PlatformVariableController {
  constructor(
    private readonly platformVariableService: PlatformVariableService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get platform variables' })
  async getPlatformVariables(@Query() query: GetPlatformVariablesDto) {
    return this.platformVariableService.getPlatformVariables(query);
  }

  @Get(':name')
  @ApiOperation({ summary: 'Get a platform variable by name' })
  @ApiParam({
    name: 'name',
    description: 'Platform variable name',
  })
  async getPlatformVariable(@Param('name') name: string) {
    return this.platformVariableService.getPlatformVariable(name);
  }
}
