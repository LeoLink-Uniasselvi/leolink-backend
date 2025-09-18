import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '@/modules/users/repositories/user.repository';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { UserAdapter } from '@/modules/users/user.adapter';

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
    private readonly userAdapter: UserAdapter,
  ) {}

  execute(id: string) {
    return this.userRepository.findById(id).then((user) => {
      if (!user) {
        throw new NotFoundException('User not found');
      }

      return {
        message: 'User found',
        user: this.userAdapter.convertToDto(user),
      };
    });
  }
}
