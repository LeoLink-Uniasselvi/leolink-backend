import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ChangePasswordDto } from '../../dto/change-password.dto';
import { IUserRepository, UserRepository } from '../../../users/repos/user.repository';
import { UserAdapter } from '../../../users/user.adapter';
import { UserDto } from '../../../users/dto';

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
    private readonly userAdapter: UserAdapter
  ) {}

  async execute(input: ChangePasswordDto): Promise<UserDto> {
    const user = await this.userRepository.findById(input.id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await user.checkPassword(input.oldPassword);

    if (!isPasswordValid) {
      throw new Error('Incorrect password');
    }

    user.password = input.newPassword;

    await user.hashPassword();

    await this.userRepository.update(user);

    return this.userAdapter.convertToDto(user);
  }
}