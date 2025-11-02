import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsPositive, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetFollowingQueryDto {
  @ApiPropertyOptional({
    description: 'Número da página',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsPositive({
    message: 'A página deve ser um número positivo',
  })
  @Min(1, {
    message: 'A página deve ser no mínimo 1',
  })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Quantidade de itens por página',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsPositive({
    message: 'O limite deve ser um número positivo',
  })
  @Min(1, {
    message: 'O limite deve ser no mínimo 1',
  })
  @Max(100, {
    message: 'O limite deve ser no máximo 100',
  })
  limit?: number = 10;
}