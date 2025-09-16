import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

const UUID_V7_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class IdParamDto {
  @ApiProperty({ format: 'uuid', description: 'UUID v7' })
  @Matches(UUID_V7_REGEX, { message: 'id must be a UUID v7' })
  id!: string;
}
