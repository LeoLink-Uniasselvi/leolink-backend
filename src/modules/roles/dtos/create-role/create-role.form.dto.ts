import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateRoleFormDto {
  @ApiProperty({
    description: 'Nome da funcao/papel',
    example: 'Admin',
    minLength: 3,
    maxLength: 120,
  })
  @IsNotEmpty({
    message: 'O nome da funcao e obrigatorio',
  })
  @IsString({
    message: 'O nome da funcao deve ser uma string',
  })
  @Length(3, 120, {
    message: 'O nome da funcao deve ter entre 3 e 120 caracteres',
  })
  name!: string;
}
