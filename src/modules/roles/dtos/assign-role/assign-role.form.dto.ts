import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignRoleFormDto {
  @ApiProperty({
    description: 'Identificador do usuario',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty({
    message: 'O usuario e obrigatorio',
  })
  userId!: string;

  @ApiProperty({
    description: 'Identificador da funcao a ser atribuida',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174999',
  })
  @IsUUID()
  @IsNotEmpty({
    message: 'A funcao e obrigatoria',
  })
  roleId!: string;
}
