import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@/common/dtos';
import { CommentDto } from '../shared/comment.response.dto';

/**
 * Resposta para obtenção das respostas de um comentário específico.
 */
export class GetCommentRepliesResponseDto extends BaseResponseDto<CommentDto[]> {
  @ApiProperty({
    description: 'Lista de respostas do comentário',
    type: () => [CommentDto],
  })
  declare data: CommentDto[];

  @ApiProperty({ example: 'Respostas obtidas com sucesso' })
  declare message: string;

  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({
    example: '2025-09-22T10:30:00Z',
    description: 'Timestamp da resposta',
  })
  declare timestamp: string;
}