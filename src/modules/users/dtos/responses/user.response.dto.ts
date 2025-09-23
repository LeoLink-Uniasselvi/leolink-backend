import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@/common/dtos';
import { UserDto } from '../shared/user.response.dto';

export class UserResponseDto extends BaseResponseDto<UserDto> {
  @ApiProperty({
    description: 'Dados do usuário',
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
    example: 'Usuário encontrado com sucesso',
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
