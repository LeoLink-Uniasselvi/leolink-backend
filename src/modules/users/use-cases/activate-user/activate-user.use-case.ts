import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { IUserRepository } from '@/modules/users/repositories/user.repository';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { UserAdapter } from '@/modules/users/user.adapter';

@Injectable()
export class ActivateUserUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
    private readonly userAdapter: UserAdapter,
  ) {}

  async execute(id: string) {
    const user = await this.userRepository
      .findByIdWithDeleted(id)
      .then((user) => {
        if (!user) {
          throw new NotFoundException('User not found');
        }

        if (user.deletedAt === null || user.deletedAt === undefined) {
          throw new UnprocessableEntityException('User is not deleted');
        }

        return user;
      });

    await this.userRepository.activate(id);

    return {
      message: 'User activated successfully',
      user: this.userAdapter.convertToDto(user),
    };
  }
}
