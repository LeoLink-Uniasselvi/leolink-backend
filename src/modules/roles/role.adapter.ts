import { Injectable } from '@nestjs/common';
import { Role } from '@/modules/roles/entities/role.entity';
import { RoleDto } from '@/modules/roles/dtos';

@Injectable()
export class RoleAdapter {
  convertToDto(role: Role): RoleDto {
    const dto = new RoleDto();
    dto.id = role.id;
    dto.name = role.name;
    dto.isActive = role.deletedAt ? false : true;
    dto.createdAt = role.createdAt;
    dto.updatedAt = role.updatedAt;
    return dto;
  }

  convertMany(roles: Role[]): RoleDto[] {
    return roles.map((role) => this.convertToDto(role));
  }
}
