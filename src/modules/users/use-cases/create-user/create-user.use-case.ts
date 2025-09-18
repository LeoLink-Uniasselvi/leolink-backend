import { UserAdapter } from '@/modules/users/user.adapter';
import { CreateUserFormDto } from '@/modules/users/dtos';
import type { IUserRepository } from '@/modules/users/repositories/user.repository';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PasswordHashingService } from '@/modules/auth/services/password-hashing.service';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
    private readonly userAdapter: UserAdapter,
    private readonly passwordHashingService: PasswordHashingService,
  ) {}

  async execute(input: CreateUserFormDto) {
    const checkUser = await this.userRepository.findByEmail(input.email);

    if (checkUser) {
      throw new UnprocessableEntityException('User already exists');
    }

    const user = this.userAdapter.convertCreateUserDtoToEntity(input);

    const hashedPassword = await this.passwordHashingService.hashPassword(
      user.password,
    );
    user.updatePassword(hashedPassword);

    await this.userRepository.create(user);

    return {
      message: 'User created successfully',
      user: this.userAdapter.convertToDto(user),
    };
  }
}
