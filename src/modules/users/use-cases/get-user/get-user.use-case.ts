import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '@/modules/users/repositories/user.repository';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { UserAdapter } from '@/modules/users/user.adapter';
import { UserNotFoundException } from '@/modules/users/exceptions';
import { BaseResponseDto } from '@/common/dtos';
import { UserDto } from '@/modules/users/dtos/shared/user.response.dto';

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
    private readonly userAdapter: UserAdapter,
  ) {}

  async execute(id: string): Promise<BaseResponseDto<UserDto>> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    return {
      data: this.userAdapter.convertToDto(user),
      message: 'Usuário encontrado com sucesso',
      timestamp: new Date().toISOString(),
      statusCode: 200,
    };
  }
}
