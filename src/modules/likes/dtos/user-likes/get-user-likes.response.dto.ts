import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@/common/dtos';
import { LikeDto } from '@/modules/likes/dtos/shared/like.response.dto';

export class UserLikesDataDto {
  @ApiProperty({
    description: 'Curtidas do usuario em posts',
    type: () => [LikeDto],
  })
  posts!: LikeDto[];

  @ApiProperty({
    description: 'Curtidas do usuario em comentarios',
    type: () => [LikeDto],
  })
  comments!: LikeDto[];

  @ApiProperty({
    description: 'Total de curtidas registradas pelo usuario',
    example: 12,
  })
  total!: number;
}

export class GetUserLikesResponseDto extends BaseResponseDto<UserLikesDataDto> {
  @ApiProperty({
    description: 'Resumo das curtidas do usuario',
    type: () => UserLikesDataDto,
  })
  declare data: UserLikesDataDto;

  @ApiProperty({
    example: 'Curtidas do usuario recuperadas com sucesso',
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
