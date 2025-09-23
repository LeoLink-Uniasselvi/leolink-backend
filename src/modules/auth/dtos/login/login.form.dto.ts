import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class LoginFormDto {
  @ApiProperty({
    description: 'Endereço de email do usuário',
    example: 'usuario@example.com',
    format: 'email',
  })
  @IsNotEmpty({
    message: 'O email é obrigatório',
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
    minLength: 6,
  })
  @IsNotEmpty({
    message: 'A senha é obrigatória',
  })
  @IsString({
    message: 'A senha deve ser uma string',
  })
  password: string;
}
