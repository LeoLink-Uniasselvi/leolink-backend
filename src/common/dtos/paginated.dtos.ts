import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsNumber, Min, Max, IsString } from 'class-validator';
import { BaseResponseDto } from './base-response.dto';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Número da página',
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
    description: 'Número de itens por página',
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
    description: 'Termo de busca',
    example: 'termo de busca',
  })
  @IsOptional()
  @IsString({ message: 'Search must be a string' })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  search?: string;
}

export class PaginationMetaDto {
  @ApiProperty({
    example: 1,
    readOnly: true,
    description: 'Número da página atual',
  })
  page!: number;

  @ApiProperty({
    example: 10,
    readOnly: true,
    description: 'Número de itens por página',
  })
  limit!: number;

  @ApiProperty({
    example: 50,
    readOnly: true,
    description: 'Número total de itens',
  })
  total!: number;

  @ApiProperty({
    example: 5,
    readOnly: true,
    description: 'Número total de páginas',
  })
  totalPages!: number;

  @ApiProperty({
    example: true,
    readOnly: true,
    description: 'Indica se existe uma próxima página',
  })
  hasNext!: boolean;

  @ApiProperty({
    example: false,
    readOnly: true,
    description: 'Indica se existe uma página anterior',
  })
  hasPrevious!: boolean;
}

export class PaginatedDataDto<T> {
  @ApiProperty({
    readOnly: true,
    description: 'Array de itens',
  })
  items!: T[];

  @ApiProperty({
    type: PaginationMetaDto,
    readOnly: true,
    description: 'Metadados de paginação',
  })
  meta!: PaginationMetaDto;

  constructor(items: T[], meta: PaginationMetaDto) {
    this.items = items;
    this.meta = meta;
  }
}

export class PaginatedResponseDto<T> extends BaseResponseDto<
  PaginatedDataDto<T>
> {
  constructor(
    items: T[],
    meta: PaginationMetaDto,
    message: string = 'Dados recuperados com sucesso',
    statusCode: number = 200,
  ) {
    super(new PaginatedDataDto(items, meta), message, statusCode);
  }
}
