import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@/common/dtos';
import { RoleDto } from '@/modules/roles/dtos';

export class RemoveRoleResponseDto extends BaseResponseDto<RoleDto[]> {
  @ApiProperty({
    type: [RoleDto],
    description: 'Funcoes restantes do usuario',
  })
  declare data: RoleDto[];

  constructor(
    roles: RoleDto[],
    message: string = 'Funcao removida com sucesso',
    statusCode: number = 200,
  ) {
    super(roles, message, statusCode);
  }
}
