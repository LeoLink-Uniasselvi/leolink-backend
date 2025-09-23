import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@/common/dtos';

export class LogoutResponseDto extends BaseResponseDto<null> {
  @ApiProperty({
    example: null,
    description: 'Sem dados de retorno',
  })
  declare data: null;

  @ApiProperty({
    example: 'Logout realizado com sucesso',
    description: 'Mensagem de sucesso',
  })
  declare message: string;

  @ApiProperty({
    example: 200,
    description: 'Código de status HTTP',
  })
  declare statusCode: number;

  @ApiProperty({
    example: '2025-09-23T10:30:00Z',
    description: 'Timestamp da resposta',
  })
  declare timestamp: string;
}
