import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

/**
 * DTO usado para criação de uma resposta a um comentário existente.
 */
export class CreateReplyFormDto {
  @ApiProperty({
    format: 'uuid',
    required: false,
    description:
      'Identificador do post ao qual a resposta pertence (opcional, inferido a partir do comentário pai se omitido)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(undefined, { message: 'postId deve ser um UUID válido' })
  postId?: string;

  @ApiProperty({
    format: 'uuid',
    description: 'Identificador do comentário que será respondido',
    example: '321e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(undefined, { message: 'parentId deve ser um UUID válido' })
  parentId!: string;

  @ApiProperty({
    description: 'Conteúdo da resposta',
    example: 'Concordo com seu ponto de vista.',
    minLength: 1,
  })
  @IsString({ message: 'content deve ser uma string' })
  @IsNotEmpty({ message: 'content não pode estar vazio' })
  content!: string;
}