import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@/common/dtos';
import { CommentDto } from '../shared/comment.response.dto';

/**
 * Resposta para obtenção de um comentário por ID.
 */
export class GetCommentResponseDto extends BaseResponseDto<CommentDto> {
  @ApiProperty({ description: 'Dados do comentário', type: CommentDto })
  declare data: CommentDto;

  @ApiProperty({ example: 'Comentário obtido com sucesso' })
  declare message: string;

  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({
    example: '2025-09-22T10:30:00Z',
    description: 'Timestamp da resposta',
  })
  declare timestamp: string;
}