import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TrackerService } from './tracker.service';
import { CreateTrackerDto } from './dto/create-tracker.dto';

@Controller('tracker')
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  @Get(':id')
  trackerDetail(@Param('id') trackerId: string) {
    return this.trackerService.getOne(trackerId);
  }

  @Post()
  create(@Body() createTrackerDto: CreateTrackerDto) {
    return this.trackerService.create(createTrackerDto);
  }
}
