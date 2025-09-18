import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '@/modules/users/repositories/user.repository';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { CreateUserUseCase } from '@/modules/users/use-cases/create-user/create-user.use-case';

@Injectable()
export class GenerateDefaultUserUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  async execute() {
    const users = await this.userRepository.findWithDeleted();

    if (users.length < 1) {
      await this.createUserUseCase.execute({
        name: process.env.DEFAULT_USER_NAME || 'Admin',
        email: process.env.DEFAULT_USER_EMAIL || 'admin@admin.com',
        password: process.env.DEFAULT_USER_PASS || 'admin',
        passwordConfirmation: process.env.DEFAULT_USER_PASS || 'admin',
      });
    }
  }
}
