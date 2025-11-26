import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@/common/dtos';
import { LikeDto } from '@/modules/likes/dtos/shared/like.response.dto';

export class CreateLikeResponseDto extends BaseResponseDto<LikeDto> {
  @ApiProperty({
    description: 'Dados da curtida criada',
    type: () => LikeDto,
    example: {
      id: '01953132-0b30-7cae-b97a-7af819689e21',
      userId: '01953132-0b30-7cae-b97a-7af819689e00',
      postId: '01953132-0b30-7cae-b97a-7af819689e10',
      commentId: null,
      targetType: 'post',
      createdAt: '2025-09-22T10:30:00Z',
      updatedAt: '2025-09-22T10:30:00Z',
    },
  })
  declare data: LikeDto;

  @ApiProperty({
    example: 'Curtida registrada com sucesso',
    description: 'Mensagem de confirmacao',
  })
  declare message: string;

  @ApiProperty({
    example: 201,
    description: 'Codigo de status HTTP',
  })
  declare statusCode: number;

  @ApiProperty({
    example: '2025-09-22T10:30:00Z',
    description: 'Timestamp da resposta',
  })
  declare timestamp: string;
}
