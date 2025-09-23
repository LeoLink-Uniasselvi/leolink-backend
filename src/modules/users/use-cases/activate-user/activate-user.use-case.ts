import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '@/modules/users/repositories/user.repository';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { UserAdapter } from '@/modules/users/user.adapter';
import {
  UserNotFoundException,
  UserNotActiveException,
} from '@/modules/users/exceptions';
import { BaseResponseDto } from '@/common/dtos';
import { UserDto } from '@/modules/users/dtos';

@Injectable()
export class ActivateUserUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
    private readonly userAdapter: UserAdapter,
  ) {}

  async execute(id: string): Promise<BaseResponseDto<UserDto>> {
    const user = await this.userRepository.findByIdWithDeleted(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    if (user.deletedAt === null || user.deletedAt === undefined) {
      throw new UserNotActiveException('Usuário não está desativado');
    }

    await this.userRepository.activate(id);

    // Atualiza o deletedAt para null para refletir a ativação
    user.deletedAt = null;

    return {
      data: this.userAdapter.convertToDto(user),
      message: 'Usuário ativado com sucesso',
      timestamp: new Date().toISOString(),
      statusCode: 200,
    };
  }
}
