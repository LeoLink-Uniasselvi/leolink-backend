import { Match } from 'src/decorators/match.decorator';
import { IsPassword } from '../decorators';

export class ChangePasswordDto {
  id: number;

  @IsPassword('Old Password')
  oldPassword: string;

  @IsPassword('New Password')
  newPassword: string;

  @IsPassword('Password Confirmation')
  @Match('password', {
    message: 'New Password confirmation must match new password',
  })
  passwordConfirmation: string;
}