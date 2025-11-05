import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCourseFormDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @ApiProperty({ type: String, format: 'date', description: 'YYYY-MM-DD' })
  @IsDateString()
  startDate!: string;
}

