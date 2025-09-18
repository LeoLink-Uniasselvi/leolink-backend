import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '@/modules/users/repositories/user.repository';
import { UserRepository } from '@/modules/users/repositories/user.repository';

@Injectable()
export class SoftDeleteUserUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string) {
    await this.userRepository.findById(id).then((user) => {
      if (!user) {
        throw new NotFoundException('User not found');
      }
    });

    this.userRepository.delete(id).catch(() => {
      throw new NotFoundException('User not found');
    });

    return {
      message: 'User deleted successfully',
    };
  }
}
