import { PaginatedDto } from '@/common/dtos/paginated.dtos';
import { UserResponseDto } from '@/modules/users/dtos/shared/user.response.dto';

export class IndexUsersResponseDto extends PaginatedDto<UserResponseDto> {
  // Herda todos os campos de paginação (page, limit, total, totalPages, data) do PaginatedDto
  // TODO: Considerar adicionar metadados específicos da listagem de usuários:
  // - totalActive: number (total de usuários ativos)
  // - totalInactive: number (total de usuários inativos)
  // - filters: object (filtros aplicados na consulta)
}
