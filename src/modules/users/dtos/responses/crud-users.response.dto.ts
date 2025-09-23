import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto, SuccessResponseDto } from '@/common/dtos';
import { UserDto } from '../shared/user.response.dto';

export class CreateUserResponseDto extends BaseResponseDto<UserDto> {
  @ApiProperty({
    description: 'Dados do usuário criado',
    example: {
      id: '01923456-7890-7abc-def0-123456789abc',
      name: 'Fulano da Silva',
      email: 'fulano.silva@email.com',
      isActive: true,
      createdAt: '2025-09-23T10:30:00.123Z',
      updatedAt: '2025-09-23T10:30:00.123Z',
    },
  })
  declare data: UserDto;

  @ApiProperty({
    example: 'Usuário criado com sucesso',
    description: 'Mensagem de sucesso',
  })
  declare message: string;

  @ApiProperty({
    example: 201,
    description: 'Código de status HTTP',
  })
  declare statusCode: number;

  @ApiProperty({
    example: '2025-09-23T10:30:00Z',
    description: 'Timestamp da resposta',
  })
  declare timestamp: string;
}

export class UpdateUserResponseDto extends BaseResponseDto<UserDto> {
  @ApiProperty({
    description: 'Dados do usuário atualizado',
    example: {
      id: '01923456-7890-7abc-def0-123456789abc',
      name: 'Fulano da Silva Atualizado',
      email: 'fulano.novo@email.com',
      isActive: true,
      createdAt: '2025-09-20T10:30:00.123Z',
      updatedAt: '2025-09-23T10:30:00.123Z',
    },
  })
  declare data: UserDto;

  @ApiProperty({
    example: 'Usuário atualizado com sucesso',
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

export class DeleteUserResponseDto extends SuccessResponseDto {
  @ApiProperty({
    example: 'Usuário removido com sucesso',
    description: 'Mensagem de sucesso',
  })
  declare message: string;
}

export class ActivateUserResponseDto extends SuccessResponseDto {
  @ApiProperty({
    example: 'Usuário ativado com sucesso',
    description: 'Mensagem de sucesso',
  })
  declare message: string;
}
