import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePostFormDto {
  @ApiProperty({
    description: 'Conteúdo do post',
    example: 'Este é o conteúdo do meu primeiro post!',
    maxLength: 5000,
  })
  @IsString()
  @IsNotEmpty({ message: 'O conteúdo não pode estar vazio' })
  @MaxLength(5000, { message: 'O conteúdo não pode ter mais de 5000 caracteres' })
  content!: string;
}
