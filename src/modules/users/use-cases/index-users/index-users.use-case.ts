import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '@/modules/users/repositories/user.repository';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { UserAdapter } from '@/modules/users/user.adapter';
import { BaseResponseDto } from '@/common/dtos';
import { UserDto } from '@/modules/users/dtos/shared/user.response.dto';
import { IndexUsersQueryDto } from '@/modules/users/dtos/index-users/index-users.query.dto';
import {
  PaginatedDataDto,
  PaginationMetaDto,
} from '@/common/dtos/paginated.dtos';

@Injectable()
export class IndexUsersUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
    private readonly userAdapter: UserAdapter,
  ) {}

  async execute(
    query: IndexUsersQueryDto,
  ): Promise<BaseResponseDto<PaginatedDataDto<UserDto>>> {
    // Buscar todos os usuários
    const allUsers = await this.userRepository.find();

    // Aplicar filtro de busca se fornecido
    let filteredUsers = allUsers;
    if (query.search) {
      const searchTerm = query.search.toLowerCase();
      filteredUsers = allUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm),
      );
    }

    // Ordenar por nome
    filteredUsers.sort((a, b) => a.name.localeCompare(b.name));

    // Aplicar paginação
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(skip, skip + limit);

    // Converter para DTOs
    const userDtos = paginatedUsers.map((user) =>
      this.userAdapter.convertToDto(user),
    );

    // Criar metadados de paginação
    const total = filteredUsers.length;
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    const meta: PaginationMetaDto = {
      page,
      limit,
      total,
      totalPages,
      hasNext,
      hasPrevious,
    };

    const paginatedData = new PaginatedDataDto<UserDto>(userDtos, meta);

    return {
      data: paginatedData,
      message: 'Usuários listados com sucesso',
      timestamp: new Date().toISOString(),
      statusCode: 200,
    };
  }
}
