import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@/common/dtos';

export class HasUserLikedDataDto {
  @ApiProperty({
    description: 'Indica se a curtida existe',
    example: true,
  })
  liked!: boolean;

  @ApiProperty({
    format: 'uuid',
    description: 'Identificador da curtida quando existente',
    example: '01953132-0b30-7cae-b97a-7af819689e21',
    nullable: true,
  })
  likeId!: string | null;
}

export class HasUserLikedResponseDto extends BaseResponseDto<HasUserLikedDataDto> {
  @ApiProperty({
    description: 'Resultado da verificacao de curtida',
    type: () => HasUserLikedDataDto,
  })
  declare data: HasUserLikedDataDto;

  @ApiProperty({
    example: 'Verificacao de curtida realizada com sucesso',
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
