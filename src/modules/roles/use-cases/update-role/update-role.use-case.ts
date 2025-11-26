import { Inject, Injectable } from '@nestjs/common';
import { BaseResponseDto } from '@/common/dtos';
import { RoleDto, UpdateRoleFormDto } from '@/modules/roles/dtos';
import {
  RoleAlreadyExistsException,
  RoleNotFoundException,
} from '@/modules/roles/exceptions';
import type { IRoleRepository } from '@/modules/roles/repositories/role.repository';
import { RoleRepository } from '@/modules/roles/repositories/role.repository';
import { RoleAdapter } from '@/modules/roles/role.adapter';

@Injectable()
export class UpdateRoleUseCase {
  constructor(
    @Inject(RoleRepository)
    private readonly roleRepository: IRoleRepository,
    private readonly roleAdapter: RoleAdapter,
  ) {}

  async execute(
    id: string,
    input: UpdateRoleFormDto,
  ): Promise<BaseResponseDto<RoleDto>> {
    const role = await this.roleRepository.findById(id);

    if (!role) {
      throw new RoleNotFoundException();
    }

    const existingWithName = await this.roleRepository.findByName(
      input.name,
      true,
    );

    if (existingWithName && existingWithName.id !== role.id) {
      throw new RoleAlreadyExistsException();
    }

    role.name = input.name;

    await this.roleRepository.update(role);

    return {
      data: this.roleAdapter.convertToDto(role),
      message: 'Funcao atualizada com sucesso',
      timestamp: new Date().toISOString(),
      statusCode: 200,
    };
  }
}
