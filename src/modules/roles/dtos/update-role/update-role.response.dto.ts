import { BaseResponseDto } from '@/common/dtos';
import { RoleDto } from '@/modules/roles/dtos';

export class UpdateRoleResponseDto extends BaseResponseDto<RoleDto> {
  constructor(
    role: RoleDto,
    message: string = 'Funcao atualizada com sucesso',
    statusCode: number = 200,
  ) {
    super(role, message, statusCode);
  }
}
