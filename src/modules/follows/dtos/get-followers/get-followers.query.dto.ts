import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumberString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetFollowersQueryDto {
  @ApiPropertyOptional({
    description: 'Número da página (começando em 1)',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumberString({}, {
    message: 'A página deve ser um número',
  })
  @Transform(({ value }) => parseInt(value))
  @Min(1, {
    message: 'A página deve ser maior que 0',
  })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Quantidade de itens por página (máximo 100)',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumberString({}, {
    message: 'O limite deve ser um número',
  })
  @Transform(({ value }) => Math.min(parseInt(value), 100))
  @Min(1, {
    message: 'O limite deve ser maior que 0',
  })
  limit?: number = 10;
}