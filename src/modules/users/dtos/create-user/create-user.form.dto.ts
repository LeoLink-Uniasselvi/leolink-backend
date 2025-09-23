import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Match } from '@/common/decorators/match.decorator';
import { IsPassword } from '@/modules/auth/decorators/is-password.decorator';

export class CreateUserFormDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
    minLength: 3,
    maxLength: 255,
  })
  @IsNotEmpty({
    message: 'O nome é obrigatório',
  })
  @IsString({
    message: 'O nome deve ser uma string',
  })
  @Length(3, 255, {
    message: 'O nome deve ter pelo menos 3 caracteres',
  })
  name: string;

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

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'minhaSenhaSegura123',
    minLength: 8,
  })
  @IsPassword('Senha')
  password: string;

  @ApiProperty({
    description: 'Confirmação da senha',
    example: 'minhaSenhaSegura123',
    minLength: 8,
  })
  @IsPassword('Confirmação da Senha')
  @Match('password', {
    message: 'A confirmação da senha deve coincidir com a senha',
  })
  passwordConfirmation: string;
}
