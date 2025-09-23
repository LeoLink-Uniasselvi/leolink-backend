import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '@/modules/users/repositories/user.repository';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { UpdateUserFormDto } from '@/modules/users/dtos';
import { UserAdapter } from '@/modules/users/user.adapter';
import { UserNotFoundException } from '@/modules/users/exceptions';
import { BaseResponseDto } from '@/common/dtos';
import { UserDto } from '@/modules/users/dtos';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
    private readonly userAdapter: UserAdapter,
  ) {}

  async execute(
    id: string,
    input: UpdateUserFormDto,
  ): Promise<BaseResponseDto<UserDto>> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    if (input.name) {
      user.name = input.name;
    }

    if (input.email) {
      user.email = input.email;
    }

    await this.userRepository.update(user);

    return {
      data: this.userAdapter.convertToDto(user),
      message: 'Usuário atualizado com sucesso',
      timestamp: new Date().toISOString(),
      statusCode: 200,
    };
  }
}
