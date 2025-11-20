import { Inject, Injectable } from '@nestjs/common';
import { BaseResponseDto } from '@/common/dtos';
import {
  RemoveRoleResponseDto,
  RoleDto,
} from '@/modules/roles/dtos';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import type { IUserRepository } from '@/modules/users/repositories/user.repository';
import { UserNotFoundException } from '@/modules/users/exceptions';
import {
  RoleNotAssignedException,
  RoleNotFoundException,
} from '@/modules/roles/exceptions';
import type { IRoleRepository } from '@/modules/roles/repositories/role.repository';
import { RoleRepository } from '@/modules/roles/repositories/role.repository';
import type { IUserRoleRepository } from '@/modules/roles/repositories/user-role.repository';
import { UserRoleRepository } from '@/modules/roles/repositories/user-role.repository';
import { RoleAdapter } from '@/modules/roles/role.adapter';

@Injectable()
export class RemoveRoleFromUserUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(RoleRepository)
    private readonly roleRepository: IRoleRepository,
    @Inject(UserRoleRepository)
    private readonly userRoleRepository: IUserRoleRepository,
    private readonly roleAdapter: RoleAdapter,
  ) {}

  async execute(
    userId: string,
    roleId: string,
  ): Promise<BaseResponseDto<RoleDto[]>> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }
    if (user.deletedAt) {
      throw new UserNotFoundException();
    }

    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new RoleNotFoundException();
    }

    const assignment = await this.userRoleRepository.findByUserAndRole(
      userId,
      roleId,
    );
    if (!assignment) {
      throw new RoleNotAssignedException();
    }

    await this.userRoleRepository.deleteByUserAndRole(userId, roleId);

    const updatedRoles = await this.userRoleRepository.findRolesByUser(userId);

    return new RemoveRoleResponseDto(
      this.roleAdapter.convertMany(updatedRoles),
    );
  }
}
