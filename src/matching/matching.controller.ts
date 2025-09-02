import { Controller, Post, Param, UseGuards, ParseIntPipe, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MatchingService } from './matching.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('matching')
@Controller('projects')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post(':id/matches/rebuild')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rebuild matches for a project (Admin only)' })
  @ApiResponse({ status: 200, description: 'Matches rebuilt successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin access required.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  async rebuildMatches(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.matchingService.rebuildMatches(id);
  }
}