import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { BabiesService } from './babies.service';
import { ActivitiesService } from 'src/activities/activities.service';
import { CreateBabyDto } from './dto/create-baby.dto';
import { CreateActivityDto } from 'src/activities/dto/create-activity.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('babies')
@ApiBearerAuth()
@Controller('babies')
@UseGuards(AuthGuard('jwt'))
export class BabiesController {
  constructor(
    private readonly babiesService: BabiesService,
    private readonly activitiesService: ActivitiesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new baby profile' })
  @ApiBody({
    type: CreateBabyDto,
    examples: {
      a: {
        summary: 'Simple Example',
        value: { name: 'Atlas', dateOfBirth: '2025-05-20' },
      },
    },
  })
  create(@Body() createBabyDto: CreateBabyDto, @Request() req) {
    return this.babiesService.create(createBabyDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all baby profiles for the logged-in user' })
  findAll(@Request() req) {
    return this.babiesService.findAllForUser(req.user.userId);
  }

  @Post(':babyId/sleeps')
  @ApiOperation({ summary: 'Create a new sleep record' })
  @ApiBody({
    type: CreateActivityDto,
    examples: {
      a: {
        summary: 'Simple Sleep Log',
        value: {
          start: '2025-06-18T14:00:00.000Z',
          end: '2025-06-18T15:30:00.000Z',
          notes: 'Morning nap',
        },
      },
    },
  })
  createSleep(
    @Param('babyId') babyId: string,
    @Body() createActivityDto: CreateActivityDto,
    @Request() req,
  ) {
    return this.activitiesService.createSleep(createActivityDto, babyId, req.user.userId);
  }

  @Post(':babyId/feedings')
  @ApiOperation({ summary: 'Create a new feeding record' })
  @ApiBody({
    type: CreateActivityDto,
    examples: {
      a: {
        summary: 'Bottle Feeding Example',
        value: {
          startTime: '2025-06-18T16:00:00.000Z',
          feedingType: 'bottle',
          amount: 120,
          contents: 'formula',
        },
      },
    },
  })
  createFeeding(
    @Param('babyId') babyId: string,
    @Body() createActivityDto: CreateActivityDto,
    @Request() req,
  ) {
    return this.activitiesService.createFeeding(createActivityDto, babyId, req.user.userId);
  }

  @Post(':babyId/diapers')
  @ApiOperation({ summary: 'Create a new diaper record' })
  @ApiBody({
    type: CreateActivityDto,
    examples: {
      a: {
        summary: 'Dirty Diaper Example',
        value: {
          time: '2025-06-18T17:00:00.000Z',
          diaperType: 'dirty',
          pooColor: 'yellow',
          pooConsistency: 'seedy',
        },
      },
    },
  })
  createDiaper(
    @Param('babyId') babyId: string,
    @Body() createActivityDto: CreateActivityDto,
    @Request() req,
  ) {
    return this.activitiesService.createDiaper(createActivityDto, babyId, req.user.userId);
  }
}
