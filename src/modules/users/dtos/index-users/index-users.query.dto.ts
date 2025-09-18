import { PaginationQueryDto } from '@/common/dtos/paginated.dtos';

export class IndexUsersQueryDto extends PaginationQueryDto {
  // Herda todos os campos de paginação (page, limit, search) do PaginationQueryDto
  // TODO: Implementar filtros específicos para usuários:
  // - isActive: boolean (filtrar por usuários ativos/inativos)
  // - role: string (filtrar por role/perfil do usuário)
  // - createdAfter: Date (filtrar por data de criação)
  // - createdBefore: Date (filtrar por data de criação)
  // - sortBy: 'name' | 'email' | 'createdAt' (ordenação)
  // - sortOrder: 'asc' | 'desc' (ordem da ordenação)
}
