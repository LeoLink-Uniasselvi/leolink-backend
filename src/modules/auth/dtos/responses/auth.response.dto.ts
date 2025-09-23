import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@/common/dtos';
import { LoginDataDto } from '../login/login.response.dto';
import { UserDto } from '@/modules/users/dtos/shared/user.response.dto';

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

export class MeResponseDto extends BaseResponseDto<UserDto> {
  @ApiProperty({
    description: 'Dados do usuário logado',
    example: {
      id: '01923456-7890-7abc-def0-123456789abc',
      name: 'Fulano da Silva',
      email: 'fulano.silva@email.com',
      isActive: true,
      createdAt: '2025-09-20T14:20:10.234Z',
      updatedAt: '2025-09-21T16:45:30.567Z',
    },
  })
  declare data: UserDto;

  @ApiProperty({
    example: 'Dados do usuário obtidos com sucesso',
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
