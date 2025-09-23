import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseResponseDto } from '@/common/dtos';
import { UserDto } from '@/modules/users/dtos';

export class LoginDataDto {
  @ApiProperty({
    description: 'Token de acesso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    readOnly: true,
  })
  token!: string;

  @ApiProperty({ example: 'bearer', default: 'bearer', readOnly: true })
  tokenType = 'bearer' as const;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    description: 'Horário de expiração do token de acesso',
    nullable: true,
    readOnly: true,
  })
  expiresAt?: Date | null;

  @ApiPropertyOptional({
    description: 'Token de atualização quando emitido',
    example: 'def50200a1b2c3...',
    readOnly: true,
  })
  refreshToken?: string;

  @ApiProperty({ type: () => UserDto, readOnly: true })
  user!: UserDto;
}

export class LoginResponseDto extends BaseResponseDto<LoginDataDto> {
  @ApiProperty({
    description: 'Dados do login',
    example: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      tokenType: 'bearer',
      expiresAt: '2025-09-24T10:30:00Z',
      refreshToken: null,
      user: {
        id: '01923456-7890-7abc-def0-123456789abc',
        name: 'Fulano da Silva',
        email: 'fulano.silva@email.com',
        isActive: true,
        createdAt: '2025-09-20T14:20:10.234Z',
        updatedAt: '2025-09-21T16:45:30.567Z',
      },
    },
  })
  declare data: LoginDataDto;

  @ApiProperty({
    example: 'Login realizado com sucesso',
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
