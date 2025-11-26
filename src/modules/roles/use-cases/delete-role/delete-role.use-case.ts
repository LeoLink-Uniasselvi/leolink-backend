import { Inject, Injectable } from '@nestjs/common';
import { SuccessResponseDto } from '@/common/dtos/success-response.dto';
import {
  RoleInUseException,
  RoleNotFoundException,
} from '@/modules/roles/exceptions';
import type { IRoleRepository } from '@/modules/roles/repositories/role.repository';
import { RoleRepository } from '@/modules/roles/repositories/role.repository';
import type { IUserRoleRepository } from '@/modules/roles/repositories/user-role.repository';
import { UserRoleRepository } from '@/modules/roles/repositories/user-role.repository';

@Injectable()
export class DeleteRoleUseCase {
  constructor(
    @Inject(RoleRepository)
    private readonly roleRepository: IRoleRepository,
    @Inject(UserRoleRepository)
    private readonly userRoleRepository: IUserRoleRepository,
  ) {}

  async execute(id: string): Promise<SuccessResponseDto> {
    const role = await this.roleRepository.findById(id);

    if (!role) {
      throw new RoleNotFoundException();
    }

    const assignments = await this.userRoleRepository.countByRole(id);
    if (assignments > 0) {
      throw new RoleInUseException();
    }

    await this.roleRepository.delete(id);

    return {
      data: null,
      message: 'Funcao removida com sucesso',
      timestamp: new Date().toISOString(),
      statusCode: 200,
    };
  }
}
