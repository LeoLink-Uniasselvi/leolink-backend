import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '@/modules/users/repositories/user.repository';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { UpdateUserFormDto } from '@/modules/users/dtos';
import { UserAdapter } from '@/modules/users/user.adapter';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
    private readonly userAdapter: UserAdapter,
  ) {}

  async execute(id: string, input: UpdateUserFormDto) {
    const user = await this.userRepository.findById(id).then((user) => {
      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    });

    if (input.name) {
      user.name = input.name;
    }

    if (input.email) {
      user.email = input.email;
    }

    await this.userRepository.update(user);

    return {
      message: 'User updated successfully',
      user: this.userAdapter.convertToDto(user),
    };
  }
}
