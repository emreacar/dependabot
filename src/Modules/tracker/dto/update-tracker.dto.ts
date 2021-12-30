import { IsEnum, IsObject, IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { TrackerResult } from 'src/Shared/types/tracker-result.type';
import { TrackerStatus } from 'src/Shared/types/tracker-status.type';
import { CreateTrackerDto } from './create-tracker.dto';

export class UpdateTrackerDto extends PartialType(CreateTrackerDto) {
  @ApiProperty()
  @IsOptional()
  @IsObject()
  trackerResult?: TrackerResult;

  @IsOptional()
  @IsEnum(TrackerStatus)
  status?: TrackerStatus;
}
