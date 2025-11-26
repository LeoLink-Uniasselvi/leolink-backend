import { Inject, Injectable } from '@nestjs/common';
import { BaseResponseDto } from '@/common/dtos';
import { CreateRoleFormDto, RoleDto } from '@/modules/roles/dtos';
import { Role } from '@/modules/roles/entities/role.entity';
import { RoleAlreadyExistsException } from '@/modules/roles/exceptions';
import type { IRoleRepository } from '@/modules/roles/repositories/role.repository';
import { RoleRepository } from '@/modules/roles/repositories/role.repository';
import { RoleAdapter } from '@/modules/roles/role.adapter';

@Injectable()
export class CreateRoleUseCase {
  constructor(
    @Inject(RoleRepository)
    private readonly roleRepository: IRoleRepository,
    private readonly roleAdapter: RoleAdapter,
  ) {}

  async execute(
    input: CreateRoleFormDto,
  ): Promise<BaseResponseDto<RoleDto>> {
    const existingRole = await this.roleRepository.findByName(input.name, true);

    if (existingRole && !existingRole.deletedAt) {
      throw new RoleAlreadyExistsException();
    }

    if (existingRole && existingRole.deletedAt) {
      existingRole.deletedAt = null;
      existingRole.name = input.name;
      await this.roleRepository.update(existingRole);

      return {
        data: this.roleAdapter.convertToDto(existingRole),
        message: 'Funcao reativada com sucesso',
        timestamp: new Date().toISOString(),
        statusCode: 200,
      };
    }

    const role = new Role(input.name);
    await this.roleRepository.create(role);

    return {
      data: this.roleAdapter.convertToDto(role),
      message: 'Funcao criada com sucesso',
      timestamp: new Date().toISOString(),
      statusCode: 201,
    };
  }
}
