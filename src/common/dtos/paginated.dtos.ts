import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsNumber, Min, Max, IsString } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be at least 1' })
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit: number = 10;

  @ApiPropertyOptional({
    description: 'Search term',
    example: 'search term',
  })
  @IsOptional()
  @IsString({ message: 'Search must be a string' })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  search?: string;
}

export class PaginatedDto<T> {
  @ApiProperty({ example: 1, readOnly: true })
  page!: number;

  @ApiProperty({ example: 10, readOnly: true })
  limit!: number;

  @ApiProperty({ example: 50, readOnly: true })
  total!: number;

  @ApiProperty({ example: 5, readOnly: true })
  totalPages!: number;

  @ApiProperty({ readOnly: true })
  data!: T[];

  constructor(init?: Partial<PaginatedDto<T>>) {
    Object.assign(this, init);
  }
}
