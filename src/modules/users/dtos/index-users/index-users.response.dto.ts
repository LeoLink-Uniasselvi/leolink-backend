import { ApiProperty } from '@nestjs/swagger';
import {
  BaseResponseDto,
  PaginatedDataDto,
  PaginationMetaDto,
} from '@/common/dtos';
import { UserDto } from '../shared/user.response.dto';

export class PaginatedUsersDataDto extends PaginatedDataDto<UserDto> {
  @ApiProperty({
    type: [UserDto],
    description: 'Lista de usuários',
  })
  declare items: UserDto[];

  @ApiProperty({
    type: PaginationMetaDto,
    description: 'Metadados de paginação',
  })
  declare meta: PaginationMetaDto;
}

export class IndexUsersResponseDto extends BaseResponseDto<PaginatedUsersDataDto> {
  @ApiProperty({
    description: 'Dados paginados de usuários',
    example: {
      items: [
        {
          id: '01923456-7890-7abc-def0-123456789abc',
          name: 'Fulano da Silva',
          email: 'fulano.silva@email.com',
          isActive: true,
          createdAt: '2025-09-20T14:20:10.234Z',
          updatedAt: '2025-09-21T16:45:30.567Z',
        },
        {
          id: '01923456-7890-7abc-def0-987654321def',
          name: 'Maria Santos',
          email: 'maria.santos@email.com',
          isActive: true,
          createdAt: '2025-09-19T09:30:45.890Z',
          updatedAt: '2025-09-22T08:15:20.123Z',
        },
      ],
      meta: {
        page: 1,
        limit: 10,
        total: 25,
        totalPages: 3,
        hasNext: true,
        hasPrevious: false,
      },
    },
  })
  declare data: PaginatedUsersDataDto;

  @ApiProperty({
    example: 'Usuários listados com sucesso',
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
