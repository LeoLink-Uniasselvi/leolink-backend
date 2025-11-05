import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, Matches } from 'class-validator';

const UUID_V7_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class EnrollUserFormDto {
  @ApiProperty({ format: 'uuid' })
  @IsString()
  @Matches(UUID_V7_REGEX, { message: 'userId must be a UUID v7' })
  userId!: string;

  @ApiProperty({ type: String, format: 'date' })
  @IsDateString()
  startedAt!: string;
}

