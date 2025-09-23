import { UserDto } from '@/modules/users/dtos/shared/user.response.dto';
import { BaseResponseDto } from '@/common/dtos';

export class UpdateUserResponseDto extends BaseResponseDto<UserDto> {
  constructor(
    user: UserDto,
    message: string = 'Usuário atualizado com sucesso',
    statusCode: number = 200,
  ) {
    super(user, message, statusCode);
  }
}
