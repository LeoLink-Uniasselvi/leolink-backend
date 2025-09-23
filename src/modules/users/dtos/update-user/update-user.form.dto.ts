import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { NamedDto } from '@/common/dtos/traits/named.dto';

class _UpdateUserFormDto extends NamedDto {
  @ApiProperty({
    description: 'Endereço de email do usuário',
    example: 'joao@example.com',
    format: 'email',
  })
  @IsNotEmpty({
    message: 'O email é obrigatório',
  })
  @IsString({
    message: 'O email deve ser uma string',
  })
  @IsEmail(
    {},
    {
      message: 'O email deve ser um endereço válido',
    },
  )
  email: string;
}

export class UpdateUserFormDto extends PartialType(_UpdateUserFormDto) {}
