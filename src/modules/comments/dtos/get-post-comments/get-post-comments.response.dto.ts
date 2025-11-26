import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@/common/dtos';
import { CommentDto } from '../shared/comment.response.dto';

/**
 * Resposta para obtenção de todos os comentários de um post em
 * estrutura hierárquica. A propriedade `data` contém uma lista de
 * comentários raiz, cada um com suas respostas aninhadas na
 * propriedade `replies`.
 */
export class GetPostCommentsResponseDto extends BaseResponseDto<CommentDto[]> {
  @ApiProperty({
    description: 'Lista de comentários do post em formato de árvore',
    type: () => [CommentDto],
  })
  declare data: CommentDto[];

  @ApiProperty({
    example: 'Comentários obtidos com sucesso',
    description: 'Mensagem de sucesso',
  })
  declare message: string;

  @ApiProperty({ example: 200, description: 'Código HTTP' })
  declare statusCode: number;

  @ApiProperty({
    example: '2025-09-22T10:30:00Z',
    description: 'Timestamp da resposta',
  })
  declare timestamp: string;
}