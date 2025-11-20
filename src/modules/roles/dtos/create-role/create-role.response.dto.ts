import { BaseResponseDto } from '@/common/dtos';
import { RoleDto } from '@/modules/roles/dtos';

export class CreateRoleResponseDto extends BaseResponseDto<RoleDto> {
  constructor(
    role: RoleDto,
    message: string = 'Funcao criada com sucesso',
    statusCode: number = 201,
  ) {
    super(role, message, statusCode);
  }
}
