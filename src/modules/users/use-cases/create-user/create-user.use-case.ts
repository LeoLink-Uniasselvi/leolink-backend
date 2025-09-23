import { UserAdapter } from '@/modules/users/user.adapter';
import { CreateUserFormDto } from '@/modules/users/dtos';
import type { IUserRepository } from '@/modules/users/repositories/user.repository';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { Inject, Injectable } from '@nestjs/common';
import { PasswordHashingService } from '@/modules/auth/services/password-hashing.service';
import { UserAlreadyExistsException } from '@/modules/users/exceptions';
import { BaseResponseDto } from '@/common/dtos';
import { UserDto } from '@/modules/users/dtos/shared/user.response.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
    private readonly userAdapter: UserAdapter,
    private readonly passwordHashingService: PasswordHashingService,
  ) {}

  async execute(input: CreateUserFormDto): Promise<BaseResponseDto<UserDto>> {
    const checkUser = await this.userRepository.findByEmail(input.email);

    if (checkUser) {
      throw new UserAlreadyExistsException();
    }

    const user = this.userAdapter.convertCreateUserDtoToEntity(input);

    const hashedPassword = await this.passwordHashingService.hashPassword(
      user.password,
    );
    user.updatePassword(hashedPassword);

    await this.userRepository.create(user);

    return {
      data: this.userAdapter.convertToDto(user),
      message: 'Usuário criado com sucesso',
      timestamp: new Date().toISOString(),
      statusCode: 201,
    };
  }
}
