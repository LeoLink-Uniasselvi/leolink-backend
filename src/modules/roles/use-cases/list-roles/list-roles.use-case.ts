import { Inject, Injectable } from '@nestjs/common';
import { BaseResponseDto } from '@/common/dtos';
import { RoleDto } from '@/modules/roles/dtos';
import type { IRoleRepository } from '@/modules/roles/repositories/role.repository';
import { RoleRepository } from '@/modules/roles/repositories/role.repository';
import { RoleAdapter } from '@/modules/roles/role.adapter';

@Injectable()
export class ListRolesUseCase {
  constructor(
    @Inject(RoleRepository)
    private readonly roleRepository: IRoleRepository,
    private readonly roleAdapter: RoleAdapter,
  ) {}

  async execute(): Promise<BaseResponseDto<RoleDto[]>> {
    const roles = await this.roleRepository.find();

    return {
      data: this.roleAdapter.convertMany(roles),
      message: 'Funcoes listadas com sucesso',
      timestamp: new Date().toISOString(),
      statusCode: 200,
    };
  }
}
