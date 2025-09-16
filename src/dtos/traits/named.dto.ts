import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class NamedDto {
  @ApiProperty({ example: 'Nome do recurso' })
  @IsString()
  @Length(3, 255)
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  name!: string;
}