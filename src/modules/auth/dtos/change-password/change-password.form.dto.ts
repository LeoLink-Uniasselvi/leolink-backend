import { Match } from '@/common/decorators/match.decorator';
import { IsPassword } from '@/modules/auth/decorators/is-password.decorator';

export class ChangePasswordDto {
  @IsPassword('Old Password')
  oldPassword: string;

  @IsPassword('New Password')
  newPassword: string;

  @IsPassword('Password Confirmation')
  @Match('newPassword', {
    message: 'New Password confirmation must match new password',
  })
  passwordConfirmation: string;
}
