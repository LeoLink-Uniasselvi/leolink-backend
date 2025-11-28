import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class UpdatePostFormDto {
  @ApiProperty({
    description: 'Conteúdo do post',
    example: 'Conteúdo atualizado do post',
    maxLength: 5000,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'O conteúdo não pode estar vazio' })
  @MaxLength(5000, { message: 'O conteúdo não pode ter mais de 5000 caracteres' })
  content?: string;
}
