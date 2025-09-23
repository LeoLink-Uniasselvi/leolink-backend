import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityDto } from '@/common/dtos/base-entity.dto';

export class UserDto extends BaseEntityDto {
  @ApiProperty({
    example: 'Fulano da Silva',
    readOnly: true,
    description: 'Nome completo do usuário',
  })
  name!: string;

  @ApiProperty({
    example: 'fulano.silva@email.com',
    readOnly: true,
    description: 'Endereço de email do usuário',
  })
  email!: string;

  @ApiProperty({
    example: true,
    readOnly: true,
    description: 'Indica se a conta do usuário está ativa',
  })
  isActive!: boolean;
}
