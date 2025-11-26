import { Inject, Injectable } from '@nestjs/common';
import { BaseResponseDto } from '@/common/dtos';
import {
  AssignRoleFormDto,
  AssignRoleResponseDto,
  RoleDto,
} from '@/modules/roles/dtos';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import type { IUserRepository } from '@/modules/users/repositories/user.repository';
import { UserNotActiveException, UserNotFoundException } from '@/modules/users/exceptions';
import type { IRoleRepository } from '@/modules/roles/repositories/role.repository';
import { RoleRepository } from '@/modules/roles/repositories/role.repository';
import type { IUserRoleRepository } from '@/modules/roles/repositories/user-role.repository';
import { UserRoleRepository } from '@/modules/roles/repositories/user-role.repository';
import { RoleAdapter } from '@/modules/roles/role.adapter';
import {
  RoleAlreadyAssignedException,
  RoleInactiveException,
  RoleNotFoundException,
} from '@/modules/roles/exceptions';
import { UserRole } from '@/modules/roles/entities/user-role.entity';

@Injectable()
export class AssignRoleToUserUseCase {
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
    input: AssignRoleFormDto,
  ): Promise<BaseResponseDto<RoleDto[]>> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new UserNotFoundException();
    }
    if (user.deletedAt) {
      throw new UserNotActiveException('Usuario inativo');
    }

    const role = await this.roleRepository.findById(input.roleId);
    if (!role) {
      throw new RoleNotFoundException();
    }
    if (role.deletedAt) {
      throw new RoleInactiveException();
    }

    const alreadyAssigned = await this.userRoleRepository.findByUserAndRole(
      input.userId,
      input.roleId,
    );
    if (alreadyAssigned) {
      throw new RoleAlreadyAssignedException();
    }

    const userRole = new UserRole({
      userId: input.userId,
      roleId: input.roleId,
    });

    await this.userRoleRepository.create(userRole);

    const userRoles = await this.userRoleRepository.findRolesByUser(
      input.userId,
    );

    return new AssignRoleResponseDto(
      this.roleAdapter.convertMany(userRoles),
    );
  }
}
