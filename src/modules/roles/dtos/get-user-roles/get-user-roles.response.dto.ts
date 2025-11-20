import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@/common/dtos';
import { RoleDto } from '@/modules/roles/dtos';

export class GetUserRolesResponseDto extends BaseResponseDto<RoleDto[]> {
  @ApiProperty({
    type: [RoleDto],
    description: 'Funcoes associadas ao usuario',
  })
  declare data: RoleDto[];

  constructor(
    roles: RoleDto[],
    message: string = 'Funcoes recuperadas com sucesso',
    statusCode: number = 200,
  ) {
    super(roles, message, statusCode);
  }
}
