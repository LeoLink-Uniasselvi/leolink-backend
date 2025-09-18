import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Match } from '@/common/decorators/match.decorator';
import { IsPassword } from '@/modules/auth/decorators/is-password.decorator';

export class CreateUserFormDto {
  @IsNotEmpty({
    message: 'Name is required',
  })
  @IsString({
    message: 'Name must be a string',
  })
  @Length(3, 255, {
    message: 'Name must be at least 3 characters long',
  })
  name: string;

  @IsNotEmpty({
    message: 'Email is required',
  })
  @IsString({
    message: 'Email must be a string',
  })
  @IsEmail(
    {},
    {
      message: 'Email must be a valid email',
    },
  )
  email: string;

  @IsPassword('Password')
  password: string;

  @IsPassword('Password Confirmation')
  @Match('password', {
    message: 'Password confirmation must match password',
  })
  passwordConfirmation: string;
}
