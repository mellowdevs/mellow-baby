import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BabiesService } from './babies.service';
import { CreateBabyDto } from './dto/create-baby.dto';
import { UpdateBabyDto } from './dto/update-baby.dto';

@ApiTags('babies')
@Controller('babies')
@UseGuards(AuthGuard('jwt'))
export class BabiesController {
  constructor(private readonly babiesService: BabiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new baby profile' })
  @ApiResponse({ status: 201, description: 'Baby profile created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createBabyDto: CreateBabyDto, @Request() req) {
    return this.babiesService.create(createBabyDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all babies for the logged-in user' })
  @ApiResponse({ status: 200, description: 'Returns a list of babies.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(@Request() req) {
    const userId = req.user.userId;
    return this.babiesService.findAllForUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.babiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBabyDto: UpdateBabyDto) {
    return this.babiesService.update(+id, updateBabyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.babiesService.remove(+id);
  }
}
