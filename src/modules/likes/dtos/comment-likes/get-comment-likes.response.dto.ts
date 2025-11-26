import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@/common/dtos';
import { LikeDto } from '@/modules/likes/dtos/shared/like.response.dto';

export class CommentLikesDataDto {
  @ApiProperty({
    description: 'Quantidade total de curtidas do comentario',
    example: 8,
  })
  count!: number;

  @ApiProperty({
    description: 'Lista de curtidas associadas ao comentario',
    type: () => [LikeDto],
  })
  likes!: LikeDto[];
}

export class GetCommentLikesResponseDto extends BaseResponseDto<CommentLikesDataDto> {
  @ApiProperty({
    description: 'Dados agregados de curtidas do comentario',
    type: () => CommentLikesDataDto,
  })
  declare data: CommentLikesDataDto;

  @ApiProperty({
    example: 'Curtidas do comentario recuperadas com sucesso',
    description: 'Mensagem de confirmacao',
  })
  declare message: string;

  @ApiProperty({
    example: 200,
    description: 'Codigo de status HTTP',
  })
  declare statusCode: number;

  @ApiProperty({
    example: '2025-09-22T10:30:00Z',
    description: 'Timestamp da resposta',
  })
  declare timestamp: string;
}
