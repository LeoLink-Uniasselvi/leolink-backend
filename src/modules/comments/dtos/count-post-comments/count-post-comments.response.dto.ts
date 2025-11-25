import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@/common/dtos';

/**
 * DTO retornado quando se solicita a contagem de comentários de um post.
 */
export class CountPostCommentsResponseDto extends BaseResponseDto<{ count: number }> {
  @ApiProperty({ example: { count: 5 }, description: 'Quantidade de comentários' })
  declare data: { count: number };

  @ApiProperty({ example: 'Contagem de comentários obtida com sucesso' })
  declare message: string;

  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({
    example: '2025-09-22T10:30:00Z',
    description: 'Timestamp da resposta',
  })
  declare timestamp: string;
}