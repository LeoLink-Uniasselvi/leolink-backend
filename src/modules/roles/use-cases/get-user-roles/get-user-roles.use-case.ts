import { Inject, Injectable } from '@nestjs/common';
import { BaseResponseDto } from '@/common/dtos';
import { RoleDto } from '@/modules/roles/dtos';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import type { IUserRepository } from '@/modules/users/repositories/user.repository';
import { UserNotFoundException } from '@/modules/users/exceptions';
import type { IUserRoleRepository } from '@/modules/roles/repositories/user-role.repository';
import { UserRoleRepository } from '@/modules/roles/repositories/user-role.repository';
import { RoleAdapter } from '@/modules/roles/role.adapter';

@Injectable()
export class GetUserRolesUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(UserRoleRepository)
    private readonly userRoleRepository: IUserRoleRepository,
    private readonly roleAdapter: RoleAdapter,
  ) {}

  async execute(userId: string): Promise<BaseResponseDto<RoleDto[]>> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundException();
    }
    if (user.deletedAt) {
      throw new UserNotFoundException();
    }

    const roles = await this.userRoleRepository.findRolesByUser(userId);

    return {
      data: this.roleAdapter.convertMany(roles),
      message: 'Funcoes do usuario encontradas com sucesso',
      timestamp: new Date().toISOString(),
      statusCode: 200,
    };
  }
}
