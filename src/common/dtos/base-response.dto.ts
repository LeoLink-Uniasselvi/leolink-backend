import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto<T = any> {
  @ApiProperty({
    description: 'Dados da resposta',
    example: 'Dados da resposta baseados no endpoint',
  })
  data?: T;

  @ApiProperty({
    description: 'Mensagem da resposta',
    example: 'Operação realizada com sucesso',
  })
  message: string;

  @ApiProperty({
    description: 'Código de status HTTP',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Timestamp da requisição',
    type: String,
    format: 'date-time',
    example: '2025-09-22T10:30:00Z',
  })
  timestamp: string;

  constructor(data: T, message: string, statusCode: number) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Mensagem de erro',
    example: 'Falha na validação',
  })
  message: string | string[];

  @ApiProperty({
    description: 'Tipo do erro',
    example: 'Requisição Inválida',
  })
  error: string;

  @ApiProperty({
    description: 'Código de status HTTP',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Timestamp da requisição',
    type: String,
    format: 'date-time',
    example: '2025-09-22T10:30:00Z',
  })
  timestamp: string;
}
