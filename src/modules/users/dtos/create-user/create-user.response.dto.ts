import { UserDto } from '@/modules/users/dtos/shared/user.response.dto';
import { BaseResponseDto } from '@/common/dtos';

export class CreateUserResponseDto extends BaseResponseDto<UserDto> {
  constructor(
    user: UserDto,
    message: string = 'Usuário criado com sucesso',
    statusCode: number = 201,
  ) {
    super(user, message, statusCode);
  }
}
