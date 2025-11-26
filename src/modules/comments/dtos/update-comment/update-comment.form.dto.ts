import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO usado para atualizar o conteúdo de um comentário. Somente o
 * autor ou um administrador pode realizar esta operação.
 */
export class UpdateCommentFormDto {
  @ApiProperty({
    description: 'Novo conteúdo do comentário',
    example: 'Atualizando o meu comentário original.',
    minLength: 1,
  })
  @IsString({ message: 'content deve ser uma string' })
  @IsNotEmpty({ message: 'content não pode estar vazio' })
  content!: string;
}