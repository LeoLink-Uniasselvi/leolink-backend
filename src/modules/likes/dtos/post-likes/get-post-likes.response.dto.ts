import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@/common/dtos';
import { LikeDto } from '@/modules/likes/dtos/shared/like.response.dto';

export class PostLikesDataDto {
  @ApiProperty({
    description: 'Quantidade total de curtidas do post',
    example: 42,
  })
  count!: number;

  @ApiProperty({
    description: 'Lista de curtidas associadas ao post',
    type: () => [LikeDto],
  })
  likes!: LikeDto[];
}

export class GetPostLikesResponseDto extends BaseResponseDto<PostLikesDataDto> {
  @ApiProperty({
    description: 'Dados agregados de curtidas do post',
    type: () => PostLikesDataDto,
  })
  declare data: PostLikesDataDto;

  @ApiProperty({
    example: 'Curtidas do post recuperadas com sucesso',
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
