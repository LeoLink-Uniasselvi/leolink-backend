import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@/common/dtos';
import { CommentDto } from '../shared/comment.response.dto';

export class CreateCommentResponseDto extends BaseResponseDto<CommentDto> {
  @ApiProperty({
    description: 'Dados do comentário criado',
    type: CommentDto,
  })
  declare data: CommentDto;

  @ApiProperty({
    example: 'Comentário criado com sucesso',
    description: 'Mensagem de sucesso',
  })
  declare message: string;

  @ApiProperty({ example: 201, description: 'Código HTTP' })
  declare statusCode: number;

  @ApiProperty({
    example: '2025-09-22T10:30:00Z',
    description: 'Timestamp da resposta',
  })
  declare timestamp: string;
}