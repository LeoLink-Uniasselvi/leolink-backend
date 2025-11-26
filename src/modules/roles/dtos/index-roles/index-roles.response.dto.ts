import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@/common/dtos';
import { RoleDto } from '@/modules/roles/dtos';

export class IndexRolesResponseDto extends BaseResponseDto<RoleDto[]> {
  @ApiProperty({
    type: [RoleDto],
    description: 'Lista de funcoes encontradas',
  })
  declare data: RoleDto[];

  constructor(
    roles: RoleDto[],
    message: string = 'Funcoes listadas com sucesso',
    statusCode: number = 200,
  ) {
    super(roles, message, statusCode);
  }
}
