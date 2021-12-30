import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsEnum, IsString } from 'class-validator';
import { ERR_INVALID_MAIL } from 'src/Core/Constants/index';
import { RepoProvider } from 'src/Shared/types/provider.type';

export class CreateTrackerDto {
  @ApiProperty()
  @IsArray()
  @IsEmail({}, { each: true, message: ERR_INVALID_MAIL })
  emails: string[];

  @ApiProperty()
  @IsEnum(RepoProvider)
  provider: RepoProvider;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  repository: string;
}
