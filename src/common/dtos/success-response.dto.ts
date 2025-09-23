import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@/common/dtos';

/**
 * DTO genérico para respostas de sucesso sem dados específicos
 * Útil para operações como delete, ativação, etc.
 */
export class SuccessResponseDto extends BaseResponseDto<null> {
  @ApiProperty({
    example: null,
    description: 'Dados da resposta (null para operações sem retorno)',
  })
  declare data: null;

  @ApiProperty({
    example: 'Operação realizada com sucesso',
    description: 'Mensagem de sucesso',
  })
  declare message: string;

  @ApiProperty({
    example: 200,
    description: 'Código de status HTTP',
  })
  declare statusCode: number;

  @ApiProperty({
    example: '2025-09-22T10:30:00Z',
    description: 'Timestamp da resposta',
  })
  declare timestamp: string;
}
