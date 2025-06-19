import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  Request,
  Query,
  ParseEnumPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { ActivitiesService } from './activities.service';

enum ActivityType {
  SLEEP = 'sleep',
  FEEDING = 'feeding',
  DIAPER = 'diaper',
}

@ApiTags('activities')
@ApiBearerAuth()
@Controller('activities')
@UseGuards(AuthGuard('jwt')) // Protect all routes in this controller
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all activities for all babies of the logged-in user' })
  @ApiResponse({ status: 200, description: 'Returns a sorted list of all activities.' })
  findAll(@Request() req) {
    return this.activitiesService.findAllForUser(req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific activity by its ID' })
  @ApiQuery({
    name: 'type',
    required: true,
    enum: ActivityType,
    description: 'The type of activity to delete.',
  })
  @ApiResponse({ status: 200, description: 'Activity deleted successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. You do not own this record.' })
  @ApiResponse({ status: 404, description: 'Activity not found.' })
  remove(
    @Param('id') id: string,
    @Query('type', new ParseEnumPipe(ActivityType)) type: ActivityType,
    @Request() req,
  ) {
    return this.activitiesService.remove(id, type, req.user.userId);
  }
}
