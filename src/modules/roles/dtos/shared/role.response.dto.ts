import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityDto } from '@/common/dtos/base-entity.dto';

export class RoleDto extends BaseEntityDto {
  @ApiProperty({
    example: 'admin',
    readOnly: true,
    description: 'Nome do papel/funcao',
  })
  name!: string;

  @ApiProperty({
    example: true,
    readOnly: true,
    description: 'Indica se a funcao esta ativa',
  })
  isActive!: boolean;
}
