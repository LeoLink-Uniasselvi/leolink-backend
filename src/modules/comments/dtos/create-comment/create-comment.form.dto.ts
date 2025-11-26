import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

/**
 * DTO usado para criação de um comentário raiz em um post.
 */
export class CreateCommentFormDto {
  @ApiProperty({
    format: 'uuid',
    description: 'Identificador do post para o qual o comentário será criado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(undefined, { message: 'postId deve ser um UUID válido' })
  postId!: string;

  @ApiProperty({
    description: 'Conteúdo do comentário',
    example: 'Excelente publicação! Parabéns pelo artigo.',
    minLength: 1,
  })
  @IsString({ message: 'content deve ser uma string' })
  @IsNotEmpty({ message: 'content não pode estar vazio' })
  content!: string;
}