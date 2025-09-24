import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@/common/dtos';
import { UserDto } from '@/modules/users/dtos';

export class RegisterDataDto {
  @ApiProperty({
    description: 'Token de acesso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    readOnly: true,
  })
  token!: string;

  @ApiProperty({ example: 'bearer', default: 'bearer', readOnly: true })
  tokenType = 'bearer' as const;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Horário de expiração do token de acesso',
    readOnly: true,
  })
  expiresAt!: Date;

  @ApiProperty({ type: () => UserDto, readOnly: true })
  user!: UserDto;
}

export class RegisterResponseDto extends BaseResponseDto<RegisterDataDto> {
  @ApiProperty({
    description: 'Dados do registro e login automático',
    example: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      tokenType: 'bearer',
      expiresAt: '2025-09-25T10:30:00Z',
      user: {
        id: '01923456-7890-7abc-def0-123456789abc',
        name: 'João Silva',
        email: 'joao@exemplo.com',
        isActive: true,
        createdAt: '2025-09-24T10:30:00Z',
        updatedAt: '2025-09-24T10:30:00Z',
      },
    },
  })
  declare data: RegisterDataDto;

  @ApiProperty({
    example: 'Usuário registrado e logado com sucesso',
    description: 'Mensagem de sucesso',
  })
  declare message: string;

  @ApiProperty({
    example: 201,
    description: 'Código de status HTTP',
  })
  declare statusCode: number;

  @ApiProperty({
    example: '2025-09-24T10:30:00Z',
    description: 'Timestamp da resposta',
  })
  declare timestamp: string;
}