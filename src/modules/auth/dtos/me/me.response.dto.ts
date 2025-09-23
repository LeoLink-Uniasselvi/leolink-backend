import { BaseResponseDto } from '@/common/dtos';
import { UserDto } from '@/modules/users/dtos/shared/user.response.dto';

export class MeResponseDto extends BaseResponseDto<UserDto> {
  constructor(
    user: UserDto,
    message: string = 'Informações do usuário recuperadas com sucesso',
    statusCode: number = 200,
  ) {
    super(user, message, statusCode);
  }
}
