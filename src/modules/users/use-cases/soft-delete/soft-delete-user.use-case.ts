import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '@/modules/users/repositories/user.repository';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { UserNotFoundException } from '@/modules/users/exceptions';
import { BaseResponseDto } from '@/common/dtos';

@Injectable()
export class SoftDeleteUserUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<BaseResponseDto<null>> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    await this.userRepository.delete(id);

    return {
      data: null,
      message: 'Usuário excluído com sucesso',
      timestamp: new Date().toISOString(),
      statusCode: 200,
    };
  }
}
